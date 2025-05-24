import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useItemContext } from '../../context/ItemReducer'
import { Check, Container, Image, Item, ItemInfo, ItemList } from './style'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { state, dispatch } = useItemContext()
  const [itens, setItens] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const navigate = useNavigate()

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

  const handleEnviarPedido = async () => {
    const { error } = await supabase
      .from('itens')
      .update({ for_sale: false })
      .in('id', selectedItems)

    if (!error) {
      setItens((prev) =>
        prev.filter((item) => !selectedItems.includes(item.id)),
      )
      navigate('/pending')
    } else {
      alert('Erro ao enviar pedido')
      console.error(error)
    }
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
        <button onClick={handleEnviarPedido}>Enviar Pedido</button>
      )}
    </Container>
  )
}

export { Home }
