import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
  padding-top: 100px;
`

export const ItemList = styled.ul`
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;

  @media (max-width: 840px) {
    display: block;
  }
`

export const Item = styled.li`
  background: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 30%;

  @media (max-width: 840px) {
    width: 100%;
  }
`

export const ItemInfo = styled.div`
  align-items: center;
  display: flex;
  gap: 50px;
  width: 100%;
`
export const Image = styled.img`
  height: 100px;
  width: 100px;
`
export const Check = styled.input`
  margin-right: 40px;
`
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
  max-height: 90vh;
  overflow-y: auto;
`
