const test = require("node:test");
const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const when = require("../");

test("clear inside a false predicate stops future checks", async (t) => {
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

  await setImmediate();
  await setImmediate();
  await setImmediate();

  assert.equal(checks, 2);
  assert.equal(calls, 0);
});

test("clear inside a truthy predicate suppresses its callback", async (t) => {
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

  await setImmediate();

  assert.equal(calls, 0);
});

test("reset ignores a truthy result from the previous check", async (t) => {
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

  await setImmediate();

  assert.equal(checks, 3);
  assert.equal(calls, 0);
  handle.setCondition(() => true);
  await setImmediate();
  assert.equal(calls, 1);
});

test("reset inside a false predicate leaves only one cancellable poll", async (t) => {
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

  await setImmediate();
  handle.clear();
  await setImmediate();

  assert.equal(checks, 3);
  assert.equal(calls, 0);
});
