'use strict';

/**
 * compare renderToString
 */
const os = require('os');
const fs = require('fs');
const path = require('path');
const Benchmark = require('benchmark');
const xtemplate = require('xtemplate');
const Rax = require('rax');
const raxRenderToString = require('rax-server-renderer').renderToString;
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Vue = require('vue');
const vueRenderToString = require('vue-server-renderer').createRenderer().renderToString;
const Preact = require('preact');
const preactRenderToString = require('preact-render-to-string');
const InfernoServer = require('inferno-server');
const infernoCreateElement = require('inferno-create-element');

const reactPkg = require('react/package.json');
const raxPkg = require('rax/package.json');
const infernoPkg = require('inferno/package.json');
const preactPkg = require('preact/package.json');
const vuePkg = require('vue/package.json');
const markoPkg = require('marko/package.json');
const xtemplatePkg = require('xtemplate/package.json');

const ReactApp = require('../assets/build/server.react.bundle').default;
const RaxApp = require('../assets/build/server.rax.bundle').default;
const VueApp = require('../assets/build/server.vue.bundle').default;
const PreactApp = require('../assets/build/server.preact.bundle').default;
const MarkoApp = require('../assets/build/server.marko.bundle');
const InfernoApp = require('../assets/build/server.inferno.bundle').default;

const xtplPath = path.join(__dirname, '../assets/src/app/index.xtpl');
const xtplString = fs.readFileSync(xtplPath, 'utf8');
const xtpl = xtemplate.compile(xtplString);

const data = {
  listData: require('../mock/list'),
  bannerData: require('../mock/banner')
};

const suite = new Benchmark.Suite;

console.log('| package                       |    ops/sec    |        runs sampled |')
console.log('| ----------------------------- | :-----------: | ------------------: |')

suite
  .add(`React(${reactPkg.version})#renderToString`, function() {
    ReactDOMServer.renderToString(React.createElement(ReactApp, data));
  })
  .add(`Rax(${raxPkg.version})#renderToString`, function() {
    raxRenderToString(Rax.createElement(RaxApp, data));
  })
  .add(`Inferno(${infernoPkg.version})#renderToString`, function() {
    InfernoServer.renderToString(infernoCreateElement.createElement(InfernoApp, data));
  })
  .add(`Preact(${preactPkg.version})#renderToString`, function() {
    preactRenderToString(Preact.h(PreactApp, data));
  })
  .add(`Vue(${vuePkg.version})#renderToString`, function(deferred) {
    const vueVm = new Vue({
      render(h) {
        return h(VueApp, {
          attrs: {
            listData: data.listData,
            bannerData: data.bannerData
          }
        });
      }
    });
    // Do not call deferred.resolve in the callback of renderToString, it will bring more delay time
    vueRenderToString(vueVm).then(html => {
      deferred.resolve();
    });
  }, {defer: true})
  .add(`Marko(${markoPkg.version})#renderToString`, function() {
    MarkoApp.renderToString(data);
  })
  .add(`xtemplate(${xtemplatePkg.version})#render`, function(){
    const xtplApp = new xtemplate(xtpl);
    xtplApp.render(data);
  })
  .on('cycle', function(event) {
    var pm = '\xb1';
    var hz = event.target.hz;
    var size = event.target.stats.sample.length;
    var name = event.target.name || (_.isNaN(id) ? id : '<Test #' + id + '>');
    var ops = formatNumber(hz.toFixed(hz < 100 ? 2 : 0)) + ' ' + pm + event.target.stats.rme.toFixed(2);
    var runs = '% (' + size + ' run' + (size == 1 ? '' : 's') + ' sampled)';
    console.log(`| ${name} | ${ops} | ${runs} |`)
    // const t = event.target.stats.mean;
    // console.log('mean:' + (t*1000000).toFixed(6) + 'μs');
  })
  .on('complete', function() {
    console.log();
    console.log('The benchmark was run on:');
    const osInformation = getOSInformation();
    Object.keys(osInformation).map(info => {
      console.log('   ' + info.toUpperCase() + ': ' + osInformation[info]);
    });
  })
  // run async
  .run({ 'async': true });

function getOSInformation() {
  return {
    platform: os.platform() + ' ' + os.release(),
    cpu: os.cpus()[0].model,
    'system memory': os.totalmem() / ( 1024 * 1024 * 1024 ) + 'GB',
    'node version': process.version
  };
}

/**
 * Converts a number to a more readable comma-separated string representation.
 *
 * @static
 * @memberOf Benchmark
 * @param {number} number The number to convert.
 * @returns {string} The more readable string representation.
 */
function formatNumber(number) {
  number = String(number).split('.');
  return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') +
    (number[1] ? '.' + number[1] : '');
}
