# Server-side Rendering Comparison

## Benchmark info

- With `NODE_ENV=production`. `renderToString` both require from `lib` not `dist`.
- With about 600 dom nodes.

## Run

```bash
# prepare
npm install
npm run webpack

# run renderToString benchmark
npm run benchmark
```

## Result

> <https://github.com/raxjs/server-side-rendering-comparison/commit/04fdfec8aa8626312ad3e2c0c6a57c6f735ad6de/checks?check_suite_id=401266841>

```bash
| package                       |    ops/sec    |        runs sampled |
| ----------------------------- | :-----------: | ------------------: |
| React(17.0.1)#renderToString | 1,780 ±1.16 | % (86 runs sampled) |
| Rax(1.1.4)#renderToString | 9,069 ±0.91 | % (86 runs sampled) |
| Inferno(7.4.6)#renderToString | 5,256 ±2.00 | % (85 runs sampled) |
| Preact(10.5.7)#renderToString | 1,309 ±0.71 | % (86 runs sampled) |
| Vue(2.6.12)#renderToString | 1,123 ±1.69 | % (79 runs sampled) |
| Marko(4.23.9)#renderToString | 14,579 ±0.80 | % (86 runs sampled) |
| xtemplate(4.7.2)#render | 27,178 ±4.30 | % (84 runs sampled) |

The benchmark was run on:
   PLATFORM: linux 5.0.0-1027-azure
   CPU: Intel(R) Xeon(R) CPU E5-2673 v4 @ 2.30GHz
   SYSTEM MEMORY: 6.782737731933594GB
   NODE VERSION: v10.18.1
```

| package                       |   ops/sec    |        runs sampled |
| ----------------------------- | :----------: | ------------------: |
| React(17.0.1)#renderToString  | 1,780 ±1.16  | % (86 runs sampled) |
| Rax(1.1.4)#renderToString     | 9,069 ±0.91  | % (86 runs sampled) |
| Inferno(7.4.6)#renderToString | 5,256 ±2.00  | % (85 runs sampled) |
| Preact(10.5.7)#renderToString | 1,309 ±0.71  | % (86 runs sampled) |
| Vue(2.6.12)#renderToString    | 1,123 ±1.69  | % (79 runs sampled) |
| Marko(4.23.9)#renderToString  | 14,579 ±0.80 | % (86 runs sampled) |
| xtemplate(4.7.2)#render       | 27,178 ±4.30 | % (84 runs sampled) |

- Result run by [Github Actions](https://github.com/raxjs/server-side-rendering-comparison/actions)
