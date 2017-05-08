import LegendChoroTemplate from 'ejs!templates/tool/map/legend-choro.ejs';
import 'style/components/tool/map/map-legend.scss';
import { PROFILE_CHOROPLETH_CLASSES } from 'constants';
import abbreviateNumber from 'utils/abbreviateNumber';

export default (selector, legend, { title, bucket }) => {
  const el = document.querySelector(selector);

  const legendTemplate = LegendChoroTemplate({
    title,
    cssClass: '-horizontal -profile',
    colors: PROFILE_CHOROPLETH_CLASSES,
    bucket,
    abbreviateNumber: (x, y, index) => (index === 0  ? `<${abbreviateNumber(x, 0)}` : `>${abbreviateNumber(x, 0)}`),
    isBidimensional: false
  });

  const container = el.querySelector(legend);
  container.classList.add('c-map-legend-choro');
  container.innerHTML = legendTemplate;
};