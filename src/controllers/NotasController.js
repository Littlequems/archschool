exports.post = (req, res) => {
    console.log(req.fields)
    res.status(201).send('Rota POST!');
 };
 exports.get = (req, res, next) => {
    res.status(200).json({nome: 'lucas'});
};