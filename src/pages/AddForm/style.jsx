import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  padding-top: 100px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`

export const Label = styled.label`
  font-weight: bold;
`

export const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`
export const Select = styled.select`
  padding: 8px;
  font-size: 16px;
  border-radius: 5px;
  margin-bottom: 10px;
`

export const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #45a049;
  }
`
