const router = require('express').Router()
const { Session } = require('../models');
const tokenExtractor = require('../util/middleware')


router.delete('/', tokenExtractor, async (req, res) => {
  try {
    await Session.destroy({
      where: { user_id: req.targetSession.userId}
    })
    return res.status(204).end()
  } catch (error) {
    return res.status(501).json({ error: 'Something else went wrong with logout'})
  }

})

module.exports = router
