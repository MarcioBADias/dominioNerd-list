const initialState = {
  name: '',
  email: '',
  password: '',
  phone: '',
  profile: null,
  isLogin: true,
  loading: false,
  error: null,
}

const authReducer = (state, action) => {
  if (action.type === 'SET_FIELD') {
    return { ...state, [action.field]: action.value }
  }
  if (action.type === 'TOGGLE_MODE') {
    return { ...state, isLogin: !state.isLogin, error: null }
  }
  if (action.type === 'SET_LOADING') {
    return { ...state, loading: action.value }
  }
  if (action.type === 'SET_ERROR') {
    return { ...state, error: action.value }
  }
  return state
}

export { initialState, authReducer }
