import connect from 'connect';
import ToolContent from 'components/tool/tool-content.component';

const mapMethodsToState = (state) => ({
  toggleMapVisibility: state.tool.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible,
  showLoaderAtInitialLoad: state.tool.initialDataLoading,
  showLoader: state.tool.linksLoading,
  toggleError: state.tool.links
});

export default connect(ToolContent, mapMethodsToState);
