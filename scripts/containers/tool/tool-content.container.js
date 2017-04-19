import connect from 'connect';
import flowContent from 'components/tool/tool-content.component';

const mapMethodsToState = (state) => ({
  toggleMapVisibility: state.tool.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible
});

export default connect(flowContent, mapMethodsToState);
