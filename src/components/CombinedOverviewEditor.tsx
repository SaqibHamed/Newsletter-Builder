import React, { useState, useEffect, useRef } from 'react';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Plus,
  Type,
  Heading as HeadingIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  List as ListIcon,
  ListOrdered,
  Columns as ColumnsIcon,
  MousePointerClick,
  Sparkles,
  Mail,
  Sliders,
  ExternalLink,
  Layers,
  ArrowUpDown,
  Car,
  Tag,
  Check,
  Link as LinkIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode, NodeType } from '../types';
import { createNewNode } from '../utils/nodeFactory';
import { SYSTEM_TAGS_LIST, formatPlaceholderTag, isPlaceholderGraphic } from '../utils/autolinaAssets';

interface CombinedOverviewEditorProps {
  nodes: NewsletterNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateNode: (node: NewsletterNode) => void;
  onUpdateNodes: (nodes: NewsletterNode[]) => void;
  meta: NewsletterMeta;
  onUpdateMeta: (meta: NewsletterMeta) => void;
  company?: CompanySettings;
  onToggleSecurityNotice?: () => void;
  primaryColor?: string;
  onResetNodes?: () => void;
  isDraggingExternal?: boolean;
  draggedBrickType?: NodeType | null;
}

const sampleImages = [
  {
    label: 'Büro & Architektur',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Technologie & Code',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Zusammenarbeit',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Finanzen & Analyse',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  },
];

export const CombinedOverviewEditor: React.FC<CombinedOverviewEditorProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onUpdateNode,
  onUpdateNodes,
  meta,
  onUpdateMeta,
  company,
  onToggleSecurityNotice,
  primaryColor = '#18181b',
  onResetNodes,
  isDraggingExternal = false,
  draggedBrickType = null,
}) => {
  const [draggedNodeIndex, setDraggedNodeIndex] = useState<number | null>(null);
  const draggedNodeIndexRef = useRef<number | null>(null);
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);
  const [isWindowDragging, setIsWindowDragging] = useState<boolean>(false);
  const [showMetaSettings, setShowMetaSettings] = useState<boolean>(false);
  const [showSystemTagsDrawer, setShowSystemTagsDrawer] = useState<boolean>(true);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  const handleInsertTag = (tag: string, targetNodeId?: string) => {
    const targetId = targetNodeId || selectedNodeId;
    if (targetId) {
      const targetNode = nodes.find((n) => n.id === targetId);
      if (targetNode) {
        if ('text' in targetNode) {
          const current = (targetNode as any).text || '';
          const updated = current ? `${current} ${tag}` : tag;
          onUpdateNode({ ...targetNode, text: updated });
        } else if (targetNode.type === 'two_col_left_graphic' || targetNode.type === 'two_col_right_graphic') {
          const current = targetNode.paragraph || '';
          const updated = current ? `${current} ${tag}` : tag;
          onUpdateNode({ ...targetNode, paragraph: updated });
        } else if (targetNode.type === 'bullet_list' || targetNode.type === 'numbered_list') {
          const lastIdx = targetNode.items.length - 1;
          if (lastIdx >= 0) {
            const newItems = [...targetNode.items];
            newItems[lastIdx] = newItems[lastIdx] ? `${newItems[lastIdx]} ${tag}` : tag;
            onUpdateNode({ ...targetNode, items: newItems });
          }
        }
      }
    }
    try {
      navigator.clipboard.writeText(tag);
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 2000);
    } catch {
      // Ignore clipboard write restrictions if any
    }
  };

  // Detect global window drag for smooth drop cells appearance
  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = () => {
      dragCounter++;
      setIsWindowDragging(true);
    };

    const handleDragLeave = () => {
      dragCounter--;
      if (dragCounter <= 0) {
        setIsWindowDragging(false);
        dragCounter = 0;
      }
    };

    const handleDropOrEnd = () => {
      dragCounter = 0;
      setIsWindowDragging(false);
      setActiveDropIndex(null);
      setDraggedNodeIndex(null);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragend', handleDropOrEnd);
    window.addEventListener('drop', handleDropOrEnd);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragend', handleDropOrEnd);
      window.removeEventListener('drop', handleDropOrEnd);
    };
  }, []);

  const isDraggingAny = isDraggingExternal || draggedNodeIndex !== null || isWindowDragging;

  // Helper to get icon & label for node type
  const getNodeInfo = (type: NodeType) => {
    switch (type) {
      case 'title':
        return {
          icon: <Type className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Titel',
          badge: '24px',
        };
      case 'heading':
        return {
          icon: <HeadingIcon className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Überschrift',
          badge: '16px',
        };
      case 'paragraph':
        return {
          icon: <AlignLeft className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Textabschnitt',
          badge: '14px',
        };
      case 'graphic':
        return {
          icon: <ImageIcon className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Grafik',
          badge: 'Bild',
        };
      case 'bullet_list':
        return {
          icon: <ListIcon className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Aufzählung Listed',
          badge: 'Bullet',
        };
      case 'numbered_list':
        return {
          icon: <ListOrdered className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Aufzählung Nummeriert',
          badge: '1, 2, 3',
        };
      case 'two_col_left_graphic':
        return {
          icon: <ColumnsIcon className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Links Grafik / Rechts Text',
          badge: '2-Spalten',
        };
      case 'two_col_right_graphic':
        return {
          icon: <ColumnsIcon className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Rechts Grafik / Links Text',
          badge: '2-Spalten',
        };
      case 'button_cta':
        return {
          icon: <MousePointerClick className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Button / CTA',
          badge: 'Link',
        };
      case 'vehicle_card':
        return {
          icon: <Car className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Fahrzeugkarte',
          badge: 'Fahrzeug',
        };
      case 'url':
        return {
          icon: <LinkIcon className="w-3.5 h-3.5 text-[#2E3E6C]" />,
          label: 'URL / Link',
          badge: 'Bold Dunkelblau',
        };
      default:
        return {
          icon: <Layers className="w-3.5 h-3.5 text-zinc-900" />,
          label: 'Baustein',
          badge: 'Node',
        };
    }
  };

  // Node summary text for header preview
  const getNodeSummary = (node: NewsletterNode) => {
    switch (node.type) {
      case 'title':
      case 'heading':
      case 'paragraph':
        return node.text ? node.text.slice(0, 42) + (node.text.length > 42 ? '…' : '') : '(Leer)';
      case 'graphic':
        return node.altText || node.caption || 'Grafik';
      case 'bullet_list':
      case 'numbered_list':
        return `${node.items.length} Aufzählungspunkte`;
      case 'two_col_left_graphic':
      case 'two_col_right_graphic':
        return node.heading || '2 Inhalte nebeneinander';
      case 'button_cta':
        return `Button: "${node.label}"`;
      case 'vehicle_card':
        return `${node.brandModel || 'Fahrzeug'} • ${node.price || 'CHF'}`;
      case 'url':
        return `URL: ${node.label || node.url || '%Reset%'}`;
      default:
        return '';
    }
  };

  // Move operations
  const moveNode = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nodes.length) return;
    const updated = [...nodes];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onUpdateNodes(updated);
    onSelectNode(moved.id);
  };

  const handleReorderNode = (fromIndex: number, targetIndex: number) => {
    if (fromIndex === targetIndex || fromIndex < 0 || fromIndex >= nodes.length) return;
    const safeTarget = Math.max(0, Math.min(targetIndex, nodes.length - 1));
    const updated = [...nodes];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(safeTarget, 0, moved);
    onUpdateNodes(updated);
    onSelectNode(moved.id);
  };

  const duplicateNode = (index: number) => {
    const original = nodes[index];
    const cloned: NewsletterNode = JSON.parse(JSON.stringify(original));
    cloned.id = `node-${cloned.type}-${Date.now()}`;
    const updated = [...nodes];
    updated.splice(index + 1, 0, cloned);
    onUpdateNodes(updated);
    onSelectNode(cloned.id);
  };

  const deleteNode = (index: number) => {
    const deletedId = nodes[index].id;
    const updated = nodes.filter((_, i) => i !== index);
    onUpdateNodes(updated);
    if (selectedNodeId === deletedId) {
      onSelectNode(updated[Math.min(index, updated.length - 1)]?.id || null);
    }
  };

  // HTML5 Drag & Drop for reordering and incoming palette drops
  const handleDragStart = (e: React.DragEvent, index: number) => {
    draggedNodeIndexRef.current = index;
    setDraggedNodeIndex(index);
    e.dataTransfer.setData('text/plain', `overview:${index}`);
    e.dataTransfer.setData('reorder-node', String(index));
    e.dataTransfer.setData('application/json', JSON.stringify({ source: 'overview', index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, isCardDrop = false) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropIndex(null);
    setIsWindowDragging(false);

    try {
      // 1. Check if this is an internal reorder of an existing node
      let reorderFromIndex: number | null = null;
      if (draggedNodeIndexRef.current !== null) {
        reorderFromIndex = draggedNodeIndexRef.current;
      }

      if (reorderFromIndex === null) {
        const reorderStr = e.dataTransfer.getData('reorder-node');
        if (reorderStr !== '' && !isNaN(Number(reorderStr))) {
          reorderFromIndex = Number(reorderStr);
        }
      }

      if (reorderFromIndex === null) {
        const textData = e.dataTransfer.getData('text/plain')?.trim();
        if (textData && textData.startsWith('overview:')) {
          const idx = parseInt(textData.replace('overview:', ''), 10);
          if (!isNaN(idx)) reorderFromIndex = idx;
        }
      }

      if (reorderFromIndex === null) {
        const jsonStr = e.dataTransfer.getData('application/json');
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed?.source === 'overview' && typeof parsed.index === 'number') {
              reorderFromIndex = parsed.index;
            }
          } catch {}
        }
      }

      if (reorderFromIndex !== null) {
        const fromIndex = reorderFromIndex;
        draggedNodeIndexRef.current = null;
        setDraggedNodeIndex(null);

        if (isCardDrop) {
          handleReorderNode(fromIndex, targetIndex);
        } else {
          const destIndex = targetIndex > fromIndex ? targetIndex - 1 : targetIndex;
          handleReorderNode(fromIndex, destIndex);
        }
        return;
      }

      // 2. Incoming new brick from palette
      draggedNodeIndexRef.current = null;
      setDraggedNodeIndex(null);

      let paletteType: NodeType | null = null;
      const validTypes: NodeType[] = [
        'title',
        'heading',
        'paragraph',
        'graphic',
        'bullet_list',
        'numbered_list',
        'two_col_left_graphic',
        'two_col_right_graphic',
        'button_cta',
        'vehicle_card',
        'url',
      ];

      // Check text/plain
      const rawText = e.dataTransfer.getData('text/plain')?.trim();
      if (rawText && validTypes.includes(rawText as NodeType)) {
        paletteType = rawText as NodeType;
      }

      // Check custom brick-type
      if (!paletteType) {
        const brickType = e.dataTransfer.getData('brick-type')?.trim();
        if (brickType && validTypes.includes(brickType as NodeType)) {
          paletteType = brickType as NodeType;
        }
      }

      // Check application/json
      if (!paletteType) {
        const dataStr = e.dataTransfer.getData('application/json');
        if (dataStr) {
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed?.type && validTypes.includes(parsed.type)) {
              paletteType = parsed.type;
            }
          } catch {}
        }
      }

      // Fallback to passed draggedBrickType prop
      if (!paletteType && draggedBrickType && validTypes.includes(draggedBrickType)) {
        paletteType = draggedBrickType;
      }

      if (paletteType) {
        const newNode = createNewNode(paletteType);
        const updated = [...nodes];
        const safeIndex = Math.max(0, Math.min(targetIndex, updated.length));
        updated.splice(safeIndex, 0, newNode);
        onUpdateNodes(updated);
        onSelectNode(newNode.id);
        return;
      }
    } catch (err) {
      console.error('Drop error', err);
    } finally {
      draggedNodeIndexRef.current = null;
      setDraggedNodeIndex(null);
      setActiveDropIndex(null);
    }
  };

  const renderDropZone = (targetIndex: number) => {
    const isOver = activeDropIndex === targetIndex;
    const isAtEnd = targetIndex === nodes.length;

    // Bottom slot at the end of the list
    if (isAtEnd) {
      if (nodes.length === 0) {
        return (
          <div
            key={`drop-zone-${targetIndex}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = 'copy';
              if (activeDropIndex !== targetIndex) setActiveDropIndex(targetIndex);
            }}
            onDragLeave={(e) => {
              e.stopPropagation();
              if (activeDropIndex === targetIndex) setActiveDropIndex(null);
            }}
            onDrop={(e) => handleDrop(e, targetIndex)}
            className={`p-6 border-2 border-dashed rounded-lg text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
              isOver
                ? 'border-teal-600 bg-teal-100 text-teal-950 font-bold shadow-xs'
                : isDraggingAny
                ? 'border-teal-400 bg-teal-50 text-teal-900 animate-pulse'
                : 'border-zinc-300 bg-zinc-50 text-zinc-500 hover:border-zinc-400'
            }`}
          >
            <Plus className="w-5 h-5 text-teal-600" />
            <span className="text-xs font-semibold">
              {isOver
                ? 'Hier loslassen zum Platzieren'
                : 'Ersten Baustein hierher ziehen oder links anklicken'}
            </span>
          </div>
        );
      }

      // Bottom drop slot
      return (
        <div
          key={`drop-zone-${targetIndex}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            if (activeDropIndex !== targetIndex) setActiveDropIndex(targetIndex);
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            if (activeDropIndex === targetIndex) setActiveDropIndex(null);
          }}
          onDrop={(e) => handleDrop(e, targetIndex)}
          className={`transition-all duration-150 border-2 border-dashed rounded-lg text-center flex items-center justify-center cursor-pointer select-none ${
            isOver
              ? 'p-3.5 border-teal-600 bg-teal-100 text-teal-950 font-bold shadow-xs'
              : isDraggingAny
              ? 'p-3 border-teal-400 bg-teal-50 text-teal-900 font-semibold'
              : 'p-2.5 border-zinc-200 hover:border-zinc-300 text-zinc-400 bg-white hover:text-zinc-600'
          }`}
        >
          <span className="text-xs flex items-center justify-center gap-1.5 pointer-events-none">
            <Plus
              className={`w-3.5 h-3.5 ${
                isOver || isDraggingAny ? 'text-teal-700' : 'text-zinc-400'
              }`}
            />
            <span>
              {isOver
                ? 'Hier am Ende platzieren'
                : isDraggingAny
                ? '+ Baustein am Ende anfügen'
                : '+ Baustein am Ende anfügen'}
            </span>
          </span>
        </div>
      );
    }

    // Between nodes or at top:
    if (!isOver) {
      if (isDraggingAny) {
        return (
          <div
            key={`drop-gap-${targetIndex}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.dataTransfer.dropEffect = 'copy';
              if (activeDropIndex !== targetIndex) setActiveDropIndex(targetIndex);
            }}
            onDrop={(e) => handleDrop(e, targetIndex)}
            className="py-1.5 my-1 border-2 border-dashed border-teal-300/90 bg-teal-50/60 hover:bg-teal-100/80 hover:border-teal-600 rounded-lg flex items-center justify-center text-[11px] text-teal-800 font-medium transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3 text-teal-600 mr-1" />
            <span>Hier einfügen</span>
          </div>
        );
      }

      return (
        <div
          key={`drop-gap-${targetIndex}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            if (activeDropIndex !== targetIndex) setActiveDropIndex(targetIndex);
          }}
          className="h-2 -my-1 relative z-10"
        />
      );
    }

    // Active hover drop zone
    return (
      <div
        key={`drop-zone-${targetIndex}`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          if (activeDropIndex === targetIndex) {
            setActiveDropIndex(null);
          }
        }}
        onDrop={(e) => handleDrop(e, targetIndex)}
        className="p-3 my-1 border-2 border-dashed border-teal-600 bg-teal-100 text-teal-950 font-bold text-xs rounded-lg text-center flex items-center justify-center gap-1.5 shadow-xs transition-all duration-150 select-none animate-fadeIn"
      >
        <Plus className="w-3.5 h-3.5 text-teal-700 pointer-events-none" />
        <span className="pointer-events-none">Hier loslassen zum Platzieren</span>
      </div>
    );
  };

  return (
    <aside
      id="combined-overview-editor-pane"
      className="bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col h-full overflow-hidden"
    >
      {/* Panel Header */}
      <div className="p-3 border-b border-zinc-200 bg-zinc-50/70 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-700" />
            <span>Übersicht & Editor</span>
            <span className="text-[11px] font-normal text-zinc-500 normal-case">
              ({nodes.length} Bausteine)
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleSecurityNotice && (
            <button
              type="button"
              onClick={onToggleSecurityNotice}
              className={`px-2 py-1 text-[11px] rounded border transition-colors flex items-center gap-1 ${
                company?.showSecurityNotice !== false
                  ? 'bg-blue-900 text-white border-blue-900 font-semibold shadow-2xs'
                  : 'bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Vorsicht vor Betrügern: autolina würde Sie nie nach Ihrem Passwort oder persönlichen Daten fragen... (Ein-/Ausblenden)"
            >
              {company?.showSecurityNotice !== false ? (
                <ShieldCheck className="w-3 h-3 text-cyan-300" />
              ) : (
                <ShieldAlert className="w-3 h-3 text-zinc-400" />
              )}
              <span className="hidden sm:inline">Sicherheit</span>
              <span className="text-[10px] opacity-80">
                {company?.showSecurityNotice !== false ? 'AN' : 'AUS'}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSystemTagsDrawer(!showSystemTagsDrawer)}
            className={`px-2 py-1 text-[11px] rounded border transition-colors flex items-center gap-1 ${
              showSystemTagsDrawer
                ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
            title="Personalisierungs-Tags (%Anrede%, %Nachname%, %Reset%) anzeigen und einfügen"
          >
            <Tag className="w-3 h-3" />
            <span>Tags</span>
          </button>
          <button
            type="button"
            onClick={() => setShowMetaSettings(!showMetaSettings)}
            className={`px-2 py-1 text-[11px] rounded border transition-colors flex items-center gap-1 ${
              showMetaSettings
                ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
            title="E-Mail Betreffzeile und Vorschautext anpassen"
          >
            <Mail className="w-3 h-3" />
            <span>Betreff</span>
          </button>
        </div>
      </div>

      {/* System-Tags Drawer (%Anrede%, %Nachname%, %Reset%) */}
      {showSystemTagsDrawer && (
        <div className="p-2.5 bg-amber-50/80 border-b border-amber-200 space-y-1.5 text-xs shrink-0 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-950 font-semibold text-[11px]">
              <Tag className="w-3.5 h-3.5 text-amber-700" />
              <span>System-Tags</span>
            </div>
            {copiedTag && (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                Kopiert: {copiedTag}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {SYSTEM_TAGS_LIST.map((item) => {
              const lower = item.tag.toLowerCase();
              const isMail = lower.includes('mail');
              const isImage = lower.includes('bild');
              const isFahrzeug = lower.includes('fahrzeug') || ['%marke%', '%modell%', '%preis%', '%datum%', '%km%', '%ps%', '%schaltung%', '%energie%', '%antrieb%'].includes(lower);
              const isUrl = lower.includes('reset');
              const isFirma = lower.includes('firma');
              const isTermin = lower.includes('termin');

              let badgeStyle = "bg-white hover:bg-amber-100 border-amber-300 text-amber-950";
              if (isMail) badgeStyle = "bg-purple-50 hover:bg-purple-100 border-purple-300 text-purple-950 font-bold";
              else if (isImage) badgeStyle = "bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-950 font-bold";
              else if (isFirma) badgeStyle = "bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-950 font-bold";
              else if (isTermin) badgeStyle = "bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-950 font-bold";
              else if (lower === '%fahrzeugname%') badgeStyle = "bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-950 font-bold";
              else if (isFahrzeug) badgeStyle = "bg-teal-50/70 hover:bg-teal-100 border-teal-200 text-teal-900";
              else if (isUrl) badgeStyle = "bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-950";

              return (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => handleInsertTag(item.tag)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded border font-mono text-[11px] font-semibold transition-all shadow-2xs hover:shadow-xs active:scale-95 ${badgeStyle}`}
                  title={`${item.description} (Klicken zum Einfügen/Kopieren)`}
                >
                  <span>{item.tag}</span>
                  <span className="text-[10px] font-sans font-normal opacity-75 border-l border-current/20 pl-1">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Meta Drawer (Subject & Preheader) */}
      {showMetaSettings && (
        <div className="p-3 bg-zinc-50/90 border-b border-zinc-200 space-y-2 text-xs shrink-0">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              E-Mail Betreffzeile (Subject)
            </label>
            <input
              type="text"
              value={meta.subject}
              onChange={(e) => onUpdateMeta({ ...meta, subject: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Betreff eingeben..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              Preheader (Vorschautext im Posteingang)
            </label>
            <input
              type="text"
              value={meta.preheader}
              onChange={(e) => onUpdateMeta({ ...meta, preheader: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Vorschautext eingeben..."
            />
          </div>
        </div>
      )}

      {/* Sequence of Nodes (Scrollable list with inline accordion editor) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(e, nodes.length);
        }}
        onDragLeave={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX <= rect.left ||
            e.clientX >= rect.right ||
            e.clientY <= rect.top ||
            e.clientY >= rect.bottom
          ) {
            setActiveDropIndex(null);
          }
        }}
        className="flex-1 overflow-y-auto p-2 space-y-2"
      >
        {/* Drop zone at the top (before first node) */}
        {nodes.length > 0 && renderDropZone(0)}

        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const info = getNodeInfo(node.type);

          return (
            <React.Fragment key={node.id}>
              <div
                id={`overview-node-${node.id}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const isReorder = draggedNodeIndexRef.current !== null || draggedNodeIndex !== null;
                  e.dataTransfer.dropEffect = isReorder ? 'move' : 'copy';
                  if (activeDropIndex !== index) {
                    setActiveDropIndex(index);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const isReorder = draggedNodeIndexRef.current !== null || draggedNodeIndex !== null;
                  if (isReorder) {
                    handleDrop(e, index, true);
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const midY = rect.top + rect.height / 2;
                    const targetIdx = e.clientY < midY ? index : index + 1;
                    handleDrop(e, targetIdx, false);
                  }
                }}
                className={`rounded-lg border transition-all duration-150 overflow-hidden relative ${
                  isSelected
                    ? 'border-zinc-900 bg-white ring-1 ring-zinc-900/10 shadow-xs'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                } ${draggedNodeIndex === index ? 'opacity-40 scale-[0.99] border-dashed border-zinc-400' : ''} ${
                  activeDropIndex === index && draggedNodeIndex !== index
                    ? 'ring-2 ring-teal-500 ring-offset-1 bg-teal-50/20'
                    : ''
                }`}
              >
                {/* Card Header: Draggable, info, actions */}
                <div
                  draggable
                  onDragStart={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button, input, select, textarea, a')) {
                      e.preventDefault();
                      return;
                    }
                    handleDragStart(e, index);
                  }}
                  onDragEnd={() => {
                    draggedNodeIndexRef.current = null;
                    setDraggedNodeIndex(null);
                    setActiveDropIndex(null);
                  }}
                  onClick={() => onSelectNode(isSelected ? null : node.id)}
                  className={`px-2.5 py-2 flex items-center justify-between gap-1.5 cursor-grab active:cursor-grabbing select-none transition-colors ${
                    isSelected ? 'bg-zinc-50 border-b border-zinc-200' : 'hover:bg-zinc-50/60'
                  }`}
                  title="Klicken zum Bearbeiten • Ziehen zum Verschieben"
                >
                  {/* Drag Handle & Position */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(e, index);
                      }}
                      onDragEnd={() => {
                        draggedNodeIndexRef.current = null;
                        setDraggedNodeIndex(null);
                        setActiveDropIndex(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-grab active:cursor-grabbing p-1 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-200/60 transition-colors"
                      title="Ziehen zum Neuanordnen"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>

                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-zinc-200/80 text-zinc-800 shrink-0">
                    {index + 1}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    {info.icon}
                    <span className="text-xs font-semibold text-zinc-900">
                      {info.label}
                    </span>
                  </div>

                  {!isSelected && (
                    <span className="text-[11px] text-zinc-500 truncate ml-1">
                      {getNodeSummary(node)}
                    </span>
                  )}
                </div>

                {/* Right toolbar actions */}
                <div
                  className="flex items-center gap-0.5 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveNode(index, 'up');
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="Nach oben verschieben"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === nodes.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveNode(index, 'down');
                    }}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                    title="Nach unten verschieben"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateNode(index)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200"
                    title="Duplizieren"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNode(index)}
                    className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Löschen"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectNode(isSelected ? null : node.id)}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-800"
                  >
                    {isSelected ? (
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-900" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Inline Editor Body (Expanded when selected) */}
              {isSelected && (
                <div className="p-3 bg-white space-y-3 text-xs animate-fadeIn">
                  {/* 1. Title Node */}
                  {node.type === 'title' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-700">
                          Titeltext
                        </label>
                        <div className="flex items-center gap-0.5 border border-zinc-200 rounded p-0.5">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => onUpdateNode({ ...node, align })}
                              className={`p-1 rounded text-xs ${
                                (node.align || 'left') === align
                                  ? 'bg-zinc-900 text-white'
                                  : 'text-zinc-600 hover:bg-zinc-100'
                              }`}
                              title={`Ausrichtung: ${align}`}
                            >
                              {align === 'left' && <AlignLeft className="w-3 h-3" />}
                              {align === 'center' && <AlignCenter className="w-3 h-3" />}
                              {align === 'right' && <AlignRight className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={node.text}
                        onChange={(e) => onUpdateNode({ ...node, text: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none font-semibold text-zinc-900"
                        placeholder="Titel eingeben..."
                      />
                    </div>
                  )}

                  {/* 2. Heading Node */}
                  {node.type === 'heading' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-700">
                          Überschrift
                        </label>
                        <div className="flex items-center gap-0.5 border border-zinc-200 rounded p-0.5">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => onUpdateNode({ ...node, align })}
                              className={`p-1 rounded text-xs ${
                                (node.align || 'left') === align
                                  ? 'bg-zinc-900 text-white'
                                  : 'text-zinc-600 hover:bg-zinc-100'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-3 h-3" />}
                              {align === 'center' && <AlignCenter className="w-3 h-3" />}
                              {align === 'right' && <AlignRight className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Tag Insertion Chips */}
                      <div className="flex items-center gap-1 text-[10px] flex-wrap">
                        <span className="text-zinc-400">System-Tags:</span>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Anrede%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Anrede% einfügen"
                        >
                          + %Anrede%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Nachname%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Nachname% einfügen"
                        >
                          + %Nachname%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Mail%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Mail% einfügen"
                        >
                          + %Mail%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Firma%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Firma% einfügen"
                        >
                          + %Firma%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%FirmaOrt%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%FirmaOrt% einfügen"
                        >
                          + %FirmaOrt%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%TerminDate%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%TerminDate% einfügen"
                        >
                          + %TerminDate%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%TerminTime%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%TerminTime% einfügen"
                        >
                          + %TerminTime%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Fahrzeugname%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Fahrzeugname% einfügen"
                        >
                          + %Fahrzeugname%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Anrede% %Nachname%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-mono text-[10px] transition-colors"
                          title="%Anrede% %Nachname% einfügen"
                        >
                          + %Anrede% %Nachname%
                        </button>
                      </div>

                      <input
                        type="text"
                        value={node.text}
                        onChange={(e) => onUpdateNode({ ...node, text: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none font-semibold text-zinc-900"
                        placeholder="Überschrift eingeben (z.B. Guten Tag %Anrede% %Nachname%)..."
                      />
                    </div>
                  )}

                  {/* 3. Paragraph Node */}
                  {node.type === 'paragraph' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-700">
                          Textabschnitt
                        </label>
                        <span className="text-[10px] text-zinc-400">
                          {node.text.length} Zeichen
                        </span>
                      </div>

                      {/* Quick Tag Insertion Chips */}
                      <div className="flex items-center gap-1 text-[10px] flex-wrap">
                        <span className="text-zinc-400">System-Tags:</span>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Anrede%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Anrede% einfügen"
                        >
                          + %Anrede%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Nachname%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Nachname% einfügen"
                        >
                          + %Nachname%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Mail%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Mail% einfügen"
                        >
                          + %Mail%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Firma%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Firma% einfügen"
                        >
                          + %Firma%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%FirmaOrt%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-950 border border-orange-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%FirmaOrt% einfügen"
                        >
                          + %FirmaOrt%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%TerminDate%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%TerminDate% einfügen"
                        >
                          + %TerminDate%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%TerminTime%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%TerminTime% einfügen"
                        >
                          + %TerminTime%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInsertTag('%Fahrzeugname%', node.id)}
                          className="px-1.5 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Fahrzeugname% einfügen"
                        >
                          + %Fahrzeugname%
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={node.text}
                        onChange={(e) => onUpdateNode({ ...node, text: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs leading-relaxed focus:ring-1 focus:ring-zinc-900 focus:outline-none resize-y"
                        placeholder="Inhalt des Textabschnitts..."
                      />
                    </div>
                  )}

                  {/* 4. Graphic Node */}
                  {node.type === 'graphic' && (
                    <div className="space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-zinc-700">
                            Bild-URL oder System-Tag
                          </label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onUpdateNode({ ...node, imageUrl: '%Fahrzeugbild%' })}
                              className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-mono text-[10px] font-semibold transition-colors"
                              title="%Fahrzeugbild% einsetzen"
                            >
                              + %Fahrzeugbild%
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateNode({ ...node, imageUrl: '%Bild%' })}
                              className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-mono text-[10px] font-semibold transition-colors"
                              title="%Bild% einsetzen"
                            >
                              + %Bild%
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={node.imageUrl}
                          onChange={(e) => onUpdateNode({ ...node, imageUrl: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none font-mono"
                          placeholder="https://... oder %Bild% / %Fahrzeugbild%"
                        />
                      </div>

                      {/* 4:3 Platzhalter-Box Vorschau */}
                      {isPlaceholderGraphic(node.imageUrl) ? (
                        <div className="p-2.5 bg-zinc-50 rounded-lg border border-dashed border-zinc-300 text-center">
                          <div
                            className="w-full aspect-[4/3] max-w-[200px] mx-auto rounded-lg bg-[#F4F4F6] border border-dashed border-zinc-300 flex flex-col items-center justify-center p-3 select-none"
                            style={{ aspectRatio: '4/3' }}
                          >
                            <span className="font-mono text-xs font-bold text-zinc-700">
                              {formatPlaceholderTag(node.imageUrl, 'Bild')}
                            </span>
                            <span className="text-[10px] text-zinc-400 mt-0.5">
                              4:3 Platzhalter
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1.5">
                            Leere Box mit <span className="font-mono font-bold text-zinc-700">{formatPlaceholderTag(node.imageUrl, 'Bild')}</span> im 4:3-Format (ohne Bild).
                          </p>
                        </div>
                      ) : null}

                      {/* Quick Sample Image Picker */}
                      <div>
                        <span className="block text-[10px] text-zinc-500 mb-1">
                          Schnellauswahl Beispielbilder:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {sampleImages.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => onUpdateNode({ ...node, imageUrl: img.url })}
                              className="text-[10px] text-left px-2 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded truncate"
                            >
                              {img.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Alt-Text
                          </label>
                          <input
                            type="text"
                            value={node.altText || ''}
                            onChange={(e) => onUpdateNode({ ...node, altText: e.target.value })}
                            className="w-full px-2.5 py-1 border border-zinc-200 rounded-lg text-xs"
                            placeholder="Beschreibung für Screenreader..."
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Bildunterschrift
                          </label>
                          <input
                            type="text"
                            value={node.caption || ''}
                            onChange={(e) => onUpdateNode({ ...node, caption: e.target.value })}
                            className="w-full px-2.5 py-1 border border-zinc-200 rounded-lg text-xs"
                            placeholder="Optionale Legende..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Bullet List */}
                  {node.type === 'bullet_list' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-700">
                          Aufzählungspunkte (Listenpunkte)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...node.items, 'Neuer Aufzählungspunkt'];
                            onUpdateNode({ ...node, items: newItems });
                          }}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-zinc-900 text-white flex items-center gap-1 hover:bg-black"
                        >
                          <Plus className="w-2.5 h-2.5" /> Punkt hinzufügen
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {node.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800 shrink-0 ml-1"></span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...node.items];
                                newItems[itemIdx] = e.target.value;
                                onUpdateNode({ ...node, items: newItems });
                              }}
                              className="flex-1 px-2 py-1 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              disabled={node.items.length <= 1}
                              onClick={() => {
                                const newItems = node.items.filter((_, i) => i !== itemIdx);
                                onUpdateNode({ ...node, items: newItems });
                              }}
                              className="p-1 text-zinc-400 hover:text-rose-600 disabled:opacity-20"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Numbered List */}
                  {node.type === 'numbered_list' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-700">
                          Nummerierte Schritte
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...node.items, 'Nächster nummerierter Schritt'];
                            onUpdateNode({ ...node, items: newItems });
                          }}
                          className="px-2 py-0.5 text-[10px] font-semibold rounded bg-zinc-900 text-white flex items-center gap-1 hover:bg-black"
                        >
                          <Plus className="w-2.5 h-2.5" /> Schritt hinzufügen
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        {node.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-1.5">
                            <span className="w-5 text-[11px] font-bold text-zinc-700 text-right shrink-0">
                              {itemIdx + 1}.
                            </span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...node.items];
                                newItems[itemIdx] = e.target.value;
                                onUpdateNode({ ...node, items: newItems });
                              }}
                              className="flex-1 px-2 py-1 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            />
                            <button
                              type="button"
                              disabled={node.items.length <= 1}
                              onClick={() => {
                                const newItems = node.items.filter((_, i) => i !== itemIdx);
                                onUpdateNode({ ...node, items: newItems });
                              }}
                              className="p-1 text-zinc-400 hover:text-rose-600 disabled:opacity-20"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7 & 8. Two Column Left / Right Graphics */}
                  {(node.type === 'two_col_left_graphic' ||
                    node.type === 'two_col_right_graphic') && (
                    <div className="space-y-2.5">
                      <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200 text-[11px] text-zinc-600 font-medium">
                        Layout:{' '}
                        {node.type === 'two_col_left_graphic'
                          ? 'Links Grafik • Rechts Überschrift & Text'
                          : 'Links Überschrift & Text • Rechts Grafik'}
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Überschrift
                        </label>
                        <input
                          type="text"
                          value={node.heading}
                          onChange={(e) => onUpdateNode({ ...node, heading: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Textabschnitt
                        </label>
                        <textarea
                          rows={3}
                          value={node.paragraph}
                          onChange={(e) => onUpdateNode({ ...node, paragraph: e.target.value })}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs leading-relaxed focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-zinc-700">
                            Grafik URL oder System-Tag
                          </label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onUpdateNode({ ...node, imageUrl: '%Fahrzeugbild%' })}
                              className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-mono text-[10px] font-semibold transition-colors"
                              title="%Fahrzeugbild% einsetzen"
                            >
                              + %Fahrzeugbild%
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateNode({ ...node, imageUrl: '%Bild%' })}
                              className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 font-mono text-[10px] font-semibold transition-colors"
                              title="%Bild% einsetzen"
                            >
                              + %Bild%
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={node.imageUrl}
                          onChange={(e) => onUpdateNode({ ...node, imageUrl: e.target.value })}
                          className="w-full px-2.5 py-1 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                          placeholder="https://... oder %Fahrzeugbild% / %Bild%"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Button-Text (optional)
                          </label>
                          <input
                            type="text"
                            value={node.buttonText || ''}
                            onChange={(e) => onUpdateNode({ ...node, buttonText: e.target.value })}
                            className="w-full px-2.5 py-1 border border-zinc-200 rounded-lg text-xs"
                            placeholder="z.B. Mehr erfahren"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Button-Link URL
                          </label>
                          <input
                            type="url"
                            value={node.buttonUrl || ''}
                            onChange={(e) => onUpdateNode({ ...node, buttonUrl: e.target.value })}
                            className="w-full px-2.5 py-1 border border-zinc-200 rounded-lg text-xs"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 9. Button CTA */}
                  {node.type === 'button_cta' && (
                    <div className="space-y-2">
                      {/* Quick Tag Insertion Chips */}
                      <div className="flex items-center gap-1 text-[10px] flex-wrap">
                        <span className="text-zinc-400">System-Tags:</span>
                        <button
                          type="button"
                          onClick={() => onUpdateNode({ ...node, url: '%Reset%' })}
                          className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#1B3C71] border border-blue-200 font-mono text-[10px] font-semibold transition-colors"
                          title="Ziel-URL auf %Reset% setzen"
                        >
                          + %Reset%
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateNode({ ...node, url: 'mailto:%Mail%' })}
                          className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 font-mono text-[10px] font-semibold transition-colors"
                          title="Ziel-URL auf mailto:%Mail% setzen"
                        >
                          + %Mail%
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Button-Beschriftung
                          </label>
                          <input
                            type="text"
                            value={node.label}
                            onChange={(e) => onUpdateNode({ ...node, label: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Ziel-URL
                          </label>
                          <input
                            type="text"
                            value={node.url}
                            onChange={(e) => onUpdateNode({ ...node, url: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="https://... oder %Reset% / mailto:%Mail%"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-zinc-500">Ausrichtung:</span>
                        <div className="flex items-center gap-1 border border-zinc-200 rounded p-0.5">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => onUpdateNode({ ...node, align })}
                              className={`p-1 rounded text-xs ${
                                (node.align || 'center') === align
                                  ? 'bg-zinc-900 text-white'
                                  : 'text-zinc-600 hover:bg-zinc-100'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-3 h-3" />}
                              {align === 'center' && <AlignCenter className="w-3 h-3" />}
                              {align === 'right' && <AlignRight className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 10. Fahrzeugkarte (autolina Style Guide mit System-Tags & 6 Spezifikationen) */}
                  {node.type === 'vehicle_card' && (
                    <div className="space-y-3.5">
                      {/* Schnell-Aktionen für Vorlagen (Probefahrt & Inserat ist online) */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-zinc-800 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-teal-600" />
                            System-Tags für Vorlagen
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            z.B. Probefahrt, Inserat online
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateNode({
                                ...node,
                                imageUrl: '%Fahrzeugbild%',
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
                            title="Alle Felder auf CRM/Marketing-System-Tags (%Marke%, %Modell%, %Preis%, %Datum%, %KM%, ...) setzen"
                          >
                            <Sparkles className="w-3 h-3" />
                            Alle System-Tags einsetzen
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateNode({
                                ...node,
                                imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
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
                            className="px-2 py-1 text-[11px] font-medium bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded shadow-2xs flex items-center gap-1 transition-colors"
                            title="Beispiel-Daten gemäss Style Guide laden"
                          >
                            <RotateCcw className="w-3 h-3 text-zinc-500" />
                            Beispiel-Daten
                          </button>
                        </div>
                      </div>

                      {/* Marke & Modell */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-semibold text-zinc-700">
                              Marke
                            </label>
                            <button
                              type="button"
                              onClick={() => onUpdateNode({ ...node, brand: '%Marke%' })}
                              className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                              title="%Marke% einsetzen"
                            >
                              + %Marke%
                            </button>
                          </div>
                          <input
                            type="text"
                            value={node.brand || ''}
                            onChange={(e) => onUpdateNode({ ...node, brand: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="z.B. Mercedes-Benz oder %Marke%"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-semibold text-zinc-700">
                              Modell (H3: 18px Semi Bold)
                            </label>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, brandModel: '%Fahrzeugname%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%Fahrzeugname% einsetzen"
                              >
                                + %Fahrzeugname%
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, brandModel: '%Modell%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%Modell% einsetzen"
                              >
                                + %Modell%
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={node.brandModel}
                            onChange={(e) => onUpdateNode({ ...node, brandModel: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="z.B. AMG GT 63 S oder %Modell% / %Fahrzeugname%"
                          />
                        </div>
                      </div>

                      {/* Preis & Bild-URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-semibold text-zinc-700">
                              Preis (Schweizer Format)
                            </label>
                            <button
                              type="button"
                              onClick={() => onUpdateNode({ ...node, price: '%Preis%' })}
                              className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                              title="%Preis% einsetzen"
                            >
                              + %Preis%
                            </button>
                          </div>
                          <input
                            type="text"
                            value={node.price}
                            onChange={(e) => onUpdateNode({ ...node, price: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="CHF 72'500 oder %Preis%"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-semibold text-zinc-700">
                              Fahrzeug-Bild (URL oder System-Tag)
                            </label>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, imageUrl: '%Fahrzeugbild%' })}
                                className="text-[10px] text-indigo-700 font-mono font-semibold hover:underline bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200"
                                title="%Fahrzeugbild% einsetzen"
                              >
                                + %Fahrzeugbild%
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, imageUrl: '%Bild%' })}
                                className="text-[10px] text-indigo-700 font-mono font-semibold hover:underline bg-indigo-50 px-1 py-0.5 rounded border border-indigo-200"
                                title="%Bild% einsetzen"
                              >
                                + %Bild%
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={node.imageUrl}
                            onChange={(e) => onUpdateNode({ ...node, imageUrl: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="https://... oder %Fahrzeugbild% / %Bild%"
                          />
                        </div>
                      </div>

                      {/* Gliederung der Infos: 6 Spezifikationen gemäss Vorgabe */}
                      <div className="pt-2 border-t border-zinc-100">
                        <label className="block text-[11px] font-semibold text-zinc-800 mb-2">
                          Fahrzeug-Spezifikationen (Gliederung: Datum, KM, PS, Schaltung, Energie, Antrieb)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* 1. Datum */}
                          <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                Datum / 1. Inverkehrssetzung
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, date: '%Datum%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%Datum% einsetzen"
                              >
                                + %Datum%
                              </button>
                            </div>
                            <input
                              type="text"
                              value={node.date || ''}
                              onChange={(e) => onUpdateNode({ ...node, date: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                              placeholder="06.2024 oder %Datum%"
                            />
                          </div>

                          {/* 2. KM */}
                          <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                                <Gauge className="w-3 h-3 text-zinc-500" />
                                KM / Kilometerstand
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, mileage: '%KM%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%KM% einsetzen"
                              >
                                + %KM%
                              </button>
                            </div>
                            <input
                              type="text"
                              value={node.mileage || ''}
                              onChange={(e) => onUpdateNode({ ...node, mileage: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                              placeholder="256'984 km oder %KM%"
                            />
                          </div>

                          {/* 3. PS */}
                          <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                                <Zap className="w-3 h-3 text-zinc-500" />
                                PS / Leistung
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, power: '%PS%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%PS% einsetzen"
                              >
                                + %PS%
                              </button>
                            </div>
                            <input
                              type="text"
                              value={node.power || ''}
                              onChange={(e) => onUpdateNode({ ...node, power: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                              placeholder="1296 PS oder %PS%"
                            />
                          </div>

                          {/* 4. Schaltung */}
                          <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                                <Sliders className="w-3 h-3 text-zinc-500" />
                                Schaltung / Getriebe
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, transmission: '%Schaltung%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%Schaltung% einsetzen"
                              >
                                + %Schaltung%
                              </button>
                            </div>
                            <input
                              type="text"
                              value={node.transmission || ''}
                              onChange={(e) => onUpdateNode({ ...node, transmission: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                              placeholder="Handschaltung oder %Schaltung%"
                            />
                          </div>

                          {/* 5. Energie */}
                          <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                                <Fuel className="w-3 h-3 text-zinc-500" />
                                Energie / Treibstoff
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, fuelType: '%Energie%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%Energie% einsetzen"
                              >
                                + %Energie%
                              </button>
                            </div>
                            <input
                              type="text"
                              value={node.fuelType || ''}
                              onChange={(e) => onUpdateNode({ ...node, fuelType: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                              placeholder="Plug-in-Hybrid oder %Energie%"
                            />
                          </div>

                          {/* 6. Antrieb */}
                          <div className="bg-slate-50/60 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
                                <Car className="w-3 h-3 text-zinc-500" />
                                Antrieb / Antriebsart
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateNode({ ...node, driveTrain: '%Antrieb%' })}
                                className="text-[10px] text-teal-700 font-mono font-semibold hover:underline bg-teal-50 px-1 py-0.5 rounded border border-teal-200"
                                title="%Antrieb% einsetzen"
                              >
                                + %Antrieb%
                              </button>
                            </div>
                            <input
                              type="text"
                              value={node.driveTrain || ''}
                              onChange={(e) => onUpdateNode({ ...node, driveTrain: e.target.value })}
                              className="w-full px-2 py-1 bg-white border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                              placeholder="Vorderradantrieb oder %Antrieb%"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 11. URL Node (Bold & autolina Dunkelblau #2E3E6C) */}
                  {node.type === 'url' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5 text-[#2E3E6C]" />
                          <span>URL / Textlink (Bold & autolina Dunkelblau)</span>
                        </label>
                        <div className="flex items-center gap-0.5 border border-zinc-200 rounded p-0.5">
                          {(['left', 'center', 'right'] as const).map((align) => (
                            <button
                              key={align}
                              type="button"
                              onClick={() => onUpdateNode({ ...node, align })}
                              className={`p-1 rounded text-xs ${
                                (node.align || 'left') === align
                                  ? 'bg-zinc-900 text-white'
                                  : 'text-zinc-600 hover:bg-zinc-100'
                              }`}
                              title={`Ausrichtung: ${align}`}
                            >
                              {align === 'left' && <AlignLeft className="w-3 h-3" />}
                              {align === 'center' && <AlignCenter className="w-3 h-3" />}
                              {align === 'right' && <AlignRight className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Tag Button für %Reset% und %Mail% */}
                      <div className="flex items-center gap-1 text-[10px] flex-wrap">
                        <span className="text-zinc-400">System-Tags:</span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateNode({
                              ...node,
                              url: '%Reset%',
                              label: node.label ? `${node.label} %Reset%` : '%Reset%',
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-[#1B3C71] border border-blue-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Reset% Tag einfügen"
                        >
                          + %Reset% (Reset-URL)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateNode({
                              ...node,
                              url: 'mailto:%Mail%',
                              label: node.label ? `${node.label} %Mail%` : '%Mail%',
                            })
                          }
                          className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-200 font-mono text-[10px] font-semibold transition-colors"
                          title="%Mail% E-Mail Link einfügen"
                        >
                          + %Mail% (E-Mail)
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Link-Beschriftung (Text)
                          </label>
                          <input
                            type="text"
                            value={node.label !== undefined ? node.label : node.url}
                            onChange={(e) => onUpdateNode({ ...node, label: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-bold text-[#2E3E6C] focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="z.B. %Reset% oder Link-Text"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Ziel-URL
                          </label>
                          <input
                            type="text"
                            value={node.url || ''}
                            onChange={(e) => onUpdateNode({ ...node, url: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-zinc-900 focus:outline-none"
                            placeholder="z.B. %Reset% oder https://..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drop zone between nodes (index + 1) */}
            {index < nodes.length - 1 && renderDropZone(index + 1)}
          </React.Fragment>
        );
      })}

      {/* Drop target at bottom */}
      {renderDropZone(nodes.length)}
    </div>
    </aside>
  );
};
