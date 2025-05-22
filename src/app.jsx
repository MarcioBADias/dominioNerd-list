import { AppRoutes } from './routes'
import { ItemProvider } from './context/ItemReducer'

const App = () => {
  return (
    <ItemProvider>
      <AppRoutes />
    </ItemProvider>
  )
}

export { App }
