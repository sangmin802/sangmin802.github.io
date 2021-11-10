export function debounce() {
  let timer = null
  return function debounceAct(callback, time) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(callback, time)
  }
}
