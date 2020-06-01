import AddServices from 'facade/addservices';

const map = M.map({
  container: 'mapjs',
});

const mp = new AddServices();

map.addPlugin(mp);
