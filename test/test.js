const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const when = require("../");

beforeEach((t) => t.mock.timers.enable({ apis: ["setTimeout"] }));

test("calls the callback synchronously when the initial condition is truthy", (t) => {
  let calls = 0;
  const handle = when(
    () => "ready",
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.equal(calls, 1);
});

test("checks a false condition again and calls the callback once", (t) => {
  let ready = false;
  let calls = 0;
  const handle = when(
    () => ready,
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.equal(calls, 0);
  ready = true;
  t.mock.timers.tick(10);
  assert.equal(calls, 1);
  t.mock.timers.tick(10);
  assert.equal(calls, 1);
});

test("uses replacement condition and callback while active", (t) => {
  let oldCalls = 0;
  let newCalls = 0;
  const handle = when(
    () => false,
    () => oldCalls++,
  );
  t.after(() => handle.clear());

  handle.setCondition(() => true);
  handle.setCode(() => newCalls++);
  t.mock.timers.tick(10);

  assert.equal(oldCalls, 0);
  assert.equal(newCalls, 1);
});

test("setters do not restart a completed controller", (t) => {
  let calls = 0;
  const handle = when(
    () => true,
    () => calls++,
  );
  t.after(() => handle.clear());

  handle.setCondition(() => true);
  handle.setCode(() => calls++);
  t.mock.timers.tick(10);

  assert.equal(calls, 1);
});
