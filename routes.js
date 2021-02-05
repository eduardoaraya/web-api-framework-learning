module.exports = (app) => {
  app.route('/', (req, res) => {
    res.end('Ok');
  })
}