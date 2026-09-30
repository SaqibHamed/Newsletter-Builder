import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';

export const defaultCompanySettings: CompanySettings = {
  companyName: 'autolina',
  tagline: 'Der Schweizer Fahrzeugmarkt',
  logoText: 'autolina.ch',
  logoUrl: '/assets/202506_Logo-Transparent.svg',
  primaryColor: '#2E3E6C', // autolina Button & URL Farbe #2E3E6C
  accentColor: '#08B9C2', // autolina Logo-Teal #08B9C2
  backgroundColor: '#F6F6F8', // Spec: Helles Grau #F6F6F8
  cardBackgroundColor: '#FFFFFF', // Spec: Weisser Hintergrund #FFFFFF
  cardBorderRadius: 20, // Spec: border-radius: 20px
  containerWidth: 600, // Spec: 600px Inhaltsbreite (640px Gesamt-Container)
  supportEmail: 'service@autolina.ch',
  websiteUrl: 'https://www.autolina.ch',
  imprintAddress: 'autolina.ch ag • Bahnhofstrasse 24c • 8570 Weinfelden, Schweiz',
  unsubscribeNotice: 'Sie erhalten diese Benachrichtigung von autolina.ch.',
  showHeader: true,
  showFooter: true,
  showSecurityNotice: true,
};

export const defaultNewsletterMeta: NewsletterMeta = {
  subject: 'Willkommen bei autolina — Der Schweizer Fahrzeugmarkt',
  preheader: 'Entdecken Sie jetzt die vielfältigen Möglichkeiten rund um Kauf und Verkauf auf autolina.ch.',
  recipientSalutation: '%Anrede%',
  recipientName: '%Nachname%',
  senderName: 'autolina Team',
  senderEmail: 'service@autolina.ch',
};

// Standard Startinhalt (Willkommens-E-Mail gemäss Style Guide Abschnitt 6a)
export const defaultNodes: NewsletterNode[] = [
  {
    id: 'node-title-welcome',
    type: 'title',
    text: 'Willkommen bei autolina',
    align: 'left',
  },
  {
    id: 'node-salutation',
    type: 'heading',
    text: 'Guten Tag %Anrede% %Nachname%',
    align: 'left',
  },
  {
    id: 'node-welcome-intro',
    type: 'paragraph',
    text: 'Schön, dass Sie bei uns sind! Mit autolina finden Sie einfach, transparent und verlässlich Ihr Wunschfahrzeug oder verkaufen Ihr aktuelles Auto an qualifizierte Interessenten in der ganzen Schweiz.',
    align: 'left',
  },
  {
    id: 'node-graphic-hero',
    type: 'graphic',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    altText: 'autolina Schweizer Fahrzeugmarkt',
    caption: 'Tausende geprüfte Occasionen und Neuwagen aus der ganzen Schweiz',
    fullWidth: true,
  },
  {
    id: 'node-sub-features',
    type: 'heading',
    text: 'Ihre Vorteile im Überblick',
    align: 'left',
  },
  {
    id: 'node-bullets-features',
    type: 'bullet_list',
    items: [
      'Gezielte Suchfilter nach Marke, Modell, Treibstoffart und Schweizer Regionen',
      'Direkter Kontakt zu Schweizer Markenhändlern und privaten Verkäufern',
      'Suchauftrag mit Benachrichtigung bei neuen Treffern und Preissenkungen',
    ],
  },
  {
    id: 'node-sub-tip',
    type: 'heading',
    text: 'Tipp zum Start',
    align: 'left',
  },
  {
    id: 'node-tip-content',
    type: 'paragraph',
    text: 'Speichern Sie Ihre bevorzugten Suchkriterien als Suchauftrag. Sobald ein passendes Fahrzeug online gestellt wird, erhalten Sie sofort eine E-Mail-Mitteilung — so verpassen Sie kein attraktives Angebot.',
    align: 'left',
  },
  {
    id: 'node-cta-start',
    type: 'button_cta',
    label: 'Jetzt Fahrzeuge entdecken',
    url: 'https://www.autolina.ch',
    align: 'left',
    styleVariant: 'primary',
  },
];

export interface NewsletterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  meta: NewsletterMeta;
  nodes: NewsletterNode[];
}

export const sampleTemplates: NewsletterTemplate[] = [
  {
    id: 'welcome',
    name: 'Willkommen bei autolina',
    category: 'Onboarding',
    description: 'Offizielle Begrüssung, Kernfunktionen, Start-Tipp und Grussformel',
    meta: {
      subject: 'Willkommen bei autolina',
      preheader: 'Entdecken Sie die Kernfunktionen auf autolina.ch.',
      recipientSalutation: '%Anrede%',
      recipientName: '%Nachname%',
      senderName: 'autolina Team',
      senderEmail: 'service@autolina.ch',
    },
    nodes: defaultNodes,
  },
  {
    id: 'reset-password',
    name: 'Passwort zurücksetzen',
    category: 'Sicherheit',
    description: 'Link zum Zurücksetzen, 24h-Gültigkeit und Sicherheitshinweis',
    meta: {
      subject: 'Passwort zurücksetzen — autolina.ch',
      preheader: 'Ihr angeforderter Link zum Zurücksetzen des Passworts ist 24 Stunden gültig.',
      recipientSalutation: '%Anrede%',
      recipientName: '%Nachname%',
      senderName: 'autolina Team',
      senderEmail: 'service@autolina.ch',
    },
    nodes: [
      {
        id: 'tmpl-pwd-title',
        type: 'title',
        text: 'Passwort zurücksetzen',
        align: 'left',
      },
      {
        id: 'tmpl-pwd-salutation',
        type: 'heading',
        text: 'Guten Tag %Anrede% %Nachname%',
        align: 'left',
      },
      {
        id: 'tmpl-pwd-para',
        type: 'paragraph',
        text: 'Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts für Ihr autolina-Benutzerkonto erhalten. Über die untenstehende Schaltfläche können Sie ein neues, sicheres Passwort festlegen.',
        align: 'left',
      },
      {
        id: 'tmpl-pwd-cta',
        type: 'button_cta',
        label: 'Neues Passwort festlegen',
        url: '%Reset%',
        align: 'left',
        styleVariant: 'primary',
      },
      {
        id: 'tmpl-pwd-url',
        type: 'url',
        label: '%Reset%',
        url: '%Reset%',
        align: 'left',
      },
      {
        id: 'tmpl-pwd-notice',
        type: 'paragraph',
        text: 'Hinweis: Dieser Sicherheitslink ist aus Sicherheitsgründen für genau 24 Stunden gültig.\n\nFalls Sie das Zurücksetzen nicht selbst angefordert haben, können Sie diese E-Mail ignorieren. Ihr bisheriges Passwort bleibt weiterhin unverändert aktiv.',
        align: 'left',
      },
    ],
  },
  {
    id: 'ad-online',
    name: 'Ihr Inserat ist online',
    category: 'Inserate',
    description: 'Veröffentlichungs-Bestätigung, Tipps für Sichtbarkeit und 60-Tage-Laufzeit',
    meta: {
      subject: 'Ihr Inserat ist jetzt auf autolina.ch online',
      preheader: 'Ihr Fahrzeug ist ab sofort für tausende Kaufinteressenten sichtbar.',
      recipientSalutation: '%Anrede%',
      recipientName: '%Nachname%',
      senderName: 'autolina Team',
      senderEmail: 'service@autolina.ch',
    },
    nodes: [
      {
        id: 'tmpl-online-title',
        type: 'title',
        text: 'Ihr Inserat ist online',
        align: 'left',
      },
      {
        id: 'tmpl-online-salutation',
        type: 'heading',
        text: 'Guten Tag %Anrede% %Nachname%',
        align: 'left',
      },
      {
        id: 'tmpl-online-para',
        type: 'paragraph',
        text: 'Herzlichen Glückwunsch! Ihr Fahrzeuginserat wurde erfolgreich geprüft und ist ab sofort auf autolina.ch für Interessenten freigeschaltet. Die reguläre Laufzeit beträgt 60 Tage.',
        align: 'left',
      },
      {
        id: 'tmpl-online-card',
        type: 'vehicle_card',
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        altText: 'Fahrzeuginserat',
        brand: '%Marke%',
        brandModel: '%Modell%',
        price: '%Preis%',
        date: '%Datum%',
        mileage: '%KM%',
        power: '%PS%',
        transmission: '%Schaltung%',
        fuelType: '%Energie%',
        driveTrain: '%Antrieb%',
      },
      {
        id: 'tmpl-online-sub',
        type: 'heading',
        text: 'Tipps für maximale Sichtbarkeit',
        align: 'left',
      },
      {
        id: 'tmpl-online-steps',
        type: 'numbered_list',
        items: [
          'Aussagekräftige Bilder bei Tageslicht hinzufügen (mindestens 8 bis 12 Fotos)',
          'Vollständige Servicehistorie und Ausstattungsmerkmale detailliert auflisten',
          'Auf eingehende Anfragen von Interessenten rasch und freundlich reagieren',
        ],
      },
    ],
  },
  {
    id: 'ad-expiring',
    name: 'Ihr Inserat läuft in 7 Tagen ab',
    category: 'Inserate',
    description: 'Ablaufwarnung mit Bullet-Point-Optionen (Verlängern, Preis anpassen, verkauft)',
    meta: {
      subject: 'Ihr Inserat läuft in 7 Tagen ab — autolina.ch',
      preheader: 'Entscheiden Sie jetzt: Inserat kostenlos verlängern oder als verkauft markieren.',
      recipientSalutation: '%Anrede%',
      recipientName: '%Nachname%',
      senderName: 'autolina Team',
      senderEmail: 'service@autolina.ch',
    },
    nodes: [
      {
        id: 'tmpl-exp-title',
        type: 'title',
        text: 'Ihr Inserat läuft in 7 Tagen ab',
        align: 'left',
      },
      {
        id: 'tmpl-exp-salutation',
        type: 'heading',
        text: 'Guten Tag %Anrede% %Nachname%',
        align: 'left',
      },
      {
        id: 'tmpl-exp-para',
        type: 'paragraph',
        text: 'Die 60-tägige Veröffentlichungsdauer für Ihr Inserat auf autolina.ch endet in 7 Tagen. Nach Ablauf der Frist wird das Inserat automatisch archiviert und ist für Interessenten nicht mehr sichtbar.',
        align: 'left',
      },
      {
        id: 'tmpl-exp-sub',
        type: 'heading',
        text: 'Ihre Optionen im Kundenbereich',
        align: 'left',
      },
      {
        id: 'tmpl-exp-bullets',
        type: 'bullet_list',
        items: [
          'Verlängern — Kostenlos um weitere 60 Tage verlängern',
          'Preis anpassen — Attraktiverer Preis für mehr Nachfrage',
          'Als verkauft markieren — Inserat sofort deaktivieren',
        ],
      },
      {
        id: 'tmpl-exp-cta',
        type: 'button_cta',
        label: 'Jetzt Inserat verlängern',
        url: 'https://www.autolina.ch/meine-inserate',
        align: 'left',
        styleVariant: 'primary',
      },
    ],
  },
  {
    id: 'test-drive',
    name: 'Ihre Probefahrt ist bestätigt',
    category: 'Probefahrt',
    description: 'Termin-Details, Fahrzeugkarte (CHF 72\'500 Format) und Vorbereitungs-Hinweise',
    meta: {
      subject: 'Ihre Probefahrt ist bestätigt — autolina.ch',
      preheader: 'Ihr Probefahrttermin steht fest. Alle Details und Adresse auf einen Blick.',
      recipientSalutation: '%Anrede%',
      recipientName: '%Nachname%',
      senderName: 'autolina Team',
      senderEmail: 'service@autolina.ch',
    },
    nodes: [
      {
        id: 'tmpl-td-title',
        type: 'title',
        text: 'Ihre Probefahrt ist bestätigt',
        align: 'left',
      },
      {
        id: 'tmpl-td-salutation',
        type: 'heading',
        text: 'Guten Tag %Anrede% %Nachname%',
        align: 'left',
      },
      {
        id: 'tmpl-td-para',
        type: 'paragraph',
        text: 'Der Händler hat Ihren Wunschtermin für die Probefahrt verbindlich bestätigt. Das Fahrzeug steht zum vereinbarten Zeitpunkt bereit.',
        align: 'left',
      },
      {
        id: 'tmpl-td-sub-details',
        type: 'heading',
        text: 'Termin-Details',
        align: 'left',
      },
      {
        id: 'tmpl-td-bullets',
        type: 'bullet_list',
        items: [
          'Datum & Zeit — Samstag, 17. Oktober um 10:30 Uhr',
          'Standort — Autohaus Thurgau AG, Bahnhofstrasse 42, 8570 Weinfelden',
          'Ihr Ansprechpartner — Herr Thomas Keller (Tel. +41 71 626 50 50)',
        ],
      },
      {
        id: 'tmpl-td-card',
        type: 'vehicle_card',
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        altText: 'Probefahrt Fahrzeug',
        brand: '%Marke%',
        brandModel: '%Modell%',
        price: '%Preis%',
        date: '%Datum%',
        mileage: '%KM%',
        power: '%PS%',
        transmission: '%Schaltung%',
        fuelType: '%Energie%',
        driveTrain: '%Antrieb%',
      },
      {
        id: 'tmpl-td-sub-hints',
        type: 'heading',
        text: 'Hinweise zum Termin',
        align: 'left',
      },
      {
        id: 'tmpl-td-hints',
        type: 'numbered_list',
        items: [
          'Bitte bringen Sie Ihren gültigen Schweizer Führerausweis im Original mit.',
          'Planen Sie rund 45 bis 60 Minuten für Besichtigung und Probefahrt ein.',
          'Geben Sie dem Verkäufer bei allfälliger Verhinderung bitte mindestens 24 Stunden vorher Bescheid.',
        ],
      },
    ],
  },
  {
    id: 'newsletter-monthly',
    name: 'autolina Newsletter — September',
    category: 'Newsletter',
    description: 'Monatlicher Newsletter mit mehreren Artikeln, Bildern und Fahrzeug-Highlights',
    meta: {
      subject: 'autolina Newsletter — September 2026',
      preheader: 'Elektromobilität im Aufwind, Markttrends und die Top-Occasionen des Monats.',
      recipientSalutation: '%Anrede%',
      recipientName: '%Nachname%',
      senderName: 'autolina Team',
      senderEmail: 'service@autolina.ch',
    },
    nodes: [
      {
        id: 'tmpl-nl-title',
        type: 'title',
        text: 'autolina Newsletter — September',
        align: 'left',
      },
      {
        id: 'tmpl-nl-salutation',
        type: 'heading',
        text: 'Guten Tag %Anrede% %Nachname%',
        align: 'left',
      },
      {
        id: 'tmpl-nl-intro',
        type: 'paragraph',
        text: 'Willkommen zur September-Ausgabe des autolina Newsletters! In diesem Monat beleuchten wir die Preisentwicklung im Schweizer Occasionsmarkt und präsentieren neue Funktionen für unsere Suchabonnenten.',
        align: 'left',
      },
      {
        id: 'tmpl-nl-col1',
        type: 'two_col_left_graphic',
        imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
        altText: 'Elektrofahrzeuge und Ladetechnologie',
        heading: 'Elektromobilität in der Schweiz',
        paragraph: 'Die Nachfrage nach gebrauchten Elektrofahrzeugen ist im vergangenen Quartal um 18 % gestiegen. Wir zeigen die gefragtesten Modelle und Tipps zur Batterieprüfung.',
        buttonText: 'Artikel lesen',
        buttonUrl: 'https://www.autolina.ch/ratgeber/elektro-trends',
      },
      {
        id: 'tmpl-nl-sub-features',
        type: 'heading',
        text: 'Neue Filter auf autolina.ch',
        align: 'left',
      },
      {
        id: 'tmpl-nl-bullets',
        type: 'bullet_list',
        items: [
          'Filter für Batteriezustand (State of Health) bei E-Fahrzeugen',
          'Schnellansicht von Schweizer Qualitätsgarantien (z.B. Quality1, NSA)',
          'Direkte Ratenberechnung für Leasing und Fahrzeugfinanzierung',
        ],
      },
      {
        id: 'tmpl-nl-card',
        type: 'vehicle_card',
        imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
        altText: 'Audi RS6 Avant Quattro',
        brand: 'Audi',
        brandModel: 'RS6 Avant Quattro Performance',
        price: "CHF 128'900",
        date: '11.2024',
        mileage: "9'200 km",
        power: '630 PS',
        transmission: 'Tiptronic',
        fuelType: 'Benzin',
        driveTrain: 'Allrad',
      },
      {
        id: 'tmpl-nl-cta',
        type: 'button_cta',
        label: 'Alle Monatsangebote auf autolina.ch',
        url: 'https://www.autolina.ch',
        align: 'center',
        styleVariant: 'primary',
      },
    ],
  },
];
