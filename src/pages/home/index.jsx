import { useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useItemContext } from '../../context/ItemReducer'
import { Check, Container, Image, Item, ItemInfo, ItemList } from './style'

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
              <div>
                <Image
                  src={`https://hcunits.net/static/images/set/${item.edition}/0${item.serialNumber}.png`}
                  alt=""
                />
              </div>
              <div>
                <strong>{item.name}</strong>
              </div>
              <div>
                <span>Preço: R$ {item.price}</span>
              </div>
              <div>
                <span>Quantidade: {item.quantity}</span>
              </div>
            </ItemInfo>
          </Item>
        ))}
      </ItemList>
    </Container>
  )
}

export { Home }
