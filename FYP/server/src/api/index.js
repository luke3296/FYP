const express = require('express');

const emojis = require('./emojis');
const pdbs = require('./pdbs');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

//mount the pdbs router. api requests will be prepened with /pdbs/
router.use('/pdbs', pdbs)

module.exports = router;
