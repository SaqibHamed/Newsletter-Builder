import { CompanySettings, NewsletterMeta, NewsletterNode } from '../types';

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
        const alignClass = node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        return `      <h1 class="nl-title${alignClass}">${escapeHtml(replacePersonalization(node.text))}</h1>`;
      }

      case 'heading': {
        const alignClass = node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        return `      <h2 class="nl-heading${alignClass}">${escapeHtml(replacePersonalization(node.text))}</h2>`;
      }

      case 'paragraph': {
        const alignClass = node.align === 'center' ? ' text-center' : node.align === 'right' ? ' text-right' : '';
        const text = escapeHtml(replacePersonalization(node.text));
        return `      <p class="nl-paragraph${alignClass}">${text}</p>`;
      }

      case 'graphic': {
        const captionHtml = node.caption
          ? `\n        <p class="nl-caption">${escapeHtml(node.caption)}</p>`
          : '';
        const imgTag = `<img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || 'Grafik')}" />`;
        const wrapped = node.linkUrl
          ? `<a href="${escapeAttr(node.linkUrl)}" target="_blank" rel="noopener noreferrer">${imgTag}</a>`
          : imgTag;

        return `      <div class="nl-graphic">
        ${wrapped}${captionHtml}
      </div>`;
      }

      case 'bullet_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item) =>
              `        <li class="nl-list-item"><span class="nl-bullet">•</span><span>${escapeHtml(
                replacePersonalization(item)
              )}</span></li>`
          )
          .join('\n');

        return `      <ul class="nl-list">\n${items}\n      </ul>`;
      }

      case 'numbered_list': {
        const items = node.items
          .filter((item) => item.trim().length > 0)
          .map(
            (item, idx) =>
              `        <li class="nl-list-item"><span class="nl-badge-num">${idx + 1}</span><span>${escapeHtml(
                replacePersonalization(item)
              )}</span></li>`
          )
          .join('\n');

        return `      <ol class="nl-list">\n${items}\n      </ol>`;
      }

      case 'two_col_left_graphic': {
        const btnHtml = node.buttonText
          ? `\n          <a href="${escapeAttr(node.buttonUrl || '#')}" class="nl-btn">${escapeHtml(
              node.buttonText
            )}</a>`
          : '';

        return `      <div class="nl-twocol">
        <div class="nl-twocol-media">
          <img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" />
        </div>
        <div class="nl-twocol-body">
          <h3>${escapeHtml(replacePersonalization(node.heading))}</h3>
          <p>${escapeHtml(replacePersonalization(node.paragraph))}</p>${btnHtml}
        </div>
      </div>`;
      }

      case 'two_col_right_graphic': {
        const btnHtml = node.buttonText
          ? `\n          <a href="${escapeAttr(node.buttonUrl || '#')}" class="nl-btn">${escapeHtml(
              node.buttonText
            )}</a>`
          : '';

        return `      <div class="nl-twocol nl-twocol-reverse">
        <div class="nl-twocol-media">
          <img src="${escapeAttr(node.imageUrl)}" alt="${escapeAttr(node.altText || '')}" />
        </div>
        <div class="nl-twocol-body">
          <h3>${escapeHtml(replacePersonalization(node.heading))}</h3>
          <p>${escapeHtml(replacePersonalization(node.paragraph))}</p>${btnHtml}
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
        return `      <div class="nl-btn-wrap${alignClass}">
        <a href="${escapeAttr(node.url || '#')}" class="nl-btn nl-btn-cta">${escapeHtml(node.label)}</a>
      </div>`;
      }

      default:
        return '';
    }
  };

  const renderedContent = nodes.map(renderNodeHtml).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.subject)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #E4E4E4;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: #000000;
      padding: 32px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .nl-container {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .nl-card {
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
    }

    .nl-logo-card {
      padding: 20px;
      text-align: center;
    }

    .nl-logo-card img {
      height: 36px;
      width: auto;
      max-width: 100%;
      display: inline-block;
      vertical-align: middle;
    }

    .nl-content-card {
      padding: 36px 32px;
    }

    .nl-stack {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .nl-title {
      font-family: 'Poppins', sans-serif;
      font-size: 26px;
      font-weight: 700;
      line-height: 1.25;
      color: #000000;
    }

    .nl-heading {
      font-family: 'Poppins', sans-serif;
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4;
      color: #000000;
    }

    .nl-paragraph {
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.6;
      color: #000000;
      white-space: pre-line;
    }

    .nl-graphic {
      text-align: center;
      margin: 4px 0;
    }

    .nl-graphic img {
      width: 100%;
      height: auto;
      border-radius: 12px;
      display: block;
    }

    .nl-caption {
      font-size: 12px;
      color: #6b7280;
      margin-top: 6px;
      text-align: center;
    }

    .nl-twocol {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin: 6px 0;
    }

    .nl-twocol-reverse {
      flex-direction: row-reverse;
    }

    .nl-twocol-media {
      flex: 0 0 42%;
      max-width: 42%;
    }

    .nl-twocol-media img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 12px;
      display: block;
    }

    .nl-twocol-body {
      flex: 1;
    }

    .nl-twocol-body h3 {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 700;
      line-height: 1.35;
      color: #000000;
      margin-bottom: 6px;
    }

    .nl-twocol-body p {
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #000000;
      white-space: pre-line;
    }

    .nl-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-left: 2px;
      margin: 4px 0;
    }

    .nl-list-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 15px;
      line-height: 1.6;
      color: #000000;
    }

    .nl-bullet {
      color: #1B4B97;
      font-size: 18px;
      line-height: 1;
      padding-top: 2px;
      flex-shrink: 0;
    }

    .nl-badge-num {
      background-color: #1B4B97;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 600;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .nl-btn {
      display: inline-block;
      background-color: #1B4B97;
      color: #FFFFFF !important;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      padding: 12px 24px;
      border-radius: 12px;
      text-decoration: none;
      margin-top: 10px;
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
      margin: 10px 0;
    }

    .nl-btn-center {
      text-align: center;
    }

    .nl-btn-right {
      text-align: right;
    }

    .nl-btn-cta {
      /* Exakt einheitliche Grösse und einheitlicher Schriftstil für alle Buttons */
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.3;
      padding: 12px 24px;
      border-radius: 12px;
    }

    .nl-closing {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #F4F4F5;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: #000000;
    }

    .nl-closing p {
      margin-bottom: 12px;
    }

    .nl-closing strong {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }

    .nl-closing a {
      color: #1B4B97;
      text-decoration: none;
      font-weight: 500;
    }

    .nl-security-card {
      background-color: #1B4B97;
      color: #FFFFFF;
      padding: 20px 24px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      line-height: 1.6;
    }

    .nl-security-card strong {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      color: #FFFFFF;
    }

    .nl-security-card a {
      color: #FFFFFF;
      text-decoration: underline;
      font-weight: 600;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }

    @media (max-width: 620px) {
      body {
        padding: 16px 12px;
      }
      .nl-content-card {
        padding: 24px 20px;
      }
      .nl-twocol {
        flex-direction: column !important;
      }
      .nl-twocol-media {
        flex: 0 0 100%;
        max-width: 100%;
      }
      .nl-twocol-media img {
        height: auto;
        max-height: 200px;
      }
    }
  </style>
</head>
<body>
  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#E4E4E4;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${escapeHtml(meta.preheader)}
  </div>

  <div class="nl-container">
    <!-- Fixed Logo Box -->
    <div class="nl-card nl-logo-card">
      <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer">
        <img src="https://www.autolina.ch/media/logo.64af33af2b4aa46a.svg" alt="autolina.ch" />
      </a>
    </div>

    <!-- Main Content Box -->
    <div class="nl-card nl-content-card">
      <div class="nl-stack">
${renderedContent}
      </div>

      <!-- Fixed Closing Signature -->
      <div class="nl-closing">
        <p>Liebe Grüsse,<br />Dein autolina Team</p>
        <p>
          <strong>autolina.ch AG</strong><br />
          8570 Weinfelden<br />
          <a href="https://www.autolina.ch" target="_blank" rel="noopener noreferrer">www.autolina.ch</a>
        </p>
      </div>
    </div>

    <!-- Fixed Blue Security Notice Box -->
    <div class="nl-card nl-security-card">
      <strong>Vorsicht vor Betrügern:</strong> autolina würde Sie nie nach Ihrem Passwort oder persönlichen Daten fragen oder Sie auffordern, diese zu ändern. Sollten Sie eine E-Mail mit einer entsprechenden Aufforderung erhalten, bitten wir Sie, die betreffende E-Mail zu ignorieren und umgehend unseren Support unter <a href="mailto:service@autolina.ch">service@autolina.ch</a> zu kontaktieren.
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
