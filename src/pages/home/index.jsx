import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useItemContext } from '../../context/ItemReducer'
import {
  BackdropStyle,
  Check,
  Container,
  Image,
  Item,
  ItemInfo,
  ItemList,
  ModalStyle,
} from './style'
import { QuantitySelector } from '../../components/QuantitySelector'

const Home = ({ openPopup, onHandleSandOrders }) => {
  const { state, dispatch } = useItemContext()
  const [selectedItems, setSelectedItems] = useState([])

  const selectedItemObjects = state.items.filter((item) =>
    selectedItems.includes(item.id),
  )

  const toggleSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    )
  }

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .eq('for_sale', true)
      if (error) {
        console.error('Erro ao buscar itens:', error)
      } else {
        const itensComCheck = data.map((item) => ({ ...item, checked: false }))
        dispatch({ type: 'LOAD_ITEMS', payload: itensComCheck })
      }
    }

    fetchItems()
  }, [])

  const handleSendingOrders = () => {
    onHandleSandOrders()
  }

  const checkout = async (quantities) => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user.name)

    for (const item of selectedItemObjects) {
      const quantidadeSelecionada = quantities[item.id]
      await supabase.from('orders').insert({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: quantidadeSelecionada,
        purchaser: user?.name || 'desconhecido',
        contact: user?.phone || '',
      })

      const novaQuantidade = item.quantity - quantidadeSelecionada
      await supabase
        .from('itens')
        .update({
          quantity: novaQuantidade,
          for_sale: novaQuantidade > 0,
        })
        .eq('id', item.id)
    }
    setSelectedItems([])
    onHandleSandOrders()
  }

  return (
    <Container>
      <h1>Lista de Itens</h1>
      <ItemList>
        {state.items.map((item) => (
          <Item key={item.id}>
            <Check
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => toggleSelect(item.id)}
            />
            <ItemInfo>
              <div>
                <Image
                  src={`https://hcunits.net/static/images/set/${item.edition}/${item.serialNumber}.png`}
                  alt=""
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>{item.name}</strong>
                <span>R$ {item.price},00</span>
                <span>Qtd: {item.quantity} und</span>
                <span>
                  <a
                    href={`https://hcunits.net/units/${item.edition}${item.serialNumber}/`}
                    target="_blank"
                  >
                    Ver card
                  </a>
                </span>
              </div>
            </ItemInfo>
          </Item>
        ))}
      </ItemList>
      {selectedItems.length > 0 && (
        <button onClick={handleSendingOrders}>Enviar Pedido</button>
      )}
      {openPopup && (
        <BackdropStyle>
          <ModalStyle>
            <QuantitySelector
              items={selectedItemObjects}
              onSubmit={checkout}
              onCancel={onHandleSandOrders}
            />
          </ModalStyle>
        </BackdropStyle>
      )}
    </Container>
  )
}

export { Home }
