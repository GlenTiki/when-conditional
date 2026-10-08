const test = require("node:test");
const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const when = require("../");

test("clear stops future checks and is safe to repeat", async (t) => {
  let checks = 0;
  let calls = 0;
  const handle = when(
    () => {
      checks++;
      return false;
    },
    () => calls++,
  );
  t.after(() => handle.clear());

  handle.clear();
  handle.clear();
  await setImmediate();

  assert.equal(checks, 1);
  assert.equal(calls, 0);
});

test("setters do not restart a cancelled controller", async (t) => {
  let calls = 0;
  const handle = when(
    () => false,
    () => calls++,
  );
  t.after(() => handle.clear());

  handle.clear();
  handle.setCondition(() => true);
  handle.setCode(() => calls++);
  await setImmediate();

  assert.equal(calls, 0);
});
