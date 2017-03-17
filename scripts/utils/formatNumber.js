export default (number, isPercentage)  => {
  let maximumFractionDigits = 1;

  if (number === null || number === undefined || typeof number !== 'number') return 'N/A';

  if (number === 0) return number;

  if (isPercentage) {
    number *= 100;
  } else {
    if (number > 0 && number < 1) {
      maximumFractionDigits = 4;
    }
  }

  return parseFloat(number).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits
  });
};
