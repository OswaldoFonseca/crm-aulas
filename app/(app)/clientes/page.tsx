import { createClient } from '@/lib/supabase-server'
import type { Cliente } from '@/types'
import ClientesTable from '@/components/ClientesTable'

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clientes')
    .select('*')
    .order('criado_em', { ascending: false })

  return <ClientesTable clientes={(data ?? []) as Cliente[]} />
}
