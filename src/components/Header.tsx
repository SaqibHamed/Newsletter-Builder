import React from 'react';
import {
  Copy,
  Check,
  FolderOpen,
  RotateCcw,
  Code2,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import { sampleTemplates } from '../data/defaultNewsletter';

interface HeaderProps {
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  company: CompanySettings;
  onOpenExportModal: () => void;
  onSelectTemplate: (templateId: string) => void;
  onReset: () => void;
  onCopyHtml: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  nodes,
  meta,
  company,
  onOpenExportModal,
  onSelectTemplate,
  onReset,
  onCopyHtml,
  copied,
}) => {
  return (
    <header
      id="app-main-header"
      className="bg-white border-b border-zinc-200 sticky top-0 z-30 shadow-2xs w-full"
    >
      <div className="w-full px-3 sm:px-5 h-13 flex items-center justify-between gap-3">
        {/* Left: Puristic Clean Title */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-900 text-sm tracking-tight">
            Newsletter Builder
          </span>
          <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
            • E-Mail 600px
          </span>
        </div>

        {/* Center: Template Switcher & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <FolderOpen className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
            <select
              id="template-selector-dropdown"
              onChange={(e) => onSelectTemplate(e.target.value)}
              defaultValue="standard-briefing"
              aria-label="Newsletter-Vorlage auswählen"
              className="text-xs font-medium pl-8 pr-7 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer transition-colors"
            >
              {sampleTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  Vorlage: {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            id="reset-template-btn"
            onClick={onReset}
            title="Auf Vorlage zurücksetzen"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Copy HTML & Export */}
        <div className="flex items-center gap-2">
          <button
            id="copy-html-btn"
            onClick={onCopyHtml}
            className="px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors"
            title="E-Mail HTML direkt in die Zwischenablage kopieren"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Kopiert!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">HTML kopieren</span>
              </>
            )}
          </button>

          {/* Export button (HTML Textblock) */}
          <button
            id="open-export-modal-btn"
            onClick={onOpenExportModal}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-black rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            title="Newsletter als HTML-Textblock exportieren"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
