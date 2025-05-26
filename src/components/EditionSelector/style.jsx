import styled from 'styled-components'

export const EditionContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 1rem;
  gap: 1rem;
  justify-content: space-around;
`

export const EditionIcon = styled.img`
  width: 50px;
  height: 50px;
  cursor: pointer;
  border: ${(props) =>
    props.selected ? '3px solid #b83242' : '2px solid transparent'};
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 5px;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`
