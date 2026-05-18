'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { Cliente, ClienteStatus } from '@/types'

interface Props {
  cliente: Cliente | null
  onClose: () => void
  onSaved: () => void
}

interface FormState {
  nome: string
  email: string
  telefone: string
  empresa: string
  status: ClienteStatus
  notas: string
}

export default function ClienteModal({ cliente, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    nome: cliente?.nome ?? '',
    email: cliente?.email ?? '',
    telefone: cliente?.telefone ?? '',
    empresa: cliente?.empresa ?? '',
    status: cliente?.status ?? 'ativo',
    notas: cliente?.notas ?? '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      nome: form.nome,
      email: form.email || null,
      telefone: form.telefone || null,
      empresa: form.empresa || null,
      status: form.status,
      notas: form.notas || null,
    }

    const supabase = createClient()
    const { error } = cliente
      ? await supabase.from('clientes').update(payload).eq('id', cliente.id)
      : await supabase.from('clientes').insert(payload)

    if (error) {
      setError(
        error.code === '23505'
          ? 'Este e-mail já está cadastrado.'
          : 'Erro ao salvar. Tente novamente.'
      )
      setLoading(false)
      return
    }

    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome <span className="text-red-500">*</span>
              </label>
              <input name="nome" required value={form.nome} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input name="empresa" value={form.empresa} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select name="status" value={form.status} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea name="notas" value={form.notas} onChange={handleChange} rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
