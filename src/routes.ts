export default (app) => {
  app.route('/', (req, res) => {
    res.end('Ok');
  })
}