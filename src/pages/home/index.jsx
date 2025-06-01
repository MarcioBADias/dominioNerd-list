// Home.jsx

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
  FloatingCartButton,
  FloatingTextButton,
} from './style'
import { QuantitySelector } from '../../components/QuantitySelector'
import { EditionSelector } from '../../components/EditionSelector'
import { BsCartCheckFill } from 'react-icons/bs'

const Home = ({ openPopup, onHandleSandOrders }) => {
  const { state, dispatch } = useItemContext()
  const [selectedItems, setSelectedItems] = useState([])
  const [selectedEdition, setSelectedEdition] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

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

  const handleCloseSuccessPopup = () => {
    setShowSuccessMessage(false)
    onHandleSandOrders()
    window.location.reload()
  }

  const checkout = async (quantities) => {
    const user = JSON.parse(localStorage.getItem('user'))
    console.log(user.name)

    let firstInsertedOrderId = null

    try {
      for (const item of selectedItemObjects) {
        const quantidadeSelecionada = quantities[item.id]

        if (quantidadeSelecionada <= 0) continue

        const { data: insertedOrder, error: orderError } = await supabase
          .from('orders')
          .insert({
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            quantity: quantidadeSelecionada,
            purchaser: user?.name || 'desconhecido',
            contact: user?.phone || '',
          })
          .select()

        if (orderError) {
          console.error('Erro ao inserir pedido:', orderError)
          throw new Error('Erro ao registrar um dos itens do pedido.')
        }

        if (
          firstInsertedOrderId === null &&
          insertedOrder &&
          insertedOrder.length > 0
        ) {
          firstInsertedOrderId = insertedOrder[0].id
        }

        const novaQuantidade = item.quantity - quantidadeSelecionada
        const { error: updateError } = await supabase
          .from('itens')
          .update({
            quantity: novaQuantidade,
            for_sale: novaQuantidade > 0,
          })
          .eq('id', item.id)

        if (updateError) {
          console.error('Erro ao atualizar estoque:', updateError)
          throw new Error('Erro ao atualizar estoque de um dos itens.')
        }
      }

      setSelectedItems([])

      setShowSuccessMessage(true)

      const nomeFormatado = user?.name?.split(' ')[0] || 'Cliente'
      let mensagemWhatsapp = `Olá *${nomeFormatado}*,\n\nSeu pedido foi registrado com número *${firstInsertedOrderId || 'ID_INDISPONIVEL'}* e será confirmado em breve.`
      mensagemWhatsapp += `\n\nSegue a lista abaixo:\n`

      selectedItemObjects.forEach((item) => {
        const quantidadeSelecionada = quantities[item.id] || 0
        if (quantidadeSelecionada > 0) {
          mensagemWhatsapp += `\n• ${item.name} (x${quantidadeSelecionada}) - R$ ${(item.price * quantidadeSelecionada).toFixed(2)}`
        }
      })

      const totalPedidoWhatsapp = selectedItemObjects.reduce((acc, item) => {
        const quantidadeSelecionada = quantities[item.id] || 0
        return acc + item.price * quantidadeSelecionada
      }, 0)
      mensagemWhatsapp += `\n\n*Total: R$ ${totalPedidoWhatsapp.toFixed(2)}*.`
      mensagemWhatsapp += `\n\nPara alterações, é só avisar!`

      const telefone = `55${user?.phone?.replace(/\D/g, '') || ''}`
      if (telefone && telefone.length > 2) {
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagemWhatsapp)}`
        window.open(url, '_blank')
      } else {
        console.warn(
          'Número de telefone do usuário não encontrado para enviar WhatsApp.',
        )
      }
    } catch (error) {
      console.error('Falha no processo de checkout:', error.message)
      alert(
        'Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente.',
      )
      onHandleSandOrders()
    }
  }

  return (
    <Container>
      <h1 style={{ textAlign: 'center' }}>Lista de Itens</h1>
      <div>
        <p style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
          Filtro por edição:
        </p>
        <EditionSelector
          selectedEdition={selectedEdition}
          onSelect={setSelectedEdition}
        />
      </div>
      <ItemList>
        {state.items
          .filter(
            (item) => !selectedEdition || item.edition === selectedEdition,
          )
          .map((item) => (
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

      <div onClick={onHandleSandOrders}>
        <FloatingCartButton>
          <BsCartCheckFill size={30} color="white" />
          {selectedItems.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: '#b83242',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.7em',
                fontWeight: 'bold',
              }}
            >
              {selectedItems.length}
            </span>
          )}
        </FloatingCartButton>
        <FloatingTextButton>
          Fechar <br /> Pedido
        </FloatingTextButton>
      </div>
      {openPopup && (
        <BackdropStyle>
          <ModalStyle>
            {showSuccessMessage ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <h2>Seu pedido foi realizado com sucesso!</h2>
                <p>Você receberá uma confirmação via WhatsApp.</p>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#222',
                    color: 'white',
                    borderRadius: '10px',
                    marginTop: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={handleCloseSuccessPopup}
                >
                  Fechar
                </button>
              </div>
            ) : (
              <QuantitySelector
                items={selectedItemObjects}
                onSubmit={checkout}
                onCancel={onHandleSandOrders}
              />
            )}
          </ModalStyle>
        </BackdropStyle>
      )}
    </Container>
  )
}

export { Home }
