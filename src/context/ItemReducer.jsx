import { createContext, useReducer, useContext } from 'react'

const initialState = {
  items: [],
  selectedItems: [],
  pedidos: [],
}

const itemReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return { ...state, items: action.payload }

    case 'TOGGLE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, checked: !item.checked }
            : item,
        ),
      }

    case 'FECHAR_PEDIDO':
      const selecionados = state.items.filter((item) => item.checked)
      return {
        ...state,
        selectedItems: selecionados,
        pedidos: [...state.pedidos, selecionados],
        items: state.items.map((item) => ({ ...item, checked: false })),
      }

    case 'RETORNAR_ITEM':
      // Evita duplicação de item retornado
      const isAlreadyInItems = state.items.some(
        (i) => i.id === action.payload.id,
      )
      return {
        ...state,
        items: isAlreadyInItems
          ? state.items
          : [...state.items, { ...action.payload, checked: false }],
        pedidos: state.pedidos.map((p) =>
          p.filter((i) => i.id !== action.payload.id),
        ),
        selectedItems: state.selectedItems.filter(
          (i) => i.id !== action.payload.id,
        ),
      }

    case 'CLEAR_SELECTED':
      return {
        ...state,
        selectedItems: [],
      }

    default:
      return state
  }
}

const ItemContext = createContext()

const ItemProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itemReducer, initialState)

  return (
    <ItemContext.Provider value={{ state, dispatch }}>
      {children}
    </ItemContext.Provider>
  )
}

const useItemContext = () => useContext(ItemContext)

export { ItemProvider, useItemContext }
