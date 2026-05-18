'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Cliente } from '@/types'
import { createClient } from '@/lib/supabase-browser'
import ClienteModal from './ClienteModal'

interface Props {
  clientes: Cliente[]
}

export default function ClientesTable({ clientes }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const router = useRouter()

  function openCreate() {
    setEditingCliente(null)
    setModalOpen(true)
  }

  function openEdit(cliente: Cliente) {
    setEditingCliente(cliente)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return
    const supabase = createClient()
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (error) {
      alert('Erro ao excluir. Tente novamente.')
      return
    }
    router.refresh()
  }

  function handleSaved() {
    setModalOpen(false)
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Cliente
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Nome', 'Email', 'Telefone', 'Empresa', 'Status', 'Cadastro', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Nenhum cliente cadastrado. Clique em &quot;Novo Cliente&quot; para começar.
                </td>
              </tr>
            )}
            {clientes.map(cliente => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{cliente.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cliente.email ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cliente.telefone ?? '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{cliente.empresa ?? '—'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    cliente.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cliente.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(cliente.criado_em).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => openEdit(cliente)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(cliente.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <ClienteModal
          cliente={editingCliente}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
