import React, { useState } from 'react';
import {
  Eye,
  Sliders,
  Code2,
  Copy,
  Check,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  SplitSquareVertical,
  Mail,
  Maximize2,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import { NewsletterLivePreview } from './NewsletterLivePreview';
import { SelectedBrickEditor } from './SelectedBrickEditor';
import { generateEmailHtml } from '../utils/htmlGenerator';

interface RightPaneProps {
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  company: CompanySettings;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onUpdateNode: (updatedNode: NewsletterNode) => void;
  onUpdateMeta: (meta: NewsletterMeta) => void;
  onOpenSendModal: () => void;
  onCopyHtml: () => void;
  copied: boolean;
}

type RightTab = 'split' | 'preview' | 'editor' | 'code';

export const RightPane: React.FC<RightPaneProps> = ({
  nodes,
  meta,
  company,
  selectedNodeId,
  onSelectNode,
  onUpdateNode,
  onUpdateMeta,
  onOpenSendModal,
  onCopyHtml,
  copied,
}) => {
  const [activeTab, setActiveTab] = useState<RightTab>('split');
  const [showMetaSettings, setShowMetaSettings] = useState<boolean>(false);

  const selectedIndex = nodes.findIndex((n) => n.id === selectedNodeId);
  const selectedNode = selectedIndex !== -1 ? nodes[selectedIndex] : nodes[0] || null;

  const handlePrevNode = () => {
    if (selectedIndex > 0) {
      onSelectNode(nodes[selectedIndex - 1].id);
    }
  };

  const handleNextNode = () => {
    if (selectedIndex < nodes.length - 1) {
      onSelectNode(nodes[selectedIndex + 1].id);
    }
  };

  const fullHtml = generateEmailHtml(nodes, meta, company);

  return (
    <section
      id="right-preview-editor-pane"
      className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full"
    >
      {/* Top Controls Header */}
      <div className="px-4 py-2.5 border-b border-zinc-100 bg-zinc-50/70 flex flex-wrap items-center justify-between gap-2">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-white border border-zinc-200 p-0.5 rounded-lg shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'split'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Geteilte Ansicht: Editor & Vorschau gleichzeitig"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Editor & Vorschau</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Nur Newsletter-Vorschau anzeigen"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Nur Vorschau</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'editor'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Nur Editor für ausgewählten Baustein anzeigen"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Nur Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
              activeTab === 'code'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Reines E-Mail HTML anzeigen"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>HTML Code</span>
          </button>
        </div>

        {/* Right side buttons: Meta Toggle & Send Modal */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowMetaSettings(!showMetaSettings)}
            className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
              showMetaSettings
                ? 'bg-zinc-900 text-white border-zinc-900 font-semibold'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
            }`}
            title="Betreffzeile & Preheader anpassen"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Betreff & Meta</span>
          </button>

          <button
            type="button"
            onClick={onOpenSendModal}
            className="px-3 py-1 bg-zinc-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Vorschau vor Versand & Testsendung"
          >
            <Send className="w-3 h-3" />
            <span>Versandprüfung</span>
          </button>
        </div>
      </div>

      {/* Optional Drawer for E-Mail Meta (Betreff, Preheader) */}
      {showMetaSettings && (
        <div className="p-3 bg-zinc-50 border-b border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              E-Mail Betreffzeile (Subject)
            </label>
            <input
              type="text"
              value={meta.subject}
              onChange={(e) => onUpdateMeta({ ...meta, subject: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Betreffzeile eingeben..."
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
              className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Vorschautext für E-Mail Clients..."
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* MODE: Split (Editor on top or side + Preview) */}
        {activeTab === 'split' && (
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
            {/* Editor Half */}
            <div className="lg:w-2/5 p-4 overflow-y-auto bg-zinc-50/30 flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-zinc-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Editor
                  </span>
                  {selectedNode && (
                    <span className="text-[11px] text-zinc-500 font-medium">
                      ({selectedIndex + 1}/{nodes.length})
                    </span>
                  )}
                </div>

                {/* Node Navigator */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={selectedIndex <= 0}
                    onClick={handlePrevNode}
                    className="p-1 rounded text-zinc-500 hover:text-black hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
                    title="Vorheriger Baustein"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={selectedIndex >= nodes.length - 1}
                    onClick={handleNextNode}
                    className="p-1 rounded text-zinc-500 hover:text-black hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none"
                    title="Nächster Baustein"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <SelectedBrickEditor
                  node={selectedNode}
                  meta={meta}
                  primaryColor={company.primaryColor}
                  onUpdateNode={onUpdateNode}
                  onUpdateMeta={onUpdateMeta}
                />
              </div>
            </div>

            {/* Live Preview Half */}
            <div className="lg:w-3/5 overflow-y-auto p-4 bg-zinc-100/40">
              <NewsletterLivePreview
                nodes={nodes}
                meta={meta}
                company={company}
                onOpenSendModal={onOpenSendModal}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
              />
            </div>
          </div>
        )}

        {/* MODE: Nur Vorschau */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-100/40">
            <NewsletterLivePreview
              nodes={nodes}
              meta={meta}
              company={company}
              onOpenSendModal={onOpenSendModal}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
            />
          </div>
        )}

        {/* MODE: Nur Editor */}
        {activeTab === 'editor' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-200">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Baustein bearbeiten: {selectedNode?.type}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Position {selectedIndex + 1} von {nodes.length} in der Übersicht
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedIndex <= 0}
                  onClick={handlePrevNode}
                  className="px-2 py-1 text-xs rounded border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-30 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" /> Vorheriger
                </button>
                <button
                  type="button"
                  disabled={selectedIndex >= nodes.length - 1}
                  onClick={handleNextNode}
                  className="px-2 py-1 text-xs rounded border border-zinc-200 bg-white hover:bg-zinc-50 disabled:opacity-30 flex items-center gap-1"
                >
                  Nächster <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <SelectedBrickEditor
              node={selectedNode}
              meta={meta}
              primaryColor={company.primaryColor}
              onUpdateNode={onUpdateNode}
              onUpdateMeta={onUpdateMeta}
            />
          </div>
        )}

        {/* MODE: HTML Code */}
        {activeTab === 'code' && (
          <div className="flex-1 overflow-hidden flex flex-col p-4 bg-zinc-950 text-zinc-100 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800">
              <span className="text-zinc-400 text-[11px]">
                Standardisiertes HTML (Poppins / Arial, Tabellen-Layout, 600px Card)
              </span>
              <button
                type="button"
                onClick={onCopyHtml}
                className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Kopiert!' : 'Code kopieren'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={fullHtml}
              className="flex-1 w-full bg-transparent text-zinc-300 font-mono text-[11px] leading-relaxed p-2 resize-none focus:outline-none overflow-y-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
};
