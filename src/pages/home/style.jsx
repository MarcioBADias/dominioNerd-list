import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
`

export const ItemList = styled.ul`
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin-top: 50px;

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
