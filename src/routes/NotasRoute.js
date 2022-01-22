const NotasController = require('../Controllers/NotasController');
module.exports = (app) => {
   app.post('/notasadmin', NotasController.post);
   app.get('/notasadmin', NotasController.get);
}