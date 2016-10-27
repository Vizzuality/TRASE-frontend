import 'styles/about.scss';

import smoothScroll from 'utils/smoothScroll';
import { calculateOffsets, scrollDocument } from 'utils/fixedScroll';
import _ from 'lodash';

const options = {
  elems: {
    anchorNav: document.querySelector('.js-anchor-nav'),
    anchorItems: document.querySelectorAll('.anchor-item > a')
  }
};

const _toggleAnchors = (e) => {
  const target = e && e.target.hash;
  const anchorItems = options.elems.anchorItems;

  anchorItems.forEach((anchorItem) => {
    anchorItem.parentElement.classList.toggle('-selected', anchorItem.hash === target);
  });
};

const _onScrollDocument = () => {
  const el = options.elems.anchorNav;
  const elemOffsets = options.elemOffsets;

  scrollDocument(el, elemOffsets);
};

const _setEventListeners = () => {
  const anchorItems = options.elems.anchorItems;
  const _onScrollThrottle = _.throttle(_onScrollDocument, 50, { leading: true });

  document.addEventListener('scroll', _onScrollThrottle);

  anchorItems.forEach((anchorItem) => {
    anchorItem.addEventListener('click', (e) => _toggleAnchors(e));
  });

  smoothScroll(anchorItems);
};

const _init = () => {
  Object.assign(options, { elemOffsets: calculateOffsets(options.elems.anchorNav)});

  _setEventListeners();
};


_init();
