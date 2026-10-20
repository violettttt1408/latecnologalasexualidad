/* =========================================================
   SEXUALIDAD & TECNOLOGÍA — main.js
   JavaScript nativo (Vanilla). Sin dependencias externas.
   ========================================================= */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Navegación: menú móvil, estado pegajoso y scrollspy
     --------------------------------------------------------- */
  function initNav() {
    var nav = $('#nav');
    var toggle = $('#navToggle');
    var menu = $('#navMenu');
    if (!nav || !toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' &&
          !menu.contains(e.target) && !toggle.contains(e.target)) {
        setOpen(false);
      }
    });

    var stuck = false;
    function onScroll() {
      var shouldStick = window.scrollY > 24;
      if (shouldStick !== stuck) {
        stuck = shouldStick;
        nav.classList.toggle('is-stuck', stuck);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     2. Desplazamiento suave con desplazamiento por cabecera
     --------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      var top = target.getBoundingClientRect().top + window.scrollY - navH - 8;

      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });

      // Mueve el foco al destino para navegación por teclado/lector de pantalla
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  }

  /* ---------------------------------------------------------
     3. Barra de progreso de lectura
     --------------------------------------------------------- */
  function initProgress() {
    var bar = $('#progressBar');
    var fill = $('#progressFill');
    if (!bar || !fill) return;
    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      fill.style.width = pct.toFixed(2) + '%';
      bar.setAttribute('aria-valuenow', String(Math.round(pct)));
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------------
     4. Botón volver al inicio
     --------------------------------------------------------- */
  function initToTop() {
    var btn = $('#toTop');
    if (!btn) return;
    var visible = false;

    window.addEventListener('scroll', function () {
      var should = window.scrollY > 700;
      if (should !== visible) { visible = should; btn.hidden = !should; }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      var brand = $('.brand');
      if (brand) brand.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------
     5. Animaciones de entrada (Intersection Observer)
     --------------------------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // Red de seguridad: si el observador no llega a disparar, el contenido
    // nunca debe quedar invisible.
    var pending = false;
    function fallbackCheck() {
      pending = false;
      var vh = window.innerHeight || 0;
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.classList.contains('is-visible')) continue;
        var rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.94 && rect.bottom > 0) el.classList.add('is-visible');
      }
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(fallbackCheck);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    schedule();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     6. Línea temporal interactiva (patrón de pestañas)
     --------------------------------------------------------- */
  function initTimeline() {
    var root = $('[data-timeline]');
    if (!root) return;
    var tabs = $$('.timeline__node', root);
    var panels = $$('.timeline__panel', root);
    if (!tabs.length) return;

    function activate(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        if (panels[i]) {
          panels[i].hidden = !on;
          panels[i].classList.toggle('is-active', on);
        }
        if (on && focus) tab.focus();
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { activate(i, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); activate(next, true); }
      });
    });
  }

  /* ---------------------------------------------------------
     7. Comparador ANTES / AHORA
     --------------------------------------------------------- */
  function initCompare() {
    var root = $('[data-compare]');
    var source = $('#compareSource');
    if (!root || !source) return;

    var thenBox = $('#compareThen');
    var nowBox = $('#compareNow');
    var limitBox = $('#compareLimit');
    var chips = $$('.chip', root);

    function render(topic) {
      var block = source.querySelector('[data-topic="' + topic + '"]');
      if (!block) return;
      var t = block.querySelector('[data-then]');
      var n = block.querySelector('[data-now]');
      var l = block.querySelector('[data-limit]');

      thenBox.innerHTML = t ? t.innerHTML : '';
      nowBox.innerHTML = n ? n.innerHTML : '';
      limitBox.innerHTML = l ? '<strong>Límite actual:</strong> ' + l.innerHTML : '';
      limitBox.hidden = !l;

      if (!reduceMotion) {
        [thenBox, nowBox].forEach(function (box) {
          box.classList.remove('is-swap');
          void box.offsetWidth; // reinicia la animación
          box.classList.add('is-swap');
        });
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-selected', 'true');
        render(chip.getAttribute('data-topic'));
      });
    });

    var active = root.querySelector('.chip.is-active') || chips[0];
    if (active) render(active.getAttribute('data-topic'));
  }

  /* ---------------------------------------------------------
     8. Carrusel / cronología horizontal
     --------------------------------------------------------- */
  function initCarousel() {
    var root = $('[data-carousel]');
    if (!root) return;
    var track = $('#carouselTrack', root);
    var slides = $$('.carousel__slide', track);
    var dotsBox = $('#carouselDots', root);
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    if (!track || slides.length === 0) return;

    var index = 0;
    var dots = [];

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Ir al hito ' + (i + 1) + ' de ' + slides.length);
      dot.addEventListener('click', function () { go(i); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });

    function go(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === index);
        d.setAttribute('aria-selected', String(k === index));
      });
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
    }

    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
    });

    // Soporte táctil (swipe)
    var startX = null;
    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 55) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    go(0);
  }

  /* ---------------------------------------------------------
     9. Tarjetas expandibles («Saber más»)
     --------------------------------------------------------- */
  function initExpanders() {
    $$('[data-expand]').forEach(function (card) {
      var btn = card.querySelector('.xcard__btn');
      var panel = card.querySelector('.xcard__more');
      if (!btn || !panel) return;

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
        btn.textContent = open ? 'Saber más' : 'Ver menos';
      });
    });
  }

  /* ---------------------------------------------------------
     10. Acordeones
     --------------------------------------------------------- */
  function initAccordions() {
    $$('[data-accordion] .acc__btn').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.hidden = open;
      });
    });
  }

  /* ---------------------------------------------------------
     11. Módulo mitos y realidades
     --------------------------------------------------------- */
  function initMyths() {
    var root = $('[data-myths]');
    var source = $('#mythSource');
    var answer = $('#mythAnswer');
    if (!root || !source || !answer) return;
    var buttons = $$('.myth-btn', root);

    var classes = { 'Mito': 'verdict--myth', 'Realidad': 'verdict--truth', 'Matiz': 'verdict--nuance' };

    function show(i) {
      var block = source.children[i];
      if (!block) return;
      var verdict = block.getAttribute('data-verdict') || '';
      var title = block.getAttribute('data-title') || '';
      var text = block.innerHTML;

      answer.innerHTML =
        '<span class="verdict ' + (classes[verdict] || '') + '">' + verdict + '</span>' +
        '<h4>' + title + '</h4>' + text;

      buttons.forEach(function (b, k) {
        b.classList.toggle('is-active', k === i);
        b.setAttribute('aria-selected', String(k === i));
      });

      if (!reduceMotion) {
        answer.classList.remove('is-swap');
        void answer.offsetWidth;
        answer.classList.add('is-swap');
      }
    }

    buttons.forEach(function (btn, i) {
      btn.addEventListener('click', function () { show(i); });
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % buttons.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
        if (next !== null) { e.preventDefault(); buttons[next].focus(); show(next); }
      });
    });

    show(0);
  }

  /* ---------------------------------------------------------
     12. Cuestionario: puntuación, retroalimentación y reinicio
     --------------------------------------------------------- */
  function initQuiz() {
    var form = $('#quizForm');
    var result = $('#quizResult');
    var scoreEl = $('#quizScore');
    var msgEl = $('#quizMsg');
    var resetBtn = $('#quizReset');
    if (!form || !result) return;

    var questions = $$('.q', form);

    // Compatibilidad con navegadores sin :has()
    $$('.q__opt input', form).forEach(function (input) {
      input.addEventListener('change', function () {
        $$('.q__opt', input.closest('.q')).forEach(function (opt) {
          opt.classList.toggle('is-selected', !!opt.querySelector('input:checked'));
        });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var correct = 0;
      questions.forEach(function (q) {
        var expected = q.getAttribute('data-answer');
        var selected = q.querySelector('input:checked');
        var feedback = q.querySelector('.q__feedback');
        var ok = selected && selected.value === expected;

        q.classList.toggle('is-correct', !!ok);
        q.classList.toggle('is-wrong', !ok);
        if (feedback) feedback.hidden = false;
        if (ok) correct++;
      });

      var total = questions.length;
      var pct = Math.round((correct / total) * 100);
      scoreEl.textContent = correct + ' de ' + total + ' respuestas correctas (' + pct + '%)';

      var msg;
      if (correct === total) msg = 'Dominas el tema: historia, salud, riesgos digitales y protección. Considera compartir el cuestionario con alguien.';
      else if (correct >= 7) msg = 'Muy buen resultado. Repasa las explicaciones de las preguntas que fallaste para afianzar los detalles.';
      else if (correct >= 4) msg = 'Base correcta, pero conviene revisar las secciones de reproducción, legislación y protección de menores.';
      else msg = 'Te recomendamos recorrer las secciones de nuevo, empezando por la antigüedad y la reproducción, y volver a intentarlo.';
      msgEl.textContent = msg;

      result.hidden = false;
      if (resetBtn) resetBtn.disabled = false;
      if (!reduceMotion) {
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.reset();
        questions.forEach(function (q) {
          q.classList.remove('is-correct', 'is-wrong');
          $$('.q__opt', q).forEach(function (opt) { opt.classList.remove('is-selected'); });
          var feedback = q.querySelector('.q__feedback');
          if (feedback) feedback.hidden = true;
        });
        result.hidden = true;
        resetBtn.disabled = true;
        var first = form.querySelector('input');
        if (first) first.focus();
      });
    }
  }

  /* ---------------------------------------------------------
     13. Scrollspy: resalta el enlace de la sección visible
     --------------------------------------------------------- */
  function initScrollSpy() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var section = document.querySelector(id);
      if (section) { map[id] = link; sections.push(section); }
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          var link = map['#' + entry.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------------------------------------------------------
     14. Marca de carga: gestiona fallos de imagen
     --------------------------------------------------------- */
  function initImageFallback() {
    $$('img').forEach(function (img) {
      img.addEventListener('error', function () {
        var fig = img.closest('.figure') || img.parentElement;
        if (fig) fig.classList.add('img-failed');
        img.style.visibility = 'hidden';
      });
    });
  }

  /* ---------------------------------------------------------
     Arranque
     --------------------------------------------------------- */
  function init() {
    initNav();
    initSmoothScroll();
    initProgress();
    initToTop();
    initReveal();
    initTimeline();
    initCompare();
    initCarousel();
    initExpanders();
    initAccordions();
    initMyths();
    initQuiz();
    initScrollSpy();
    initImageFallback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
