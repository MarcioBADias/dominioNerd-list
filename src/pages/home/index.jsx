import { useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useItemContext } from '../../context/ItemReducer'
import { Check, Container, Item, ItemInfo, ItemList } from './style'

const Home = () => {
  const { state, dispatch } = useItemContext()

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from('itens').select('*')
      if (error) {
        console.error('Erro ao buscar itens:', error)
      } else {
        const itensComCheck = data.map((item) => ({ ...item, checked: false }))
        dispatch({ type: 'LOAD_ITEMS', payload: itensComCheck })
      }
    }

    fetchItems()
  }, [])

  const toggleItem = (id) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: id })
  }

  return (
    <Container>
      <h1>Lista de Itens</h1>
      <ItemList>
        {state.items.map((item) => (
          <Item key={item.id}>
            <Check
              type="checkbox"
              checked={item.checked || false}
              onChange={() => toggleItem(item.id)}
            />
            <ItemInfo>
              <strong>{item.name}</strong>
              <span>Edição: {item.edition}</span>
              <span>Preço: R$ {item.price}</span>
              <span>Quantidade: {item.quantity}</span>
            </ItemInfo>
          </Item>
        ))}
      </ItemList>
    </Container>
  )
}

export { Home }
