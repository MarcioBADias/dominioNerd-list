import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/home'
import { AddForm } from '@/pages/AddForm'
import { Pending } from '../pages/pending'
import { Login } from '../pages/login'
import { PrivateRoute } from '../components/PrivateRoute'
import { Header } from '../components/Header'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Header />
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-form"
        element={
          <PrivateRoute>
            <Header />
            <AddForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/pending"
        element={
          <PrivateRoute>
            <Header />
            <Pending />
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
)

export { AppRoutes }
