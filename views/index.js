var mercury = require('mercury')
var h = require('micro-css/h')(mercury.h)
var renderMainParams = require('./main-params.js')
var AudioMeter = require('./audio-meter.js')

var audioMeterOptions = {red: 1, amber: 0.9, min: 0, max: 1.3, steps: 60}

module.exports = function(element, state, actions, context){
  var setupBrowser = require('./browser.js')(state.setups, actions.setups)
  var chunkBrowser = require('./browser.js')(state.chunks, actions.chunks)
  var renderEditor = require('./tabbed-editor.js')(state, actions)


  var loop = mercury.main(state, function(data){
    return h('Holder', [
      h('div.side', [
        h('div.transport', [
          AudioMeter(context.outputRms.observ, audioMeterOptions),
          renderMainParams(state.main, actions.main)
        ]),
        h('div.browser', [
          setupBrowser('Setups', 'SetupsBrowser'),
          chunkBrowser('Chunks', 'ChunksBrowser')
        ])
      ]),
      h('div.main', [
        renderEditor()
      ])
    ])
  }, mercury)

  state(loop.update)
  element.appendChild(loop.target)

  return function(){
    loop.update(state())
    console.log('force update')
  }
}