export function debounce() {
  let timer = null;
  return function debounceAct(callback, time) {
    if (timer) clearTimeout(timer);
    setTimeout(callback, time);
  };
}
