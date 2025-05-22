const initialState = {
  items: [],
  selectedItems: [],
  pedidos: [],
}

const Reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_ITEMS':
      return { ...state, items: action.payload }
    case 'TOGGLE_ITEM':
      const updated = state.items.map((item) =>
        item.id === action.payload ? { ...item, checked: !item.checked } : item,
      )
      return { ...state, items: updated }
    case 'FECHAR_PEDIDO':
      const selected = state.items.filter((item) => item.checked)
      return {
        ...state,
        selectedItems: selected,
        pedidos: [...state.pedidos, selected],
        items: state.items.map((i) => ({ ...i, checked: false })),
      }
    case 'RETORNAR_ITEM':
      return {
        ...state,
        items: [...state.items, { ...action.payload, checked: false }],
        pedidos: state.pedidos.map((p) =>
          p.filter((i) => i.id !== action.payload.id),
        ),
      }
    default:
      return state
  }
}

export { initialState, Reducer }
