export default (mapDimensions, selectedMapDimensionsUids) => {
  return mapDimensions.filter(d => selectedMapDimensionsUids.indexOf(d.uid) > -1 && d.disabledYearRangeReason !== undefined).map(d => d.disabledYearRangeReason);
};
