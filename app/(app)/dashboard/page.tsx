import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalAtivos, error: err1 },
    { count: totalAbertos, error: err2 },
    { data: valorRows, error: err3 },
    { count: totalFechados, error: err4 },
  ] = await Promise.all([
    supabase.from('clientes').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
    supabase.from('deals').select('*', { count: 'exact', head: true }).neq('etapa', 'Fechado'),
    supabase.from('deals').select('valor').neq('etapa', 'Fechado'),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('etapa', 'Fechado'),
  ])

  if (err1 || err2 || err3 || err4) throw err1 ?? err2 ?? err3 ?? err4

  const valorTotal = (valorRows ?? []).reduce((sum, row) => sum + Number(row.valor ?? 0), 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Clientes Ativos" value={String(totalAtivos ?? 0)} />
        <MetricCard title="Oportunidades Abertas" value={String(totalAbertos ?? 0)} />
        <MetricCard
          title="Valor em Aberto"
          value={`R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
        />
        <MetricCard title="Oportunidades Fechadas" value={String(totalFechados ?? 0)} />
      </div>
      <div className="flex gap-4">
        <Link href="/clientes" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Gerenciar Clientes
        </Link>
        <Link href="/pipeline" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
          Ver Pipeline
        </Link>
      </div>
    </div>
  )
}
