const router = require('express').Router()
const { rollbackMigration, runMigrations } = require('../util/db')



router.post('/', async (req, res) => {
  console.log('RESETING');
  try {
    await rollbackMigration()
    await runMigrations()
    res.status(201).json('DB HAS BEEN RESET');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reset DB' });
  }
});

module.exports = router;
