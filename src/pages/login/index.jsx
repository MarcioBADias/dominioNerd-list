import { useReducer, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Form,
  Input,
  Button,
  ToggleText,
  Label,
  LogoImage,
  ErrorMessage,
} from './style'
import { authReducer, initialState } from '../../context/AuthReducer'

const AUTH_ACTION_TYPES = {
  SET_FIELD: 'SET_FIELD',
  TOGGLE_MODE: 'TOGGLE_MODE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_AVATAR_INPUT: 'TOGGLE_AVATAR_INPUT',
  RESET_ERROR: 'RESET_ERROR',
}

export const LoginPage = () => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem('user')
  }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: AUTH_ACTION_TYPES.SET_LOADING, value: true })
    dispatch({ type: AUTH_ACTION_TYPES.SET_ERROR, value: null })

    const { name, email, password, isLogin, profile, phone } = state

    try {
      if (isLogin) {
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          })

        if (loginError) {
          dispatch({
            type: AUTH_ACTION_TYPES.SET_ERROR,
            value: loginError.message || 'Invalid email or password.',
          })
        } else if (loginData.user) {
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', loginData.user.id)
            .single()

          if (profileError || !userProfile) {
            dispatch({
              type: AUTH_ACTION_TYPES.SET_ERROR,
              value:
                'Login successful but profile not found. Please contact support.',
            })
          } else {
            localStorage.setItem('user', JSON.stringify(userProfile))
            navigate('/')
          }
        } else {
          dispatch({
            type: AUTH_ACTION_TYPES.SET_ERROR,
            value: 'Login failed. Please try again.',
          })
        }
      } else {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                name: name,
                phone: phone,
              },
            },
          })

        if (signUpError) {
          dispatch({
            type: AUTH_ACTION_TYPES.SET_ERROR,
            value: signUpError.message,
          })
        } else if (signUpData.user) {
          let profileStoragePublicUrl = ''
          if (profile) {
            const fileExtension = profile.name.split('.').pop()
            const newFileName = `${signUpData.user.id}.${fileExtension}`
            const filePath = `avatars/${newFileName}`

            const { data: uploadData, error: uploadError } =
              await supabase.storage.from('profile').upload(filePath, profile, {
                cacheControl: '3600',
                upsert: true,
                contentType: profile.type || 'image/jpeg',
              })

            if (uploadError) {
              console.error('Avatar upload error:', uploadError)
            } else {
              const { data: publicUrlData } = supabase.storage
                .from('profile')
                .getPublicUrl(filePath)
              profileStoragePublicUrl = publicUrlData.publicUrl
            }
          }

          const { error: insertProfileError } = await supabase
            .from('users')
            .insert({
              id: signUpData.user.id,
              name: name,
              email: email,
              phone: phone,
              profile: profileStoragePublicUrl,
              adm: false,
            })

          if (insertProfileError) {
            console.error(
              'Error inserting user profile data:',
              insertProfileError,
            )
            dispatch({
              type: AUTH_ACTION_TYPES.SET_ERROR,
              value: `Account created, but profile setup failed: ${insertProfileError.message}`,
            })
          } else {
            alert(
              'Signup successful! Please check your email for a confirmation link if email confirmation is enabled.',
            )
            dispatch({ type: AUTH_ACTION_TYPES.TOGGLE_MODE })
          }
        } else {
          dispatch({
            type: AUTH_ACTION_TYPES.SET_ERROR,
            value: 'Signup failed. Please try again.',
          })
        }
      }
    } catch (err) {
      console.error('Authentication error:', err)
      dispatch({
        type: AUTH_ACTION_TYPES.SET_ERROR,
        value: err.message || 'An unexpected error occurred.',
      })
    } finally {
      dispatch({ type: AUTH_ACTION_TYPES.SET_LOADING, value: false })
    }
  }

  const handleInputChange = (field, value) => {
    dispatch({ type: AUTH_ACTION_TYPES.SET_FIELD, field, value })
    if (state.error) {
      dispatch({ type: AUTH_ACTION_TYPES.RESET_ERROR })
    }
  }

  return (
    <Container>
      <LogoImage src="/Logo_DominioNerd_Black.png" alt="Dominio Nerd Logo" />
      <h1>{state.isLogin ? 'Login' : 'Sign Up'}</h1>
      <Form onSubmit={handleFormSubmit}>
        {!state.isLogin && (
          <>
            <Label htmlFor="name-input">Username</Label>
            <Input
              id="name-input"
              type="text"
              value={state.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <Label htmlFor="phone-input">Phone for WhatsApp</Label>
            <Input
              id="phone-input"
              type="tel"
              value={state.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <Label htmlFor="avatar-input">Avatar Image</Label>
            {!state.showAvatarInput ? (
              <ToggleText
                onClick={() =>
                  dispatch({ type: AUTH_ACTION_TYPES.TOGGLE_AVATAR_INPUT })
                }
              >
                Want to add an avatar?
              </ToggleText>
            ) : (
              <>
                <Input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleInputChange('profile', e.target.files[0])
                  }
                />
                <ToggleText
                  onClick={() =>
                    dispatch({ type: AUTH_ACTION_TYPES.TOGGLE_AVATAR_INPUT })
                  }
                >
                  Cancel Avatar
                </ToggleText>
              </>
            )}
          </>
        )}
        <Label htmlFor="email-input">Email</Label>
        <Input
          id="email-input"
          type="email"
          value={state.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        <Label htmlFor="password-input">Password</Label>
        <Input
          id="password-input"
          type="password"
          value={state.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
        />
        {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
        <Button type="submit" disabled={state.loading}>
          {state.loading ? 'Loading...' : state.isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </Form>
      <ToggleText
        onClick={() => dispatch({ type: AUTH_ACTION_TYPES.TOGGLE_MODE })}
      >
        {state.isLogin
          ? "Don't have an account? Sign up here"
          : 'Already have an account? Login'}
      </ToggleText>
    </Container>
  )
}
