const MAX_CHARS = 150;

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseBoldSegments(text) {
  const segments = [];
  let lastIndex = 0;
  const regex = /\*\*(.+?)\*\*/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bold: false });
  }

  return segments;
}

function renderMarkdownHtml(text) {
  return parseBoldSegments(text)
    .map((segment) => {
      const escaped = escapeHtml(segment.text);
      return segment.bold ? `<strong>${escaped}</strong>` : escaped;
    })
    .join("");
}

function truncateMarkdownHtml(text, maxChars) {
  const segments = parseBoldSegments(text);
  let chars = 0;
  let html = "";

  for (const segment of segments) {
    const remaining = maxChars - chars;
    if (remaining <= 0) {
      break;
    }

    if (segment.text.length <= remaining) {
      const escaped = escapeHtml(segment.text);
      html += segment.bold ? `<strong>${escaped}</strong>` : escaped;
      chars += segment.text.length;
      continue;
    }

    const escaped = escapeHtml(segment.text.slice(0, remaining));
    html += segment.bold ? `<strong>${escaped}</strong>` : escaped;
    chars += remaining;
    break;
  }

  if (text.length > maxChars) {
    html += "...";
  }

  return html;
}

const cards = document.querySelectorAll(".news-card");

cards.forEach((card) => {
  const preview = card.querySelector(".news-preview");
  const btn = card.querySelector(".btn-leer-mas");

  const textoCompleto = preview.textContent;
  const textoRecortado = truncateMarkdownHtml(textoCompleto, MAX_CHARS);

  if (textoCompleto.length <= MAX_CHARS) {
    btn.style.display = "none";
    preview.innerHTML = renderMarkdownHtml(textoCompleto);
    return;
  }

  preview.innerHTML = textoRecortado;

  let expandido = false;

  btn.addEventListener("click", () => {
    if (expandido) {
      preview.innerHTML = textoRecortado;
      btn.textContent = "▼ Leer más";
      expandido = false;
    } else {
      preview.innerHTML = renderMarkdownHtml(textoCompleto);
      btn.textContent = "▲ Leer menos";
      expandido = true;
    }
  });
});
