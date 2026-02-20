export function microTask(fn: () => void) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(fn);
    return;
  }

  if (typeof Promise === "function") {
    Promise.resolve().then(fn);
    return;
  }

  if (typeof MutationObserver === "function") {
    const text = document.createTextNode("");
    const observer = new MutationObserver(fn);
    observer.observe(text, { characterData: true });
    text.data = "1";
    return;
  }

  const nextTick = Reflect.get(Object(process), "nextTick");
  if (typeof nextTick === "function") {
    nextTick(fn);
    return;
  }

  if (typeof setImmediate === "function") {
    setImmediate(fn);
    return;
  }

  // Fallback
  setTimeout(fn, 0);
}
