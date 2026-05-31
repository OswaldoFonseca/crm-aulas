'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { Deal, DealEtapa, ClienteListItem } from '@/types'
import { ETAPAS } from '@/types'

interface Props {
  deal: Deal | null
  clientes: ClienteListItem[]
  onClose: () => void
  onSaved: () => void
}

interface FormState {
  titulo: string
  cliente_id: string
  valor: string
  etapa: DealEtapa
  notas: string
}

export default function DealModal({ deal, clientes, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    titulo: deal?.titulo ?? '',
    cliente_id: deal?.cliente_id ?? '',
    valor: deal?.valor != null ? String(deal.valor) : '',
    etapa: deal?.etapa ?? 'Lead',
    notas: deal?.notas ?? '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleEtapaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm(prev => ({ ...prev, etapa: e.target.value as DealEtapa }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.titulo.trim()) {
      setError('O título não pode estar em branco.')
      return
    }

    const valorNum = form.valor !== '' ? parseFloat(form.valor) : null
    if (valorNum !== null && (!Number.isFinite(valorNum) || valorNum < 0)) {
      setError('O valor deve ser um número positivo válido.')
      return
    }

    setLoading(true)

    const payload = {
      titulo: form.titulo,
      cliente_id: form.cliente_id || null,
      valor: valorNum,
      etapa: form.etapa,
      notas: form.notas || null,
    }

    const supabase = createClient()
    const { error: saveError } = deal
      ? await supabase.from('deals').update(payload).eq('id', deal.id)
      : await supabase.from('deals').insert(payload)

    if (saveError) {
      setError('Erro ao salvar. Tente novamente.')
      setLoading(false)
      return
    }

    setLoading(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {deal ? 'Editar Oportunidade' : 'Nova Oportunidade'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input name="titulo" required value={form.titulo} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select name="cliente_id" value={form.cliente_id} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">— Sem cliente —</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input name="valor" type="number" min="0" step="0.01" value={form.valor} onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etapa <span className="text-red-500">*</span>
              </label>
              <select name="etapa" value={form.etapa} onChange={handleEtapaChange}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                {ETAPAS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea name="notas" value={form.notas} onChange={handleChange} rows={3}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors">
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
