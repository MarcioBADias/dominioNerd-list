import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { Button, Card, Container } from './style'

const Pending = () => {
  const [pending, setPending] = useState([])
  const [finish, setFinish] = useState(false)

  useEffect(() => {
    const fetchPending = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('recall', false)

      if (!error) setPending(data)
    }

    fetchPending()
  }, [])

  const total = pending.reduce((sum, item) => sum + item.price, 0)

  const confirmarVenda = () => {
    setFinish(true)
  }

  const devolverVenda = async () => {
    const ids = pending.map((item) => item.id)
    await supabase.from('itens').update({ for_sale: true }).in('id', ids)
    window.location.href = '/' // volta pra home
  }

  return (
    <Container>
      <h1>Pedidos Pendentes</h1>

      {pending.map((order) => (
        <Card key={order.id} style={{ opacity: finish ? 0.5 : 1 }}>
          <h3>{order.item_name}</h3>
          <p>Comprador: {order.purchaser}</p>
          <p>Contato: {order.contact}</p>
          <p>Preço: R$ {order.price.toFixed(2)}</p>
          <p>Qtd: {order.quantity}</p>
        </Card>
      ))}

      <h2>Valor total: R$ {total.toFixed(2)}</h2>
      <Button onClick={devolverVenda}>Devolver à Venda</Button>
      <Button onClick={confirmarVenda}>Confirmar Venda</Button>
    </Container>
  )
}

export { Pending }
