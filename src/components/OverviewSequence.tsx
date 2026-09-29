import React, { useState } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Plus,
  Type,
  Heading as HeadingIcon,
  AlignLeft,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Columns2,
  MousePointerClick,
  RotateCcw,
  ListFilter,
  CheckCircle2,
  Car,
} from 'lucide-react';
import { NewsletterNode, NodeType } from '../types';
import { createNewNode } from '../utils/nodeFactory';

const nodeIcons: Record<NodeType, React.ComponentType<{ className?: string }>> = {
  title: Type,
  heading: HeadingIcon,
  paragraph: AlignLeft,
  graphic: ImageIcon,
  bullet_list: ListIcon,
  numbered_list: ListOrdered,
  two_col_left_graphic: Columns2,
  two_col_right_graphic: Columns2,
  button_cta: MousePointerClick,
  vehicle_card: Car,
};

const nodeLabels: Record<NodeType, { title: string }> = {
  title: { title: 'Titel' },
  heading: { title: 'Überschrift' },
  paragraph: { title: 'Textabschnitt' },
  graphic: { title: 'Grafik / Bild' },
  bullet_list: { title: 'Aufzählung Listed' },
  numbered_list: { title: 'Aufzählung Nummeriert' },
  two_col_left_graphic: { title: '2 Spalten (L-Grafik)' },
  two_col_right_graphic: { title: '2 Spalten (R-Grafik)' },
  button_cta: { title: 'Button CTA' },
  vehicle_card: { title: 'Fahrzeugkarte' },
};

function getNodeSnippet(node: NewsletterNode): string {
  switch (node.type) {
    case 'title':
    case 'heading':
    case 'paragraph':
      return node.text ? node.text.replace(/\n+/g, ' ').slice(0, 75) : '(Kein Text eingetragen)';
    case 'graphic':
      return node.caption ? `Bild: ${node.caption}` : node.altText ? `Bild: ${node.altText}` : 'Bild ohne Bildunterschrift';
    case 'vehicle_card':
      return `${node.brandModel || 'Fahrzeug'} • ${node.price || 'CHF'}`;
    case 'bullet_list':
    case 'numbered_list':
      return `${node.items.length} Aufzählungspunkte`;
    case 'two_col_left_graphic':
    case 'two_col_right_graphic':
      return `${node.heading || 'Überschrift'}: ${(node.paragraph || '').slice(0, 45)}...`;
    case 'button_cta':
      return `Button: "${node.label}" → ${node.url || '#'}`;
    default:
      return '';
  }
}

interface OverviewSequenceProps {
  nodes: NewsletterNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onUpdateNodes: (nodes: NewsletterNode[]) => void;
  onResetNodes: () => void;
}

export const OverviewSequence: React.FC<OverviewSequenceProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onUpdateNodes,
  onResetNodes,
}) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);

  // Handle Drag Start from inside the sequence (reordering)
  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('application/json-reorder', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle Drag Over a drop zone
  const handleDragOver = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggedItemIndex !== null ? 'move' : 'copy';
    if (activeDropIndex !== dropIndex) {
      setActiveDropIndex(dropIndex);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if leaving the container
  };

  // Handle Drop in a specific position
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setActiveDropIndex(null);

    // Case 1: Reordering existing item
    const reorderIndexStr = e.dataTransfer.getData('application/json-reorder');
    if (reorderIndexStr !== '' || draggedItemIndex !== null) {
      const sourceIndex = draggedItemIndex !== null ? draggedItemIndex : parseInt(reorderIndexStr, 10);
      if (!isNaN(sourceIndex) && sourceIndex >= 0 && sourceIndex < nodes.length) {
        if (sourceIndex === targetIndex || sourceIndex === targetIndex - 1) {
          setDraggedItemIndex(null);
          return;
        }
        const updated = [...nodes];
        const [moved] = updated.splice(sourceIndex, 1);
        const insertionIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
        updated.splice(insertionIndex, 0, moved);
        onUpdateNodes(updated);
        onSelectNode(moved.id);
      }
      setDraggedItemIndex(null);
      return;
    }

    // Case 2: Dropping new brick from left palette
    const brickType = (e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('brick-type')) as NodeType;
    if (brickType && nodeLabels[brickType]) {
      const newNode = createNewNode(brickType);
      const updated = [...nodes];
      updated.splice(targetIndex, 0, newNode);
      onUpdateNodes(updated);
      onSelectNode(newNode.id);
    }

    setDraggedItemIndex(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= nodes.length) return;
    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    onUpdateNodes(updated);
  };

  const handleDelete = (id: string) => {
    const updated = nodes.filter((n) => n.id !== id);
    onUpdateNodes(updated);
    if (selectedNodeId === id) {
      onSelectNode(updated[0]?.id || '');
    }
  };

  const handleDuplicate = (id: string) => {
    const index = nodes.findIndex((n) => n.id === id);
    if (index === -1) return;
    const original = nodes[index];
    const clone: NewsletterNode = {
      ...JSON.parse(JSON.stringify(original)),
      id: `node-${original.type}-${Date.now()}`,
    };
    const updated = [...nodes];
    updated.splice(index + 1, 0, clone);
    onUpdateNodes(updated);
    onSelectNode(clone.id);
  };

  return (
    <section
      id="overview-sequence-container"
      className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full"
    >
      {/* Top Header */}
      <div className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-zinc-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Übersicht (Angereihte Bausteine)
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
            {nodes.length} Bausteine
          </span>
          <button
            type="button"
            onClick={onResetNodes}
            title="Auf Vorlagen-Reihenfolge zurücksetzen"
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Instructional helper */}
      <div className="px-4 py-2 bg-zinc-50/40 border-b border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>Klicken zum Bearbeiten • Ziehen zum Verschieben</span>
        <span className="text-zinc-400 text-[10px] font-mono">Top → Down</span>
      </div>

      {/* Main List with Drop Zones */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-1.5"
        onDragLeave={() => setActiveDropIndex(null)}
      >
        {/* Dropzone at index 0 (top) */}
        <div
          onDragOver={(e) => handleDragOver(e, 0)}
          onDrop={(e) => handleDrop(e, 0)}
          className={`h-2.5 -my-1 rounded transition-all duration-150 flex items-center justify-center ${
            activeDropIndex === 0
              ? 'h-8 bg-zinc-900 text-white text-[11px] font-medium shadow-xs my-1 border border-zinc-900'
              : 'hover:bg-zinc-200/60 opacity-0 hover:opacity-100'
          }`}
        >
          {activeDropIndex === 0 && (
            <span className="flex items-center gap-1 text-[10px]">
              <Plus className="w-3 h-3" /> Als ersten Baustein einfügen
            </span>
          )}
        </div>

        {nodes.length === 0 ? (
          <div
            onDragOver={(e) => handleDragOver(e, 0)}
            onDrop={(e) => handleDrop(e, 0)}
            className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl my-4"
          >
            <Plus className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-700">Keine Bausteine angereiht</p>
            <p className="text-[11px] text-zinc-400 mt-1">
              Ziehen Sie Bausteine aus der linken Spalte hierher, um den Newsletter aufzubauen.
            </p>
          </div>
        ) : (
          nodes.map((node, index) => {
            const Icon = nodeIcons[node.type] || AlignLeft;
            const meta = nodeLabels[node.type] || { title: node.type };
            const isSelected = selectedNodeId === node.id;
            const snippet = getNodeSnippet(node);

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  id={`overview-item-${node.id}`}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, index)}
                  onDragEnd={() => setDraggedItemIndex(null)}
                  onClick={() => onSelectNode(node.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectNode(node.id);
                    }
                  }}
                  className={`group relative rounded-lg border transition-all select-none p-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                      : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Position Number & Drag Handle */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <GripVertical
                        className={`w-3.5 h-3.5 cursor-grab active:cursor-grabbing ${
                          isSelected ? 'text-zinc-400' : 'text-zinc-300 group-hover:text-zinc-500'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-mono font-bold w-4 text-center ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-400'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`p-1.5 rounded shrink-0 ${
                        isSelected ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Meta info & Snippet */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold tracking-tight truncate">
                          {meta.title}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-white text-zinc-950 font-mono">
                            Aktiv
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-[11px] truncate mt-0.5 font-normal ${
                          isSelected ? 'text-zinc-300' : 'text-zinc-500'
                        }`}
                      >
                        {snippet}
                      </p>
                    </div>

                    {/* Actions Menu */}
                    <div
                      className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        title="Nach oben verschieben"
                        className={`p-1 rounded transition-colors ${
                          index === 0
                            ? 'opacity-30 cursor-not-allowed'
                            : isSelected
                            ? 'hover:bg-zinc-800 text-zinc-300'
                            : 'hover:bg-zinc-200 text-zinc-500'
                        }`}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === nodes.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        title="Nach unten verschieben"
                        className={`p-1 rounded transition-colors ${
                          index === nodes.length - 1
                            ? 'opacity-30 cursor-not-allowed'
                            : isSelected
                            ? 'hover:bg-zinc-800 text-zinc-300'
                            : 'hover:bg-zinc-200 text-zinc-500'
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(node.id)}
                        title="Baustein duplizieren"
                        className={`p-1 rounded transition-colors ${
                          isSelected
                            ? 'hover:bg-zinc-800 text-zinc-300'
                            : 'hover:bg-zinc-200 text-zinc-500'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(node.id)}
                        title="Baustein löschen"
                        className={`p-1 rounded transition-colors ${
                          isSelected
                            ? 'hover:bg-red-900/50 text-red-300'
                            : 'hover:bg-red-100 text-red-600'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropzone between items */}
                <div
                  onDragOver={(e) => handleDragOver(e, index + 1)}
                  onDrop={(e) => handleDrop(e, index + 1)}
                  className={`h-2.5 -my-1 rounded transition-all duration-150 flex items-center justify-center ${
                    activeDropIndex === index + 1
                      ? 'h-8 bg-zinc-900 text-white text-[11px] font-medium shadow-xs my-1 border border-zinc-900'
                      : 'hover:bg-zinc-200/60 opacity-0 hover:opacity-100'
                  }`}
                >
                  {activeDropIndex === index + 1 && (
                    <span className="flex items-center gap-1 text-[10px]">
                      <Plus className="w-3 h-3" /> Hier einfügen (Position {index + 2})
                    </span>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-zinc-100 bg-zinc-50/50 text-[11px] text-zinc-500 flex items-center justify-between">
        <span>Sequenz: {nodes.length} Elemente</span>
        <span className="text-[10px] text-zinc-400">Ausgewählt: {selectedNodeId ? '1 Baustein' : 'Keiner'}</span>
      </div>
    </section>
  );
};
