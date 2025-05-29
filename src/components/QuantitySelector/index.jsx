// QuantitySelector.jsx

import { useState } from 'react'

const QuantitySelector = ({ items, onSubmit, onCancel }) => {
  const [quantities, setQuantities] = useState(
    items.reduce((acc, item) => {
      acc[item.id] = 1
      return acc
    }, {}),
  )

  const handleChange = (itemId, value) => {
    const max = items.find((item) => item.id === itemId).quantity
    const newValue = Math.max(1, Math.min(max, value))
    setQuantities({ ...quantities, [itemId]: newValue })
  }

  // Novo cálculo do valor total do pedido
  const totalPrice = items.reduce((acc, item) => {
    const selectedQuantity = quantities[item.id] || 0 // Garante que seja 0 se não houver quantidade
    return acc + item.price * selectedQuantity
  }, 0)

  return (
    <div style={{ background: '#fff', padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Definir quantidade do pedido</h2>
      {items.map((item) => (
        <div key={item.id}>
          <strong>
            {item.edition} {item.serialNumber} - {item.name}
          </strong>
          <span> Preço: R$ {item.price},00</span>
          <div>
            <button
              style={{
                marginRight: 10,
                paddingRight: 8,
                paddingLeft: 8,
                backgroundColor: '#222',
                color: 'white',
                borderRadius: 10,
              }}
              onClick={() => handleChange(item.id, quantities[item.id] - 1)}
            >
              -
            </button>
            <input
              type="number"
              value={quantities[item.id]}
              onChange={(e) => handleChange(item.id, parseInt(e.target.value))}
              min="1"
              max={item.quantity}
              style={{ width: 50 }}
            />
            <button
              style={{
                marginLeft: 10,
                paddingRight: 5,
                paddingLeft: 5,
                backgroundColor: '#222',
                color: 'white',
                borderRadius: 10,
              }}
              onClick={() => handleChange(item.id, quantities[item.id] + 1)}
            >
              +
            </button>
            <span> {item.quantity} disponíveis</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            {/* Subtotal por item - corrigido para usar a quantidade selecionada */}
            <strong>
              Subtotal: R$ {item.price * (quantities[item.id] || 0)},00
            </strong>
          </div>
        </div>
      ))}
      <br />
      {/* Exibição do valor final do pedido */}
      <h2>Valor final do pedido: R$ {totalPrice},00</h2>
      <br />
      <button
        style={{
          padding: 5,
          backgroundColor: '#222',
          color: 'white',
          borderRadius: 10,
        }}
        onClick={() => onSubmit(quantities)}
      >
        Enviar pedido
      </button>
      <button
        style={{
          marginLeft: 20,
          padding: 5,
          backgroundColor: '#222',
          color: 'white',
          borderRadius: 10,
        }}
        onClick={onCancel}
      >
        Cancelar
      </button>
    </div>
  )
}

export { QuantitySelector }
