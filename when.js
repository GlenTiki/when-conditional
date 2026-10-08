require("setimmediate");

function when(condition, code) {
  assertFunction(condition, "condition");
  assertFunction(code, "code");
  let immediate;
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
      immediate = setImmediate(checkCondition);
    }
  }

  function clear() {
    generation++;
    clearImmediate(immediate);
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

module.exports = when;
