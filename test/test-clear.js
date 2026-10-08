const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const when = require("../");

beforeEach((t) => t.mock.timers.enable({ apis: ["setTimeout"] }));

test("clear stops future checks and is safe to repeat", (t) => {
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
  t.mock.timers.tick(10);

  assert.equal(checks, 1);
  assert.equal(calls, 0);
});

test("setters do not restart a cancelled controller", (t) => {
  let calls = 0;
  const handle = when(
    () => false,
    () => calls++,
  );
  t.after(() => handle.clear());

  handle.clear();
  handle.setCondition(() => true);
  handle.setCode(() => calls++);
  t.mock.timers.tick(10);

  assert.equal(calls, 0);
});
