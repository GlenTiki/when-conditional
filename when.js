require("setimmediate");

function when(condition, code) {
  let immediate;
  let generation = 0;

  function checkCondition() {
    const currentGeneration = generation;
    const ready = condition();
    if (currentGeneration !== generation) return;

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
    condition = newCondition;
  }

  function setCode(newCode) {
    code = newCode;
  }

  checkCondition();
  return { clear, reset, setCondition, setCode };
}

module.exports = when;
