const slug = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const unique = (arr) => [...new Set(arr.filter(Boolean))];

let DB = { meta: {}, categories: [], items: [], settings: [] };
let tagSelect = null; // Fix: Declare tagSelect to avoid global pollution
let filtersInitialized = false; // Track if filters have been initialized

// --- Path Validation ---
function validateDataPath(path) {
  // Whitelist approach: only allow alphanumeric, hyphens, and underscores
  // No path traversal sequences allowed
  if (!path || typeof path !== 'string') {
    return false;
  }
  // Check for path traversal attempts
  if (path.includes('..') || path.includes('/') || path.includes('\\')) {
    return false;
  }
  // Only allow safe characters
  if (!/^[a-zA-Z0-9_-]+$/.test(path)) {
    return false;
  }
  return true;
}

// --- Error Display ---
function showError(message) {
  const errorDiv = $('<div>')
    .attr('role', 'alert')
    .addClass('fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md')
    .text(message);

  $('body').append(errorDiv);

  setTimeout(() => {
    errorDiv.fadeOut(300, function() {
      $(this).remove();
    });
  }, 5000);
}

// --- Load CSV Data ---
async function loadInitialData() {
  try {
    const path = DB.settings.dataPath;

    // Validate path before using it
    if (!validateDataPath(path)) {
      throw new Error('Invalid data path configuration. Path must contain only letters, numbers, hyphens, and underscores.');
    }

    DB.categories = await loadCSV(`/data/${path}/categories.csv`);
    DB.items = await loadCSV(`/data/${path}/collection.csv`);

    if (!DB.categories || DB.categories.length === 0) {
      throw new Error('Categories file is empty or invalid.');
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
    showError(`Failed to load collection data: ${error.message}`);
    throw error;
  }
}

// Minimal CSV parser
function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  if (lines.length === 0) {
    return [];
  }
  const headers = lines[0].trim().split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj;
  });
}

async function loadCSV(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
    }
    const text = await resp.text();
    return parseCSV(text);
  } catch (error) {
    console.error(`Error loading CSV from ${url}:`, error);
    throw new Error(`Failed to load ${url}: ${error.message}`);
  }
}

async function loadSettings() {
  try {
    const resp = await fetch("/data/settings.json");
    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}: ${resp.statusText}`);
    }
    DB.settings = await resp.json();

    // Validate and sanitize settings
    if (!DB.settings.title || typeof DB.settings.title !== 'string') {
      DB.settings.title = 'Virtual Collection';
    }
    if (!DB.settings.dataPath || typeof DB.settings.dataPath !== 'string') {
      throw new Error('Missing or invalid dataPath in settings.json');
    }

    // Safely set text content
    document.title = DB.settings.title;
    $("#appTitle").text(DB.settings.title);
    $("#footerTitle").text(DB.settings.title);
  } catch (error) {
    console.error('Error loading settings:', error);
    showError(`Failed to load settings: ${error.message}`);
    throw error;
  }
}

// --- State ---
const state = { q: "", filters: {}, sortBy: "", page: 1, perPage: 20 };

// --- Filter & Sort ---
function filterItems(items) {
  return items.filter((item) => {
    // search
    if (state.q) {
      const hay = Object.values(item).join(" ").toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }

    // category filters
    for (const cat of DB.categories) {
      if (cat.filter === "true") {
        const val = state.filters[cat.field];
        if (!val || val.length === 0) continue;

        if (cat.field === "tags") {
          const itemTags = (item.tags || "").split("|");
          if (!val.some((tag) => itemTags.includes(tag))) return false;
        } else {
          if (String(item[cat.field] || "") !== val) return false;
        }
      }
    }
    return true;
  });
}

function sortItems(items) {
  const arr = [...items];
  // dynamic sort by first category with type=number or string
  return arr.sort((a, b) => 0); // implement custom sort based on category if needed
}

// --- Rendering ---
function render() {
  const filtered = filterItems(DB.items);
  const sorted = sortItems(filtered);
  const total = sorted.length;
  const start = (state.page - 1) * state.perPage;
  const pageItems = sorted.slice(start, start + state.perPage);

  // Grid
  const $grid = $("#grid").empty();
  if (!pageItems.length) $("#emptyState").removeClass("hidden");
  else $("#emptyState").addClass("hidden");

  pageItems.forEach((item) => {
    // Create elements safely without XSS vulnerabilities
    const $article = $('<article>')
      .addClass('group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden');

    const $button = $('<button>')
      .addClass('block w-full text-left')
      .attr('data-id', item.id || '');

    const $imageContainer = $('<div>')
      .addClass('aspect-[3/4] bg-slate-100 dark:bg-slate-700 overflow-hidden');

    const $img = $('<img>')
      .addClass('w-full h-full object-cover')
      .attr('src', item.thumbnail || '')
      .attr('alt', item.title || item.name || 'Collection item');

    const $content = $('<div>').addClass('p-3');

    const $title = $('<h3>')
      .addClass('text-sm font-medium line-clamp-1')
      .text(item.title || item.name || '');

    const $subtitle = $('<p>')
      .addClass('text-xs text-slate-600 line-clamp-1')
      .text(item.subtitle || '');

    // Assemble the card
    $imageContainer.append($img);
    $content.append($title, $subtitle);
    $button.append($imageContainer, $content);
    $article.append($button);

    // Add click handler
    $button.on("click", () => openLightbox(item.id));

    $grid.append($article);
  });

  $("#resultCount").text(`${total} item${total === 1 ? "" : "s"}`);
  renderFilters();
  renderPager(total);
}

function renderFilters() {
  const $sidebar = $("#sidebarFilters").empty();
  $sidebar.append('<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-4"><h2 class="text-lg font-semibold">Filters</h2></div>');
  const $container = $sidebar.children().last();

  DB.categories.forEach((cat) => {
    if (cat.filter === "true") {
      const options = unique(DB.items.flatMap((i) => (cat.field === "tags" ? (i[cat.field] || "").split("|") : [i[cat.field]]))).sort();

      if (cat.field === "tags") {
        const sel = $(`
        <div>
          <label class="block text-sm font-medium mb-1">${cat.display}</label>
          <select id="filter-${cat.field}" multiple placeholder="Select tags..." class="tom-select w-full"></select>
        </div>
      `);
        $container.append(sel);

        const selectEl = sel.find("select")[0];
        tagSelect = new TomSelect(selectEl, {
          plugins: ["remove_button"],
          create: false,
          persist: false,
          onChange(values) {
            // only update state here, don’t call render()!
            state.filters[cat.field] = values;
            state.page = 1;
            render();
          },
        });

        // populate options once
        updateTagOptions();
      } else {
        // Regular single-select
        const sel = $(`
          <div>
            <label class="block text-sm font-medium mb-1">${cat.display}</label>
            <select id="filter-${cat.field}" class="w-full rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:focus:ring-indigo-400">
              <option value="">Any</option>
            </select>
          </div>
        `);
        options.forEach((opt) => {
          if (opt) sel.find("select").append(`<option value="${opt}">${opt}</option>`);
        });
        sel.find("select").val(state.filters[cat.field] || "");
        sel.find("select").on("change", function () {
          state.filters[cat.field] = this.value;
          state.page = 1;
          render();
        });
        $container.append(sel);
      }
    }
  });
}

function updateTagOptions() {
  if (!tagSelect) return;
  const allTags = unique(DB.items.flatMap((i) => (i.tags ? i.tags.split("|") : []))).sort();

  tagSelect.clearOptions();
  allTags.forEach((tag) => {
    tagSelect.addOption({ value: tag, text: tag });
  });

  // Restore selection
  if (state.filters.tags?.length) {
    tagSelect.setValue(state.filters.tags, true);
  }
}

function renderPager(total) {
  const pages = Math.max(1, Math.ceil(total / state.perPage));
  const p = (state.page = Math.min(state.page, pages));
  const btn = (n, label = n) => `<button class='px-3 py-2 rounded-xl border ${n === p ? "bg-slate-900 text-white" : "border-slate-300 hover:bg-slate-100"}' data-page='${n}'>${label}</button>`;
  const items = [];
  if (pages > 1) {
    if (p > 1) items.push(btn(p - 1, "Prev"));
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - p) <= 2) items.push(btn(i));
      else if (items[items.length - 1] !== "…") items.push("…");
    }
    if (p < pages) items.push(btn(p + 1, "Next"));
  }
  $("#pager").html(items.join(""));
  $("#pager [data-page]").on("click", function () {
    state.page = Number($(this).data("page"));
    render();
  });
}

// --- Lightbox ---
let lbIndex = -1;
function openLightbox(id) {
  const filtered = sortItems(filterItems(DB.items));
  lbIndex = filtered.findIndex((i) => i.id === id);
  if (lbIndex < 0) return;
  const i = filtered[lbIndex];

  $("#lbImage").attr("src", i.image || "");
  $("#lbTitle").text(i.title || "");
  $("#lbSubtitle").text(i.subtitle || "");

  // Build details safely without XSS
  const $details = $("#lbDetails").empty();

  Object.entries(i)
    .filter(([k]) => !["tags","id","notes","image","thumbnail","title","subtitle"].includes(k.trim()))
    .forEach(([k, v]) => {
      const $dt = $('<dt>').addClass('text-slate-500').text(k.trim());
      const $dd = $('<dd>').addClass('font-medium mb-2').text(v || '');
      $details.append($dt, $dd);
    });

  // tags as pills - build safely
  const $tagsDt = $('<dt>').addClass('text-slate-500').text('Tags');
  const $tagsDd = $('<dd>');

  (i.tags || "")
    .split("|")
    .filter(Boolean)
    .forEach((t) => {
      const $pill = $('<span>')
        .addClass('inline-block bg-indigo-100 text-indigo-800 text-xs font-medium mr-1 mb-1 px-2 py-1 rounded-full')
        .text(t);
      $tagsDd.append($pill);
    });

  $details.append($tagsDt, $tagsDd);

  $("#lbNotes").text(i.notes || "");
  $("#lightbox").removeClass("hidden").addClass("flex");
}

function hookupEvents() {
  $("#closeLightbox").on("click", () => {
    $("#lightbox").addClass("hidden").removeClass("flex");
  });

  // --- Search ---
  $("#searchInput").on("input", () => {
    state.q = $("#searchInput").val();
    state.page = 1;
    render();
  });
  $("#clearSearch").on("click", () => {
    state.q = "";
    $("#searchInput").val("");
    state.page = 1;
    render();
  });

  $(document).on("click", "#themeToggle", toggleTheme);
}

function initTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// --- Init ---
$(async () => {
  await loadSettings();
  initTheme();
  await loadInitialData();
  render();
  hookupEvents();
});
