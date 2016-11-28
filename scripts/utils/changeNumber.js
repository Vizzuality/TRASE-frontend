export default (number, type)  => {
  let numberChange;

  if(number != null){
    if(number > 0) {
      if(type === 'percentage') {
        numberChange = (number * 100).toFixed(1);
      } else{
        numberChange = number.toFixed(1);
      }
    } else {
      if(number != 0){
        numberChange = number.toFixed(4);
      } else {
        numberChange = 0;
      }
    }
  } else{ // if is null
    numberChange = 0;
  }

  return numberChange.toLocaleString();
};
