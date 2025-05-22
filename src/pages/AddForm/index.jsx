import { useState } from 'react'
import { supabase } from '../../services/supabase'
import { Container, Form, Label, Input, Button } from './style'

const AddForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    edition: '',
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

    const { name, edition, price, quantity } = formData

    if (!name || !edition || !price || !quantity) {
      alert('Preencha todos os campos')
      return
    }

    const { error } = await supabase.from('itens').insert([
      {
        name,
        edition,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    ])

    if (error) {
      console.error('Erro ao inserir item:', error)
      alert('Erro ao adicionar item.')
    } else {
      alert('Item adicionado com sucesso!')
      setFormData({ name: '', edicao: '', price: '', quantity: '' })
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
        <Input
          type="text"
          name="edition"
          value={formData.edition}
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
