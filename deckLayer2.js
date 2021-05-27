// https://observablehq.com/@davidbjourno/chinas-coronavirus-aviation-shutdown-animated@69


export default function define2(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("mapsContainer")).define("mapsContainer", ["html"], function(html){return(
html`<div>
        
          
            <div id="feb-13" style="height: 800px;width:1200px;border:1px solid red"></div>
          
        
      </div>`
)});

  main.variable(observer("deckGlFeb13")).define("deckGlFeb13", ["mapsContainer","deck","deckGlConfig"], function(mapsContainer,deck,deckGlConfig)
{
  const feb13Container = mapsContainer.children[0];
  // Observable hack per @pessimistress/deck-gl-tutorial
  feb13Container.innerHTML = '';

  return new deck.DeckGL({ container: feb13Container, ...deckGlConfig }); //创建GL画布
}
);
  main.variable(observer("tripsLayerFeb13")).define("tripsLayerFeb13", ["deck","tripsFeb13","layerConfig","deckGlFeb13"], function(deck,tripsFeb13,layerConfig,deckGlFeb13)
{
  const layer = new deck.TripsLayer({
    // Observable hack per @pessimistress/deck-gl-tutorial - changing the ID will force the layer to refresh when the cell reevaluates
    id: `trips-feb13-${Date.now()}`,
    data: tripsFeb13,
    ...layerConfig
  });

  deckGlFeb13.setProps({ layers: [layer] });  //添加图层
  return layer;
}
);
  main.variable(observer("deckGlConfig")).define("deckGlConfig", [], function(){return(
{
  initialViewState: {
    latitude: 38,
    longitude: 132.5,
    zoom: 2.63,
    pitch: 0,
    bearing: 0,
    altitude: 1.5
  },
  controller: true
}
)});
  main.variable(observer("layerConfig")).define("layerConfig", ["trailLength","currentTime"], function(trailLength,currentTime){return(
{
  getPath: d => d.path,
  getTimestamps: d => d.timestamps,
  getColor: d => (d.is_domestic === 0 ? [11, 94, 230] : [230, 0, 126]),
  opacity: 1,
  widthMinPixels: 2, // 流的宽度
  rounded: false,
  trailLength,
  currentTime
}
)});
  main.variable(observer("currentTime")).define("currentTime", ["loopLength","animationSpeed"], function*(loopLength,animationSpeed)
{
  while (true) {
    const timestamp = Date.now() / 1000; // Playhead i.e. real-world current time in seconds
    const loopTime = loopLength / animationSpeed; // Real-world duration of animation loop in seconds
    const time = Math.round(((timestamp % loopTime) / loopTime) * loopLength)+4500; // Animation world current “time”
    
    yield time;
  }
}
);
  main.variable(observer("animationSpeed")).define("animationSpeed", function(){return(  //速度
3000
)});
  main.variable(observer("loopLength")).define("loopLength", function(){return(  //最长时间跨度
6000
)});
  main.variable(observer("trailLength")).define("trailLength", function(){return( //流体最大长度
3000
)});

  main.variable(observer("tripsFeb13")).define("tripsFeb13", async function(){return(
(await fetch(
  // "./20200213-china-simplified-2pc-deckgl.json"
  // "./test.json"
  "./path1.json"
)).json()
)});

  main.variable(observer("deck")).define("deck", ["require"], function(require){return(
require.alias({
  h3: {},
  s2Geometry: {}
})('deck.gl@^8.1.0/dist.min.js')
)});
  return main;
}
