var express = require('express');
var router = express.Router();

var ctrl_starter =  require('../controller/starter.controller')

/* GET home page. */
router.post('/Wettkampf', ctrl_starter.createWettkampf)
router.post('/Start', ctrl_starter.createStart)

router.get('/Wettkampf', ctrl_starter.getAllWettkampf)
router.get('/Starterliste', ctrl_starter.getStarterliste)

router.delete('/Start', ctrl_starter.DeleteStarter)
router.put('/Start', ctrl_starter.UpdateStarter)
module.exports = router;
