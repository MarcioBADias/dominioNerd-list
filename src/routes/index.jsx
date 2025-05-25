import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/home'
import { AddForm } from '@/pages/AddForm'
import { Pending } from '../pages/pending'
import { Login } from '../pages/login'
import { Header } from '../components/Header'
import { PrivateRoute } from '../components/PrivateRoute'
import { useState } from 'react'

const AppRoutes = () => {
  const [sendOrders, setSendOrders] = useState(false)

  const handleSendOrders = () => setSendOrders(!sendOrders)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Header onCartClick={handleSendOrders} />
                <Home
                  openPopup={sendOrders}
                  onHandleSandOrders={handleSendOrders}
                />
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
    </>
  )
}
export { AppRoutes }
