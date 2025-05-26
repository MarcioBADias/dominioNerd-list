import { useReducer } from 'react'
import { supabase } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Form,
  Input,
  Button,
  ToggleText,
  Label,
  Logo,
} from './style'
import { authReducer, initialState } from '../../context/AuthReducer'

const Login = () => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'SET_LOADING', value: true })

    const { name, email, password, isLogin, profile, phone } = state

    try {
      if (isLogin) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .single()

        if (error || !data) {
          dispatch({ type: 'SET_ERROR', value: 'Email ou password inválidos' })
        } else {
          localStorage.setItem('user', JSON.stringify(data))
          navigate('/')
        }
      } else {
        let profileUrl = ''

        if (profile) {
          const fileName = `${Date.now()}_${profile.name}`
          const filePath = `avatars/${fileName}`

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from('profile').upload(filePath, profile, {
              contentType: profile.type || 'image/jpeg',
              upsert: false,
            })

          if (uploadError) throw uploadError

          const {
            data: { publicUrl },
          } = supabase.storage.from('profile').getPublicUrl(filePath)

          profileUrl = publicUrl
        }

        const { error: insertError } = await supabase.from('users').insert({
          name,
          email,
          password,
          phone,
          profile: profileUrl,
          adm: false,
        })

        if (insertError) {
          dispatch({ type: 'SET_ERROR', value: insertError.message })
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      console.error('Erro no cadastro:', err)
      dispatch({ type: 'SET_ERROR', value: err.message || 'Erro inesperado' })
    } finally {
      dispatch({ type: 'SET_LOADING', value: false })
    }
  }

  return (
    <Container>
      <Logo src="/Logo_DominioNerd_Black.png" />
      <h1>{state.isLogin ? 'Login' : 'Cadastro'}</h1>
      <Form onSubmit={handleSubmit}>
        {!state.isLogin && (
          <>
            <Label>Nome de usuario</Label>
            <Input
              type="text"
              value={state.name}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'name',
                  value: e.target.value,
                })
              }
            />
            <Label>Telefone para whatsapp</Label>
            <Input
              type="text"
              value={state.phone}
              onChange={(e) =>
                dispatch({
                  type: 'SET_FIELD',
                  field: 'phone',
                  value: e.target.value,
                })
              }
            />
            <Label>Imagem de avatar</Label>
            {!state.showAvatarInput ? (
              <ToggleText
                onClick={() => dispatch({ type: 'TOGGLE_AVATAR_INPUT' })}
              >
                Deseja criar um avatar?
              </ToggleText>
            ) : (
              <>
                <Input
                  type="file"
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'profile',
                      value: e.target.files[0],
                    })
                  }
                />
                <ToggleText
                  onClick={() => dispatch({ type: 'TOGGLE_AVATAR_INPUT' })}
                >
                  Cancelar avatar
                </ToggleText>
              </>
            )}
          </>
        )}
        <Label>Email</Label>
        <Input
          type="email"
          value={state.email}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'email',
              value: e.target.value,
            })
          }
        />
        <Label>password</Label>
        <Input
          type="password"
          value={state.password}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'password',
              value: e.target.value,
            })
          }
        />
        {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
        <Button type="submit" disabled={state.loading}>
          {state.loading
            ? 'Carregando...'
            : state.isLogin
              ? 'Entrar'
              : 'Cadastrar'}
        </Button>
      </Form>
      <ToggleText onClick={() => dispatch({ type: 'TOGGLE_MODE' })}>
        {state.isLogin
          ? 'Ainda não tem conta? Cadastre-se aqui'
          : 'Já tem conta? Faça login'}
      </ToggleText>
    </Container>
  )
}

export { Login }
