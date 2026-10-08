const test = require("node:test");
const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const when = require("../");

test("rejects invalid callbacks before evaluating the condition", () => {
  for (const value of [undefined, null, false, 1, "callback", {}]) {
    let checks = 0;
    assert.throws(() => when(() => checks++, value), {
      name: "TypeError",
      message: "code must be a function",
    });
    assert.equal(checks, 0);
  }
});

test("rejects invalid conditions with a named error", () => {
  for (const value of [undefined, null, false, 1, "condition", {}]) {
    assert.throws(() => when(value, () => {}), {
      name: "TypeError",
      message: "condition must be a function",
    });
  }
});

test("invalid setters preserve the previous functions", (t) => {
  let calls = 0;
  const handle = when(
    () => true,
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.throws(
    () => handle.setCondition(null),
    /condition must be a function/,
  );
  assert.throws(() => handle.setCode(null), /code must be a function/);
  handle.reset();

  assert.equal(calls, 2);
});

test("rejects Promise and callable thenable results without invoking code", async () => {
  const callable = Object.assign(() => {}, {
    then: (resolve) => resolve(false),
  });
  for (const condition of [
    async () => false,
    async () => {
      throw new Error("predicate rejected");
    },
    () => ({ then: (resolve) => resolve(false) }),
    () => callable,
  ]) {
    let calls = 0;
    assert.throws(() => when(condition, () => calls++), {
      name: "TypeError",
      message: "condition must return a synchronous value",
    });
    assert.equal(calls, 0);
  }
  await setImmediate();
});

test("a non-callable then property remains an ordinary truthy value", () => {
  let calls = 0;
  when(
    () => ({ then: 1 }),
    () => calls++,
  );
  assert.equal(calls, 1);
});

test("reset validates the replacement predicate result", (t) => {
  const handle = when(
    () => false,
    () => {},
  );
  t.after(() => handle.clear());
  handle.setCondition(async () => false);
  assert.throws(
    () => handle.reset(),
    /condition must return a synchronous value/,
  );
});

test("synchronous predicate and callback errors retain their identity", () => {
  const failure = new Error("original failure");
  assert.throws(
    () =>
      when(
        () => {
          throw failure;
        },
        () => {},
      ),
    (error) => error === failure,
  );
  assert.throws(
    () =>
      when(
        () => true,
        () => {
          throw failure;
        },
      ),
    (error) => error === failure,
  );
});
