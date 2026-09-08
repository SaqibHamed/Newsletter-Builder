import React, { useRef } from 'react';
import {
  Type,
  Heading as HeadingIcon,
  AlignLeft,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Columns2,
  MousePointerClick,
  Upload,
  Link,
  Plus,
  Trash2,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { NewsletterMeta, NewsletterNode } from '../types';

interface SelectedBrickEditorProps {
  node: NewsletterNode | null;
  meta: NewsletterMeta;
  primaryColor: string;
  onUpdateNode: (updatedNode: NewsletterNode) => void;
  onUpdateMeta: (meta: NewsletterMeta) => void;
}

export const SelectedBrickEditor: React.FC<SelectedBrickEditorProps> = ({
  node,
  meta,
  primaryColor,
  onUpdateNode,
  onUpdateMeta,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!node) {
    return (
      <div className="p-6 text-center text-zinc-500 bg-zinc-50/50 rounded-lg border border-zinc-200">
        <Sliders className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
        <p className="text-xs font-semibold text-zinc-700">Kein Baustein ausgewählt</p>
        <p className="text-[11px] text-zinc-400 mt-1">
          Klicken Sie in der Übersicht (Mitte) oder direkt in der Vorschau auf einen Baustein, um ihn zu bearbeiten.
        </p>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'imageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && typeof reader.result === 'string') {
          onUpdateNode({
            ...node,
            [targetField]: reader.result,
          } as NewsletterNode);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="selected-brick-editor" className="space-y-4">
      {/* Node Type Info Banner */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-100/70 border border-zinc-200 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 capitalize">{node.type.replace(/_/g, ' ')}</span>
          {node.type === 'title' && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-zinc-700 border border-zinc-200">
              24px SemiBold
            </span>
          )}
          {node.type === 'heading' && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-zinc-700 border border-zinc-200">
              16px Regular
            </span>
          )}
          {node.type === 'paragraph' && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white text-zinc-700 border border-zinc-200">
              16px Regular
            </span>
          )}
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">ID: {node.id.split('-').slice(-2).join('-')}</span>
      </div>

      {/* Editor Fields based on node type */}
      {node.type === 'title' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Titel-Text (Norm: 24px Semi Bold, #000000)
            </label>
            <input
              type="text"
              value={node.text}
              onChange={(e) => onUpdateNode({ ...node, text: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Haupttitel eingeben..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Ausrichtung</label>
            <div className="flex gap-1.5">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateNode({ ...node, align })}
                  className={`flex-1 py-1 text-xs rounded border transition-colors capitalize ${
                    node.align === align
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {align === 'left' ? 'Links' : align === 'center' ? 'Zentriert' : 'Rechts'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {node.type === 'heading' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Überschrift / Anrede (Norm: 16px Regular, #000000)
            </label>
            <input
              type="text"
              value={node.text}
              onChange={(e) => onUpdateNode({ ...node, text: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="z. B. Guten Tag Frau Muster,"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              Tipp: Platzhalter wie <code>{'{{salutation}}'}</code> und <code>{'{{name}}'}</code> werden unterstützt.
            </p>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Ausrichtung</label>
            <div className="flex gap-1.5">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateNode({ ...node, align })}
                  className={`flex-1 py-1 text-xs rounded border transition-colors capitalize ${
                    node.align === align
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {align === 'left' ? 'Links' : align === 'center' ? 'Zentriert' : 'Rechts'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {node.type === 'paragraph' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Textabschnitt (Norm: 16px Regular, #000000, 1.5 Zeilenabstand)
            </label>
            <textarea
              rows={5}
              value={node.text}
              onChange={(e) => onUpdateNode({ ...node, text: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 leading-relaxed font-sans"
              placeholder="Geben Sie hier den Fliesstext ein. Doppelte Zeilenumbrüche erzeugen neue Absätze..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Ausrichtung</label>
            <div className="flex gap-1.5">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateNode({ ...node, align })}
                  className={`flex-1 py-1 text-xs rounded border transition-colors capitalize ${
                    node.align === align
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {align === 'left' ? 'Links' : align === 'center' ? 'Zentriert' : 'Rechts'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {node.type === 'graphic' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bild-Quelle (URL oder Upload)</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={node.imageUrl}
                onChange={(e) => onUpdateNode({ ...node, imageUrl: e.target.value })}
                className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="https://images.unsplash.com/..."
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 flex items-center gap-1 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'imageUrl')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Alt-Text (Barrierefreiheit)</label>
              <input
                type="text"
                value={node.altText}
                onChange={(e) => onUpdateNode({ ...node, altText: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="Bildbeschreibung..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Bildunterschrift (Optional)</label>
              <input
                type="text"
                value={node.caption || ''}
                onChange={(e) => onUpdateNode({ ...node, caption: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="Caption unter Bild..."
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Klick-Link (Optional)</label>
            <input
              type="url"
              value={node.linkUrl || ''}
              onChange={(e) => onUpdateNode({ ...node, linkUrl: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      {node.type === 'bullet_list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-700">Listenpunkte (Bullets)</label>
            <button
              type="button"
              onClick={() => onUpdateNode({ ...node, items: [...node.items, 'Neuer Aufzählungspunkt'] })}
              className="text-xs text-zinc-900 hover:text-black font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Punkt hinzufügen
            </button>
          </div>
          <div className="space-y-2">
            {node.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 shrink-0 ml-1" />
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...node.items];
                    newItems[idx] = e.target.value;
                    onUpdateNode({ ...node, items: newItems });
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  placeholder={`Listenpunkt ${idx + 1}...`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = node.items.filter((_, i) => i !== idx);
                    onUpdateNode({ ...node, items: newItems });
                  }}
                  disabled={node.items.length <= 1}
                  className="p-1 rounded text-zinc-400 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.type === 'numbered_list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-zinc-700">Nummerierte Schritte</label>
            <button
              type="button"
              onClick={() => onUpdateNode({ ...node, items: [...node.items, 'Nächster Prozessschritt'] })}
              className="text-xs text-zinc-900 hover:text-black font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Schritt hinzufügen
            </button>
          </div>
          <div className="space-y-2">
            {node.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...node.items];
                    newItems[idx] = e.target.value;
                    onUpdateNode({ ...node, items: newItems });
                  }}
                  className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  placeholder={`Schritt ${idx + 1}...`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = node.items.filter((_, i) => i !== idx);
                    onUpdateNode({ ...node, items: newItems });
                  }}
                  disabled={node.items.length <= 1}
                  className="p-1 rounded text-zinc-400 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(node.type === 'two_col_left_graphic' || node.type === 'two_col_right_graphic') && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              {node.type === 'two_col_left_graphic' ? 'Grafik (Links, 46%)' : 'Grafik (Rechts, 46%)'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={node.imageUrl}
                onChange={(e) => onUpdateNode({ ...node, imageUrl: e.target.value })}
                className="flex-1 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-lg border border-zinc-200 flex items-center gap-1 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'imageUrl')}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Überschrift</label>
            <input
              type="text"
              value={node.heading}
              onChange={(e) => onUpdateNode({ ...node, heading: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Themen-Überschrift..."
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Textabschnitt</label>
            <textarea
              rows={3}
              value={node.paragraph}
              onChange={(e) => onUpdateNode({ ...node, paragraph: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Textinhalt passend zur Grafik..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Button-Text (Optional)</label>
              <input
                type="text"
                value={node.buttonText || ''}
                onChange={(e) => onUpdateNode({ ...node, buttonText: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="z. B. Details ansehen"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Button-Link</label>
              <input
                type="url"
                value={node.buttonUrl || ''}
                onChange={(e) => onUpdateNode({ ...node, buttonUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      )}

      {node.type === 'button_cta' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Button-Beschriftung</label>
            <input
              type="text"
              value={node.label}
              onChange={(e) => onUpdateNode({ ...node, label: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="z. B. Jetzt anmelden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Ziel-URL (Link)</label>
            <input
              type="url"
              value={node.url}
              onChange={(e) => onUpdateNode({ ...node, url: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="https://unternehmen.ch/aktion"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Ausrichtung</label>
            <div className="flex gap-1.5">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() => onUpdateNode({ ...node, align })}
                  className={`flex-1 py-1 text-xs rounded border transition-colors capitalize ${
                    node.align === align
                      ? 'bg-zinc-900 text-white border-zinc-900 font-medium'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  {align === 'left' ? 'Links' : align === 'center' ? 'Zentriert' : 'Rechts'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
