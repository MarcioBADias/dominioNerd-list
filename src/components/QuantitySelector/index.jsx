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

  return (
    <div style={{ background: '#fff', padding: 20 }}>
      <h2>Definir quantidade do pedido</h2>
      {items.map((item) => (
        <div key={item.id}>
          <strong>{item.name}</strong>
          <div>
            <button
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
              onClick={() => handleChange(item.id, quantities[item.id] + 1)}
            >
              +
            </button>
            <span> / {item.quantity} disponíveis</span>
          </div>
        </div>
      ))}
      <br />
      <button onClick={() => onSubmit(quantities)}>Enviar pedido</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  )
}

export { QuantitySelector }
