import { createClient } from '@/lib/supabase-server'
import type { Deal, ClienteListItem } from '@/types'
import KanbanBoard from '@/components/KanbanBoard'

export default async function PipelinePage() {
  const supabase = await createClient()

  const [{ data: deals, error: dealsError }, { data: clientes, error: clientesError }] = await Promise.all([
    supabase
      .from('deals')
      .select('*, clientes(nome)')
      .order('criado_em', { ascending: true }),
    supabase
      .from('clientes')
      .select('id, nome')
      .eq('status', 'ativo')
      .order('nome'),
  ])

  if (dealsError) throw dealsError
  if (clientesError) throw clientesError

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pipeline de Vendas</h1>
      <KanbanBoard
        initialDeals={(deals ?? []) as Deal[]}
        clientes={(clientes ?? []) as ClienteListItem[]}
      />
    </div>
  )
}
