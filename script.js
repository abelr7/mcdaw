const $ = (selector) => document.querySelector(selector);

function renderMods(list = MODS) {
  const grid = $('#modsGrid');
  const empty = $('#emptyState');

  grid.innerHTML = list.map(mod => `
    <article class="mod">
      <div class="mod-top">
        <h3>${escapeHtml(mod.name)}</h3>
        <span class="tag">${escapeHtml(mod.category)}</span>
      </div>
      <p>${escapeHtml(mod.description)}</p>
      <div class="file">${escapeHtml(mod.file)}</div>
    </article>
  `).join('');

  empty.classList.toggle('hidden', list.length !== 0);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
  }[char]));
}

function setupFilters() {
  const select = $('#categoryFilter');
  const categories = [...new Set(MODS.map(mod => mod.category))].sort();

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  function filter() {
    const query = $('#searchMods').value.trim().toLowerCase();
    const category = select.value;

    const filtered = MODS.filter(mod => {
      const text = `${mod.name} ${mod.file} ${mod.description}`.toLowerCase();
      return text.includes(query) && (category === 'all' || mod.category === category);
    });

    renderMods(filtered);
  }

  $('#searchMods').addEventListener('input', filter);
  select.addEventListener('change', filter);
}

function setupCopy() {
  $('#copyIp').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SERVER.ip);
    } catch {
      const temp = document.createElement('textarea');
      temp.value = SERVER.ip;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
    }

    const toast = $('#toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1600);
  });
}

$('#serverIp').textContent = SERVER.ip;
$('#minecraftVersion').textContent = SERVER.minecraft;
$('#forgeVersion').textContent = SERVER.forge;
$('#modCount').textContent = MODS.length;

renderMods();
setupFilters();
setupCopy();
