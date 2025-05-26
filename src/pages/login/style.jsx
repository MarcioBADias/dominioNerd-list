import styled from 'styled-components'

export const Container = styled.div`
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  text-align: center;
`
export const Logo = styled.img`
  width: 150px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Label = styled.label`
  text-align: left;
  font-weight: bold;
`

export const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
`

export const Button = styled.button`
  padding: 0.75rem;
  background: #333;
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
`

export const ToggleText = styled.p`
  margin-top: 1rem;
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`
