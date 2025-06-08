export const initialAddFormState = {
  name: '',
  edition: '',
  serialNumber: '',
  price: '',
  quantity: '',
  isLoading: false,
  error: null,
  successMessage: '',
}

export const addFormActionTypes = {
  SET_FIELD: 'SET_FIELD',
  SUBMIT_START: 'SUBMIT_START',
  SUBMIT_SUCCESS: 'SUBMIT_SUCCESS',
  SUBMIT_ERROR: 'SUBMIT_ERROR',
  RESET_FORM: 'RESET_FORM',
}

export const addFormReducer = (state, action) => {
  if (action.type === addFormActionTypes.SET_FIELD) {
    return {
      ...state,
      [action.field]: action.value,
      error: null,
      successMessage: '',
    }
  }
  if (action.type === addFormActionTypes.SUBMIT_START) {
    return { ...state, isLoading: true, error: null, successMessage: '' }
  }
  if (action.type === addFormActionTypes.SUBMIT_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      successMessage: action.payload,
      error: null,
    }
  }
  if (action.type === addFormActionTypes.SUBMIT_ERROR) {
    return {
      ...state,
      isLoading: false,
      error: action.payload,
      successMessage: '',
    }
  }
  if (action.type === addFormActionTypes.RESET_FORM) {
    return { ...initialAddFormState }
  }
}
