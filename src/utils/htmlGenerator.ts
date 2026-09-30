import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import {
  getAutolinaLogoSvg,
  getAutolinaLogoHtml,
  getAppleBadgeHtml,
  getGooglePlayBadgeHtml,
  getAppleBadgeSvgLink,
  getGooglePlayBadgeSvgLink,
  getSocialMediaLinksHtml,
  getVehicleSpecIconSvg,
} from './autolinaAssets';

export function generateEmailHtml(
  nodes: NewsletterNode[],
  meta: NewsletterMeta,
  company: CompanySettings
): string {
  const replacePersonalization = (str: string) => {
    return str || '';
  };

  const renderNodeHtml = (node: NewsletterNode): string => {
    switch (node.type) {
      case 'title': {
        const alignClass =
          node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        return `        <h1 class="nl-title${alignClass}">${escapeHtml(replacePersonalization(node.text))}</h1>`;
      }

      case 'heading': {
        const alignClass =
          node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        return `        <h2 class="nl-heading${alignClass}">${escapeHtml(replacePersonalization(node.text))}</h2>`;
      }

      case 'paragraph': {
        const alignClass =
          node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        // Automatically make URLs and email addresses clickable links in #08B9C2
        const rawText = escapeHtml(replacePersonalization(node.text));
        const formattedText = formatInlineLinks(rawText);
        return `        <p class="nl-paragraph${alignClass}">${formattedText}</p>`;
      }

      case 'graphic': {
        const captionHtml = node.caption
          ? `\n          <p class="nl-caption">${escapeHtml(node.caption)}</p>`
          : '';
        const imgTag = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || 'Grafik')}" class="nl-img" />`;
        const wrapped = node.linkUrl
          ? `<a href="${escapeAttr(node.linkUrl)}" target="_blank" rel="noopener noreferrer">${imgTag}</a>`
          : imgTag;

        return `        <div class="nl-graphic">
          ${wrapped}${captionHtml}
        </div>`;
      }

      case 'bullet_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item) =>
              `          <li class="nl-list-item"><span class="nl-bullet">•</span><span>${formatInlineLinks(
                escapeHtml(replacePersonalization(item))
              )}</span></li>`
          )
          .join('\n');

        return `        <ul class="nl-list">\n${items}\n        </ul>`;
      }

      case 'numbered_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item, idx) =>
              `          <li class="nl-list-item"><span class="nl-badge-num">${idx + 1}.</span><span>${formatInlineLinks(
                escapeHtml(replacePersonalization(item))
              )}</span></li>`
          )
          .join('\n');

        return `        <ol class="nl-list">\n${items}\n        </ol>`;
      }

      case 'two_col_left_graphic': {
        const btnHtml = node.buttonText
          ? `\n            <a href="${escapeAttr(node.buttonUrl || '#')}" class="nl-btn">${escapeHtml(
              node.buttonText
            )}</a>`
          : '';

        return `        <div class="nl-twocol">
          <div class="nl-twocol-media">
            <img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" />
          </div>
          <div class="nl-twocol-body">
            <h3>${escapeHtml(replacePersonalization(node.heading))}</h3>
            <p>${formatInlineLinks(escapeHtml(replacePersonalization(node.paragraph)))}</p>${btnHtml}
          </div>
        </div>`;
      }

      case 'two_col_right_graphic': {
        const btnHtml = node.buttonText
          ? `\n            <a href="${escapeAttr(node.buttonUrl || '#')}" class="nl-btn">${escapeHtml(
              node.buttonText
            )}</a>`
          : '';

        return `        <div class="nl-twocol nl-twocol-reverse">
          <div class="nl-twocol-media">
            <img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" />
          </div>
          <div class="nl-twocol-body">
            <h3>${escapeHtml(replacePersonalization(node.heading))}</h3>
            <p>${formatInlineLinks(escapeHtml(replacePersonalization(node.paragraph)))}</p>${btnHtml}
          </div>
        </div>`;
      }

      case 'button_cta': {
        const alignClass =
          node.align === 'center'
            ? ' nl-btn-center'
            : node.align === 'right'
            ? ' nl-btn-right'
            : '';
        return `        <div class="nl-btn-wrap${alignClass}">
          <a href="${escapeAttr(node.url || '#')}" class="nl-btn nl-btn-cta">${escapeHtml(node.label)}</a>
        </div>`;
      }

      case 'vehicle_card': {
        const brand = node.brand || (node.brandModel?.includes(' ') ? node.brandModel.split(' ')[0] : 'Mercedes-Benz');
        const model = node.brandModel || '%Modell%';
        const price = node.price || "CHF 72'500";
        const dateVal = node.date || '06.2024';
        const mileageVal = node.mileage || "256'984 km";
        const powerVal = node.power || '1296 PS';
        const transVal = node.transmission || 'Handschaltung';
        const fuelVal = node.fuelType || 'Plug-in-Hybrid';
        const driveVal = node.driveTrain || 'Vorderradantrieb';

        return `        <div class="nl-vehicle-card-v2">
          <div class="nl-vehicle-media-v2">
            <img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || model)}" />
          </div>
          <div class="nl-vehicle-body-v2">
            <div class="nl-vehicle-brand">${escapeHtml(replacePersonalization(brand))}</div>
            <div class="nl-vehicle-title-v2">${escapeHtml(replacePersonalization(model))}</div>
            <div class="nl-vehicle-price-v2">${escapeHtml(replacePersonalization(price))}</div>

            <!-- 6 Spezifikationen (2 Zeilen x 3 Spalten) -->
            <div class="nl-vehicle-specs-grid">
              <div class="nl-spec-pill">
                ${getVehicleSpecIconSvg('date')}
                <span>${escapeHtml(replacePersonalization(dateVal))}</span>
              </div>
              <div class="nl-spec-pill">
                ${getVehicleSpecIconSvg('mileage')}
                <span>${escapeHtml(replacePersonalization(mileageVal))}</span>
              </div>
              <div class="nl-spec-pill">
                ${getVehicleSpecIconSvg('power')}
                <span>${escapeHtml(replacePersonalization(powerVal))}</span>
              </div>
              <div class="nl-spec-pill">
                ${getVehicleSpecIconSvg('transmission')}
                <span>${escapeHtml(replacePersonalization(transVal))}</span>
              </div>
              <div class="nl-spec-pill">
                ${getVehicleSpecIconSvg('fuel')}
                <span>${escapeHtml(replacePersonalization(fuelVal))}</span>
              </div>
              <div class="nl-spec-pill">
                ${getVehicleSpecIconSvg('drive')}
                <span>${escapeHtml(replacePersonalization(driveVal))}</span>
              </div>
            </div>
          </div>
        </div>`;
      }

      case 'url': {
        const alignClass =
          node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        const displayLabel = node.label || node.url || '%Reset%';
        const targetUrl = node.url || '%Reset%';
        return `        <div class="nl-url-wrap${alignClass}">
          <a href="${escapeAttr(targetUrl)}" target="_blank" rel="noopener noreferrer" class="nl-url-link">${escapeHtml(replacePersonalization(displayLabel))}</a>
        </div>`;
      }

      default:
        return '';
    }
  };

  const renderedContent = nodes.map(renderNodeHtml).join('\n');

  return `<!DOCTYPE html>
<html lang="de" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.subject)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    /* AUTOLINA E-MAIL STYLE GUIDE — RESET & NORMEN */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #F6F6F8;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 150%;
      color: #000000;
      padding: 20px;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Container: 640px gesamt, 600px Inhaltsblöcke */
    .nl-outer-wrapper {
      width: 100%;
      background-color: #F6F6F8;
      padding: 20px 0;
    }

    .nl-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Alle Blöcke: Weisser Hintergrund, 20px Radius, kein Schatten, kein Gradient */
    .nl-block {
      background-color: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* Block 1: HEADER (Padding: 24px) */
    .nl-header-block {
      padding: 24px;
      text-align: center;
    }

    .nl-header-block a {
      text-decoration: none;
      display: inline-block;
    }

    /* Block 2: INHALT (Padding: 32px, innerer Abstand 24px) */
    .nl-content-block {
      padding: 32px;
    }

    .nl-stack {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* TYPOGRAFIE LAUT STYLE GUIDE */
    /* H1: Inter Semi Bold (600), 28px, 120% */
    .nl-title {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 28px;
      font-weight: 600;
      line-height: 120%;
      color: #000000;
      margin: 0;
    }

    /* H2: Inter Semi Bold (600), 20px, auto */
    .nl-heading {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 600;
      line-height: 130%;
      color: #000000;
      margin: 0;
    }

    /* H3: Inter Semi Bold (600), 18px, 130% */
    .nl-subheading {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 18px;
      font-weight: 600;
      line-height: 130%;
      color: #000000;
      margin: 0;
    }

    /* Fliesstext: Inter Regular (400), 16px, 150% */
    .nl-paragraph {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 150%;
      color: #000000;
      margin: 0;
      white-space: pre-line;
    }

    /* Links: #2E3E6C, unterstrichen */
    a, .nl-link {
      color: #2E3E6C;
      text-decoration: underline;
    }

    /* Bilder: Immer border-radius: 12px */
    .nl-graphic {
      text-align: center;
      margin: 0;
    }

    .nl-graphic img, .nl-img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      display: block;
      margin: 0 auto;
    }

    .nl-caption {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 150%;
      color: #666666;
      margin-top: 8px;
      text-align: center;
    }

    /* Listen: Punkt • oder Ziffer 1. / 2. / 3. */
    .nl-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-left: 0;
      margin: 0;
    }

    .nl-list-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 150%;
      color: #000000;
    }

    .nl-bullet {
      color: #2E3E6C;
      font-size: 18px;
      line-height: 1.2;
      flex-shrink: 0;
    }

    .nl-badge-num {
      color: #2E3E6C;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 150%;
      flex-shrink: 0;
    }

    /* 2 Spalten Layout */
    .nl-twocol {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin: 0;
    }

    .nl-twocol-reverse {
      flex-direction: row-reverse;
    }

    .nl-twocol-media {
      flex: 0 0 44%;
      max-width: 44%;
    }

    .nl-twocol-media img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 12px;
      display: block;
    }

    .nl-twocol-body {
      flex: 1;
    }

    .nl-twocol-body h3 {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 18px;
      font-weight: 600;
      line-height: 130%;
      color: #000000;
      margin: 0 0 8px 0;
    }

    .nl-twocol-body p {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 400;
      line-height: 150%;
      color: #000000;
      margin: 0;
      white-space: pre-line;
    }

    /* Buttons */
    .nl-btn {
      display: inline-block;
      background-color: #2E3E6C;
      color: #FFFFFF !important;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 120%;
      padding: 12px 24px;
      border-radius: 12px;
      text-decoration: none !important;
      margin-top: 12px;
      border: 0;
      cursor: pointer;
      text-align: center;
      box-sizing: border-box;
      transition: opacity 0.15s ease;
    }

    .nl-btn:hover {
      opacity: 0.9;
    }

    .nl-btn-wrap {
      margin: 6px 0;
    }

    .nl-btn-center {
      text-align: center;
    }

    .nl-btn-right {
      text-align: right;
    }

    .nl-btn-cta {
      padding: 14px 28px;
    }

    /* URL / Link Baustein: Bold und autolina Dunkelblau #2E3E6C */
    .nl-url-wrap {
      margin: 4px 0;
    }

    .nl-url-link {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 700 !important;
      line-height: 150%;
      color: #2E3E6C !important;
      text-decoration: underline !important;
      word-break: break-all;
    }

    /* Fahrzeugkarte v2 gemäss aktuellem autolina Design (grafik.png) */
    .nl-vehicle-card-v2 {
      background-color: #F4F4F6;
      border: 1px solid #E5E5E8;
      border-radius: 16px;
      overflow: hidden;
      padding: 16px;
      margin: 6px 0;
    }

    .nl-vehicle-media-v2 img {
      width: 100%;
      height: 240px;
      object-fit: cover;
      display: block;
      border-radius: 12px;
    }

    .nl-vehicle-body-v2 {
      padding-top: 14px;
    }

    .nl-vehicle-brand {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #71717A;
      margin-bottom: 2px;
    }

    .nl-vehicle-title-v2 {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 18px;
      font-weight: 700;
      line-height: 130%;
      color: #09090B;
      margin-bottom: 4px;
    }

    .nl-vehicle-price-v2 {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 22px;
      font-weight: 700;
      line-height: 120%;
      color: #09090B;
      margin-bottom: 12px;
    }

    .nl-vehicle-specs-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .nl-spec-pill {
      background-color: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 10px;
      padding: 8px 10px;
      display: inline-flex;
      align-items: center;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #18181B;
      box-sizing: border-box;
      flex: 1 1 calc(33.333% - 8px);
      min-width: 130px;
    }

    /* Fahrzeugkarte laut Style Guide (Probefahrt & Inserate) */
    .nl-vehicle-card {
      background-color: #FFFFFF;
      border: 1px solid #E5E5E8;
      border-radius: 12px;
      overflow: hidden;
      margin: 4px 0;
    }

    .nl-vehicle-media img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    .nl-vehicle-body {
      padding: 20px;
    }

    .nl-vehicle-title {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 18px;
      font-weight: 600;
      line-height: 130%;
      color: #000000;
      margin-bottom: 6px;
    }

    .nl-vehicle-price {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 28px;
      font-weight: 600;
      line-height: 120%;
      color: #000000;
      margin-bottom: 8px;
    }

    .nl-vehicle-meta {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: #666666;
      line-height: 140%;
    }

    /* Grussformel am Ende von Block 2 */
    .nl-closing {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #E5E5E8;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 150%;
      color: #000000;
    }

    .nl-closing p {
      margin: 0;
    }

    /* Block 3: FOOTER (Padding: 32px, innerer Abstand 24px) */
    .nl-footer-block {
      padding: 32px;
      text-align: center;
    }

    .nl-footer-stack {
      display: flex;
      flex-direction: column;
      gap: 24px;
      align-items: center;
    }

    .nl-address-block {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 150%;
      color: #000000;
      text-align: center;
    }

    .nl-address-block a {
      color: #2E3E6C;
      text-decoration: underline;
    }

    .nl-divider {
      width: 100%;
      height: 1px;
      background-color: #E5E5E8;
      border: 0;
      margin: 0;
    }

    .nl-badges-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }

    .nl-badges-wrap a {
      display: inline-block;
      line-height: 0;
      text-decoration: none;
    }

    .nl-badges-wrap img {
      height: 40px;
      width: 135px;
      border-radius: 8px;
      display: inline-block;
      vertical-align: middle;
    }

    .nl-social-wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    .nl-social-link {
      color: #000000;
      text-decoration: none;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      padding: 4px 6px;
    }

    .nl-social-link:hover {
      text-decoration: underline;
    }

    /* Block 4: SICHERHEITSHINWEIS (Dunkelblau #1B4B97, Padding: 24px, Radius: 20px) */
    .nl-security-block {
      background-color: #1B4B97;
      color: #FFFFFF;
      padding: 24px;
      border-radius: 20px;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 150%;
      box-sizing: border-box;
    }

    .nl-security-block strong {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      font-weight: 700;
      color: #FFFFFF;
    }

    .nl-security-block a {
      color: #FFFFFF !important;
      text-decoration: underline !important;
      font-weight: 600;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }

    /* RESPONSIVES VERHALTEN (Mobile bis 620px) */
    @media only screen and (max-width: 620px) {
      body {
        padding: 16px 12px !important;
      }

      .nl-outer-wrapper {
        padding: 12px 0 !important;
      }

      .nl-container {
        width: 100% !important;
        gap: 12px !important;
      }

      .nl-block {
        border-radius: 16px !important;
      }

      .nl-header-block {
        padding: 20px 16px !important;
      }

      .nl-content-block {
        padding: 24px 16px !important;
      }

      .nl-footer-block {
        padding: 24px 16px !important;
      }

      .nl-security-block {
        padding: 20px 16px !important;
        border-radius: 16px !important;
      }

      .nl-twocol {
        flex-direction: column !important;
        gap: 14px !important;
      }

      .nl-twocol-reverse {
        flex-direction: column !important;
      }

      .nl-twocol-media {
        flex: 0 0 100% !important;
        max-width: 100% !important;
      }

      .nl-twocol-media img {
        height: auto !important;
        max-height: 200px !important;
      }

      .nl-badges-wrap {
        flex-direction: column !important;
        width: 100% !important;
      }

      .nl-badges-wrap a {
        display: block !important;
        width: 100% !important;
        max-width: 200px !important;
      }

      .nl-social-wrap {
        flex-direction: column !important;
        gap: 6px !important;
      }

      .nl-social-divider {
        display: none !important;
      }

      .nl-title {
        font-size: 24px !important;
      }

      .nl-heading {
        font-size: 18px !important;
      }

      .nl-vehicle-media img {
        height: 180px !important;
      }

      .nl-vehicle-price {
        font-size: 24px !important;
      }

      .nl-vehicle-media-v2 img {
        height: 190px !important;
      }

      .nl-spec-pill {
        flex: 1 1 calc(50% - 6px) !important;
        min-width: 110px !important;
        padding: 6px 8px !important;
        font-size: 11px !important;
      }
    }
  </style>
</head>
<body>
  <!-- Preheader Text (unsichtbar) -->
  <div style="display:none;font-size:1px;color:#F6F6F8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(meta.preheader)}
  </div>

  <div class="nl-outer-wrapper">
    <div class="nl-container">

      <!-- BLOCK 1: HEADER (Weisser Hintergrund, 24px Padding, 20px Radius) -->
      <div class="nl-block nl-header-block">
        <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer">
          ${getAutolinaLogoSvg(172, 38)}
        </a>
      </div>

      <!-- BLOCK 2: INHALT (Weisser Hintergrund, 32px Padding, 20px Radius, 24px Abstand) -->
      <div class="nl-block nl-content-block">
        <div class="nl-stack">
${renderedContent}
        </div>

        <!-- Feste Grussformel gemäss Style Guide (Abschnitt 4) -->
        <div class="nl-closing">
          <p>Liebe Grüsse,<br />Dein autolina Team</p>
        </div>
      </div>

      <!-- BLOCK 3: FOOTER (Weisser Hintergrund, 32px Padding, 20px Radius, 24px Abstand) -->
      <div class="nl-block nl-footer-block">
        <div class="nl-footer-stack">
          <!-- 1. autolina-Logo (zentriert) -->
          <div>
            <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer">
              ${getAutolinaLogoSvg(150, 32)}
            </a>
          </div>

          <!-- 2. Adressblock (zentriert) -->
          <div class="nl-address-block">
            autolina.ch ag<br />
            Bahnhofstrasse 24c<br />
            8570 Weinfelden, Schweiz<br />
            <a href="mailto:service@autolina.ch">service@autolina.ch</a><br />
            <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer">www.autolina.ch</a>
          </div>

          <!-- 3. Trennlinie (#E5E5E8, 1px) -->
          <div class="nl-divider"></div>

          <!-- 4. App-Store-Badges (nebeneinander, zentriert, stacken responsive) -->
          <div class="nl-badges-wrap">
            ${getAppleBadgeSvgLink(120, 40)}
            ${getGooglePlayBadgeSvgLink(135, 40)}
          </div>

          <!-- 5. Trennlinie (#E5E5E8, 1px) -->
          <div class="nl-divider"></div>

          <!-- 6. Social-Media-Links (nebeneinander, zentriert, Icons + Text) -->
          <div class="nl-social-wrap">
            ${getSocialMediaLinksHtml()}
          </div>
        </div>
      </div>

      ${
        company.showSecurityNotice !== false
          ? `<!-- BLOCK 4: SICHERHEITSHINWEIS (Dunkelblau #1B4B97, 24px Padding, 20px Radius) -->
      <div class="nl-security-block">
        <p><strong>Vorsicht vor Betrügern:</strong> autolina würde Sie nie nach Ihrem Passwort oder persönlichen Daten fragen oder Sie auffordern, diese zu ändern. Sollten Sie eine E-Mail mit einer entsprechenden Aufforderung erhalten, bitten wir Sie, die betreffende E-Mail zu ignorieren und umgehend unseren Support unter <a href="mailto:service@autolina.ch">service@autolina.ch</a> zu kontaktieren.</p>
      </div>`
          : ''
      }

    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatInlineLinks(text: string): string {
  if (!text) return '';
  // Convert email addresses to clickable mailto links
  let formatted = text.replace(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    '<a href="mailto:$1" style="color:#2E3E6C;text-decoration:underline;">$1</a>'
  );
  // Convert standalone web urls (http/https or www.)
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+|www\.[^\s]+)/gi,
    (match) => {
      const href = match.startsWith('www.') ? `https://${match}` : match;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#2E3E6C;text-decoration:underline;">${match}</a>`;
    }
  );
  return formatted;
}
