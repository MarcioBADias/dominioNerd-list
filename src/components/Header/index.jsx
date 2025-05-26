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
import { BsCartCheckFill } from 'react-icons/bs'
import { MdOutlineAddBusiness } from 'react-icons/md'
import { RiListView } from 'react-icons/ri'
import { FiLogOut } from 'react-icons/fi'

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
      <Logo
        src="/Logo_DominioNerd_White.png"
        alt="Logo Dominio Nerd"
        onClick={() => navigate('/')}
      />

      <Nav>
        {userData.adm && (
          <>
            <button onClick={() => navigate('/add-form')}>
              <div>
                <div>
                  <MdOutlineAddBusiness size={40} />
                </div>
                <div>
                  <p style={{ fontSize: 7 }}>Cadastrar Itens</p>
                </div>
              </div>
            </button>
            <button onClick={onCartClick} style={{ position: 'relative' }}>
              <div>
                <BsCartCheckFill size={40} />
              </div>
              <div>
                <p style={{ fontSize: 7 }}>Fechar pedido</p>
              </div>
            </button>
            <button onClick={() => navigate('/pending')}>
              <div>
                <RiListView size={40} />
              </div>
              <div>
                <p style={{ fontSize: 7 }}>Ver Pedidos</p>
              </div>
            </button>
          </>
        )}
      </Nav>

      <UserInfo>
        {userData.profile && (
          <div>
            <div>
              <ProfileImage src={userData.profile} alt="Profile" />
            </div>
            <div>
              <span>{userData.name}</span>
            </div>
          </div>
        )}
        <LogoutIcon onClick={handleLogout}>
          <div>
            <div>
              <FiLogOut size={20} />
            </div>
            <div>
              <p style={{ fontSize: 7 }}>Sair</p>
            </div>
          </div>
        </LogoutIcon>
      </UserInfo>
    </HeaderContainer>
  )
}

export { Header }
