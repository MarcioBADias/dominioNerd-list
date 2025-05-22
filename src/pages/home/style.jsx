import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
`

export const ItemList = styled.ul`
  list-style: none;
  padding: 0;
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
`

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Check = styled.input`
  margin-right: 12px;
`
