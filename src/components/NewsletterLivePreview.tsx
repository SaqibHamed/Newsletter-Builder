import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { CompanySettings, NewsletterMeta, NewsletterNode, PreviewDevice } from '../types';
import { sampleTemplates } from '../data/defaultNewsletter';

interface NewsletterLivePreviewProps {
  nodes: NewsletterNode[];
  meta: NewsletterMeta;
  company: CompanySettings;
  selectedNodeId?: string | null;
  onSelectNode?: (id: string) => void;
  onSelectTemplate?: (templateId: string) => void;
  onReset?: () => void;
  onCopyHtml?: () => void;
  copied?: boolean;
}

export const NewsletterLivePreview: React.FC<NewsletterLivePreviewProps> = ({
  nodes,
  meta,
  company,
  selectedNodeId,
  onSelectNode,
  onSelectTemplate,
  onReset,
  onCopyHtml,
  copied = false,
}) => {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [zoom, setZoom] = useState<number>(100);

  const containerWidthStyle =
    device === 'mobile' ? '375px' : device === 'tablet' ? '480px' : '600px';

  return (
    <div
      id="newsletter-live-preview-wrapper"
      className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full"
    >
      {/* Top Toolbar: Unified Workspace Controls */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        {/* Left: Template Selector, Reset & Device Switcher */}
        <div className="flex items-center gap-2">
          {onSelectTemplate && (
            <div className="relative flex items-center">
              <FolderOpen className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
              <select
                id="template-selector-dropdown"
                onChange={(e) => onSelectTemplate(e.target.value)}
                defaultValue="standard-briefing"
                aria-label="Newsletter-Vorlage auswählen"
                className="text-xs font-medium pl-8 pr-7 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer transition-colors shadow-2xs"
              >
                {sampleTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    Vorlage: {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {onReset && (
            <button
              id="reset-template-btn"
              onClick={onReset}
              title="Auf Vorlage zurücksetzen"
              className="p-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-lg transition-colors border border-transparent hover:border-zinc-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          {/* Device Switcher */}
          <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                device === 'desktop'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Desktop Ansicht (600px)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 transition-colors ${
                device === 'mobile'
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
              title="Smartphone Ansicht (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Zoom & Single HTML Copy Button */}
        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center gap-1 text-xs text-zinc-500 bg-white border border-zinc-200 rounded-lg px-1.5 py-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setZoom(Math.max(60, zoom - 15))}
              className="p-1 text-zinc-500 hover:text-zinc-800 rounded hover:bg-zinc-100"
              title="Verkleinern"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-8 text-center">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(120, zoom + 15))}
              className="p-1 text-zinc-500 hover:text-zinc-800 rounded hover:bg-zinc-100"
              title="Vergrössern"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* HTML kopieren Button */}
          {onCopyHtml && (
            <button
              id="copy-html-btn"
              type="button"
              onClick={onCopyHtml}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-all ${
                copied
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-zinc-900 text-white hover:bg-black'
              }`}
              title="E-Mail HTML direkt in die Zwischenablage kopieren"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>HTML kopieren</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Live Preview Canvas Container with background #E4E4E4 */}
      <div
        id="preview-canvas-container"
        className="flex-1 overflow-auto p-4 sm:p-8 transition-all flex justify-center items-start"
        style={{ backgroundColor: company.backgroundColor || '#E4E4E4' }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out, width 0.2s ease',
            width: containerWidthStyle,
            maxWidth: '100%',
          }}
          className="nl-container"
        >
          {/* Fixed Logo Box (weisser Kasten mit zentriertem Logo, 12px Radius) */}
          <div className="nl-card nl-logo-card">
            <a
              href="https://www.autolina.ch"
              target="_blank"
              rel="noreferrer"
              className="inline-block transition-opacity hover:opacity-85"
            >
              <img
                src="https://www.autolina.ch/media/logo.64af33af2b4aa46a.svg"
                alt="autolina.ch"
              />
            </a>
          </div>

          {/* Main Content Box (weisse Inhaltskarte, 12px Radius, ohne Ränder oder Schatten) */}
          <div id="preview-newsletter-card" className="nl-card nl-content-card">
            <div className="nl-stack">
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const interactiveClasses = onSelectNode
                  ? `cursor-pointer transition-all duration-150 p-1 -m-1 rounded-lg ${
                      isSelected
                        ? 'ring-2 ring-[#1B4B97] ring-offset-2 bg-blue-50/30'
                        : 'hover:ring-1 hover:ring-zinc-300'
                    }`
                  : '';

                switch (node.type) {
                  case 'title': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <h1 className={`nl-title ${alignClass}`}>
                          {node.text}
                        </h1>
                      </div>
                    );
                  }

                  case 'heading': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <h2 className={`nl-heading ${alignClass}`}>
                          {node.text}
                        </h2>
                      </div>
                    );
                  }

                  case 'paragraph': {
                    const alignClass =
                      node.align === 'center'
                        ? 'text-center'
                        : node.align === 'right'
                        ? 'text-right'
                        : 'text-left';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <p className={`nl-paragraph ${alignClass}`}>
                          {node.text}
                        </p>
                      </div>
                    );
                  }

                  case 'graphic':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-graphic ${interactiveClasses}`}
                      >
                        <img
                          src={node.imageUrl}
                          alt={node.altText || 'Grafik'}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/600x300/f6f6f8/94a3b8?text=Grafik';
                          }}
                        />
                        {node.caption && (
                          <p className="nl-caption">{node.caption}</p>
                        )}
                      </div>
                    );

                  case 'bullet_list':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <ul className="nl-list">
                          {node.items
                            .filter((it) => it.trim().length > 0)
                            .map((item, idx) => (
                              <li key={idx} className="nl-list-item">
                                <span className="nl-bullet">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    );

                  case 'numbered_list':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={interactiveClasses}
                      >
                        <ol className="nl-list">
                          {node.items
                            .filter((it) => it.trim().length > 0)
                            .map((item, idx) => (
                              <li key={idx} className="nl-list-item">
                                <span className="nl-badge-num">{idx + 1}</span>
                                <span>{item}</span>
                              </li>
                            ))}
                        </ol>
                      </div>
                    );

                  case 'two_col_left_graphic':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-twocol ${interactiveClasses}`}
                      >
                        <div className="nl-twocol-media">
                          <img
                            src={node.imageUrl}
                            alt={node.altText || ''}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/400x300/e4e4e4/94a3b8?text=Grafik';
                            }}
                          />
                        </div>
                        <div className="nl-twocol-body">
                          <h3>{node.heading}</h3>
                          <p>{node.paragraph}</p>
                          {node.buttonText && (
                            <a
                              href={node.buttonUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="nl-btn"
                            >
                              {node.buttonText}
                            </a>
                          )}
                        </div>
                      </div>
                    );

                  case 'two_col_right_graphic':
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-twocol nl-twocol-reverse ${interactiveClasses}`}
                      >
                        <div className="nl-twocol-media">
                          <img
                            src={node.imageUrl}
                            alt={node.altText || ''}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/400x300/e4e4e4/94a3b8?text=Grafik';
                            }}
                          />
                        </div>
                        <div className="nl-twocol-body">
                          <h3>{node.heading}</h3>
                          <p>{node.paragraph}</p>
                          {node.buttonText && (
                            <a
                              href={node.buttonUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="nl-btn"
                            >
                              {node.buttonText}
                            </a>
                          )}
                        </div>
                      </div>
                    );

                  case 'button_cta': {
                    const alignClass =
                      node.align === 'center'
                        ? 'nl-btn-center'
                        : node.align === 'right'
                        ? 'nl-btn-right'
                        : '';
                    return (
                      <div
                        key={node.id}
                        onClick={() => onSelectNode?.(node.id)}
                        className={`nl-btn-wrap ${alignClass} ${interactiveClasses}`}
                      >
                        <a
                          href={node.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="nl-btn nl-btn-cta"
                        >
                          {node.label}
                        </a>
                      </div>
                    );
                  }

                  default:
                    return null;
                }
              })}
            </div>

            {/* Fixed Closing Signature: direkt nach dem letzten Baustein */}
            <div className="nl-closing">
              <p>
                Liebe Grüsse,<br />
                Dein autolina Team
              </p>
              <p>
                <strong>autolina.ch AG</strong><br />
                8570 Weinfelden<br />
                <a
                  href="https://www.autolina.ch"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.autolina.ch
                </a>
              </p>
            </div>
          </div>

          {/* Fixed Blue Security Box unterhalb vom Newsletter (Vorsicht vor Betrügern) */}
          <div id="preview-security-blue-box" className="nl-card nl-security-card">
            <p>
              <strong>Vorsicht vor Betrügern:</strong>{' '}
              autolina würde Sie nie nach Ihrem Passwort oder persönlichen Daten fragen oder Sie auffordern, diese zu ändern. Sollten Sie eine E-Mail mit einer entsprechenden Aufforderung erhalten, bitten wir Sie, die betreffende E-Mail zu ignorieren und umgehend unseren Support unter{' '}
              <a href="mailto:service@autolina.ch">
                service@autolina.ch
              </a>{' '}
              zu kontaktieren.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
