export default (nodes, nodeId) => nodes.find(n => parseInt(nodeId, 10) === parseInt(n.id, 10));
