export function throttle() {
  let boolean = false;
  return function throttleAct(callback) {
    if (!callback) return (boolean = false);
    if (boolean) return;
    boolean = true;
    callback();
    return;
  };
}
