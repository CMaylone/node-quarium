/*
 * GET home page.
 */

module.exports = function(app) {
  // serve index and view partials
  app.get('/', index);

  function index (req, res){
    res.render('public/index.html');
  }
};
