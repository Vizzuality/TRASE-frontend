// builds an URL usable to call the API, using params
export default (endpoint, params) => {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}${arrCurrent}`;
      },'');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_URL}${endpoint}?`);
};
