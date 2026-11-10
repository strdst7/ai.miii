const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('.mobile-menu');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
  menu.hidden = open;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu');
}));
document.querySelectorAll('.path-card').forEach(card => card.addEventListener('click', () => {
  const open = card.getAttribute('aria-expanded') === 'true';
  card.setAttribute('aria-expanded', String(!open));
  card.querySelector('i').textContent = open ? '+' : '−';
}));
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
  document.querySelectorAll('.resource').forEach(item => { item.hidden = button.dataset.filter !== 'all' && !item.dataset.category.split(' ').includes(button.dataset.filter); });
}));
