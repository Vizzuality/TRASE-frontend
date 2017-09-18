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
      // console.log(state)
      // TODO hack, fix needed on the API, see https://basecamp.com/1756858/projects/12498794/todos/323528801
      // Note: only start date is required to be checked as we disabled multi year selection
      // return state.tool.selectedResizeBy.name === 'AGROSATELITE_SOY_DEFOR_' && (state.tool.selectedYears[0] === 2015 || state.tool.selectedYears[0] === 2016);
      return state.tool.links === null;
    }
  }
});

export default connect(ToolContent, mapMethodsToState);
