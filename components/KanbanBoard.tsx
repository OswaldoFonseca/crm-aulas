'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { Deal, DealEtapa, ClienteListItem } from '@/types'
import { ETAPAS } from '@/types'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import DealModal from './DealModal'

interface Props {
  initialDeals: Deal[]
  clientes: ClienteListItem[]
}

export default function KanbanBoard({ initialDeals, clientes }: Props) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const router = useRouter()

  function handleDragStart(event: DragStartEvent) {
    setActiveDeal(deals.find(d => d.id === event.active.id) ?? null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDeal(null)
    if (!over) return

    const dealId = active.id as string
    const novaEtapa = over.id as DealEtapa
    const deal = deals.find(d => d.id === dealId)
    if (!deal || deal.etapa === novaEtapa || !ETAPAS.includes(novaEtapa)) return

    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, etapa: novaEtapa } : d))

    const supabase = createClient()
    const { error } = await supabase.from('deals').update({ etapa: novaEtapa }).eq('id', dealId)

    if (error) {
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, etapa: deal.etapa } : d))
      alert('Erro ao atualizar etapa. Tente novamente.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta oportunidade?')) return
    const supabase = createClient()
    const { error } = await supabase.from('deals').delete().eq('id', id)
    if (error) {
      alert('Erro ao excluir. Tente novamente.')
      return
    }
    setDeals(prev => prev.filter(d => d.id !== id))
    router.refresh()
  }

  function handleSaved() {
    setModalOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => { setEditingDeal(null); setModalOpen(true) }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Nova Oportunidade
        </button>
      </div>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {ETAPAS.map(etapa => (
            <KanbanColumn
              key={etapa}
              etapa={etapa}
              deals={deals.filter(d => d.etapa === etapa)}
              onEdit={deal => { setEditingDeal(deal); setModalOpen(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDeal && (
            <KanbanCard deal={activeDeal} onEdit={() => {}} onDelete={() => {}} />
          )}
        </DragOverlay>
      </DndContext>
      {modalOpen && (
        <DealModal
          deal={editingDeal}
          clientes={clientes}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
