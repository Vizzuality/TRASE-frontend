import { NUM_DECIMALS, NUM_DECIMALS_DEFAULT } from 'constants';

// returns a value rounded to numDecimals
export default (value, numDecimals, dimensionName) => {
  if (value === undefined) {
    return '???';
  }
  let maximumFractionDigits = NUM_DECIMALS_DEFAULT;

  if (numDecimals !== undefined && numDecimals !== null) {
    maximumFractionDigits = parseInt(numDecimals);
  } else if (NUM_DECIMALS[dimensionName] !== undefined) {
    maximumFractionDigits = NUM_DECIMALS[dimensionName];
  }

  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits
  });

};
