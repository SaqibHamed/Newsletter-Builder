import React from 'react';
import { X, Sliders, RotateCcw, Check, Sparkles, Building2 } from 'lucide-react';
import { CompanySettings } from '../types';
import { defaultCompanySettings } from '../data/defaultNewsletter';

interface CompanySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanySettings;
  onSave: (updatedCompany: CompanySettings) => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  isOpen,
  onClose,
  company,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = React.useState<CompanySettings>(company);

  React.useEffect(() => {
    setLocalSettings(company);
  }, [company]);

  if (!isOpen) return null;

  const handleReset = () => {
    setLocalSettings(defaultCompanySettings);
  };

  const handleApply = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div
      id="company-settings-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="company-settings-modal-dialog"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: localSettings.primaryColor }}
            >
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Company CI/CD & Layout-Normung
              </h2>
              <p className="text-xs text-slate-500">
                Garantiert einheitliches Aussehen aller Unternehmens-Newsletter
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="CI/CD Normung Einstellungen schließen"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Brand Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Firmenname / Marke
              </label>
              <input
                type="text"
                value={localSettings.companyName}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, companyName: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Slogan / Unterzeile
              </label>
              <input
                type="text"
                value={localSettings.tagline}
                onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          {/* Colors & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primärfarbe (CI-Farbe)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localSettings.primaryColor}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, primaryColor: e.target.value })
                  }
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={localSettings.primaryColor}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, primaryColor: e.target.value })
                  }
                  className="w-full px-2.5 py-1 text-xs font-mono text-slate-800 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Karten-Eckenradius (px)
              </label>
              <input
                type="number"
                min="0"
                max="32"
                value={localSettings.cardBorderRadius}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    cardBorderRadius: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">Testbuild-Norm: 20px</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Container-Breite (px)
              </label>
              <input
                type="number"
                min="480"
                max="720"
                value={localSettings.containerWidth}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    containerWidth: parseInt(e.target.value, 10) || 600,
                  })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
              />
              <span className="text-[10px] text-slate-400">E-Mail Standard: 600px</span>
            </div>
          </div>

          {/* Legal / Imprint & Support */}
          <div className="space-y-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kundenservice E-Mail
              </label>
              <input
                type="email"
                value={localSettings.supportEmail}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, supportEmail: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Offizielle Webseite
              </label>
              <input
                type="text"
                value={localSettings.websiteUrl}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, websiteUrl: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Genormtes Impressum (Schweiz)
              </label>
              <input
                type="text"
                value={localSettings.imprintAddress}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, imprintAddress: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Abmeldehinweis & Datenschutz-Hinweis
              </label>
              <textarea
                rows={2}
                value={localSettings.unsubscribeNotice}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, unsubscribeNotice: e.target.value })
                }
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-lg leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Standardwerte laden</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg shadow-xs transition-all hover:brightness-105"
              style={{ backgroundColor: localSettings.primaryColor }}
            >
              Änderungen übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
