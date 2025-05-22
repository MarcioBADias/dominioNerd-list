import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/home'
import { AddForm } from '@/pages/AddForm'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-form" element={<AddForm />} />
    </Routes>
  </Router>
)

export { AppRoutes }
