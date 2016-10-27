// calculates offsets relative to document
// add as many offsets you need
function calculateOffsets(el) {
  const absoluteOffsetTop = el.getBoundingClientRect().top;
  let top;

  if (!window.pageYOffset) {
    top = Math.abs(absoluteOffsetTop);
  } else {
    top = window.pageYOffset > absoluteOffsetTop ?
      window.pageYOffset + absoluteOffsetTop : window.pageYOffset + Math.abs(absoluteOffsetTop);
  }
  
  return {
    top
  };
}

function scrollDocument (el, offsets) {
  var scrollTop = window.pageYOffset;

  el.classList.toggle('is-fixed', scrollTop >= offsets.top);
}

export { calculateOffsets, scrollDocument };
