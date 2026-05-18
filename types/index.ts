export type ClienteStatus = 'ativo' | 'inativo'
export type DealEtapa = 'Lead' | 'Qualificado' | 'Proposta' | 'Negociação' | 'Fechado'

export const ETAPAS: DealEtapa[] = [
  'Lead',
  'Qualificado',
  'Proposta',
  'Negociação',
  'Fechado',
]

export interface Cliente {
  id: string
  user_id: string
  nome: string
  email: string | null
  telefone: string | null
  empresa: string | null
  status: ClienteStatus
  notas: string | null
  criado_em: string
  atualizado_em: string
}

export interface Deal {
  id: string
  user_id: string
  titulo: string
  cliente_id: string | null
  clientes: { nome: string } | null
  valor: number | null
  etapa: DealEtapa
  notas: string | null
  criado_em: string
  atualizado_em: string
}

export type ClienteListItem = Pick<Cliente, 'id' | 'nome'>
