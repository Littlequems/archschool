const NotasController = require('../Controllers/NotasController');
module.exports = (app) => {
   app.post('/notas-admin', NotasController.post);
   app.get('/notas-admin', NotasController.get);
   app.get('/get-aluno/:id', NotasController.getAluno);
   app.get('/get-all', NotasController.getAll);
   app.put('/notas-admin', NotasController.edit);
}