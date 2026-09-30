export type NodeType =
  | 'title'
  | 'heading'
  | 'paragraph'
  | 'graphic'
  | 'bullet_list'
  | 'numbered_list'
  | 'two_col_left_graphic'
  | 'two_col_right_graphic'
  | 'button_cta'
  | 'vehicle_card'
  | 'url';

export interface BaseNode {
  id: string;
  type: NodeType;
  collapsed?: boolean;
}

export interface TitleNode extends BaseNode {
  type: 'title';
  text: string;
  align?: 'left' | 'center' | 'right';
}

export interface HeadingNode extends BaseNode {
  type: 'heading';
  text: string;
  align?: 'left' | 'center' | 'right';
}

export interface ParagraphNode extends BaseNode {
  type: 'paragraph';
  text: string;
  align?: 'left' | 'center' | 'right';
}

export interface GraphicNode extends BaseNode {
  type: 'graphic';
  imageUrl: string;
  altText: string;
  caption?: string;
  linkUrl?: string;
  fullWidth?: boolean;
}

export interface BulletListNode extends BaseNode {
  type: 'bullet_list';
  items: string[];
}

export interface NumberedListNode extends BaseNode {
  type: 'numbered_list';
  items: string[];
}

export interface TwoColLeftGraphicNode extends BaseNode {
  type: 'two_col_left_graphic';
  imageUrl: string;
  altText: string;
  heading: string;
  paragraph: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface TwoColRightGraphicNode extends BaseNode {
  type: 'two_col_right_graphic';
  imageUrl: string;
  altText: string;
  heading: string;
  paragraph: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface ButtonCtaNode extends BaseNode {
  type: 'button_cta';
  label: string;
  url: string;
  align?: 'left' | 'center' | 'right';
  styleVariant?: 'primary' | 'secondary' | 'outline';
}

export interface VehicleCardNode extends BaseNode {
  type: 'vehicle_card';
  imageUrl: string;
  altText: string;
  brand?: string; // z.B. 'Mercedes-Benz' oder '%Marke%'
  brandModel: string; // z.B. 'AMG GT 63 S E Performance 4MATIC' oder '%Modell%'
  price: string; // z.B. "CHF 72'500" oder '%Preis%'
  date?: string; // z.B. '06.2024' oder '%Datum%'
  mileage?: string; // z.B. "256'984 km" oder '%KM%'
  power?: string; // z.B. '1296 PS' oder '%PS%'
  transmission?: string; // z.B. 'Handschaltung' oder '%Schaltung%'
  fuelType?: string; // z.B. 'Plug-in-Hybrid' oder '%Energie%'
  driveTrain?: string; // z.B. 'Vorderradantrieb' oder '%Antrieb%'
}

export interface UrlNode extends BaseNode {
  type: 'url';
  url: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
}

export type NewsletterNode =
  | TitleNode
  | HeadingNode
  | ParagraphNode
  | GraphicNode
  | BulletListNode
  | NumberedListNode
  | TwoColLeftGraphicNode
  | TwoColRightGraphicNode
  | ButtonCtaNode
  | VehicleCardNode
  | UrlNode;

export interface CompanySettings {
  companyName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string; // Outer container background e.g. #f6f6f8
  cardBackgroundColor: string; // Inner card background e.g. #ffffff
  cardBorderRadius: number; // e.g. 20px
  containerWidth: number; // e.g. 600px
  supportEmail: string;
  websiteUrl: string;
  imprintAddress: string;
  unsubscribeNotice: string;
  showHeader: boolean;
  showFooter: boolean;
  showSecurityNotice?: boolean;
}

export interface NewsletterMeta {
  subject: string;
  preheader: string;
  recipientSalutation: string;
  recipientName: string;
  senderName: string;
  senderEmail: string;
}

export type PreviewDevice = 'desktop' | 'mobile' | 'tablet';
