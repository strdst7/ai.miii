(function () {
  const archive = document.getElementById("library-archive");
  const frame = archive?.querySelector("iframe");
  if (!archive || !frame) return;

  function loadArchive() {
    if (!frame.src) frame.src = frame.dataset.src;
  }

  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    loadArchive();
    observer.disconnect();
  }).observe(archive);

})();
