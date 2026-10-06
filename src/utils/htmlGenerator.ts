import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';
import {
  AUTOLINA_LIVE_LOGO_PNG,
  getSocialMediaLinksHtml,
  formatPlaceholderTag,
  isPlaceholderGraphic,
} from './autolinaAssets';

/**
 * Generiert 100% E-Mail-Client-kompatibles HTML gemäss Industriestandards (Litmus, Campaign Monitor, Email on Acid).
 * 
 * Behebt Darstellungsfehler in:
 * - Microsoft Outlook (2013-2021, Office 365, Desktop Windows/Mac, Outlook Web App)
 * - Gmail (Webmail, iOS App, Android App, Google Workspace)
 * - Apple Mail (iOS, iPadOS, macOS)
 * - Yahoo Mail, GMX, Web.de, Thunderbird, Bluewin
 * 
 * Massnahmen zur Fehlerbehebung gemäss Support-Analyse:
 * 1. Keine Inline-SVGs: SVGs werden von Gmail und Outlook gestrippt oder blockiert. Spezifikationen und Icons werden über bulletproof HTML & Web-Safe Typografie gelöst.
 * 2. Vollständige bgcolor-Attribute: Outlook ignoriert CSS background-color auf <td>, wenn bgcolor fehlt. Alle Kartenblöcke (#FFFFFF) und Platzhalter (#F4F4F6) besitzen nun explizite bgcolor-Attribute.
 * 3. Robuster Web-Safe Font-Stack: Outlook besitzt einen bekannten Bug, bei dem 'Inter' in Times New Roman umgewandelt wird. Durch Arial/Helvetica als primären Fallback und MSO-Stylesheets wird die Schriftart in allen Clients konsistent dargestellt.
 * 4. Feste Pixel-Dimensionen für Bilder: Badges und Grafiken haben explizite Breiten und Höhen (width="120" height="40"), um eine 646px-Skalierung im Outlook Word-Renderer zu verhindern.
 * 5. Tabellen-basiertes 2-Spalten-Layout: Statt anfälliger inline-block Divs mit max-width (die Gmail Desktop oft umbricht) werden fluide Hybrid-Tabellen (align="left" / align="right") verwendet.
 * 6. 4:3-Platzhalterboxen mit fixierter Höhe und zentriertem Text für den %% bezeichnung%% Platzhalter.
 */
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
        const align = node.align || 'left';
        return `            <!-- TITEL -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <h1 class="nl-font nl-h1" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:bold;line-height:125%;color:#000000;text-align:${align};letter-spacing:-0.5px;">${escapeHtml(replacePersonalization(node.text))}</h1>
              </td>
            </tr>`;
      }

      case 'heading': {
        const align = node.align || 'left';
        return `            <!-- UNTERÜBERSCHRIFT -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <h2 class="nl-font nl-h2" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;line-height:130%;color:#000000;text-align:${align};">${escapeHtml(replacePersonalization(node.text))}</h2>
              </td>
            </tr>`;
      }

      case 'paragraph': {
        const align = node.align || 'left';
        const rawText = escapeHtml(replacePersonalization(node.text));
        const formattedText = formatInlineLinks(rawText);
        return `            <!-- FLIESSTEXT -->
            <tr>
              <td align="${align}" style="padding:0;text-align:${align};">
                <p class="nl-font nl-body" style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:150%;color:#000000;white-space:pre-line;text-align:${align};">${formattedText}</p>
              </td>
            </tr>`;
      }

      case 'graphic': {
        const captionHtml = node.caption
          ? `\n                <p class="nl-font" style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;color:#666666;text-align:center;">${escapeHtml(node.caption)}</p>`
          : '';
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);
        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Bild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;margin:0 auto;">
                  <tr>
                    <td align="center" valign="middle" height="402" bgcolor="#F4F4F6" style="height:402px;background-color:#F4F4F6;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:24px;">
                      <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#64748B;letter-spacing:0.5px;display:inline-block;">${escapeHtml(placeholderTag)}</span>
                    </td>
                  </tr>
                </table>`;
        } else {
          const imgTag = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || 'Grafik')}" width="536" border="0" style="display:block;width:100%;max-width:536px;height:auto;border-radius:12px;border:0;outline:none;text-decoration:none;margin:0 auto;" />`;
          mediaHtml = node.linkUrl
            ? `<a href="${escapeAttr(node.linkUrl)}" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:block;border:0;">${imgTag}</a>`
            : imgTag;
        }

        return `            <!-- GRAFIK (4:3 PLATZHALTER ODER BILD) -->
            <tr>
              <td align="center" style="padding:0;text-align:center;">
                ${mediaHtml}${captionHtml}
              </td>
            </tr>`;
      }

      case 'bullet_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item) =>
              `                  <tr>
                    <td width="20" valign="top" style="width:20px;padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:150%;color:#2E3E6C;text-align:left;">&bull;</td>
                    <td valign="top" class="nl-font" style="padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;color:#000000;text-align:left;">${formatInlineLinks(
                      escapeHtml(replacePersonalization(item))
                    )}</td>
                  </tr>`
          )
          .join('\n');

        return `            <!-- AUFZÄHLUNG (BULLET POINTS) -->
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
${items}
                </table>
              </td>
            </tr>`;
      }

      case 'numbered_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item, idx) =>
              `                  <tr>
                    <td width="28" valign="top" class="nl-font" style="width:28px;padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:150%;color:#2E3E6C;text-align:left;">${idx + 1}.</td>
                    <td valign="top" class="nl-font" style="padding:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;color:#000000;text-align:left;">${formatInlineLinks(
                      escapeHtml(replacePersonalization(item))
                    )}</td>
                  </tr>`
          )
          .join('\n');

        return `            <!-- NUMMERIERTE LISTE -->
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
${items}
                </table>
              </td>
            </tr>`;
      }

      case 'two_col_left_graphic': {
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);
        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Bild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" valign="middle" height="180" bgcolor="#F4F4F6" style="height:180px;background-color:#F4F4F6;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:16px;">
                          <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#64748B;">${escapeHtml(placeholderTag)}</span>
                        </td>
                      </tr>
                    </table>`;
        } else {
          mediaHtml = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" width="240" border="0" style="display:block;width:100%;max-width:240px;height:auto;border-radius:12px;border:0;outline:none;" />`;
        }

        const btnHtml = node.buttonText
          ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td bgcolor="#2E3E6C" style="background-color:#2E3E6C;border-radius:12px;padding:10px 20px;">
                          <a href="${escapeAttr(node.buttonUrl || '#')}" target="_blank" rel="noopener noreferrer" class="nl-font" style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;line-height:120%;text-decoration:none;display:inline-block;">${escapeHtml(node.buttonText)}</a>
                        </td>
                      </tr>
                    </table>`
          : '';

        return `            <!-- 2 SPALTEN (BILD LINKS) FLUID HYBRID -->
            <tr>
              <td style="padding:0;">
                <!--[if (gte mso 9)|(IE)]>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                <td width="240" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-left" align="left" width="240" cellpadding="0" cellspacing="0" border="0" style="width:240px;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      ${mediaHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                <td width="20" style="width:20px;font-size:1px;">&nbsp;</td>
                <td width="276" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-right" align="right" width="276" cellpadding="0" cellspacing="0" border="0" style="width:276px;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      <h3 class="nl-font" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#000000;">
                        ${escapeHtml(replacePersonalization(node.heading))}
                      </h3>
                      <p class="nl-font" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:150%;color:#000000;">
                        ${formatInlineLinks(escapeHtml(replacePersonalization(node.paragraph)))}
                      </p>
                      ${btnHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>`;
      }

      case 'two_col_right_graphic': {
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);
        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Bild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" valign="middle" height="180" bgcolor="#F4F4F6" style="height:180px;background-color:#F4F4F6;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:16px;">
                          <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#64748B;">${escapeHtml(placeholderTag)}</span>
                        </td>
                      </tr>
                    </table>`;
        } else {
          mediaHtml = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" width="240" border="0" style="display:block;width:100%;max-width:240px;height:auto;border-radius:12px;border:0;outline:none;" />`;
        }

        const btnHtml = node.buttonText
          ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                      <tr>
                        <td bgcolor="#2E3E6C" style="background-color:#2E3E6C;border-radius:12px;padding:10px 20px;">
                          <a href="${escapeAttr(node.buttonUrl || '#')}" target="_blank" rel="noopener noreferrer" class="nl-font" style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;line-height:120%;text-decoration:none;display:inline-block;">${escapeHtml(node.buttonText)}</a>
                        </td>
                      </tr>
                    </table>`
          : '';

        return `            <!-- 2 SPALTEN (BILD RECHTS) FLUID HYBRID -->
            <tr>
              <td style="padding:0;">
                <!--[if (gte mso 9)|(IE)]>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                <td width="276" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-right" align="left" width="276" cellpadding="0" cellspacing="0" border="0" style="width:276px;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      <h3 class="nl-font" style="margin:0 0 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#000000;">
                        ${escapeHtml(replacePersonalization(node.heading))}
                      </h3>
                      <p class="nl-font" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:150%;color:#000000;">
                        ${formatInlineLinks(escapeHtml(replacePersonalization(node.paragraph)))}
                      </p>
                      ${btnHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                <td width="20" style="width:20px;font-size:1px;">&nbsp;</td>
                <td width="240" valign="top">
                <![endif]-->
                <table role="presentation" class="nl-col-left" align="right" width="240" cellpadding="0" cellspacing="0" border="0" style="width:240px;max-width:100%;border-collapse:collapse;">
                  <tr>
                    <td valign="top" style="padding:0 0 16px 0;">
                      ${mediaHtml}
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>`;
      }

      case 'button_cta': {
        const align = node.align || 'left';
        return `            <!-- AKTIONSBUTTON (CTA) BULLETPROOF -->
            <tr>
              <td align="${align}" style="padding:6px 0;text-align:${align};">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${align}" style="border-collapse:separate;margin:${align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0'};">
                  <tr>
                    <td align="center" bgcolor="#2E3E6C" style="background-color:#2E3E6C;border-radius:12px;padding:14px 28px;">
                      <a href="${escapeAttr(node.url || '#')}" target="_blank" rel="noopener noreferrer" class="nl-font" style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:120%;text-decoration:none;display:inline-block;letter-spacing:0.2px;">${escapeHtml(node.label)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`;
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
        const isPlaceholder = isPlaceholderGraphic(node.imageUrl);

        let mediaHtml = '';
        if (isPlaceholder) {
          const placeholderTag = formatPlaceholderTag(node.imageUrl, 'Fahrzeugbild');
          mediaHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                      <tr>
                        <td align="center" valign="middle" height="378" bgcolor="#EFEFF2" style="height:378px;background-color:#EFEFF2;border:1px dashed #CBD5E1;border-radius:12px;text-align:center;padding:24px;">
                          <span class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#64748B;letter-spacing:0.5px;display:inline-block;">${escapeHtml(placeholderTag)}</span>
                        </td>
                      </tr>
                    </table>`;
        } else {
          mediaHtml = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || model)}" width="504" border="0" style="display:block;width:100%;max-width:504px;height:auto;border-radius:12px;border:0;outline:none;" />`;
        }

        return `            <!-- FAHRZEUGKARTE (100% E-MAIL CLIENT KOMPATIBEL) -->
            <tr>
              <td style="padding:0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F4F4F6" style="background-color:#F4F4F6;border:1px solid #E5E5E8;border-radius:16px;border-collapse:separate;width:100%;">
                  <tr>
                    <td style="padding:16px;">
                      <!-- 1. Fahrzeug-Bild -->
                      ${mediaHtml}
                      
                      <!-- 2. Marke, Modell & Preis -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;">
                        <tr>
                          <td class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:500;color:#71717A;line-height:130%;padding-bottom:2px;">
                            ${escapeHtml(replacePersonalization(brand))}
                          </td>
                        </tr>
                        <tr>
                          <td class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;line-height:130%;color:#09090B;padding-bottom:4px;">
                            ${escapeHtml(replacePersonalization(model))}
                          </td>
                        </tr>
                        <tr>
                          <td class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;line-height:120%;color:#09090B;padding-bottom:12px;">
                            ${escapeHtml(replacePersonalization(price))}
                          </td>
                        </tr>
                      </table>

                      <!-- 3. 6 Spezifikationen (2 Reihen x 3 Spalten mit sauberem Fallback ohne anfällige Inline-SVGs) -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;">
                        <tr>
                          <!-- Datum -->
                          <td width="31%" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;padding:8px 10px;text-align:left;">
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#71717A;line-height:13px;margin-bottom:3px;font-weight:500;">Datum</div>
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#18181B;font-weight:bold;line-height:16px;">${escapeHtml(replacePersonalization(dateVal))}</div>
                          </td>
                          <td width="3%" style="width:3%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <!-- KM -->
                          <td width="31%" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;padding:8px 10px;text-align:left;">
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#71717A;line-height:13px;margin-bottom:3px;font-weight:500;">Kilometer</div>
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#18181B;font-weight:bold;line-height:16px;">${escapeHtml(replacePersonalization(mileageVal))}</div>
                          </td>
                          <td width="3%" style="width:3%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <!-- PS -->
                          <td width="31%" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;padding:8px 10px;text-align:left;">
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#71717A;line-height:13px;margin-bottom:3px;font-weight:500;">Leistung</div>
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#18181B;font-weight:bold;line-height:16px;">${escapeHtml(replacePersonalization(powerVal))}</div>
                          </td>
                        </tr>
                        <tr>
                          <td height="8" colspan="5" style="height:8px;font-size:1px;line-height:8px;">&nbsp;</td>
                        </tr>
                        <tr>
                          <!-- Schaltung -->
                          <td width="31%" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;padding:8px 10px;text-align:left;">
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#71717A;line-height:13px;margin-bottom:3px;font-weight:500;">Getriebe</div>
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#18181B;font-weight:bold;line-height:16px;">${escapeHtml(replacePersonalization(transVal))}</div>
                          </td>
                          <td width="3%" style="width:3%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <!-- Energie -->
                          <td width="31%" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;padding:8px 10px;text-align:left;">
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#71717A;line-height:13px;margin-bottom:3px;font-weight:500;">Treibstoff</div>
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#18181B;font-weight:bold;line-height:16px;">${escapeHtml(replacePersonalization(fuelVal))}</div>
                          </td>
                          <td width="3%" style="width:3%;font-size:1px;line-height:1px;">&nbsp;</td>
                          <!-- Antrieb -->
                          <td width="31%" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;padding:8px 10px;text-align:left;">
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#71717A;line-height:13px;margin-bottom:3px;font-weight:500;">Antrieb</div>
                            <div class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#18181B;font-weight:bold;line-height:16px;">${escapeHtml(replacePersonalization(driveVal))}</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`;
      }

      case 'url': {
        const align = node.align || 'left';
        const displayLabel = node.label || node.url || '%Reset%';
        const targetUrl = node.url || '%Reset%';
        return `            <!-- URL / LINK -->
            <tr>
              <td align="${align}" style="padding:4px 0;text-align:${align};">
                <a href="${escapeAttr(targetUrl)}" target="_blank" rel="noopener noreferrer" class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:150%;color:#2E3E6C;text-decoration:underline;word-break:break-all;">${escapeHtml(replacePersonalization(displayLabel))}</a>
              </td>
            </tr>`;
      }

      default:
        return '';
    }
  };

  // Zusammenbau der Content-Knoten mit präzisem 24px Zeilenabstand (Spacern)
  const nodeRowsWithSpacers = nodes
    .map((node, index) => {
      const rendered = renderNodeHtml(node);
      if (index < nodes.length - 1) {
        return `${rendered}
            <!-- 24px ABSTAND ZWISCHEN DEN ELEMENTEN -->
            <tr>
              <td height="24" style="height:24px;line-height:24px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
            </tr>`;
      }
      return rendered;
    })
    .join('\n');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="de">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(meta.subject)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style type="text/css">
    body, table, td, p, a, li, blockquote, h1, h2, h3, h4, h5, h6, span, strong, b {
      font-family: Arial, Helvetica, sans-serif !important;
    }
  </style>
  <![endif]-->
  <style type="text/css">
    /* Globale E-Mail-Client Resets */
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      border-collapse: collapse;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: #F6F6F8 !important;
      font-family: Arial, Helvetica, sans-serif;
    }
    a {
      text-decoration: underline;
      color: #2E3E6C;
    }
    /* Web Font progressive enhancement für moderne Clients */
    @media screen {
      .nl-font {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
      }
    }
    /* Mobile Responsive Optimierungen */
    @media only screen and (max-width: 620px) {
      .nl-outer-table {
        padding: 10px 4px !important;
      }
      .nl-container-table {
        width: 100% !important;
        max-width: 100% !important;
      }
      .nl-card-block {
        padding: 20px 16px !important;
        border-radius: 16px !important;
      }
      .nl-card-header {
        padding: 18px 16px !important;
        border-radius: 16px !important;
      }
      .nl-col-left, .nl-col-right {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
      }
      .nl-h1 {
        font-size: 24px !important;
        line-height: 125% !important;
      }
      .nl-h2 {
        font-size: 18px !important;
        line-height: 130% !important;
      }
      .nl-body {
        font-size: 15px !important;
        line-height: 150% !important;
      }
    }
  </style>
</head>
<body bgcolor="#F6F6F8" style="margin:0;padding:0;background-color:#F6F6F8;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
  <!-- Preheader Text (unsichtbar im Textkörper, sichtbar in Posteingangsliste) -->
  <div style="display:none;font-size:1px;color:#F6F6F8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${escapeHtml(meta.preheader)}
    ${'&zwnj;&nbsp;'.repeat(30)}
  </div>

  <!-- AUSSEN-TABELLE: 100% Helles Grau #F6F6F8 mit bgcolor -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#F6F6F8" class="nl-outer-table" style="width:100%;background-color:#F6F6F8;margin:0;padding:20px 0;table-layout:fixed;">
    <tr>
      <td align="center" bgcolor="#F6F6F8" style="background-color:#F6F6F8;padding:12px 10px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
        <tr>
        <td align="center" valign="top" width="600" style="width:600px;">
        <![endif]-->
        
        <!-- INNEN-CONTAINER: Max 600px Inhaltsbreite gemäss Style Guide -->
        <table role="presentation" class="nl-container-table" align="center" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;width:100%;margin:0 auto;border-collapse:separate;">

          <!-- ================= BLOCK 1: HEADER ================= -->
          <tr>
            <td class="nl-card-header" align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E5E5E8;padding:24px;text-align:center;">
              <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;">
                <img src="${AUTOLINA_LIVE_LOGO_PNG}" alt="autolina.ch" width="172" height="38" border="0" style="display:block;margin:0 auto;border:0;width:172px;height:38px;outline:none;text-decoration:none;" />
              </a>
            </td>
          </tr>

          <!-- 16px ABSTAND -->
          <tr>
            <td height="16" style="height:16px;line-height:16px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
          </tr>

          <!-- ================= BLOCK 2: INHALT ================= -->
          <tr>
            <td class="nl-card-block" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E5E5E8;padding:32px;text-align:left;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
${nodeRowsWithSpacers}
              </table>

              <!-- Feste Grussformel am Ende des Inhaltsblocks -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:28px;border-top:1px solid #E5E5E8;">
                <tr>
                  <td class="nl-font" style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:150%;color:#000000;text-align:left;">
                    Liebe Gr&uuml;sse,<br />Dein autolina Team
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 16px ABSTAND -->
          <tr>
            <td height="16" style="height:16px;line-height:16px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
          </tr>

          <!-- ================= BLOCK 3: FOOTER ================= -->
          <tr>
            <td class="nl-card-block" align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border-radius:20px;border:1px solid #E5E5E8;padding:32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                <!-- 1. autolina Logo -->
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;">
                      <img src="${AUTOLINA_LIVE_LOGO_PNG}" alt="autolina.ch" width="150" height="33" border="0" style="display:block;margin:0 auto;border:0;width:150px;height:33px;outline:none;text-decoration:none;" />
                    </a>
                  </td>
                </tr>

                <!-- 2. Adressblock -->
                <tr>
                  <td align="center" class="nl-font" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;color:#000000;padding-bottom:20px;text-align:center;">
                    autolina.ch ag<br />
                    Bahnhofstrasse 24c<br />
                    8570 Weinfelden, Schweiz<br />
                    <a href="mailto:service@autolina.ch" style="color:#2E3E6C;text-decoration:underline;">service@autolina.ch</a><br />
                    <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer" style="color:#2E3E6C;text-decoration:underline;">www.autolina.ch</a>
                  </td>
                </tr>

                <!-- 3. Trennlinie -->
                <tr>
                  <td style="padding-bottom:20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-top:1px solid #E5E5E8;font-size:1px;line-height:1px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 4. App Store & Google Play Badges mit exakten Breiten gegen Outlook-Verzerrung -->
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" valign="middle" style="padding:0 6px;">
                          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;">
                            <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/de-de?size=250x83" alt="Laden im App Store" width="120" height="40" border="0" style="display:block;width:120px;height:40px;border:0;border-radius:8px;outline:none;text-decoration:none;" />
                          </a>
                        </td>
                        <td align="center" valign="middle" style="padding:0 6px;">
                          <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;border:0;">
                            <img src="https://play.google.com/intl/en_us/badges/static/images/badges/de_badge_web_generic.png" alt="Jetzt bei Google Play" width="135" height="40" border="0" style="display:block;width:135px;height:40px;border:0;border-radius:8px;outline:none;text-decoration:none;" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 5. Trennlinie -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-top:1px solid #E5E5E8;font-size:1px;line-height:1px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- 6. Social Media Links (100% E-Mail Tabellen-Layout) -->
                <tr>
                  <td align="center">
                    ${getSocialMediaLinksHtml()}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            company.showSecurityNotice !== false
              ? `<!-- 16px ABSTAND -->
          <tr>
            <td height="16" style="height:16px;line-height:16px;font-size:1px;mso-line-height-rule:exactly;">&nbsp;</td>
          </tr>

          <!-- ================= BLOCK 4: SICHERHEITSHINWEIS ================= -->
          <tr>
            <td align="left" bgcolor="#1B4B97" style="background-color:#1B4B97;border-radius:20px;border:1px solid #163E7D;padding:24px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:150%;">
              <p class="nl-font" style="margin:0;padding:0;color:#FFFFFF;font-size:14px;line-height:150%;">
                <strong style="color:#FFFFFF;font-weight:bold;">Vorsicht vor Betr&uuml;gern:</strong> autolina w&uuml;rde Sie nie nach Ihrem Passwort oder pers&ouml;nlichen Daten fragen oder Sie auffordern, diese zu &auml;ndern. Sollten Sie eine E-Mail mit einer entsprechenden Aufforderung erhalten, bitten wir Sie, die betreffende E-Mail zu ignorieren und umgehend unseren Support unter <a href="mailto:service@autolina.ch" style="color:#FFFFFF;text-decoration:underline;font-weight:bold;">service@autolina.ch</a> zu kontaktieren.
              </p>
            </td>
          </tr>`
              : ''
          }

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
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
  // E-Mail-Adressen klickbar machen
  let formatted = text.replace(
    /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
    '<a href="mailto:$1" style="color:#2E3E6C;text-decoration:underline;">$1</a>'
  );
  // Web-URLs klickbar machen
  formatted = formatted.replace(
    /(https?:\/\/[^\s]+|www\.[^\s]+)/gi,
    (match) => {
      const href = match.startsWith('www.') ? `https://${match}` : match;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#2E3E6C;text-decoration:underline;">${match}</a>`;
    }
  );
  return formatted;
}

