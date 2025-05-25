import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import {
  HeaderContainer,
  Nav,
  UserInfo,
  ProfileImage,
  LogoutIcon,
  Logo,
} from './style'
import { FiLogOut, FiShoppingCart } from 'react-icons/fi'

const Header = ({ onCartClick }) => {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      const userLocal = localStorage.getItem('user')
      if (userLocal) {
        const parsed = JSON.parse(userLocal)

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', parsed.email)
          .single()

        if (!error) setUserData(data)
      }
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!userData) return null

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/')}>MinhaLogo</Logo>

      <Nav>
        {userData.adm && (
          <>
            <button onClick={() => navigate('/add-form')}>
              Cadastrar Itens
            </button>
            <button onClick={() => navigate('/pending')}>Ver Pedidos</button>
          </>
        )}
        <button onClick={onCartClick} style={{ position: 'relative' }}>
          <FiShoppingCart size={20} />
        </button>
      </Nav>

      <UserInfo>
        <span>{userData.name}</span>
        {userData.profile && (
          <ProfileImage src={userData.profile} alt="Profile" />
        )}
        <LogoutIcon onClick={handleLogout}>
          <FiLogOut size={20} />
        </LogoutIcon>
      </UserInfo>
    </HeaderContainer>
  )
}

export { Header }
