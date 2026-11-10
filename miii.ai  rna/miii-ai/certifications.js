const search = document.querySelector('#cert-search');
const entries = [...document.querySelectorAll('.cert-entry')];
const count = document.querySelector('#cert-count');
const empty = document.querySelector('.no-results');
search.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  entries.forEach(entry => {
    const match = entry.dataset.search.includes(query);
    entry.hidden = !match;
    if (match) visible++;
  });
  count.textContent = query ? `Showing ${visible} of ${entries.length} entries` : `Showing all ${entries.length} entries`;
  empty.hidden = visible !== 0;
});
document.querySelector('#back-top').addEventListener('click', event => { event.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); });
