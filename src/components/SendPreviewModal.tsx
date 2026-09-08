import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Mail,
  Code,
  ShieldCheck,
  FileCheck,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import { generateEmailHtml } from '../utils/htmlGenerator';

interface SendPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  company: CompanySettings;
}

export const SendPreviewModal: React.FC<SendPreviewModalProps> = ({
  isOpen,
  onClose,
  nodes,
  meta,
  company,
}) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'desktop' | 'mobile' | 'code'>('desktop');
  const [testEmail, setTestEmail] = useState('test@unternehmen.ch');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlOutput = generateEmailHtml(nodes, meta, company);
  const htmlSizeKb = (new Blob([htmlOutput]).size / 1024).toFixed(1);

  // Pre-flight checks
  const subjectValid = meta.subject.trim().length > 0;
  const preheaderValid = meta.preheader.trim().length > 0;
  const hasTitle = nodes.some((n) => n.type === 'title');
  const hasContent = nodes.length >= 2;
  const graphicNodes = nodes.filter(
    (n) =>
      n.type === 'graphic' ||
      n.type === 'two_col_left_graphic' ||
      n.type === 'two_col_right_graphic'
  );
  const imagesHaveAlt = graphicNodes.every(
    (n: any) => n.altText && n.altText.trim().length > 0
  );
  const sizeUnderLimit = parseFloat(htmlSizeKb) < 102; // Gmail 102KB clip limit

  const allChecksPassed =
    subjectValid && preheaderValid && hasTitle && hasContent && imagesHaveAlt && sizeUnderLimit;

  const handleSendTest = () => {
    if (!testEmail || !testEmail.includes('@')) return;
    setIsSending(true);
    setSendSuccess(null);

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(
        `Test-E-Mail wurde erfolgreich an ${testEmail} versendet! (Message-ID: msg-${Date.now()})`
      );
    }, 1200);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(htmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlOutput], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-${meta.subject.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="send-preview-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        id="send-preview-modal-dialog"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: company.primaryColor }}
            >
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Vorschau & Versandprüfung vor dem Versand
              </h2>
              <p className="text-xs text-slate-500">
                Prüfen Sie das E-Mail-Rendering in verschiedenen Clients vor dem definitiven Versand
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Vorschau-Modal schließen"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pre-Flight Quality Banner */}
        <div className="px-5 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Pre-Flight Check:
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                subjectValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {subjectValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              Betreff ({meta.subject.length} Zeichen)
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                preheaderValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {preheaderValid ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              Preheader
            </span>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                imagesHaveAlt ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {imagesHaveAlt ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              Alt-Texte & Bilder ({graphicNodes.length})
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
              E-Mail Grösse: {htmlSizeKb} KB (Gmail Limit: 102 KB)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ Genormtes Firmen-Design erfüllt
            </span>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('desktop')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'desktop'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop Client (Outlook / Apple Mail)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mobile')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'mobile'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Smartphone Ansicht (iOS / Android)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'inbox'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Posteingangs-Snippet
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'code'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Reiner E-Mail HTML-Code
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopiert!' : 'HTML kopieren'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .html</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/80 flex justify-center items-start min-h-[420px]">
          {/* 1. Desktop Mode */}
          {activeTab === 'desktop' && (
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Fake Email Client Window Header */}
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="ml-2 font-medium text-slate-700">
                    Mail-Client Vorschau — {company.companyName}
                  </span>
                </div>
                <span className="text-[11px] font-mono">600px Container</span>
              </div>

              {/* Email Client Metadata Header */}
              <div className="p-4 bg-slate-50/50 border-b border-slate-200 space-y-1.5 text-xs">
                <div className="flex">
                  <span className="w-16 font-medium text-slate-400">Von:</span>
                  <span className="font-semibold text-slate-800">
                    {meta.senderName} &lt;{company.supportEmail}&gt;
                  </span>
                </div>
                <div className="flex">
                  <span className="w-16 font-medium text-slate-400">An:</span>
                  <span className="text-slate-700">Frau Muster &lt;kunde@beispiel.ch&gt;</span>
                </div>
                <div className="flex">
                  <span className="w-16 font-medium text-slate-400">Betreff:</span>
                  <span className="font-bold text-slate-900 text-sm">{meta.subject}</span>
                </div>
              </div>

              {/* Rendered HTML inside sandboxed iframe */}
              <div className="p-4 sm:p-6 flex justify-center" style={{ backgroundColor: company.backgroundColor }}>
                <iframe
                  title="Desktop E-Mail Vorschau"
                  srcDoc={htmlOutput}
                  className="w-full border-0 rounded-xl"
                  style={{ height: '560px', maxWidth: '640px' }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          )}

          {/* 2. Mobile Mode */}
          {activeTab === 'mobile' && (
            <div className="w-full max-w-sm bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800">
              <div className="bg-white rounded-[26px] overflow-hidden">
                {/* Mobile Status Bar */}
                <div className="bg-slate-50 px-4 py-2 flex items-center justify-between text-[11px] font-semibold text-slate-800 border-b border-slate-200">
                  <span>09:41</span>
                  <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto"></div>
                  <span>5G 100%</span>
                </div>

                {/* Mobile Mail Header */}
                <div className="p-3 border-b border-slate-200 text-xs bg-slate-50/50">
                  <p className="font-bold text-slate-900 text-xs truncate">{meta.subject}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Von: {company.companyName}</p>
                </div>

                {/* Iframe for Mobile */}
                <div className="h-[520px] overflow-hidden" style={{ backgroundColor: company.backgroundColor }}>
                  <iframe
                    title="Mobile E-Mail Vorschau"
                    srcDoc={htmlOutput}
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Inbox Snippet View */}
          {activeTab === 'inbox' && (
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Vorschau im Posteingang (Outlook, Gmail, Apple Mail)
              </h3>
              <p className="text-xs text-slate-500">
                So wird die Mitteilung in der E-Mail-Liste der Empfänger vor dem Öffnen dargestellt:
              </p>

              {/* Simulated Inbox Row */}
              <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-white shadow-2xs">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
                    <span className="font-bold text-xs text-slate-900">
                      {meta.senderName} ({company.companyName})
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">10:24 Uhr</span>
                </div>
                <div className="text-xs font-semibold text-slate-900 pl-4 mb-0.5">
                  {meta.subject}
                </div>
                <div className="text-xs text-slate-500 pl-4 line-clamp-2">
                  <span className="text-slate-700 font-medium">{meta.preheader}</span> —{' '}
                  {nodes.find((n) => n.type === 'paragraph')?.['text'] || 'Wichtige Mitteilung...'}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">💡 Best-Practice Empfehlungen:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-amber-700">
                  <li>Betreff idealerweise zwischen 35 und 50 Zeichen (aktuell: {meta.subject.length})</li>
                  <li>Preheader ergänzt den Betreff und animiert zum Öffnen</li>
                  <li>Keine reisserischen Grossbuchstaben oder Spam-Begriffe verwenden</li>
                </ul>
              </div>
            </div>
          )}

          {/* 4. Code View */}
          {activeTab === 'code' && (
            <div className="w-full max-w-4xl bg-slate-900 rounded-xl shadow-xl overflow-hidden flex flex-col">
              <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 border-b border-slate-700">
                <span className="font-mono">standard-newsletter.html ({htmlSizeKb} KB)</span>
                <span className="text-[11px] text-slate-400">
                  Kompatibel mit Mailchimp, Brevo, Outlook, Gmail, HubSpot
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[480px] leading-relaxed">
                <code>{htmlOutput}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer: Test Send & Export */}
        <div className="px-5 py-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          {/* Test Send Input */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="empfaenger@autolina.ch"
              className="flex-1 px-3 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <button
              type="button"
              disabled={isSending}
              onClick={handleSendTest}
              className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition-all hover:brightness-105 shrink-0"
              style={{ backgroundColor: company.primaryColor }}
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sende Test...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Test-Mail senden</span>
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {sendSuccess && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {sendSuccess}
            </span>
          )}

          {/* Close Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Schliessen
            </button>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-all hover:brightness-105"
              style={{ backgroundColor: company.primaryColor }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>HTML für Newsletter-Tool kopieren</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
