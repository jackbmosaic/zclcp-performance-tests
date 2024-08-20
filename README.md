# Performance Testing - Zero Click Lung Cancer Prediction

Performance tests for zcLCP

TypeScript, k6

## Set up

**Install k6**

https://k6.io/docs/get-started/installation/

**Install dependencies**

Clone the generated repository on your local machine, move to the project root folder and install the dependencies defined in [`package.json`](./package.json)

```bash
npm install
```

## Running the test

To run a test written in TypeScript, we first have to transpile the TypeScript code into JavaScript running a bundler. This project uses `Babel` and `Webpack` to bundle the different files into ES modules (ESM), using its [`webpack.config.js`](./webpack.config.js) configuration.

The next command transforms each TypeScript test in `./src` to the `./dist` folder as ES modules.

```bash
npm run bundle
```

Once that is done, we can run our script the same way we usually do, for instance:

```bash
k6 run dist/get-job-test.js
```

**See also**

- [Using k6 / Modules](https://grafana.com/docs/k6/latest/using-k6/modules/)
- [Using k6 / JavaScript compatibility mode](https://grafana.com/docs/k6/latest/using-k6/javascript-compatibility-mode/)
- [grafana/k6-rollup-example](https://github.com/grafana/k6-rollup-example)
