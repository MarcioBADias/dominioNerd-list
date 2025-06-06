const initialHomePageState = {
  selectedEdition: null,
  isQuantityPopupOpen: false,
  isSuccessPopupVisible: false,
}

const homePageActionTypes = {
  SET_SELECTED_EDITION: 'SET_SELECTED_EDITION',
  OPEN_QUANTITY_POPUP: 'OPEN_QUANTITY_POPUP',
  CLOSE_QUANTITY_POPUP: 'CLOSE_QUANTITY_POPUP',
  SHOW_SUCCESS_POPUP: 'SHOW_SUCCESS_POPUP',
  HIDE_SUCCESS_POPUP: 'HIDE_SUCCESS_POPUP',
  RESET_PAGE_STATE: 'RESET_PAGE_STATE',
}

const homePageReducer = (state, action) => {
  if (action.type === homePageActionTypes.SET_SELECTED_EDITION) {
    return { ...state, selectedEdition: action.payload }
  }
  if (action.type === homePageActionTypes.OPEN_QUANTITY_POPUP) {
    return {
      ...state,
      isQuantityPopupOpen: true,
      isSuccessPopupVisible: false,
    }
  }
  if (action.type === homePageActionTypes.CLOSE_QUANTITY_POPUP) {
    return { ...state, isQuantityPopupOpen: false }
  }
  if (action.type === homePageActionTypes.SHOW_SUCCESS_POPUP) {
    return {
      ...state,
      isSuccessPopupVisible: true,
      isQuantityPopupOpen: true,
    }
  }
  if (action.type === homePageActionTypes.HIDE_SUCCESS_POPUP) {
    return {
      ...state,
      isSuccessPopupVisible: false,
      isQuantityPopupOpen: false,
    }
  }
  if (action.type === homePageActionTypes.RESET_PAGE_STATE) {
    return {
      ...initialHomePageState,
      selectedEdition: state.selectedEdition,
    }
  }
}

export { initialHomePageState, homePageActionTypes, homePageReducer }
