import 'styles/factsheets.scss';

import AreaStack from 'scripts/components/graphs/area-stack.component';

const _renderAreaStack = () => {
  const el = document.querySelector('.js-municipalities-top');

  new AreaStack({
    el
  });
};

_renderAreaStack();
