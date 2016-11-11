export default (number, type)  => {

  let numberChange;

  if(number != null){
    if(number > 0) {
      if(type === 'top') {
        numberChange = (number * 100).toFixed(1);
      } else{
        numberChange = number.toFixed(1);
      }
    } else {
      if(number != 0){
        numberChange = number.toFixed(10);
      } else {
        numberChange = 0;
      }
    }
  } else{ // if is null
    numberChange = 'N/A';
  }

  return numberChange;
};
