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
        imageUrl: '%Bild%',
        altText: 'Grafik',
        caption: '',
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
        imageUrl: '%Bild%',
        altText: 'Grafik',
        heading: 'Themenblock mit Bild links',
        paragraph: 'Erklärender Textabschnitt passend zur linken Grafik. Ideal für Feature-Vorstellungen oder Team-Notizen.',
        buttonText: 'Mehr erfahren',
        buttonUrl: '#',
      };

    case 'two_col_right_graphic':
      return {
        id,
        type: 'two_col_right_graphic',
        imageUrl: '%Bild%',
        altText: 'Grafik',
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
        url: 'https://www.autolina.ch',
        align: 'left',
        styleVariant: 'primary',
      };

    case 'vehicle_card':
      return {
        id,
        type: 'vehicle_card',
        imageUrl: '%Fahrzeugbild%',
        altText: 'Fahrzeugbild',
        brand: '%Marke%',
        brandModel: '%Modell%',
        price: '%Preis%',
        date: '%Datum%',
        mileage: '%KM%',
        power: '%PS%',
        transmission: '%Schaltung%',
        fuelType: '%Energie%',
        driveTrain: '%Antrieb%',
      };

    case 'url':
      return {
        id,
        type: 'url',
        label: '%Reset%',
        url: '%Reset%',
        align: 'left',
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
