var express = require('express');
var router = express.Router();

const students = ["Ellie", "Matt", "Chonky", "Si"];

/* GET home page. */
router.get('/', function(req, res) {
  return res.json(students);
});

module.exports = router;
