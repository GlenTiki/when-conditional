const test = require("node:test");
const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const when = require("../");

test("reset checks a cancelled controller synchronously", (t) => {
  let ready = false;
  let calls = 0;
  const handle = when(
    () => ready,
    () => calls++,
  );
  t.after(() => handle.clear());

  handle.clear();
  ready = true;
  handle.reset();

  assert.equal(calls, 1);
});

test("reset checks a completed controller synchronously", (t) => {
  let calls = 0;
  const handle = when(
    () => true,
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.equal(calls, 1);
  handle.reset();
  assert.equal(calls, 2);
});

test("a callback can reset the controller after asynchronous success", async (t) => {
  let ready = false;
  let calls = 0;
  const handle = when(
    () => ready,
    () => {
      calls++;
      if (calls === 1) {
        ready = false;
        handle.reset();
      }
    },
  );
  t.after(() => handle.clear());

  ready = true;
  await setImmediate();
  assert.equal(calls, 1);
  ready = true;
  await setImmediate();
  assert.equal(calls, 2);
  await setImmediate();
  assert.equal(calls, 2);
});
