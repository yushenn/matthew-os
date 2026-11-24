// High-tech layer: cursor spotlight on cards, scroll progress bar, typing terminal.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // spotlight that follows the cursor across cards, with a glowing edge
  var sel = '.card, .panel, .glance > div, .path-card, .skills > div, .meta > div, .next li, .challenge';
  document.querySelectorAll(sel).forEach(function (el) {
    el.classList.add('spot');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // terminal lines type themselves out once, then keep their colours
  var term = document.querySelector('.term');
  if (!term) return;
  var lines = Array.prototype.slice.call(term.querySelectorAll('[data-line]'));
  var caret = document.createElement('span');
  caret.className = 'caret';
  if (reduce) { lines[lines.length - 1].appendChild(caret); return; }
  var finals = lines.map(function (l) { var h = l.innerHTML; l.textContent = ''; return h; });
  var plain = finals.map(function (h) { var d = document.createElement('div'); d.innerHTML = h; return d.textContent; });
  var li = 0, ci = 0;
  function tick() {
    if (li >= lines.length) { lines[lines.length - 1].appendChild(caret); return; }
    var line = lines[li];
    if (ci <= plain[li].length) {
      line.textContent = plain[li].slice(0, ci);
      line.appendChild(caret);
      ci++;
      setTimeout(tick, plain[li][ci - 2] === ' ' ? 20 : 32);
    } else {
      line.innerHTML = finals[li];
      li++; ci = 0;
      setTimeout(tick, 380);
    }
  }
  setTimeout(tick, 700);
})();
