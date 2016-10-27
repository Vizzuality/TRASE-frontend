import 'styles/about.scss';

import smoothScroll from 'utils/smoothScroll';

const _toggleAnchors = (e) => {
  const target = e && e.target.hash;
  const anchorItems = document.querySelectorAll('.anchor-item > a');

  anchorItems.forEach((anchorItem) => {
    anchorItem.parentElement.classList.toggle('-selected', anchorItem.hash === target);
  });
};

const _setEventListeners = () => {
  const anchorItems = document.querySelectorAll('.anchor-item > a');

  smoothScroll(anchorItems);
  anchorItems.forEach((anchorItem) => {
    anchorItem.addEventListener('click', (e) => _toggleAnchors(e));
  });
};

_setEventListeners();
