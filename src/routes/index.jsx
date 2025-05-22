import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AddForm } from '@/pages/AddForm'
import { Home } from '@/pages/Home'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-form" element={<AddForm />} />
    </Routes>
  </Router>
)

export { AppRoutes }
