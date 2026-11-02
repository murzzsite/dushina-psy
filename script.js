const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/DD5A5A4S5W';

(() => {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const vh = () => window.innerHeight;

  // ===== year =====
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== header, burger =====
  const header = $('#header');
  const burger = $('#burger');
  const nav = $('#nav');
  const closeMenu = () => {
    burger?.classList.remove('is-open');
    nav?.classList.remove('is-open');
    header?.classList.remove('menu-open');
    burger?.setAttribute('aria-expanded', 'false');
  };
  burger?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    burger.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // ===== split headings by words =====
  $$('[data-split]').forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.textContent = '';
    text.split(' ').forEach((word, i, arr) => {
      const w = document.createElement('span');
      w.className = 'w';
      const wi = document.createElement('span');
      wi.className = 'wi';
      wi.style.setProperty('--i', i);
      wi.textContent = word;
      w.appendChild(wi);
      el.appendChild(w);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  // ===== reveal =====
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const animateCount = el => {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target) || RM) return;
    const dur = 1300, start = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(tick);
  };

  const reveal = () => {
    const line = vh() * 0.94;
    $$('[data-r]:not(.in), [data-split]:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < line) {
        const d = parseInt(el.dataset.rD || '0', 10);
        el.style.setProperty('--d', d);
        el.classList.add('in');
        if (el.hasAttribute('data-r')) {
          setTimeout(() => el.removeAttribute('data-r'), 1500 + d);
        }
      }
    });
    $$('[data-count]:not(.counted)').forEach(el => {
      if (el.getBoundingClientRect().top < vh() * 0.92) {
        el.classList.add('counted');
        animateCount(el);
      }
    });
  };

  // ===== fears (thought → answer) =====
  const FEARS = [
    ['«Сойду с ума»', 'Тревога пугает силой ощущений: сердце колотится, воздуха не хватает, мысли несутся. Но это работа перегруженной нервной системы, а не безумие, и с ней можно работать. Объясню, что с вами происходит, и дам простые приёмы, которые помогают уже между встречами. Если понадобится помощь врача, скажу об этом прямо.'],
    ['«Это никогда не закончится»', 'Так кажется, потому что тревога умеет рисовать бесконечность. Моя работа нацелена на заметный сдвиг за 3–4 встречи: тревоги становится меньше, тело расслабляется, возвращается опора. Темп у каждой свой, и я его не подгоняю.'],
    ['«Не справлюсь»', 'Вам и не нужно справляться одной: для этого и существует помощь. Начнём с малого: одно дыхание, один шаг, одна опора. Остальное будем делать вместе, в вашем темпе.'],
    ['«Меня осудят»', 'На консультации нет оценок: ни «правильно», ни «неправильно». Мне важно понять вас, а не исправить. Всё, о чём вы расскажете, остаётся между нами.'],
    ['«Это моя вина»', 'Чувство вины — частый спутник развода и тяжёлых решений. Мы разберём, где факты, а где приговор, который вы вынесли себе сами. Решения прошлого перестают давить, и вы получаете право двигаться дальше.'],
    ['«Останусь одна»', 'Страх одиночества — частая тема после развода. Мы разберём его и найдём вашу внутреннюю опору, чтобы решения принимала она, а не страх.'],
    ['«Я плохая»', 'Это голос, а не факт. Мы проверим, чей он: когда появился, кому принадлежал и какие у него доказательства. Чаще всего за словом «плохая» стоят усталость и вина, а не вы.'],
    ['«Я всё выдумываю»', 'Боль, зажимы и усталость реальны, даже если анализы в порядке: тело часто говорит то, что сложно сказать словами. Я не заменяю врача и при необходимости подскажу, к кому обратиться, а вместе мы послушаем, о чём говорит ваше тело.'],
    ['«Мне стыдно обращаться»', 'Обратиться за помощью — не слабость, а решение взять заботу о себе всерьёз. Многим женщинам годами приходится «держать лицо», и оправдываться передо мной не нужно: можно прийти такой, какая вы есть сейчас.'],
    ['«Психолог — шарлатан»', 'Сомнение справедливое. Я практикующий психолог: профессиональная переподготовка по клинической психологии (1000 часов) и магистратура по коррекционной психологии. Не обещаю чудес за одну встречу и объясняю, зачем делаю каждый шаг.'],
    ['«Нет денег»', 'Начать можно с одной консультации за 3 500 ₽, а первое облегчение бесплатно: гайд «7 маленьких чудес» с практиками и аудио-медитацией. Пакет из четырёх встреч выходит по 3 000 ₽ за встречу. Сколько идти, решаете вы.'],
    ['«У меня особый случай»', 'Каждый случай особенный, поэтому я не работаю по шаблону. Помогаю и в обычных кризисах, и в по-настоящему тяжёлых ситуациях: я работаю с людьми после аварий и других ЧС. Расскажите, что происходит, и я честно скажу, чем могу помочь.'],
    ['«Нет времени»', 'Консультация идёт 50 минут и проходит онлайн, ехать никуда не нужно. Практики из гайда занимают несколько минут. Часто на тревогу и так уходит больше времени, чем на сеанс.']
  ];
  const chips = $$('.chip');
  const panel = $('#fearPanel');
  const pq = $('#panelQuote');
  const pt = $('#panelText');
  let fearBusy = false;
  const showFear = k => {
    const idx = Number(k);
    if (!FEARS[idx] || fearBusy) return;
    chips.forEach(c => {
      const on = Number(c.dataset.k) === idx;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });
    const swap = () => {
      pq.textContent = FEARS[idx][0];
      pt.textContent = FEARS[idx][1];
      panel.classList.remove('is-out');
      fearBusy = false;
    };
    if (RM) { swap(); return; }
    fearBusy = true;
    panel.classList.add('is-out');
    setTimeout(swap, 230);
  };
  chips.forEach((c, i) => {
    c.addEventListener('click', () => showFear(c.dataset.k));
    c.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = chips[(i + (e.key === 'ArrowRight' ? 1 : chips.length - 1)) % chips.length];
      next.focus();
      showFear(next.dataset.k);
    });
  });

  // ===== breath (4 in / 6 out) =====
  const breath = $('#breath');
  if (breath) {
    const word = $('#breathWord');
    const count = $('#breathCount');
    const IN = 4000, OUT = 6000, T = IN + OUT;
    const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    let visible = true, lastWord = '', lastCount = -1, lastB = -1;
    const frame = now => {
      if (visible) {
        const t = now % T;
        let b, w, c;
        if (t < IN) { b = ease(t / IN); w = 'вдох'; c = Math.floor(t / 1000) + 1; }
        else { b = 1 - ease((t - IN) / OUT); w = 'выдох'; c = Math.floor((t - IN) / 1000) + 1; }
        if (RM) b = 0;
        if (Math.abs(b - lastB) > 0.002) { breath.style.setProperty('--b', b.toFixed(3)); lastB = b; }
        if (w !== lastWord) { word.textContent = w; lastWord = w; }
        if (c !== lastCount) { count.textContent = c; lastCount = c; }
      }
      requestAnimationFrame(frame);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 }).observe(breath);
    }
    requestAnimationFrame(frame);
  }

  // ===== wonders (sticky stage) =====
  const items = $$('.wonder');
  const glyphBox = $('#stageGlyph');
  const stageTitle = $('#stageTitle');
  let curWonder = -1;
  const setWonder = i => {
    if (i === curWonder || !items[i]) return;
    curWonder = i;
    items.forEach((li, k) => li.classList.toggle('is-on', k === i));
    if (!glyphBox) return;
    const src = $('.glyph', items[i]);
    glyphBox.textContent = '';
    if (src) glyphBox.appendChild(src.cloneNode(true));
    stageTitle.textContent = items[i].dataset.title || '';
    [glyphBox, stageTitle].forEach(el => { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); });
  };
  const pickWonder = () => {
    if (!items.length) return;
    const mid = vh() * 0.5;
    let best = 0, bestD = Infinity;
    items.forEach((li, i) => {
      const r = li.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) { bestD = d; best = i; }
    });
    setWonder(best);
  };

  // ===== path (draws on scroll) =====
  const pw = $('#pathWrap');
  const pathBg = $('#pathBg');
  const pathFg = $('#pathFg');
  const stops = $$('.stop');
  let pathPts = [], pathLen = 0;
  const buildPath = () => {
    if (!pw || !stops.length) return;
    const wr = pw.getBoundingClientRect();
    pathPts = stops.map(s => {
      const r = $('.stop__dot', s).getBoundingClientRect();
      return { x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 };
    });
    const amp = pw.clientWidth > 900 ? 64 : 18;
    let d = 'M' + pathPts[0].x + ' ' + pathPts[0].y;
    for (let i = 0; i < pathPts.length - 1; i++) {
      const a = pathPts[i], b = pathPts[i + 1], dy = b.y - a.y;
      d += ' C' + (a.x + amp) + ' ' + (a.y + dy / 3) + ' ' + (b.x - amp) + ' ' + (b.y - dy / 3) + ' ' + b.x + ' ' + b.y;
    }
    pathBg.setAttribute('d', d);
    pathFg.setAttribute('d', d);
    pathLen = pathFg.getTotalLength();
    pathFg.style.strokeDasharray = pathLen;
    updatePath();
  };
  const updatePath = () => {
    if (!pw || pathPts.length < 2) return;
    if (RM) {
      pathFg.style.strokeDashoffset = 0;
      stops.forEach(s => s.classList.add('is-lit'));
      return;
    }
    const wr = pw.getBoundingClientRect();
    const lineY = vh() * 0.62 - wr.top;
    const segs = pathPts.length - 1;
    let drawn = 0;
    if (lineY >= pathPts[segs].y) drawn = pathLen;
    else if (lineY > pathPts[0].y) {
      for (let i = 0; i < segs; i++) {
        if (lineY < pathPts[i + 1].y) {
          const t = (lineY - pathPts[i].y) / (pathPts[i + 1].y - pathPts[i].y);
          drawn = ((i + t) / segs) * pathLen;
          break;
        }
      }
    }
    pathFg.style.strokeDashoffset = pathLen - drawn;
    stops.forEach((s, i) => s.classList.toggle('is-lit', lineY >= pathPts[i].y - 4));
  };

  // ===== parallax: ridges, arch photo =====
  const layers = $$('.land__l[data-speed]');
  const archFrame = $('.arch__frame');
  const archImg = $('#archImg');
  const parallax = () => {
    if (RM) return;
    const y = window.scrollY;
    if (y < 1400) layers.forEach(l => { l.style.transform = 'translateY(' + (y * parseFloat(l.dataset.speed)).toFixed(1) + 'px)'; });
    if (archFrame && archImg) {
      const r = archFrame.getBoundingClientRect();
      const p = clamp((r.top + r.height / 2 - vh() / 2) / vh(), -1, 1);
      archImg.style.setProperty('--ap', (p * -34).toFixed(1) + 'px');
    }
  };

  // ===== scroll loop =====
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      header?.classList.toggle('scrolled', window.scrollY > 8);
      reveal();
      parallax();
      updatePath();
      pickWonder();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { buildPath(); onScroll(); });
  window.addEventListener('load', () => { buildPath(); onScroll(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { buildPath(); onScroll(); });
  buildPath();
  setWonder(0);
  onScroll();
  setTimeout(() => { buildPath(); onScroll(); }, 1200);
  setTimeout(reveal, 3500);

  // ===== FAQ smooth open/close =====
  $$('.faq details').forEach(d => {
    const sum = $('summary', d);
    const ans = $('.ans', d);
    sum.addEventListener('click', e => {
      if (RM) return;
      e.preventDefault();
      if (d.open) {
        ans.style.height = ans.offsetHeight + 'px';
        void ans.offsetHeight;
        ans.style.transition = 'height .4s cubic-bezier(.22,.8,.26,1)';
        ans.style.height = '0px';
        setTimeout(() => { d.open = false; ans.removeAttribute('style'); }, 400);
      } else {
        d.open = true;
        const h = ans.scrollHeight;
        ans.style.height = '0px';
        void ans.offsetHeight;
        ans.style.transition = 'height .5s cubic-bezier(.22,.8,.26,1)';
        ans.style.height = h + 'px';
        setTimeout(() => ans.removeAttribute('style'), 520);
      }
    });
  });

  // ===== forms → Cloudflare Worker → Telegram =====
  $$('form[data-lead]').forEach(form => {
    const note = $('.form-note', form);
    const say = (text, cls) => { note.textContent = text; note.className = 'form-note' + (cls ? ' ' + cls : ''); };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      const payload = {};
      new FormData(form).forEach((v, k) => { payload[k] = v; });
      if (payload._gotcha) return;
      if (!payload.name || !payload.contact) { say('Заполните имя и контакт, чтобы я могла с вами связаться.', 'err'); return; }
      if (!form.consent.checked) { say('Нужно согласие на обработку персональных данных.', 'err'); return; }
      delete payload.consent;
      payload.page = location.href;
      btn.disabled = true;
      btn.textContent = 'Отправляю…';
      say('');
      try {
        const resp = await fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        btn.textContent = 'Отправлено ✓';
        say(form.id === 'giftForm'
          ? 'Спасибо! Я пришлю гайд и аудио-медитацию на указанный контакт.'
          : 'Спасибо! Я свяжусь с вами и предложу время для консультации.', 'ok');
        form.reset();
      } catch (err) {
        console.error(err);
        btn.textContent = orig;
        say('Не получилось отправить. Попробуйте ещё раз чуть позже.', 'err');
      } finally {
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3500);
      }
    });
  });

  // ===== smooth anchors =====
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href.length <= 1) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: RM ? 'auto' : 'smooth' });
    });
  });

  // ===== magnetic primary button =====
  if (!RM && window.matchMedia('(hover: hover)').matches) {
    $$('.magnet').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.14;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        b.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }
})();
