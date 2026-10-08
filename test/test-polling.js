const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const when = require("../");

beforeEach((t) => t.mock.timers.enable({ apis: ["setTimeout"] }));

test("the default poll waits 10 ms after the synchronous initial check", (t) => {
  let ready = false;
  let checks = 0;
  let calls = 0;
  const handle = when(
    () => {
      checks++;
      return ready;
    },
    () => calls++,
  );
  t.after(() => handle.clear());

  assert.equal(checks, 1);
  ready = true;
  t.mock.timers.tick(9);
  assert.equal(checks, 1);
  t.mock.timers.tick(1);
  assert.equal(checks, 2);
  assert.equal(calls, 1);
  t.mock.timers.tick(100);
  assert.equal(calls, 1);
});

test("each unsuccessful poll waits the configured interval", (t) => {
  let checks = 0;
  const handle = when(
    () => {
      checks++;
      return false;
    },
    () => {},
    { interval: 25 },
  );
  t.after(() => handle.clear());

  t.mock.timers.tick(24);
  assert.equal(checks, 1);
  t.mock.timers.tick(1);
  assert.equal(checks, 2);
  t.mock.timers.tick(24);
  assert.equal(checks, 2);
  t.mock.timers.tick(1);
  assert.equal(checks, 3);
});

test("clear cancels a pending timer and reset reuses the chosen interval", (t) => {
  let checks = 0;
  const handle = when(
    () => {
      checks++;
      return false;
    },
    () => {},
    { interval: 50 },
  );
  t.after(() => handle.clear());

  handle.clear();
  t.mock.timers.tick(100);
  assert.equal(checks, 1);
  handle.reset();
  assert.equal(checks, 2);
  t.mock.timers.tick(49);
  assert.equal(checks, 2);
  t.mock.timers.tick(1);
  assert.equal(checks, 3);
});

test("rejects invalid options before running the predicate", () => {
  for (const options of [null, false, 1, "options", []]) {
    let checks = 0;
    assert.throws(
      () =>
        when(
          () => {
            checks++;
            return true;
          },
          () => {},
          options,
        ),
      /options must be an object/,
    );
    assert.equal(checks, 0);
  }
});

test("rejects intervals outside the supported timer range", () => {
  for (const interval of [0, -1, 0.5, NaN, Infinity, 2147483648, "10", null]) {
    assert.throws(
      () =>
        when(
          () => true,
          () => {},
          { interval },
        ),
      {
        name: "RangeError",
        message: "interval must be an integer from 1 to 2147483647",
      },
    );
  }
});

test("a Promise returned after cancellation is discarded without a rejection leak", async (t) => {
  const handle = when(
    () => false,
    () => assert.fail("cancelled callback"),
  );
  t.after(() => handle.clear());
  handle.setCondition(() => {
    handle.clear();
    return Promise.reject(new Error("discarded result"));
  });
  t.mock.timers.tick(10);
  await new Promise(setImmediate);
});

test("a Promise returned during a later poll throws and ends that poll chain", () => {
  const output = execFileSync(
    process.execPath,
    [
      "-e",
      `
    const when = require(process.argv[1]);
    process.once("uncaughtException", (error) => {
      console.log(JSON.stringify({ name: error.name, message: error.message }));
    });
    let checks = 0;
    when(() => ++checks === 1 ? false : Promise.resolve(false), () => {
      throw new Error("unexpected callback");
    });
  `,
      require.resolve("../"),
    ],
    { encoding: "utf8", timeout: 5000 },
  );
  assert.deepEqual(JSON.parse(output), {
    name: "TypeError",
    message: "condition must return a synchronous value",
  });
});
