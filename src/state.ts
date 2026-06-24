import type { AppState } from './types';

export const STATE: AppState = {
  data: null,
  derived: null,
  active: 'notfb',
  query: '',
  sort: 'az',
  _virtual: null,
  _cmp: null
};

export const $ = (s: string): any => document.querySelector(s);

export const toast = (msg: string): void => {
  const el: any = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
};
