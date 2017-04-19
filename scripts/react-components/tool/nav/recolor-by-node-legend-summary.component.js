import { h } from 'preact';

export default ({ recolorGroups }) => {
  if (recolorGroups === undefined) {
    return;
  }
  return <div class='dropdown-item-legend-summary'>
    {recolorGroups.map(color => <div class={`color -flow-${color}`} style={`order:${color};`} />)}
  </div>;
};
