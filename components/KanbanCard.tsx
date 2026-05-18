'use client'

import { useDraggable } from '@dnd-kit/core'
import type { Deal } from '@/types'

interface Props {
  deal: Deal
  onEdit: (deal: Deal) => void
  onDelete: (id: string) => void
}

export default function KanbanCard({ deal, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: deal.id,
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white rounded-md p-3 shadow-sm border transition-opacity ${
        deal.etapa === 'Fechado' ? 'border-green-300' : 'border-gray-200'
      } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div {...listeners} className="min-w-0 flex-1 cursor-grab active:cursor-grabbing">
          <p className="text-sm font-medium text-gray-900 truncate">{deal.titulo}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {deal.clientes?.nome ?? <span className="italic text-gray-400">Cliente removido</span>}
          </p>
          {deal.valor != null && (
            <p className="text-xs font-semibold text-gray-700 mt-1">
              R$ {Number(deal.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0 pt-0.5">
          <button onClick={() => onEdit(deal)} className="text-blue-500 hover:text-blue-700 text-xs p-1" title="Editar">✏</button>
          <button onClick={() => onDelete(deal.id)} className="text-red-500 hover:text-red-700 text-xs p-1" title="Excluir">✕</button>
        </div>
      </div>
    </div>
  )
}
