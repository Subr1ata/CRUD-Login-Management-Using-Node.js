// const { query } = require('express');
var express = require('express');
// const { request } = require('../app');
var router = express.Router();

var database = require('../database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', session: req.session });
});

router.post('/login', function(request,response,next){

  var user_email_address = request.body.user_email_address;

  var user_password = request.body.user_password;

  if(user_email_address && user_password){

    var query = `
    SELECT * FROM registration 
    WHERE email = "${user_email_address}"
    `;

    database.query(query,function(error,data){
      if(data.length > 0)
      {
        for(var count = 0; count < data.length; count++)
        {
          if(data[count].password == user_password)
          {
            request.session.id = data[count].id;
            response.redirect('/sample_data');
          }
          else{
            response.send('Incorrect Password');
          }
        }

      }
      else
      {
        response.send('Incorrect Email Address');

      }
      response.end();
    });

  }else{
    response.send('Please enter Email Address and Password Details');
    response.end();
  }

});

router.get('/logout', function(request,response,next){

  request.session.destroy();

  response.redirect('/');
});

module.exports = router;