import getNodeMetaUid from './getNodeMetaUid';

export default function(mapVariables) {
  mapVariables.forEach(variable => {
    variable.uid = getNodeMetaUid(variable.type, variable.id);
  });

  return mapVariables;
}
