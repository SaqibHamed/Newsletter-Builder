import React from 'react';
import {
  Type,
  Heading as HeadingIcon,
  AlignLeft,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Columns2,
  MousePointerClick,
  GripVertical,
  Plus,
  Layers,
} from 'lucide-react';
import { NodeType } from '../types';

export interface BrickDefinition {
  type: NodeType;
  name: string;
  specs: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const availableBricks: BrickDefinition[] = [
  {
    type: 'title',
    name: 'Titel',
    specs: '24px • Semi Bold',
    description: 'Hauptüberschrift für den Newsletter-Einstieg',
    icon: Type,
  },
  {
    type: 'heading',
    name: 'Überschrift',
    specs: '16px • Regular',
    description: 'Zwischenüberschrift oder persönliche Anrede',
    icon: HeadingIcon,
  },
  {
    type: 'paragraph',
    name: 'Textabschnitt',
    specs: '16px • Regular',
    description: 'Fliesstext mit standardisiertem 1.5 Zeilenabstand',
    icon: AlignLeft,
  },
  {
    type: 'graphic',
    name: 'Grafik / Bild',
    specs: '536px max • Bildunterschrift',
    description: 'Vollbreites oder zentriertes Bild mit Alt-Text',
    icon: ImageIcon,
  },
  {
    type: 'bullet_list',
    name: 'Aufzählung Listed',
    specs: 'Bullet-Punkte • 16px',
    description: 'Ungeordnete Liste für prägnante Aufzählungen',
    icon: ListIcon,
  },
  {
    type: 'numbered_list',
    name: 'Aufzählung Nummeriert',
    specs: '1, 2, 3 Schritte • 16px',
    description: 'Nummerierte Schritte für Abläufe und Prozesse',
    icon: ListOrdered,
  },
  {
    type: 'two_col_left_graphic',
    name: '2 Spalten (Bild links)',
    specs: 'Bild 46% • Text 54%',
    description: 'Grafik links, Überschrift & Textabschnitt rechts',
    icon: Columns2,
  },
  {
    type: 'two_col_right_graphic',
    name: '2 Spalten (Bild rechts)',
    specs: 'Text 54% • Bild 46%',
    description: 'Überschrift & Textabschnitt links, Grafik rechts',
    icon: Columns2,
  },
  {
    type: 'button_cta',
    name: 'Button CTA',
    specs: 'Aktionsbutton • Zentrierbar',
    description: 'Klickbarer Aktionslink mit Button-Hintergrund',
    icon: MousePointerClick,
  },
];

interface BricksPaletteProps {
  onAddBrick: (type: NodeType) => void;
  onDragStateChange?: (isDragging: boolean, type?: NodeType | null) => void;
}

export const BricksPalette: React.FC<BricksPaletteProps> = ({ onAddBrick, onDragStateChange }) => {
  const handleDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('text/plain', type);
    e.dataTransfer.setData('application/json', JSON.stringify({ type }));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStateChange?.(true, type);
  };

  const handleDragEnd = () => {
    onDragStateChange?.(false, null);
  };

  return (
    <aside
      id="bricks-palette-container"
      className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-zinc-100 bg-zinc-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-700" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
            Bausteine (Bricks)
          </h2>
        </div>
        <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-700">
          {availableBricks.length} Typen
        </span>
      </div>

      {/* Subtitle / Tip */}
      <div className="px-4 py-2 bg-zinc-50/40 border-b border-zinc-100 text-[11px] text-zinc-500 flex items-center gap-1.5">
        <GripVertical className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span>In die Übersicht ziehen oder klicken zum Hinzufügen.</span>
      </div>

      {/* Bricks List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {availableBricks.map((brick) => {
          const Icon = brick.icon;
          return (
            <div
              key={brick.type}
              id={`brick-item-${brick.type}`}
              draggable
              onDragStart={(e) => handleDragStart(e, brick.type)}
              onDragEnd={handleDragEnd}
              onClick={() => onAddBrick(brick.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAddBrick(brick.type);
                }
              }}
              className="group relative p-2.5 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-400 rounded-lg cursor-grab active:cursor-grabbing transition-all select-none shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-start gap-2.5">
                {/* Drag Handle & Icon */}
                <div className="p-1.5 rounded-md bg-zinc-100 group-hover:bg-zinc-900 text-zinc-700 group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <span className="text-xs font-semibold text-zinc-900 tracking-tight block">
                    {brick.name}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {brick.specs}
                  </p>
                  <p className="text-[11px] text-zinc-600 line-clamp-1 mt-0.5">
                    {brick.description}
                  </p>
                </div>

                {/* Quick Add Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddBrick(brick.type);
                  }}
                  title={`${brick.name} anfügen`}
                  className="absolute right-2 top-2.5 p-1 rounded hover:bg-zinc-200 text-zinc-400 hover:text-zinc-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </aside>
  );
};
