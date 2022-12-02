var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/latest', function(req, res, next) {
  console.log("called latest here")
  return res.status(200).json({that:"is the beginning"});
});

module.exports = router;
