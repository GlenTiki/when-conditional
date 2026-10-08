const test = require("node:test");
const assert = require("node:assert/strict");
const { setImmediate } = require("node:timers/promises");
const when = require("../");

test("calls the callback synchronously when the initial condition is truthy", (t) => {
  let calls = 0;
  const handle = when(
    () => "ready",
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.equal(calls, 1);
});

test("checks a false condition again and calls the callback once", async (t) => {
  let ready = false;
  let calls = 0;
  const handle = when(
    () => ready,
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.equal(calls, 0);
  ready = true;
  await setImmediate();
  assert.equal(calls, 1);
  await setImmediate();
  assert.equal(calls, 1);
});

test("uses replacement condition and callback while active", async (t) => {
  let oldCalls = 0;
  let newCalls = 0;
  const handle = when(
    () => false,
    () => oldCalls++,
  );
  t.after(() => handle.clear());

  handle.setCondition(() => true);
  handle.setCode(() => newCalls++);
  await setImmediate();

  assert.equal(oldCalls, 0);
  assert.equal(newCalls, 1);
});

test("setters do not restart a completed controller", async (t) => {
  let calls = 0;
  const handle = when(
    () => true,
    () => calls++,
  );
  t.after(() => handle.clear());

  handle.setCondition(() => true);
  handle.setCode(() => calls++);
  await setImmediate();

  assert.equal(calls, 1);
});
