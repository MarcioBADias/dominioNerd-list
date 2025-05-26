import { useState } from 'react'
import { supabase } from '../../services/supabase'
import { Container, Form, Label, Input, Button, Select } from './style'
import { editions } from '../../services/utils'

const AddForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    edition: '',
    serialNumber: '',
    price: '',
    quantity: '',
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, edition, serialNumber, price, quantity } = formData

    if (!name || !edition || !serialNumber || !price || !quantity) {
      alert('Preencha todos os campos')
      return
    }

    const { error } = await supabase.from('itens').insert([
      {
        name,
        edition,
        serialNumber,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    ])

    if (error) {
      console.error('Erro ao inserir item:', error)
      alert('Erro ao adicionar item.')
    } else {
      alert('Item adicionado com sucesso!')
      setFormData({
        name: '',
        edicao: '',
        serialNumber: '',
        price: '',
        quantity: '',
      })
    }
  }

  return (
    <Container>
      <h1>Adicionar Novo Item</h1>
      <Form onSubmit={handleSubmit}>
        <Label>Nome</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <Label>Edição</Label>
        <Select name="edition" value={formData.edition} onChange={handleChange}>
          <option value="">Selecione uma edição</option>
          {Object.entries(editions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Label>Numero da Peça</Label>
        <Input
          type="text"
          name="serialNumber"
          value={formData.serialNumber}
          onChange={handleChange}
        />

        <Label>Preço (ex: 12.50)</Label>
        <Input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />

        <Label>Quantidade</Label>
        <Input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
        />

        <Button type="submit">Salvar</Button>
      </Form>
    </Container>
  )
}

export { AddForm }
