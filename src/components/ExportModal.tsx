import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Code2,
  Eye,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import { generateEmailHtml } from '../utils/htmlGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  company: CompanySettings;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  meta,
  company,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  if (!isOpen) return null;

  const htmlOutput = generateEmailHtml(nodes, meta, company);
  const htmlBlob = new Blob([htmlOutput], { type: 'text/html;charset=utf-8' });
  const htmlSizeKb = (htmlBlob.size / 1024).toFixed(1);
  const lineCount = htmlOutput.split('\n').length;
  const charCount = htmlOutput.length;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const url = URL.createObjectURL(htmlBlob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedSubject = meta.subject
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    link.download = `newsletter-${sanitizedSubject || 'export'}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="newsletter-export-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="newsletter-export-modal-dialog"
        className="bg-white rounded-xl shadow-2xl border border-zinc-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 leading-tight">
                Newsletter Export (HTML)
              </h2>
              <p className="text-[11px] text-zinc-500">
                Kompaktes Div-Container Layout mit zentralem CSS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Exportfenster schliessen"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info & Metrics Bar */}
        <div className="px-5 py-2.5 bg-zinc-100/70 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono text-[11px] font-semibold">
              {htmlSizeKb} KB
            </span>
            <span className="text-zinc-500 text-[11px]">
              ({lineCount} Zeilen • {charCount.toLocaleString('de-CH')} Zeichen)
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              Gmail Clip-sicher (&lt;102 KB)
            </span>
            <span className="text-[11px] text-zinc-500 hidden sm:inline">
              • Div-Container • Poppins &amp; Inter • Kompaktes CSS
            </span>
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center gap-1 bg-white border border-zinc-200 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'code'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>HTML Code</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vorschau</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 bg-zinc-950">
          {activeTab === 'code' ? (
            <div className="flex-1 overflow-hidden flex flex-col rounded-lg border border-zinc-800 bg-zinc-900/90">
              <div className="px-3 py-1.5 bg-zinc-800/80 border-b border-zinc-700 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                <span>autolina-newsletter.html</span>
                <span>Div-Container Layout • Kompaktes CSS</span>
              </div>
              <textarea
                id="export-html-textarea"
                readOnly
                value={htmlOutput}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="flex-1 w-full p-3.5 bg-transparent text-zinc-200 font-mono text-xs leading-relaxed resize-none focus:outline-none overflow-y-auto selection:bg-zinc-700 selection:text-white"
              />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 bg-zinc-100 rounded-lg">
              <iframe
                title="Newsletter Vorschau"
                srcDoc={htmlOutput}
                className="w-full max-w-[664px] h-[550px] border border-zinc-300 rounded-xl bg-white shadow-sm"
                sandbox="allow-same-origin"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-zinc-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            Kopieren und direkt in Ihr Newsletter-Tool (Mailchimp, Brevo, Outlook etc.) einfügen.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 hover:text-black bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Als Datei (.html)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-4 py-1.5 text-xs font-bold text-white bg-zinc-900 hover:bg-black rounded-lg flex items-center gap-2 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>HTML kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>HTML kopieren</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
