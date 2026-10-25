(() => {
  'use strict';
  const root = document.body;
  const waNumber = '5513996462637';
  const themes = {
    orla: 'Areia clara, verde-mar e luz natural: uma recepção leve, inspirada no litoral.',
    mare: 'Azul profundo e espuma clara: uma direção contemporânea, com energia de mar aberto.',
    quiosque: 'Terracota, palha e tons quentes: uma vitrine com clima acolhedor e local.'
  };
  const buttons = [...document.querySelectorAll('.direction-controls [data-theme]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.product-card')];
  let currentFilter = 'all';
  const search = document.getElementById('catalog-search');
  const toast = document.getElementById('toast');
  let toastTimer;

  buttons.forEach(button => button.addEventListener('click', () => {
    const theme = button.dataset.theme;
    root.dataset.theme = theme;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('theme-caption').textContent = themes[theme];
  }));

  function filterCatalog() {
    const query = search.value.trim().toLocaleLowerCase('pt-BR');
    let count = 0;
    cards.forEach(card => {
      const matchesCategory = currentFilter === 'all' || card.dataset.category === currentFilter;
      const matchesText = !query || `${card.dataset.search} ${card.textContent}`.toLocaleLowerCase('pt-BR').includes(query);
      const visible = matchesCategory && matchesText;
      card.hidden = !visible;
      if (visible) count += 1;
    });
    document.getElementById('results-count').textContent = `${count} ${count === 1 ? 'opção demonstrativa' : 'opções demonstrativas'}`;
    document.getElementById('empty-state').hidden = count > 0;
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    filterCatalog();
  }));
  search.addEventListener('input', filterCatalog);

  function toastMessage(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  document.querySelectorAll('.product-cta').forEach(button => button.addEventListener('click', () => {
    const product = button.dataset.product;
    document.getElementById('selected-product').value = product;
    if (product.includes('30 minutos')) document.getElementById('selected-duration').value = '30 minutos';
    if (product.includes('1 hora')) document.getElementById('selected-duration').value = '1 hora';
    document.getElementById('booking-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
    toastMessage('Opção selecionada. Conte os detalhes e continue quando quiser.');
  }));

  document.getElementById('booking-form').addEventListener('submit', event => {
    event.preventDefault();
    const product = document.getElementById('selected-product').value || 'Ainda estou escolhendo uma opção';
    const duration = document.getElementById('selected-duration').value;
    const date = document.getElementById('selected-date').value.trim();
    const note = document.getElementById('selected-note').value.trim();
    const details = [
      `Olá! Encontrei a Caiçara Motos e queria conversar sobre um passeio.`,
      `Opção de interesse: ${product}.`,
      duration ? `Período que quero consultar: ${duration}.` : '',
      date ? `Minha preferência de dia/horário: ${date} (sei que depende de confirmação).` : '',
      note ? `Observação: ${note}` : '',
      `Podem me explicar os valores, a disponibilidade e como funciona?`
    ].filter(Boolean).join('\n\n');
    openWhatsApp(details);
  });
})();
