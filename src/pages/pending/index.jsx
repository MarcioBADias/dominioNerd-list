import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { Button, Card, Container } from './style'

const Pending = () => {
  const [pending, setPending] = useState([])
  const [finish, setFinish] = useState(false)

  useEffect(() => {
    const fetchPending = async () => {
      const { data, error } = await supabase
        .from('itens')
        .select('*')
        .eq('for_sale', false)

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
      <h1>pendings de USUÁRIO</h1>

      {pending.map((item) => (
        <Card key={item.id} style={{ opacity: finish ? 0.5 : 1 }}>
          <h3>{item.name}</h3>
          <p>Preço: R$ {item.price.toFixed(2)}</p>
        </Card>
      ))}

      <h2>Valor total: R$ {total.toFixed(2)}</h2>

      {!finish ? (
        <Button onClick={confirmarVenda}>Confirmar Venda</Button>
      ) : (
        <Button onClick={devolverVenda}>Devolver à Venda</Button>
      )}
    </Container>
  )
}

export { Pending }
