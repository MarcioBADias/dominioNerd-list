import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/home'
import { AddForm } from '@/pages/AddForm'
import { Pending } from '../pages/pending'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-form" element={<AddForm />} />
      <Route path="/pending" element={<Pending />} />
    </Routes>
  </Router>
)

export { AppRoutes }
