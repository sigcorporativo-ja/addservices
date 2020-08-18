import AddServices from 'facade/addservices';

const map = M.map({
  // layers: [new M.layer.OSM()],
  container: 'mapjs',
  controls: ['layerswitcher'],
});

const mp = new AddServices({
  http: false,
  https: true,
});

map.addPlugin(mp);

/* map.addWMS(new M.layer.WMS({
  url: 'http://www.ideandalucia.es/wms/mdt_2016',
  name: 'modelo_digital_terreno_2016_color'
})); */

// WMS for testing: http://www.ign.es/wms-inspire/mapa-raster
