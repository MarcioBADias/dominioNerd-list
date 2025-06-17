import { useEffect, useReducer, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import { useItemContext, itemActionTypes } from '../../context/ItemReducer'
import { Container, ItemList, BackdropStyle, ModalStyle } from './style'
import { QuantitySelector } from '../../components/QuantitySelector'
import { EditionSelector } from '../../components/EditionSelector'
import { ItemCard } from './components/ItemCard'
import { OrderSuccessPopup } from './components/OrderSuccessPopup'
import { CheckoutFloatingButton } from './components/CheckoutFloatingButton'
import {
  homePageReducer,
  initialHomePageState,
  homePageActionTypes,
} from './homePageReducer'

export const HomePage = () => {
  const { state: itemContextState, dispatch: itemContextDispatch } =
    useItemContext()
  const [pageState, pageDispatch] = useReducer(
    homePageReducer,
    initialHomePageState,
  )

  const { allItems, currentOrderProspects } = itemContextState
  const { selectedEdition, isQuantityPopupOpen, isSuccessPopupVisible } =
    pageState

  useEffect(() => {
    const fetchItemsFromDB = async () => {
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .eq('for_sale', true)
        .order('name', { ascending: true })
      if (error) {
        console.error('Error fetching items:', error)
      } else {
        itemContextDispatch({
          type: itemActionTypes.LOAD_ALL_ITEMS,
          payload: data,
        })
      }
    }
    fetchItemsFromDB()
  }, [itemContextDispatch])

  const handleToggleItemSelection = useCallback(
    (itemId) => {
      itemContextDispatch({
        type: itemActionTypes.TOGGLE_ITEM_CHECK_STATUS,
        payload: { id: itemId },
      })
    },
    [itemContextDispatch],
  )

  const handleEditionSelect = useCallback((editionKey) => {
    pageDispatch({
      type: homePageActionTypes.SET_SELECTED_EDITION,
      payload: editionKey,
    })
  }, [])

  const handleOpenQuantityPopup = useCallback(() => {
    itemContextDispatch({
      type: itemActionTypes.PREPARE_ITEMS_FOR_ORDER_CONFIGURATION,
    })
    pageDispatch({ type: homePageActionTypes.OPEN_QUANTITY_POPUP })
  }, [itemContextDispatch])

  const handleCloseQuantityPopup = useCallback(() => {
    pageDispatch({ type: homePageActionTypes.CLOSE_QUANTITY_POPUP })
    itemContextDispatch({
      type: itemActionTypes.CLEAR_ITEMS_FOR_ORDER_CONFIGURATION,
    })
  }, [itemContextDispatch])

  const handleCloseSuccessPopup = useCallback(() => {
    pageDispatch({ type: homePageActionTypes.HIDE_SUCCESS_POPUP })
    pageDispatch({ type: homePageActionTypes.RESET_PAGE_STATE })
  }, [])

  const handleCheckout = async (quantitiesByItemId) => {
    const userString = localStorage.getItem('user')
    if (!userString) {
      alert('User not found. Please log in.')
      return
    }
    const currentUser = JSON.parse(userString)
    let firstSuccessfullyInsertedOrderId = null

    try {
      for (const prospectItem of currentOrderProspects) {
        const selectedQuantity = quantitiesByItemId[prospectItem.id]
        if (!selectedQuantity || selectedQuantity <= 0) continue

        const { data: insertedOrderData, error: orderInsertError } =
          await supabase
            .from('orders')
            .insert({
              item_id: prospectItem.id,
              item_name: prospectItem.name,
              price: prospectItem.price,
              quantity: selectedQuantity,
              purchaser: currentUser?.name || 'Unknown Purchaser',
              contact: currentUser?.phone || '',
            })
            .select('id')
            .single()

        if (orderInsertError) throw orderInsertError

        if (insertedOrderData && firstSuccessfullyInsertedOrderId === null) {
          firstSuccessfullyInsertedOrderId = insertedOrderData.id
        }

        itemContextDispatch({
          type: itemActionTypes.UPDATE_ITEM_STOCK_POST_ORDER,
          payload: {
            itemId: prospectItem.id,
            orderedQuantity: selectedQuantity,
          },
        })
      }

      itemContextDispatch({
        type: itemActionTypes.CLEAR_ITEMS_FOR_ORDER_CONFIGURATION,
      })
      pageDispatch({ type: homePageActionTypes.SHOW_SUCCESS_POPUP })

      const userNameFormatted = currentUser?.name?.split(' ')[0] || 'Customer'
      let whatsappMsg = `Hello *${userNameFormatted}*,\n\nYour order *#${firstSuccessfullyInsertedOrderId || 'N/A'}* has been registered and will be confirmed shortly.`
      whatsappMsg += `\n\nItems:\n`
      let orderTotalForWhatsapp = 0

      currentOrderProspects.forEach((item) => {
        const qty = quantitiesByItemId[item.id] || 0
        if (qty > 0) {
          whatsappMsg += `\n• ${item.name} (x${qty}) - R$ ${(item.price * qty).toFixed(2)}`
          orderTotalForWhatsapp += item.price * qty
        }
      })
      whatsappMsg += `\n\n*Total: R$ ${orderTotalForWhatsapp.toFixed(2)}*.`
      whatsappMsg += `\n\nFor changes, please let us know!`

      const userPhoneNumber = currentUser?.phone?.replace(/\D/g, '')
      if (userPhoneNumber && userPhoneNumber.length > 2) {
        const whatsappUrl = `https://wa.me/55${userPhoneNumber}?text=${encodeURIComponent(whatsappMsg)}`
        window.open(whatsappUrl, '_blank')
      } else {
        console.warn('User phone number not found for WhatsApp notification.')
      }
    } catch (error) {
      console.error('Checkout process failed:', error)
      alert(
        `An error occurred while finalizing the order: ${error.message}. Please try again.`,
      )
      pageDispatch({ type: homePageActionTypes.CLOSE_QUANTITY_POPUP })
    }
  }
  const filteredDisplayItems = allItems.filter(
    (item) =>
      (!selectedEdition || item.edition === selectedEdition) && item.for_sale,
  )
  const itemsSelectedForCheckoutCount = allItems.filter(
    (item) => item.isChecked && item.quantity > 0,
  ).length

  return (
    <Container>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Item List</h1>
      <div>
        <p
          style={{
            fontSize: '0.9em',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          Filter by Edition:
        </p>
        <EditionSelector
          selectedEdition={selectedEdition}
          onSelect={handleEditionSelect}
        />
      </div>
      <ItemList>
        {filteredDisplayItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isSelected={item.isChecked}
            onToggleSelect={handleToggleItemSelection}
          />
        ))}
      </ItemList>
      {itemsSelectedForCheckoutCount > 0 && (
        <CheckoutFloatingButton
          selectedItemsCount={itemsSelectedForCheckoutCount}
          onClick={handleOpenQuantityPopup}
        />
      )}

      {isQuantityPopupOpen && (
        <BackdropStyle onClick={handleCloseQuantityPopup}>
          <ModalStyle onClick={(e) => e.stopPropagation()}>
            {isSuccessPopupVisible ? (
              <OrderSuccessPopup onClose={handleCloseSuccessPopup} />
            ) : (
              <QuantitySelector
                items={currentOrderProspects}
                onSubmit={handleCheckout}
                onCancel={handleCloseQuantityPopup}
              />
            )}
          </ModalStyle>
        </BackdropStyle>
      )}
    </Container>
  )
}
