import styled from 'styled-components'

export const BackdropStyle = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`
export const ModalStyle = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  z-index: 1000;
`
