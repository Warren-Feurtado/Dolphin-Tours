var express = require('express');
var router = express.Router();
var conn = require('../lib/db');


/*-------------------- ADMIN AUTHENTICATION --------------------*/

  /* GET ADMIN-LOGIN-FORM. */
router.get('/admin', (req, res) => {
    res.render('admin/admin_login', { title: 'Dolphin Cove | Admin Login'});
});

// ADMIN LOGIN Authentication
router.post('/admin/check', function(req, res, next) {
       
    var email = req.body.email;
    var password = req.body.password;
   
    conn.query('SELECT * FROM admin WHERE adm_email = ? AND BINARY adm_pss = ?', [email, password], function(err, results, fields) {
         

      if (results.length <= 0) {
          req.flash('error', 'Invalid credentials Please try again!');
          res.redirect('/login/admin');
      }
      else {            
          req.session.loggedin = true;
          req.session.adm_id = results[0].id;
          req.session.adm_fnm = results[0].adm_fnm;
          req.session.adm_lnm = results[0].adm_lnm;
          req.session.pos = results[0].pos;
          req.flash('success', 'Welcome Admin!');
          res.redirect('/admin');
          console.log(req.session.adm_fnm);
      }            
    });
  });

  // ADMIN LOGOUT 
router.get('/logout', function (req, res) {
  req.session.destroy();
//   req.flash('success', 'Enter Your Login Credentials');
  res.redirect('/login/admin');
});

  module.exports = router;