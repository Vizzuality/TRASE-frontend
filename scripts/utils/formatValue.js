import { NUM_DECIMALS, NUM_DECIMALS_DEFAULT } from 'constants';

// returns a value rounded to numDecimals
export default (value, quantDecimals, quantName) => {
  if (value === undefined) {
    return '???';
  }
  let maximumFractionDigits = NUM_DECIMALS_DEFAULT;

  if (quantDecimals !== undefined && quantDecimals !== null) {
    maximumFractionDigits = parseInt(quantDecimals);
  } else if (NUM_DECIMALS[quantName] !== undefined) {
    maximumFractionDigits = NUM_DECIMALS[quantName];
  }

  return value.toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits
  });

};
