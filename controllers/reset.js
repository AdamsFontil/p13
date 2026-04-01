const { sequelize } = require('../util/db');
const router = require('express').Router()



router.post('/', async (req, res) => {
  console.log('RESETING');
  try {
    await sequelize.sync({ force: true });
    res.status(201).json('DB HAS BEEN RESET');
  } catch (error) {
    res.status(504).json({ error: 'Failed to reset DB' })
  }
})


module.exports = router;
