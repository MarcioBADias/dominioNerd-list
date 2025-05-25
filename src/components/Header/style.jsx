import styled from 'styled-components'

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: #222;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`

export const Logo = styled.h1`
  font-size: 1.5rem;
  cursor: pointer;
  color: #61dafb;
`

export const Nav = styled.nav`
  display: flex;
  gap: 1rem;

  button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;

    &:hover {
      text-decoration: underline;
    }
  }
`

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  span {
    font-weight: 500;
  }
`

export const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`

export const LogoutIcon = styled.div`
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`
