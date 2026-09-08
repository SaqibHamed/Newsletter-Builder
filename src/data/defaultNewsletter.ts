import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';

export const defaultCompanySettings: CompanySettings = {
  companyName: 'autolina',
  tagline: 'Der Schweizer Fahrzeugmarkt',
  logoText: 'autolina.ch',
  logoUrl: 'https://www.autolina.ch/media/logo.64af33af2b4aa46a.svg',
  primaryColor: '#1B4B97', // autolina corporate blue
  accentColor: '#1B4B97',
  backgroundColor: '#E4E4E4', // Spec #E4E4E4
  cardBackgroundColor: '#FFFFFF', // Exactly matching #FFFFFF (ohne border und effects)
  cardBorderRadius: 12, // Exactly 12px
  containerWidth: 600, // Exactly 600px
  supportEmail: 'service@autolina.ch',
  websiteUrl: 'https://www.autolina.ch',
  imprintAddress: 'autolina.ch AG • 8570 Weinfelden • www.autolina.ch',
  unsubscribeNotice: 'Sie erhalten diese Benachrichtigung von autolina.ch.',
  showHeader: false, // Standard Logo Zone is rendered fixed on top
  showFooter: false,
};

export const defaultNewsletterMeta: NewsletterMeta = {
  subject: 'Neues aus dem Schweizer Fahrzeugmarkt',
  preheader: 'Aktuelle Einblicke, Fahrzeugangebote und wichtige Neuerungen auf autolina.ch.',
  recipientSalutation: 'Guten Tag Frau',
  recipientName: 'Muster',
  senderName: 'autolina Team',
  senderEmail: 'service@autolina.ch',
};

export const defaultNodes: NewsletterNode[] = [
  {
    id: 'node-title-1',
    type: 'title',
    text: 'Monatsbericht & Entwicklungen',
    align: 'left',
  },
  {
    id: 'node-heading-1',
    type: 'heading',
    text: 'Guten Tag Frau Muster,',
    align: 'left',
  },
  {
    id: 'node-para-1',
    type: 'paragraph',
    text: 'wir freuen uns, Ihnen die wesentlichen Neuerungen und Entwicklungen dieses Monats zusammenzufassen.\n\nAlle Inhalte folgen unserem standardisierten 600px Gestaltungsraster mit 12px Eckenradius und einer klaren Poppins-Typografie für optimale Lesbarkeit auf allen Endgeräten.',
    align: 'left',
  },
  {
    id: 'node-two-col-left-1',
    type: 'two_col_left_graphic',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    altText: 'Moderne Arbeitsumgebung und Fahrzeug-Technologie',
    heading: 'Neue Fahrzeug-Services',
    paragraph: 'Wir haben unsere Suchfilter und Händlerfunktionen optimiert, um den Fahrzeugkauf und -verkauf noch effizienter zu gestalten.',
    buttonText: 'Jetzt entdecken',
    buttonUrl: 'https://www.autolina.ch',
  },
  {
    id: 'node-bullets-1',
    type: 'bullet_list',
    items: [
      'Erweiterte Suchkriterien für Elektro- und Hybridfahrzeuge',
      'Responsives 600px E-Mail Raster mit 12px Eckenradius',
      'Optimierte Händler-Tools und direkte Anfragen-Verwaltung',
    ],
  },
  {
    id: 'node-numbered-1',
    type: 'numbered_list',
    items: [
      'Aktualisierung Ihres Fahrzeugbestands mit wenigen Klicks',
      'Direkte Kontaktaufnahme durch verifizierte Interessenten',
      'Transparente Statistiken über Inserate-Aufrufe und Leads',
    ],
  },
  {
    id: 'node-button-1',
    type: 'button_cta',
    label: 'Zu autolina.ch wechseln',
    url: 'https://www.autolina.ch',
    align: 'center',
    styleVariant: 'primary',
  },
];

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  meta: NewsletterMeta;
  nodes: NewsletterNode[];
}

export const sampleTemplates: NewsletterTemplate[] = [
  {
    id: 'standard-briefing',
    name: 'Standard Rundschreiben (Puristic)',
    description: 'Minimalistischer Aufbau mit Titel, persönlicher Anrede, 2-Spalten und Aufzählungen',
    meta: defaultNewsletterMeta,
    nodes: defaultNodes,
  },
  {
    id: 'product-update',
    name: 'Produkt- & Feature Update',
    description: 'Fokussiert auf visuelle Highlights, Release-Notes und Handlungsschritte',
    meta: {
      subject: 'Release Update: Neuerungen im aktuellen Quartal',
      preheader: 'Entdecken Sie die neuesten Funktionen und Verbesserungen.',
      recipientSalutation: 'Guten Tag Frau',
      recipientName: 'Muster',
      senderName: 'Produktteam',
      senderEmail: 'kontakt@unternehmen.ch',
    },
    nodes: [
      {
        id: 'tmpl-title-1',
        type: 'title',
        text: 'Produkt- und Versions-Update',
        align: 'left',
      },
      {
        id: 'tmpl-heading-1',
        type: 'heading',
        text: 'Neue Funktionen für Ihren Arbeitsalltag',
        align: 'left',
      },
      {
        id: 'tmpl-para-1',
        type: 'paragraph',
        text: 'Im aktuellen Release haben wir uns auf Geschwindigkeit, Vereinfachung der Navigation und flexiblere Gestaltungsmöglichkeiten konzentriert.',
        align: 'left',
      },
      {
        id: 'tmpl-graphic-1',
        type: 'graphic',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        altText: 'Übersichtliche Benutzeroberfläche',
        caption: 'Standardisiertes Dashboard mit modularen Bausteinen',
        fullWidth: true,
      },
      {
        id: 'tmpl-bullets-1',
        type: 'bullet_list',
        items: [
          'Drag-and-Drop Unterstützung für rasches Anordnen von Inhalten',
          'Direkte Live-Vorschau mit pixelgenauer E-Mail-Karten-Darstellung',
          'Exportierbares, sauberes HTML ohne überflüssige Abhängigkeiten',
        ],
      },
      {
        id: 'tmpl-btn-1',
        type: 'button_cta',
        label: 'Jetzt ausprobieren',
        url: 'https://unternehmen.ch',
        align: 'center',
        styleVariant: 'primary',
      },
    ],
  },
  {
    id: 'compact-announcement',
    name: 'Kompakte Kundenmitteilung',
    description: 'Schlanke Servicemitteilung für Ankündigungen und Hinweise',
    meta: {
      subject: 'Wichtige Information zu Ihren Systemeinstellungen',
      preheader: 'Kurze Zusammenfassung der geplanten System-Optimierungen.',
      recipientSalutation: 'Guten Tag Frau',
      recipientName: 'Muster',
      senderName: 'Service Team',
      senderEmail: 'kontakt@unternehmen.ch',
    },
    nodes: [
      {
        id: 'maint-title-1',
        type: 'title',
        text: 'Wichtige Mitteilung',
        align: 'left',
      },
      {
        id: 'maint-heading-1',
        type: 'heading',
        text: 'Planmässiges System-Upgrade am Wochenende',
        align: 'left',
      },
      {
        id: 'maint-para-1',
        type: 'paragraph',
        text: 'Um Ihnen auch weiterhin maximale Zuverlässigkeit und Sicherheit zu gewährleisten, führen wir am kommenden Sonntag planmässige Wartungsarbeiten durch.',
        align: 'left',
      },
      {
        id: 'maint-num-1',
        type: 'numbered_list',
        items: [
          'Wartungsfenster: Sonntag zwischen 02:00 und 04:00 Uhr',
          'Sämtliche Daten und Einstellungen bleiben vollständig erhalten',
          'Nach Abschluss stehen alle Funktionen ohne Unterbrechung bereit',
        ],
      },
      {
        id: 'maint-para-2',
        type: 'paragraph',
        text: 'Sollten Sie vorab Fragen haben, steht Ihnen unser Team jederzeit gerne zur Verfügung.',
        align: 'left',
      },
    ],
  },
];
