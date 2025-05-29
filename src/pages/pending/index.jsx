// Pending.jsx

import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { Button, Card, Container } from './style'
import { TiArrowBack } from 'react-icons/ti'

const Pending = () => {
  const [pending, setPending] = useState([])
  const [finishedUsers, setFinishedUsers] = useState([])

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

  const confirmarVenda = (comprador, pedidos) => {
    setFinishedUsers((prev) => [...prev, comprador])

    const totalPedido = pedidos.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    )

    const listaTexto = pedidos
      .map(
        (item) =>
          `• ${item.item_name} (x${item.quantity}) - R$ ${(item.price * item.quantity).toFixed(2)}`,
      )
      .join('\n')

    const nomeFormatado = comprador.split(' ')[0]
    const mensagem = `Olá *${nomeFormatado}*, seu pedido na lista do *Domínio Nerd* ficou assim:\n\n${listaTexto}\n\n*Total de R$ ${totalPedido.toFixed(2)}*.`

    const telefone = `55${pedidos[0]?.contact?.replace(/\D/g, '')}`
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const devolverVenda = async (userName) => {
    const pedidosUsuario = pedidosAgrupados[userName]

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

  const devolverItemIndividualmente = async (
    pedidoId,
    itemId,
    quantidadeDevolvida,
  ) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja devolver este item à venda?`,
    )

    if (!confirmacao) return

    try {
      const { data: itemData, error: itemError } = await supabase
        .from('itens')
        .select('quantity')
        .eq('id', itemId)
        .single()

      if (itemError) {
        console.error('Erro ao buscar item:', itemError)
        return
      }

      const novaQuantidade = itemData.quantity + quantidadeDevolvida
      const { error: updateItemError } = await supabase
        .from('itens')
        .update({
          quantity: novaQuantidade,
          for_sale: true,
        })
        .eq('id', itemId)

      if (updateItemError) {
        console.error('Erro ao atualizar quantidade do item:', updateItemError)
        return
      }

      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ recall: true })
        .eq('id', pedidoId)

      if (updateOrderError) {
        console.error('Erro ao marcar pedido como recalled:', updateOrderError)
        return
      }

      setPending((prevPending) =>
        prevPending.filter((pedido) => pedido.id !== pedidoId),
      )

      console.log(`Item ${itemId} do pedido ${pedidoId} devolvido à venda.`)
    } catch (error) {
      console.error('Erro ao devolver item:', error)
    }
  }

  const sortedPedidosAgrupados = [
    ...Object.entries(pedidosAgrupados).filter(
      ([comprador]) => !finishedUsers.includes(comprador),
    ),
    ...Object.entries(pedidosAgrupados).filter(([comprador]) =>
      finishedUsers.includes(comprador),
    ),
  ]

  return (
    <Container>
      <h1>Pedidos Pendentes</h1>

      {sortedPedidosAgrupados.map(([comprador, pedidos]) => {
        const totalPedido = pedidos.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        )

        const isFinished = finishedUsers.includes(comprador)
        const styleFinalizado = isFinished
          ? { opacity: 0.4, filter: 'grayscale(100%)' }
          : {}

        return (
          <Card key={comprador} style={styleFinalizado}>
            <h2 style={{ borderBottom: '3px solid #333' }}>
              Pedido de{' '}
              <span style={{ color: '#b83242' }}>
                {comprador.toUpperCase()}
              </span>
            </h2>

            <ul style={{ listStyle: 'none' }}>
              {pedidos.map((pedido) => (
                <li
                  key={pedido.id}
                  style={{
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
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
                  </div>
                  <div>
                    <Button
                      onClick={() =>
                        devolverItemIndividualmente(
                          pedido.id,
                          pedido.item_id,
                          pedido.quantity,
                        )
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5em',
                        color: '#b83242',
                        marginLeft: '10px',
                      }}
                      title="Devolver este item"
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <TiArrowBack />
                        <span style={{ fontSize: 15 }}>Devolver à venda</span>
                      </div>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <h4>Total do Pedido: R$ {totalPedido.toFixed(2)}</h4>
            <Button
              onClick={() => {
                const confirmacao = window.confirm(
                  `Tem certeza que deseja devolver à venda o pedido de ${comprador}?`,
                )
                if (confirmacao) {
                  devolverVenda(comprador)
                }
              }}
            >
              Devolver à Venda
            </Button>

            <Button onClick={() => confirmarVenda(comprador, pedidos)}>
              Confirmar Venda
            </Button>
          </Card>
        )
      })}
    </Container>
  )
}

export { Pending }
