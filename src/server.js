const Hapi = require('@hapi/hapi');
const routes = require('./routes');
require('dotenv').config();
 
const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: '0.0.0.0',
    routes: {
      payload: {
        maxBytes: 1048576 * 10,
      },
    }
  });
 
  server.route(routes);
  
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();