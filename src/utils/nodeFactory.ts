import { NewsletterNode, NodeType } from '../types';

export function createNewNode(type: NodeType): NewsletterNode {
  const id = `node-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  switch (type) {
    case 'title':
      return {
        id,
        type: 'title',
        text: 'Neuer Titel',
        align: 'left',
      };

    case 'heading':
      return {
        id,
        type: 'heading',
        text: 'Neue Zwischenüberschrift',
        align: 'left',
      };

    case 'paragraph':
      return {
        id,
        type: 'paragraph',
        text: 'Fügen Sie hier Ihren Textabschnitt ein. Der Text wird gemäss Inter 16px Regular und 1.5 Zeilenabstand formatiert.',
        align: 'left',
      };

    case 'graphic':
      return {
        id,
        type: 'graphic',
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        altText: 'Grafikbeschreibung',
        caption: 'Optionale Bildunterschrift',
        fullWidth: true,
      };

    case 'bullet_list':
      return {
        id,
        type: 'bullet_list',
        items: [
          'Erster wichtiger Listenpunkt',
          'Zweiter wesentlicher Vorteil oder Hinweis',
          'Dritter Schritt oder Ergänzung',
        ],
      };

    case 'numbered_list':
      return {
        id,
        type: 'numbered_list',
        items: [
          'Erster geordneter Handlungsschritt',
          'Zweiter Prozessschritt in der Abfolge',
          'Abschliessende Bestätigung oder Prüfung',
        ],
      };

    case 'two_col_left_graphic':
      return {
        id,
        type: 'two_col_left_graphic',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        altText: 'Projektansicht',
        heading: 'Themenblock mit Bild links',
        paragraph: 'Erklärender Textabschnitt passend zur linken Grafik. Ideal für Feature-Vorstellungen oder Team-Notizen.',
        buttonText: 'Mehr erfahren',
        buttonUrl: '#',
      };

    case 'two_col_right_graphic':
      return {
        id,
        type: 'two_col_right_graphic',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        altText: 'Detailansicht',
        heading: 'Themenblock mit Bild rechts',
        paragraph: 'Zweispaltiges Layout mit einleitender Überschrift und Erläuterung auf der linken Seite sowie Grafik rechts.',
        buttonText: 'Details ansehen',
        buttonUrl: '#',
      };

    case 'button_cta':
      return {
        id,
        type: 'button_cta',
        label: 'Aktion ausführen',
        url: 'https://unternehmen.ch',
        align: 'center',
        styleVariant: 'primary',
      };

    default:
      return {
        id,
        type: 'paragraph',
        text: 'Neuer Textabschnitt',
        align: 'left',
      };
  }
}
