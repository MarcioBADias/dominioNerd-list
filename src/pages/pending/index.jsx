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

  const agruparPorComprador = () => {
    const agrupado = {}

    pending.forEach((pedido) => {
      const nome = pedido.purchaser || 'desconhecido'
      if (!agrupado[nome]) {
        agrupado[nome] = []
      }
      agrupado[nome].push(pedido)
    })

    return agrupado
  }

  const pedidosAgrupados = agruparPorComprador()

  const confirmarVenda = () => {
    setFinish(true)
    // Aqui você pode atualizar a tabela `orders` com status "confirmado", se desejar.
  }

  const devolverVenda = async (userName) => {
    const pedidosUsuario = pedidosAgrupados[userName]

    // Atualiza os itens para estarem disponíveis novamente
    for (const pedido of pedidosUsuario) {
      const { data } = await supabase
        .from('itens')
        .select('quantity')
        .eq('id', pedido.item_id)
        .single()

      await supabase
        .from('itens')
        .update({
          quantity: data.quantity + pedido.quantity,
          for_sale: true,
        })
        .eq('id', pedido.item_id)
    }

    const ids = pedidosUsuario.map((p) => p.id)
    await supabase.from('orders').update({ recall: true }).in('id', ids)

    window.location.reload()
  }

  return (
    <Container>
      <h1>Pedidos Pendentes</h1>

      {Object.entries(pedidosAgrupados).map(([comprador, pedidos]) => {
        const totalPedido = pedidos.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        )

        return (
          <Card key={comprador} style={{ opacity: finish ? 0.5 : 1 }}>
            <h2 style={{ borderBottom: '3px solid #333' }}>
              Pedido de{' '}
              <span style={{ color: '#b83242' }}>
                {' '}
                {comprador.toUpperCase()}{' '}
              </span>
            </h2>

            <ul style={{ listStyle: 'none' }}>
              {pedidos.map((pedido) => (
                <li key={pedido.id}>
                  <p>
                    <strong>Peça:</strong> {pedido.item_name}
                  </p>
                  <p>
                    <strong>Qtd:</strong> {pedido.quantity}
                  </p>
                  <p>
                    <strong>Preço unitário:</strong> R${' '}
                    {pedido.price.toFixed(2)}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> R${' '}
                    {(pedido.price * pedido.quantity).toFixed(2)}
                  </p>
                  <hr />
                </li>
              ))}
            </ul>

            <h4>Total do Pedido: R$ {totalPedido.toFixed(2)}</h4>
            <Button onClick={() => devolverVenda(comprador)}>
              Devolver à Venda
            </Button>
            <Button onClick={confirmarVenda}>Confirmar Venda</Button>
          </Card>
        )
      })}
    </Container>
  )
}

export { Pending }
