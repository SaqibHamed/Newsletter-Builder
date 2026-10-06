import React, { useRef } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  ChevronRight,
  Type,
  Heading as HeadingIcon,
  AlignLeft,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Columns2,
  Upload,
  Link,
  MousePointerClick,
  Plus,
  X,
  Sparkles,
  Car,
  Tag,
  Calendar,
  Gauge,
  Zap,
  Fuel,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { NewsletterNode, NodeType } from '../types';

interface NodeEditorItemProps {
  node: NewsletterNode;
  index: number;
  total: number;
  primaryColor: string;
  onUpdate: (updatedNode: NewsletterNode) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

const nodeTypeMeta: Record<
  NodeType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badge: string }
> = {
  title: {
    label: 'Titel',
    icon: Type,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badge: 'Haupttitel',
  },
  heading: {
    label: 'Überschrift',
    icon: HeadingIcon,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'Zwischenüberschrift',
  },
  paragraph: {
    label: 'Textabschnitt',
    icon: AlignLeft,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    badge: 'Fliesstext',
  },
  graphic: {
    label: 'Grafik',
    icon: ImageIcon,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    badge: 'Bild / Grafik',
  },
  bullet_list: {
    label: 'Aufzählung Listed',
    icon: ListIcon,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'Bullet-Punkte',
  },
  numbered_list: {
    label: 'Aufzählung Nummeriert',
    icon: ListOrdered,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: '1, 2, 3 Liste',
  },
  two_col_left_graphic: {
    label: '2 Spalten: Links Grafik, Rechts Text',
    icon: Columns2,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    badge: '2 Spalten L-Grafik',
  },
  two_col_right_graphic: {
    label: '2 Spalten: Rechts Grafik, Links Text',
    icon: Columns2,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    badge: '2 Spalten R-Grafik',
  },
  button_cta: {
    label: 'Call to Action Button',
    icon: MousePointerClick,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    badge: 'Aktions-Button',
  },
  vehicle_card: {
    label: 'Fahrzeugkarte (autolina)',
    icon: Car,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    badge: 'Fahrzeug',
  },
  url: {
    label: 'URL / Link',
    icon: Link,
    color: 'bg-blue-50 text-[#2E3E6C] border-blue-200',
    badge: 'Bold Dunkelblau',
  },
};

const sampleCarImages = [
  { label: 'Schweizer Fahrzeugmarkt', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' },
  { label: 'Kundenservice Schweiz', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Inserat erfassen', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' },
  { label: 'Auto Cockpit & Navigation', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80' },
];

export const NodeEditorItem: React.FC<NodeEditorItemProps> = ({
  node,
  index,
  total,
  primaryColor,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const meta = nodeTypeMeta[node.type];
  const Icon = meta.icon;
  const isCollapsed = !!node.collapsed;

  const toggleCollapse = () => {
    onUpdate({ ...node, collapsed: !isCollapsed });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'imageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          onUpdate({
            ...node,
            [targetField]: reader.result,
          } as NewsletterNode);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      id={`node-editor-item-${node.id}`}
      className="bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all duration-150 overflow-hidden"
    >
      {/* Node Header Bar */}
      <div className="px-3.5 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Node ausklappen" : "Node einklappen"}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform duration-150 ${
                !isCollapsed ? 'rotate-90' : ''
              }`}
            />
          </button>

          <span className="text-xs font-bold text-slate-400 font-mono w-5">
            #{index + 1}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${meta.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="truncate">{meta.label}</span>
          </span>

          {/* Collapsed summary teaser */}
          {isCollapsed && (
            <span className="text-xs text-slate-400 truncate max-w-xs ml-1">
              {'text' in node
                ? node.text
                : 'heading' in node
                ? (node as any).heading
                : 'items' in node
                ? `${(node as any).items.length} Aufzählungspunkte`
                : 'Grafik'}
            </span>
          )}
        </div>

        {/* Node Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onMove(index, 'up');
            }}
            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200/60 rounded transition-colors"
            title="Nach oben verschieben"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            onClick={(e) => {
              e.stopPropagation();
              onMove(index, 'down');
            }}
            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200/60 rounded transition-colors"
            title="Nach unten verschieben"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(node.id);
            }}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
            title="Node duplizieren"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Node löschen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Node Body Inputs (Shown when not collapsed) */}
      {!isCollapsed && (
        <div className="p-4 space-y-3.5">
          {/* 1. TITEL */}
          {node.type === 'title' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Titel-Text (26px Fett, Firmen-Norm)
                </label>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400">Ausrichtung:</span>
                  {(['left', 'center'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => onUpdate({ ...node, align })}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                        (node.align || 'left') === align
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {align === 'left' ? 'Links' : 'Zentriert'}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={node.text}
                onChange={(e) => onUpdate({ ...node, text: e.target.value })}
                placeholder="z.B. Willkommen bei autolina"
                className="w-full px-3 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          )}

          {/* 2. ÜBERSCHRIFT */}
          {node.type === 'heading' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Überschrift / Anrede (19px Halbfett)
                </label>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400">Ausrichtung:</span>
                  {(['left', 'center'] as const).map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => onUpdate({ ...node, align })}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                        (node.align || 'left') === align
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {align === 'left' ? 'Links' : 'Zentriert'}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={node.text}
                onChange={(e) => onUpdate({ ...node, text: e.target.value })}
                placeholder="z.B. Guten Tag Frau Muster,"
                className="w-full px-3 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tipp: Platzhalter wie <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">{'{{name}}'}</code> oder Standard <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">Frau Muster</code> werden in der Vorschau live simuliert.
              </p>
            </div>
          )}

          {/* 3. TEXTABSCHNITT */}
          {node.type === 'paragraph' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Textinhalt (Absätze durch Doppelklick/Enter trennen)
              </label>
              <textarea
                rows={4}
                value={node.text}
                onChange={(e) => onUpdate({ ...node, text: e.target.value })}
                placeholder="Textabschnitt eingeben..."
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 leading-relaxed font-sans"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Absätze automatisch im genormten E-Mail-Raster formatiert</span>
                <span>{node.text.length} Zeichen</span>
              </div>
            </div>
          )}

          {/* 4. GRAFIK */}
          {node.type === 'graphic' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bild-URL oder Datei-Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={node.imageUrl}
                    onChange={(e) => onUpdate({ ...node, imageUrl: e.target.value })}
                    placeholder="https://... (Bild-URL)"
                    className="flex-1 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                    title="Bild von Computer hochladen"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imageUrl')}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Quick Image Presets */}
              <div>
                <span className="text-[11px] font-medium text-slate-500 block mb-1">
                  Schnell-Vorlagen:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleCarImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onUpdate({ ...node, imageUrl: img.url, altText: img.label })}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Thumbnail */}
              {node.imageUrl && (
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 max-h-40 flex items-center justify-center">
                  <img
                    src={node.imageUrl}
                    alt={node.altText || 'Grafik Vorschau'}
                    className="max-h-40 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/600x300/f6f6f8/94a3b8?text=Bild+nicht+gefunden';
                    }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Alt-Text (Wichtig für Barrierefreiheit & E-Mail-Clients)
                  </label>
                  <input
                    type="text"
                    value={node.altText}
                    onChange={(e) => onUpdate({ ...node, altText: e.target.value })}
                    placeholder="Bildbeschreibung..."
                    className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Bildunterschrift (Optional)
                  </label>
                  <input
                    type="text"
                    value={node.caption || ''}
                    onChange={(e) => onUpdate({ ...node, caption: e.target.value })}
                    placeholder="z.B. Stand: März 2026"
                    className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. AUFZÄHLUNG LISTED (BULLETS) */}
          {node.type === 'bullet_list' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Aufzählungspunkte (Bullet-Liste)
              </label>
              <div className="space-y-1.5">
                {node.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...node.items];
                        newItems[itemIdx] = e.target.value;
                        onUpdate({ ...node, items: newItems });
                      }}
                      placeholder={`Listenpunkt ${itemIdx + 1}`}
                      className="flex-1 px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = node.items.filter((_, i) => i !== itemIdx);
                        onUpdate({ ...node, items: newItems.length > 0 ? newItems : [''] });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Punkt entfernen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onUpdate({ ...node, items: [...node.items, ''] })}
                className="mt-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Weiteren Punkt hinzufügen</span>
              </button>
            </div>
          )}

          {/* 6. AUFZÄHLUNG NUMMERIERT (NUMBERED) */}
          {node.type === 'numbered_list' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Nummerierte Schritte (1, 2, 3...)
              </label>
              <div className="space-y-1.5">
                {node.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {itemIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...node.items];
                        newItems[itemIdx] = e.target.value;
                        onUpdate({ ...node, items: newItems });
                      }}
                      placeholder={`Schritt ${itemIdx + 1}`}
                      className="flex-1 px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = node.items.filter((_, i) => i !== itemIdx);
                        onUpdate({ ...node, items: newItems.length > 0 ? newItems : [''] });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Schritt entfernen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onUpdate({ ...node, items: [...node.items, ''] })}
                className="mt-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Weiteren Schritt hinzufügen</span>
              </button>
            </div>
          )}

          {/* 7 & 8: 2 INHALTE NEBENEINANDER */}
          {(node.type === 'two_col_left_graphic' || node.type === 'two_col_right_graphic') && (
            <div className="space-y-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  {node.type === 'two_col_left_graphic'
                    ? 'Layout: [ Links: Grafik ] [ Rechts: Text (Überschrift + Absatz) ]'
                    : 'Layout: [ Links: Text (Überschrift + Absatz) ] [ Rechts: Grafik ]'}
                </span>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Grafik-URL & Vorlagen
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={node.imageUrl}
                        onChange={(e) => onUpdate({ ...node, imageUrl: e.target.value })}
                        placeholder="https://... Bild-URL"
                        className="flex-1 px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg flex items-center gap-1 shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sampleCarImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onUpdate({ ...node, imageUrl: img.url, altText: img.label })}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Überschrift im Textteil
                    </label>
                    <input
                      type="text"
                      value={node.heading}
                      onChange={(e) => onUpdate({ ...node, heading: e.target.value })}
                      placeholder="z.B. Fahrzeug in wenigen Minuten verkaufen"
                      className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Textabschnitt darunter
                    </label>
                    <textarea
                      rows={3}
                      value={node.paragraph}
                      onChange={(e) => onUpdate({ ...node, paragraph: e.target.value })}
                      placeholder="Beschreibungstext..."
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        Button-Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={node.buttonText || ''}
                        onChange={(e) => onUpdate({ ...node, buttonText: e.target.value })}
                        placeholder="z.B. Inserat erfassen"
                        className="w-full px-2 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">
                        Button-Link URL
                      </label>
                      <input
                        type="text"
                        value={node.buttonUrl || ''}
                        onChange={(e) => onUpdate({ ...node, buttonUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-2 py-1 text-xs text-slate-800 bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. BUTTON CTA */}
          {node.type === 'button_cta' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button-Beschriftung
                  </label>
                  <input
                    type="text"
                    value={node.label}
                    onChange={(e) => onUpdate({ ...node, label: e.target.value })}
                    placeholder="z.B. Jetzt Fahrzeuge entdecken"
                    className="w-full px-3 py-1.5 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ziel-URL
                  </label>
                  <input
                    type="text"
                    value={node.url}
                    onChange={(e) => onUpdate({ ...node, url: e.target.value })}
                    placeholder="https://www.autolina.ch"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Ausrichtung:</span>
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => onUpdate({ ...node, align })}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      (node.align || 'center') === align
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {align === 'left' ? 'Links' : align === 'center' ? 'Zentriert' : 'Rechts'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 10. VEHICLE CARD */}
          {node.type === 'vehicle_card' && (
            <div className="space-y-3.5">
              {/* Schnell-Aktionen für System-Tags */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-teal-600" />
                    System-Tags für Vorlagen
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    z.B. Probefahrt, Inserat online
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...node,
                        brand: '%Marke%',
                        brandModel: '%Modell%',
                        price: '%Preis%',
                        date: '%Datum%',
                        mileage: '%KM%',
                        power: '%PS%',
                        transmission: '%Schaltung%',
                        fuelType: '%Energie%',
                        driveTrain: '%Antrieb%',
                      })
                    }
                    className="px-2 py-1 text-[11px] font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded shadow-2xs flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Alle System-Tags einsetzen
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        ...node,
                        brand: 'Mercedes-Benz',
                        brandModel: 'AMG GT 63 S E Performance 4MATIC',
                        price: "CHF 72'500",
                        date: '06.2024',
                        mileage: "256'984 km",
                        power: '1296 PS',
                        transmission: 'Handschaltung',
                        fuelType: 'Plug-in-Hybrid',
                        driveTrain: 'Vorderradantrieb',
                      })
                    }
                    className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded shadow-2xs flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    Beispiel-Daten
                  </button>
                </div>
              </div>

              {/* Marke & Modell */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Marke</label>
                    <button
                      type="button"
                      onClick={() => onUpdate({ ...node, brand: '%Marke%' })}
                      className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                    >
                      + %Marke%
                    </button>
                  </div>
                  <input
                    type="text"
                    value={node.brand || ''}
                    onChange={(e) => onUpdate({ ...node, brand: e.target.value })}
                    placeholder="Mercedes-Benz oder %Marke%"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Modell</label>
                    <button
                      type="button"
                      onClick={() => onUpdate({ ...node, brandModel: '%Modell%' })}
                      className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                    >
                      + %Modell%
                    </button>
                  </div>
                  <input
                    type="text"
                    value={node.brandModel}
                    onChange={(e) => onUpdate({ ...node, brandModel: e.target.value })}
                    placeholder="AMG GT 63 S oder %Modell%"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
              </div>

              {/* Preis & Bild-URL */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Preis (CHF)
                    </label>
                    <button
                      type="button"
                      onClick={() => onUpdate({ ...node, price: '%Preis%' })}
                      className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                    >
                      + %Preis%
                    </button>
                  </div>
                  <input
                    type="text"
                    value={node.price}
                    onChange={(e) => onUpdate({ ...node, price: e.target.value })}
                    placeholder="CHF 72'500 oder %Preis%"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bild-URL
                  </label>
                  <input
                    type="url"
                    value={node.imageUrl}
                    onChange={(e) => onUpdate({ ...node, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Gliederung der Infos: 6 Spezifikationen gemäss Vorgabe */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Fahrzeug-Spezifikationen (Datum, KM, PS, Schaltung, Energie, Antrieb)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* 1. Datum */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        Datum
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...node, date: '%Datum%' })}
                        className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                      >
                        + %Datum%
                      </button>
                    </div>
                    <input
                      type="text"
                      value={node.date || ''}
                      onChange={(e) => onUpdate({ ...node, date: e.target.value })}
                      placeholder="06.2024 oder %Datum%"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {/* 2. KM */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-slate-500" />
                        KM
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...node, mileage: '%KM%' })}
                        className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                      >
                        + %KM%
                      </button>
                    </div>
                    <input
                      type="text"
                      value={node.mileage || ''}
                      onChange={(e) => onUpdate({ ...node, mileage: e.target.value })}
                      placeholder="256'984 km oder %KM%"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {/* 3. PS */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-slate-500" />
                        PS
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...node, power: '%PS%' })}
                        className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                      >
                        + %PS%
                      </button>
                    </div>
                    <input
                      type="text"
                      value={node.power || ''}
                      onChange={(e) => onUpdate({ ...node, power: e.target.value })}
                      placeholder="1296 PS oder %PS%"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {/* 4. Schaltung */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-slate-500" />
                        Schaltung
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...node, transmission: '%Schaltung%' })}
                        className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                      >
                        + %Schaltung%
                      </button>
                    </div>
                    <input
                      type="text"
                      value={node.transmission || ''}
                      onChange={(e) => onUpdate({ ...node, transmission: e.target.value })}
                      placeholder="Handschaltung oder %Schaltung%"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {/* 5. Energie */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-slate-500" />
                        Energie
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...node, fuelType: '%Energie%' })}
                        className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                      >
                        + %Energie%
                      </button>
                    </div>
                    <input
                      type="text"
                      value={node.fuelType || ''}
                      onChange={(e) => onUpdate({ ...node, fuelType: e.target.value })}
                      placeholder="Plug-in-Hybrid oder %Energie%"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>

                  {/* 6. Antrieb */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                        <Car className="w-3 h-3 text-slate-500" />
                        Antrieb
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdate({ ...node, driveTrain: '%Antrieb%' })}
                        className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                      >
                        + %Antrieb%
                      </button>
                    </div>
                    <input
                      type="text"
                      value={node.driveTrain || ''}
                      onChange={(e) => onUpdate({ ...node, driveTrain: e.target.value })}
                      placeholder="Vorderradantrieb oder %Antrieb%"
                      className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {node.type === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link-Text
                </label>
                <input
                  type="text"
                  value={node.label !== undefined ? node.label : node.url}
                  onChange={(e) => onUpdate({ ...node, label: e.target.value })}
                  placeholder="%Reset% oder individueller Text"
                  className="w-full px-3 py-1.5 text-xs text-[#2E3E6C] font-bold bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ziel-URL
                </label>
                <input
                  type="text"
                  value={node.url}
                  onChange={(e) => onUpdate({ ...node, url: e.target.value })}
                  placeholder="%Reset% oder https://..."
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
