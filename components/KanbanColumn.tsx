'use client'

import { useDroppable } from '@dnd-kit/core'
import type { Deal, DealEtapa } from '@/types'
import KanbanCard from './KanbanCard'

interface Props {
  etapa: DealEtapa
  deals: Deal[]
  onEdit: (deal: Deal) => void
  onDelete: (id: string) => void
}

export default function KanbanColumn({ etapa, deals, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: etapa })

  return (
    <div className="flex-shrink-0 w-64">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold text-gray-700">{etapa}</h3>
        <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">{deals.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-48 rounded-lg p-2 space-y-2 transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-100 border-2 border-transparent'
        }`}
      >
        {deals.map(deal => (
          <KanbanCard key={deal.id} deal={deal} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {deals.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">Nenhuma oportunidade</p>
        )}
      </div>
    </div>
  )
}
