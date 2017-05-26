// See https://github.com/sei-international/TRASE/issu  es/112
export default (node) => {
  return `./factsheet-${node.profileType}.html?nodeId=${node.id}`;
};
