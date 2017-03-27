import { h } from 'preact';

export default ({ text, position }) => {
  return (
    <svg
      class='icon tooltip-icon js-tooltip'
      data-tooltip-text={text}
      data-tooltip-position={position || 'bottom left'}
    >
      <use xlinkHref='#icon-layer-info' />
    </svg>
  );
};
