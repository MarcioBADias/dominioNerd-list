import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { Button, Card, Container } from './style'
import { TiArrowBack } from 'react-icons/ti'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const Pending = () => {
  const [pending, setPending] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    const fetchPending = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, itens(edition, serialNumber)')
        .eq('recall', false)
        .order('created_at', { ascending: true })

      if (!error) setPending(data)
      else console.error('Erro ao buscar pedidos pendentes:', error)
    }

    fetchPending()
  }, [])

  const agruparPorComprador = () => {
    const agrupado = {}

    pending.forEach((pedido) => {
      const nome = pedido.purchaser || 'desconhecido'
      const dataPedido = new Date(pedido.created_at)
      const chaveAgrupamento = `${nome}-${dataPedido.getFullYear()}-${(dataPedido.getMonth() + 1).toString().padStart(2, '0')}-${dataPedido.getDate().toString().padStart(2, '0')} ${dataPedido.getHours().toString().padStart(2, '0')}:${dataPedido.getMinutes().toString().padStart(2, '0')}`

      if (!agrupado[chaveAgrupamento]) {
        agrupado[chaveAgrupamento] = []
      }
      agrupado[chaveAgrupamento].push(pedido)
    })

    return agrupado
  }

  const pedidosAgrupados = agruparPorComprador()

  const confirmarVenda = async (compradorKey, pedidos) => {
    const nomeCompradorReal = compradorKey.split('-')[0]

    const idsDosPedidosDoGrupo = pedidos.map((p) => p.id)

    const { error: updateError } = await supabase
      .from('orders')
      .update({ is_confirmed: true })
      .in('id', idsDosPedidosDoGrupo)

    if (updateError) {
      console.error('Erro ao confirmar venda no banco de dados:', updateError)
      return
    }

    setPending((prevPending) =>
      prevPending.map((pedido) => {
        if (idsDosPedidosDoGrupo.includes(pedido.id)) {
          return { ...pedido, is_confirmed: true }
        }
        return pedido
      }),
    )

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

    const nomeFormatado = nomeCompradorReal.split(' ')[0]
    const mensagem = `Olá *${nomeFormatado}*, seu pedido na lista do *Domínio Nerd* ficou assim:\n\n${listaTexto}\n\n*Total de R$ ${totalPedido.toFixed(2)}*.`

    const telefone = `55${pedidos[0]?.contact?.replace(/\D/g, '')}`
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
  }

  const devolverVenda = async (compradorKey) => {
    const pedidosUsuario = pedidosAgrupados[compradorKey]

    if (!pedidosUsuario) {
      console.warn('Pedido não encontrado para devolução:', compradorKey)
      return
    }

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
    await supabase
      .from('orders')
      .update({ recall: true, is_confirmed: false })
      .in('id', ids)

    setPending((prevPending) =>
      prevPending.filter((pedido) => !ids.includes(pedido.id)),
    )
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
        .update({ recall: true, is_confirmed: false })
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

  const toggleOrderVisibility = (compradorKey) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [compradorKey]: !prev[compradorKey],
    }))
  }

  const sortedPedidosAgrupados = Object.entries(pedidosAgrupados).sort(
    ([_, aPedidos], [__, bPedidos]) => {
      const aIsConfirmed = aPedidos[0]?.is_confirmed || false
      const bIsConfirmed = bPedidos[0]?.is_confirmed || false

      if (!aIsConfirmed && bIsConfirmed) return -1
      if (aIsConfirmed && !bIsConfirmed) return 1
      return 0
    },
  )

  return (
    <Container>
      <h1>Pedidos Pendentes</h1>

      {sortedPedidosAgrupados.length === 0 ? (
        <p>Não há pedidos pendentes ou confirmados para exibir no momento.</p>
      ) : (
        sortedPedidosAgrupados.map(([compradorKey, pedidos]) => {
          const totalPedido = pedidos.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          )

          const isConfirmed = pedidos[0]?.is_confirmed || false

          const styleFinalizado = isConfirmed
            ? { opacity: 0.4, filter: 'grayscale(100%)' }
            : {}

          const nomeCompradorExibicao = compradorKey.split('-')[0]
          const dataHoraPedidoExibicao = compradorKey.substring(
            compradorKey.indexOf('-') + 1,
          )

          const primeiroItemId = pedidos.length > 0 ? pedidos[0].id : 'N/A'

          const isExpanded = expandedOrders[compradorKey]

          return (
            <Card key={compradorKey} style={styleFinalizado}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '3px solid #333',
                  paddingBottom: '10px',
                }}
                onClick={() => toggleOrderVisibility(compradorKey)}
              >
                <h2 style={{ margin: 0 }}>
                  Pedido de{' '}
                  <span style={{ color: '#b83242' }}>
                    {nomeCompradorExibicao.toUpperCase()} nº{' '}
                    {primeiroItemId}{' '}
                  </span>
                  <br />
                  <small style={{ fontSize: '0.7em', color: '#666' }}>
                    ({dataHoraPedidoExibicao})
                  </small>{' '}
                </h2>
                {isExpanded ? (
                  <IoIosArrowUp size={30} color="#222" />
                ) : (
                  <IoIosArrowDown size={30} color="#222" />
                )}
              </div>

              {isExpanded && (
                <>
                  <ul style={{ listStyle: 'none' }}>
                    {pedidos.map((pedido) => (
                      <li
                        key={pedido.id}
                        style={{
                          borderBottom: '1px solid #eee',
                          padding: '10px 0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <p>
                            <strong>Peça:</strong> {pedido.itens.edition}{' '}
                            {pedido.itens.serialNumber} {pedido.item_name}{' '}
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
                            disabled={isConfirmed}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <TiArrowBack />
                              <span style={{ fontSize: 10 }}>
                                Devolver à venda
                              </span>{' '}
                            </div>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <h4>Total do Pedido: R$ {totalPedido.toFixed(2)}</h4>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '20px',
                    }}
                  >
                    <Button
                      onClick={() => {
                        const confirmacao = window.confirm(
                          `Tem certeza que deseja devolver à venda o pedido de ${nomeCompradorExibicao} (${dataHoraPedidoExibicao})?`,
                        )
                        if (confirmacao) {
                          devolverVenda(compradorKey)
                        }
                      }}
                      style={{ background: '#dc3545', marginRight: '10px' }}
                      disabled={isConfirmed}
                    >
                      Devolver Pedido
                    </Button>
                    <Button
                      onClick={() => confirmarVenda(compradorKey, pedidos)}
                      style={{ background: '#28a745' }}
                      disabled={isConfirmed}
                    >
                      Confirmar Venda
                    </Button>
                  </div>
                </>
              )}
            </Card>
          )
        })
      )}
    </Container>
  )
}

export { Pending }
