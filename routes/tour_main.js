var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
// var dateTime = require('node-datetime');



/* GET COVE TOURS HOME PAGE. */
router.get('/', (req, res) => {
res.render('tour_main/tourHome', { title: 'Cove Tours | Home', my_session: req.session});
});


module.exports = router;
