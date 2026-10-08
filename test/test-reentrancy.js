const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const when = require("../");

beforeEach((t) => t.mock.timers.enable({ apis: ["setTimeout"] }));

test("clear inside a false predicate stops future checks", (t) => {
  let checks = 0;
  let calls = 0;
  const handle = when(
    () => {
      checks++;
      if (checks === 2) handle.clear();
      return checks >= 4;
    },
    () => calls++,
  );
  t.after(() => handle.clear());

  t.mock.timers.tick(10);
  t.mock.timers.tick(10);
  t.mock.timers.tick(10);

  assert.equal(checks, 2);
  assert.equal(calls, 0);
});

test("clear inside a truthy predicate suppresses its callback", (t) => {
  let checks = 0;
  let calls = 0;
  const handle = when(
    () => {
      checks++;
      if (checks === 2) {
        handle.clear();
        return true;
      }
      return false;
    },
    () => calls++,
  );
  t.after(() => handle.clear());

  t.mock.timers.tick(10);

  assert.equal(calls, 0);
});

test("reset ignores a truthy result from the previous check", (t) => {
  let checks = 0;
  let calls = 0;
  const handle = when(
    () => {
      checks++;
      if (checks === 2) {
        handle.reset();
        return true;
      }
      return false;
    },
    () => calls++,
  );
  t.after(() => handle.clear());

  t.mock.timers.tick(10);

  assert.equal(checks, 3);
  assert.equal(calls, 0);
  handle.setCondition(() => true);
  t.mock.timers.tick(10);
  assert.equal(calls, 1);
});

test("reset inside a false predicate leaves only one cancellable poll", (t) => {
  let checks = 0;
  let calls = 0;
  const handle = when(
    () => {
      checks++;
      if (checks === 2) handle.reset();
      return checks >= 4;
    },
    () => calls++,
  );
  t.after(() => handle.clear());

  t.mock.timers.tick(10);
  handle.clear();
  t.mock.timers.tick(10);

  assert.equal(checks, 3);
  assert.equal(calls, 0);
});
