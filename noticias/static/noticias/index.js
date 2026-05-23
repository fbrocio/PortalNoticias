const PREVIEW_LINE_CLAMP = 4;

/* =========================
   Escape HTML
========================= */
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =========================
   Fecha ES
========================= */
function formatDate(dateString) {

  const date = new Date(dateString);

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* =========================
   Variables dinámicas
========================= */
function injectDynamicValues(text, videoDate) {

  const formattedDate = formatDate(videoDate);

  return text.replace(
    /\[(Fecha|Fecha Actual)\]/gi,
    formattedDate
  );
}

/* =========================
   Normalización IA
========================= */
function normalizeMarkdown(text) {

  // ### **titulo** -> ### titulo
  text = text.replace(
    /^(#{2,3})\s+\*\*(.*?)\*\*$/gm,
    "$1 $2"
    
  );

  // fuerza separación tras headers
  text = text.replace(
    /^(#{2,3} .*)$/gm,
    "$1\n"
  );

  // ***titulo*** -> ## titulo
  text = text.replace(
    /^\*\*\*([^*\n]+)\*\*\*$/gm,
    "## $1"
  );

  // **titulo** -> ### titulo
  text = text.replace(
    /^\*\*([^*\n]+)\*\*$/gm,
    "### $1"
  );

  return text;
}

/* =========================
   Markdown parser
========================= */
function parseMarkdown(text, videoDate) {

  text = injectDynamicValues(text, videoDate);

  text = normalizeMarkdown(text);

  let html = escapeHtml(text);

  // headers
  html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*)$/gm, "<h2>$1</h2>");

  // links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // bold
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  // italic
  html = html.replace(
    /\*(.+?)\*/g,
    "<em>$1</em>"
  );

  // listas markdown
  html = html.replace(
    /^\*\s+(.*)$/gm,
    "<li>$1</li>"
  );

  // agrupar listas
  html = html.replace(
    /(<li>.*<\/li>)/gs,
    "<ul>$1</ul>"
  );

  // párrafos
  html = html
    .split(/\n\s*\n/)
    .map(block => {

      block = block.trim();

      if (!block) return "";

      if (
        block.startsWith("<h2>") ||
        block.startsWith("<h3>") ||
        block.startsWith("<ul>")
      ) {
        return block;
      }

      return `<p>${block.replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  return html;
}

/* =========================
   Limpieza de líneas incompletas
========================= */
function removeMalformedBoldLines(text) {

  return text
    .split(/\r?\n/)
    .filter(line => {

      const cleanLine = line.trim();

      return !(
        cleanLine.startsWith("**") &&
        !cleanLine.slice(2).includes("**")
      );
    })
    .join("\n")
    .trim();
}

/* =========================
   Inicialización
========================= */
document.addEventListener("DOMContentLoaded", () => {

  const previews = document.querySelectorAll(".news-preview");

  previews.forEach(preview => {

    const btn = preview.nextElementSibling;

    if (!btn) return;

    const originalMarkdown =
      removeMalformedBoldLines(
        preview.textContent.trim()
      );

    const videoDate =
      preview.dataset.date;

    preview.style.setProperty(
      "--preview-lines",
      PREVIEW_LINE_CLAMP
    );

    let expanded = false;

    function render() {

      preview.classList.toggle(
        "collapsed",
        !expanded
      );

      preview.innerHTML =
        parseMarkdown(originalMarkdown, videoDate);

      btn.textContent = expanded
        ? "▲ Leer menos"
        : "▼ Leer más";
    }

    

    render();

    requestAnimationFrame(() => {

      const isOverflowing =
        preview.scrollHeight >
        preview.clientHeight + 1;

      if (!isOverflowing) {
        btn.style.display = "none";
      }
    });

    btn.addEventListener("click", () => {
      expanded = !expanded;
      render();
    });

  });

});
