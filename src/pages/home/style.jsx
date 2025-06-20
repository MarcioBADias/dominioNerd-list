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

export const FloatingCartButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 30px;
  background-color: #222;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 998;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333;
  }
`

export const FloatingTextButton = styled.p`
  position: fixed;
  bottom: 10px;
  right: 43px;
  color: 222;
  cursor: pointer;
  font-weight: bold;
  font-size: 10px;
  z-index: 998;
  transition: background-color 0.3s ease;
  text-align: center;

  &:hover {
    color: #b83242;
  }
`
