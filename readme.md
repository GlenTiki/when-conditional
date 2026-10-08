# when-conditional

Check a synchronous condition until it becomes truthy, then call a callback once.

```sh
npm install when-conditional
```

Requires Node.js 22.13 or later. CI tests Node.js 22, 24 and 26. Browsers need a bundler that accepts CommonJS and a JavaScript environment that supports ES2022 and standard timers. This package does not install global polyfills.

## Usage

```js
const when = require("when-conditional");

let ready = false;
const controller = when(
  () => ready,
  () => console.log("Ready"),
  { interval: 10 },
);

setTimeout(() => {
  ready = true;
}, 100);
```

Native ES modules can use `import when from 'when-conditional'`.

## API

### `when(condition, code, { interval = 10 } = {})`

Both `condition` and `code` must be functions. The first condition check runs synchronously. If it returns a truthy value, `code()` runs before `when()` returns. The callback's return value is ignored.

When the condition is false, another check runs after the configured interval. `interval` is a positive integer in milliseconds, from `1` to `2147483647`. It defaults to `10`. Timer delays are not exact deadlines; a busy event loop can delay a check.

Conditions must return synchronous values. Promise results and values with a callable `then` property raise a `TypeError`, even if they would resolve to `false`. The package consumes their rejection through `Promise.resolve()`, which also invokes a custom thenable's `then` method. It does not wait for their result.

A predicate error stops that polling chain. Errors in the initial check or a synchronous `reset()` check throw to the caller. Errors during a later check throw from the timer callback. There is no asynchronous error callback.

### `controller.clear()`

Cancel future checks. Repeated calls are safe. Calling `clear()` inside the condition also discards that check's result, so it cannot invoke the callback or schedule another check.

There is no timeout. Call `clear()` when you no longer need to wait. An active polling timer keeps Node.js running.

### `controller.reset()`

Cancel the current check cycle and check the condition again synchronously. Use this after cancellation or completion to wait again.

Calling `reset()` inside the condition invalidates the old check's result. Only the new cycle can complete or schedule another check. A condition that always calls `reset()` recursively can exhaust the call stack.

### `controller.setCondition(condition)`

Replace the condition function. This does not run it immediately or restart a cancelled or completed controller. A non-function raises a `TypeError`.

### `controller.setCode(code)`

Replace the callback function. This does not restart a cancelled or completed controller. A non-function raises a `TypeError`.

## Cancellation example

```js
const controller = when(
  () => connection.isReady(),
  () => connection.send(message),
  { interval: 50 },
);

controller.clear();
controller.setCondition(() => replacementConnection.isReady());
controller.setCode(() => replacementConnection.send(message));
controller.reset();
```

Set replacement functions before `reset()`: its synchronous check can call the callback immediately.

## Migration from version 2

Version 3 polls every 10 ms by default instead of on every event-loop turn. Pass an explicit `interval` if you need a different delay. The first check and each reset still run synchronously.

Version 3 requires Node.js 22.13 or later and removes the `setimmediate` polyfill dependency. It validates functions and interval values, and rejects Promise and thenable predicate results. Callers that relied on those results being truthy must use a synchronous condition instead.

## Contributing

1. Run `npm ci` to install development dependencies.
2. Run `npm test` to run the tests.
3. Run `npm run check` to run lint, complexity, format and test checks.
4. Run `npm run setup-hooks` to run those checks before each commit.

`setup-hooks` sets this checkout's `core.hooksPath` to `.githooks`. If you already use a custom hook path, add `npm run check` to that hook instead. Installing this package does not change Git configuration.

Report bugs or propose changes on [GitHub](https://github.com/GlenTiki/when-conditional).

## License

[MIT](LICENSE), copyright 2015 Glen Keane.
