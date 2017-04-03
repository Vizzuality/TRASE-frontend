import { h } from 'preact';
import ColumnSelector from 'containers/column-selector-react.container';
import 'styles/components/columns-selector.scss';

export default ({ sankeySize, columns }) => {
  if (sankeySize === undefined || columns === undefined) {
    return;
  }
  return <div style={`width: ${sankeySize[0]}px`} class='c-columns-selector is-absolute'>
    <ColumnSelector group={0} />
    <ColumnSelector group={1} />
    <ColumnSelector group={2} />
    <ColumnSelector group={3} />
  </div>;
};
