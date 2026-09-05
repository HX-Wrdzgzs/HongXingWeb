import { defineMorphIcon } from 'https://esm.sh/morphicons@1.5.0/element';

defineMorphIcon();

const MENU = 'M4 6h16M4 12h16M4 18h16';
const CLOSE = 'M18 6 6 18M6 6l12 12';
const SEARCH = 'M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16';
const ARROW_RIGHT = 'M5 12h14M13 6l6 6-6 6';
const CHEVRON_RIGHT = 'M9 18l6-6-6-6';
const ARROW_UP_RIGHT = 'M7 17 17 7M7 7h10v10';
const PLUS = 'M12 5v14M5 12h14';

function icon(initial, label, className = 'morph-ui-icon') {
  const el = document.createElement('morph-icon');
  el.className = className;
  el.setAttribute('icon', initial);
  el.setAttribute('label', label);
  el.reducedMotion = 'user';
  return el;
}

function morph(el, target, spring = 'snappy') {
  try {
    el.morphTo(target, spring);
  } catch {
    el.icon = target;
  }
}

function setupMenu() {
  const button = document.querySelector('.menu-btn');
  if (!button) return;
  const mi = icon(MENU, '菜单');
  button.append(mi);
  button.classList.add('has-morph-icon');
  const sync = () => morph(mi, button.getAttribute('aria-expanded') === 'true' ? CLOSE : MENU);
  button.addEventListener('click', sync);
}

function setupSearch() {
  const input = document.querySelector('[data-search]');
  if (!input || input.closest('.morph-search-shell')) return;

  const shell = document.createElement('div');
  shell.className = 'morph-search-shell';
  input.parentNode.insertBefore(shell, input);
  shell.append(input);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'morph-search-action';
  button.setAttribute('aria-label', '搜索');
  const mi = icon(SEARCH, '搜索', 'morph-ui-icon morph-search-icon');
  button.append(mi);
  shell.append(button);

  const sync = () => {
    const hasValue = input.value.trim().length > 0;
    button.setAttribute('aria-label', hasValue ? '清除搜索' : '聚焦搜索');
    morph(mi, hasValue ? CLOSE : SEARCH);
  };

  input.addEventListener('input', sync);
  button.addEventListener('click', () => {
    if (input.value) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    input.focus();
  });
  sync();
}

function setupDetailButtons() {
  document.querySelectorAll('.detail-btn').forEach(button => {
    button.textContent = '';
    const mi = icon(ARROW_RIGHT, '查看详情');
    button.append(mi);
    button.addEventListener('mouseenter', () => morph(mi, PLUS));
    button.addEventListener('mouseleave', () => morph(mi, ARROW_RIGHT));
    button.addEventListener('focus', () => morph(mi, PLUS));
    button.addEventListener('blur', () => morph(mi, ARROW_RIGHT));
  });
}

function setupInlineArrows() {
  const candidates = document.querySelectorAll('.text-link span, .primary span, .entry b');
  candidates.forEach(holder => {
    const anchor = holder.closest('a');
    if (!anchor) return;
    holder.textContent = '';
    holder.classList.add('morph-inline-holder');
    const mi = icon(ARROW_RIGHT, '继续');
    holder.append(mi);
    const target = anchor.target === '_blank' ? ARROW_UP_RIGHT : CHEVRON_RIGHT;
    anchor.addEventListener('mouseenter', () => morph(mi, target));
    anchor.addEventListener('mouseleave', () => morph(mi, ARROW_RIGHT));
    anchor.addEventListener('focus', () => morph(mi, target));
    anchor.addEventListener('blur', () => morph(mi, ARROW_RIGHT));
  });
}

function setupExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach(anchor => {
    if (anchor.querySelector('.morph-inline-holder')) return;
    if (!anchor.classList.contains('text-link')) return;
    const mi = icon(ARROW_UP_RIGHT, '外部链接', 'morph-ui-icon morph-external-icon');
    anchor.append(mi);
  });
}

function init() {
  document.documentElement.classList.add('morphicons-ready');
  setupMenu();
  setupSearch();
  setupDetailButtons();
  setupInlineArrows();
  setupExternalLinks();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
