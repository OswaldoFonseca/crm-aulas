import { createClient } from '@/lib/supabase-server'
import type { Cliente } from '@/types'
import ClientesTable from '@/components/ClientesTable'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) throw error

  return <ClientesTable clientes={(data ?? []) as Cliente[]} />
}
