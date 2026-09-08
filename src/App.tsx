import React, { useState, useEffect } from 'react';
import {
  defaultCompanySettings,
  defaultNewsletterMeta,
  defaultNodes,
  sampleTemplates,
} from './data/defaultNewsletter';
import { CompanySettings, NewsletterMeta, NewsletterNode, NodeType } from './types';
import { BricksPalette } from './components/BricksPalette';
import { CombinedOverviewEditor } from './components/CombinedOverviewEditor';
import { NewsletterLivePreview } from './components/NewsletterLivePreview';
import { generateEmailHtml } from './utils/htmlGenerator';
import { createNewNode } from './utils/nodeFactory';
import {
  Layers,
  Sliders,
  Eye,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  const [nodes, setNodes] = useState<NewsletterNode[]>(() => {
    const saved = localStorage.getItem('company_newsletter_nodes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved nodes', e);
      }
    }
    return defaultNodes;
  });

  const [meta, setMeta] = useState<NewsletterMeta>(() => {
    const saved = localStorage.getItem('company_newsletter_meta');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved meta', e);
      }
    }
    return defaultNewsletterMeta;
  });

  const [company, setCompany] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('company_newsletter_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.backgroundColor = '#E4E4E4';
        parsed.cardBackgroundColor = '#FFFFFF';
        parsed.primaryColor = '#1B4B97';
        parsed.cardBorderRadius = 12;
        parsed.logoUrl = 'https://www.autolina.ch/media/logo.64af33af2b4aa46a.svg';
        parsed.websiteUrl = 'https://www.autolina.ch';
        parsed.supportEmail = 'service@autolina.ch';
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved company settings', e);
      }
    }
    return defaultCompanySettings;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => {
    return nodes[0]?.id || null;
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDraggingBrick, setIsDraggingBrick] = useState<boolean>(false);

  // Responsive mobile tab view
  const [mobileTab, setMobileTab] = useState<'bricks' | 'editor' | 'preview'>('editor');

  // Persistence
  useEffect(() => {
    localStorage.setItem('company_newsletter_nodes', JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem('company_newsletter_meta', JSON.stringify(meta));
  }, [meta]);

  useEffect(() => {
    localStorage.setItem('company_newsletter_settings', JSON.stringify(company));
  }, [company]);

  // Keep selected node valid
  useEffect(() => {
    if (nodes.length > 0) {
      if (!selectedNodeId || !nodes.some((n) => n.id === selectedNodeId)) {
        setSelectedNodeId(nodes[0].id);
      }
    } else {
      setSelectedNodeId(null);
    }
  }, [nodes, selectedNodeId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyHtml = async () => {
    const html = generateEmailHtml(nodes, meta, company);
    await navigator.clipboard.writeText(html);
    setCopied(true);
    showToast('HTML-Code in Zwischenablage kopiert');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddBrick = (type: NodeType) => {
    const newNode = createNewNode(type);
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    showToast(`Baustein "${type}" hinzugefügt`);
  };

  const handleUpdateNode = (updatedNode: NewsletterNode) => {
    setNodes((prev) => prev.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const handleSelectTemplate = (templateId: string) => {
    const found = sampleTemplates.find((t) => t.id === templateId);
    if (found) {
      const clonedNodes = JSON.parse(JSON.stringify(found.nodes));
      setNodes(clonedNodes);
      setMeta(JSON.parse(JSON.stringify(found.meta)));
      if (clonedNodes.length > 0) {
        setSelectedNodeId(clonedNodes[0].id);
      }
      showToast(`Vorlage "${found.name}" geladen`);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Möchten Sie den Newsletter auf das Standardformat zurücksetzen?')) {
      const clonedNodes = JSON.parse(JSON.stringify(defaultNodes));
      setNodes(clonedNodes);
      setMeta(JSON.parse(JSON.stringify(defaultNewsletterMeta)));
      setCompany(JSON.parse(JSON.stringify(defaultCompanySettings)));
      if (clonedNodes.length > 0) {
        setSelectedNodeId(clonedNodes[0].id);
      }
      showToast('Standardformat wiederhergestellt');
    }
  };

  return (
    <div
      id="newsletter-app-root"
      className="h-screen w-full bg-zinc-100 flex flex-col font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white overflow-hidden"
    >
      {/* Mobile/Tablet Workspace Tab Switcher */}
      <div className="lg:hidden bg-white border-b border-zinc-200 px-3 py-1.5 flex items-center justify-between gap-1 shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab('bricks')}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
            mobileTab === 'bricks'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Bausteine</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
            mobileTab === 'editor'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Übersicht & Editor ({nodes.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
            mobileTab === 'preview'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Vorschau</span>
        </button>
      </div>

      {/* Main Studio Workspace: Full Screen Height with integrated preview topbar */}
      <main className="flex-1 w-full p-2 sm:p-2.5 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-2.5 h-full items-stretch w-full">
          {/* Column 1: Bausteine (Fixe Breite: 256px) */}
          <div
            className={`w-full lg:w-64 shrink-0 h-[500px] lg:h-full ${
              mobileTab === 'bricks' ? 'block' : 'hidden lg:block'
            }`}
          >
            <BricksPalette
              onAddBrick={handleAddBrick}
              onDragStateChange={(dragging) => setIsDraggingBrick(dragging)}
            />
          </div>

          {/* Column 2: Übersicht & Editor kombiniert (Fixe Breite: 440px) */}
          <div
            className={`w-full lg:w-[440px] shrink-0 h-[650px] lg:h-full ${
              mobileTab === 'editor' ? 'block' : 'hidden lg:block'
            }`}
          >
            <CombinedOverviewEditor
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onUpdateNode={handleUpdateNode}
              onUpdateNodes={setNodes}
              meta={meta}
              onUpdateMeta={setMeta}
              primaryColor={company.primaryColor}
              onResetNodes={handleResetToDefault}
              isDraggingExternal={isDraggingBrick}
            />
          </div>

          {/* Column 3: Vorschau (Nimmt gesamte restliche Window-Breite und volle Höhe ein) */}
          <div
            className={`flex-1 min-w-0 h-[700px] lg:h-full overflow-hidden ${
              mobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <NewsletterLivePreview
              nodes={nodes}
              meta={meta}
              company={company}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              onSelectTemplate={handleSelectTemplate}
              onReset={handleResetToDefault}
              onCopyHtml={handleCopyHtml}
              copied={copied}
            />
          </div>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-zinc-900 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-zinc-800 animate-fadeIn">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
