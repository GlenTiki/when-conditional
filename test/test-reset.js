const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const when = require("../");

beforeEach((t) => t.mock.timers.enable({ apis: ["setTimeout"] }));

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

test("a callback can reset the controller after asynchronous success", (t) => {
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
  t.mock.timers.tick(10);
  assert.equal(calls, 1);
  ready = true;
  t.mock.timers.tick(10);
  assert.equal(calls, 2);
  t.mock.timers.tick(10);
  assert.equal(calls, 2);
});
