require("setimmediate");

function when(condition, code, options = {}) {
  assertFunction(condition, "condition");
  assertFunction(code, "code");
  const interval = getInterval(options);
  let timer;
  let generation = 0;

  function checkCondition() {
    const currentGeneration = generation;
    const ready = condition();
    const asynchronous = ready != null && typeof ready.then === "function";
    if (asynchronous) Promise.resolve(ready).catch(() => {});
    if (currentGeneration !== generation) return;
    if (asynchronous) {
      throw new TypeError("condition must return a synchronous value");
    }

    if (ready) {
      clear();
      code();
    } else {
      timer = setTimeout(checkCondition, interval);
    }
  }

  function clear() {
    generation++;
    clearTimeout(timer);
  }

  function reset() {
    clear();
    checkCondition();
  }

  function setCondition(newCondition) {
    assertFunction(newCondition, "condition");
    condition = newCondition;
  }

  function setCode(newCode) {
    assertFunction(newCode, "code");
    code = newCode;
  }

  checkCondition();
  return { clear, reset, setCondition, setCode };
}

function assertFunction(value, name) {
  if (typeof value !== "function") {
    throw new TypeError(`${name} must be a function`);
  }
}

function getInterval(options) {
  if (
    options === null ||
    typeof options !== "object" ||
    Array.isArray(options)
  ) {
    throw new TypeError("options must be an object");
  }
  const { interval = 10 } = options;
  if (!Number.isInteger(interval) || interval < 1 || interval > 2147483647) {
    throw new RangeError("interval must be an integer from 1 to 2147483647");
  }
  return interval;
}

module.exports = when;
