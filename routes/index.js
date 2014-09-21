/*
 * GET home page.
 */

module.exports = function(app) {
  // serve index and view partials
  app.get('/', index);
  //app.get('/partials/:name', partials);

  function index (req, res){
    res.render('public/index.html');
  }
//
//  function partials (req, res) {
//    var name = req.params.name;
//    res.render('partials/' + name);
//  }
};
