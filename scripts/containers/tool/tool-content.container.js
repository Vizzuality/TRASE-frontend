import connect from 'connect';
import ToolContent from 'components/tool/tool-content.component';

const mapMethodsToState = (state) => ({
  toggleMapVisibility: state.tool.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible,
  showLoaderAtInitialLoad: state.tool.initialDataLoading,
  showLoader: state.tool.linksLoading,
  toggleError: {
    _comparedValue: (state) => state.tool.links,
    _returnedValue: (state) => {
      // return (state.tool.links && links.length === 0)
      // TODO hack, fix needed on the API, see https://basecamp.com/1756858/projects/12498794/todos/323528801
      const has2015 = state.tool.selectedYears[0] <= 2015 && state.tool.selectedYears[1] >= 2015;
      return !state.tool.links || state.tool.links.length === 0 || (state.tool.selectedResizeByName === 'AGROSATELITE_SOY_DEFOR_' && has2015);
    }
  }
});

export default connect(ToolContent, mapMethodsToState);
