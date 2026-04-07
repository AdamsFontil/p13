const router = require('express').Router()
const { Session } = require('../models')
const tokenExtractor = require('../util/middleware')


router.delete ('/', tokenExtractor, async (req, res) => {
  try {
  const targetSession = await Session.findOne({
    where: { auth_token: req.token }
  })
  console.log('found target???', targetSession);
  if (!targetSession) {
    return res.status(404).json({ error: 'Failed to logout: Session not found'})
  }
    await targetSession.destroy()
    return res.status(204).end()
  } catch (error) {
    return res.status(501).json({ error: 'Something else went wrong with logout'})
  }


})

module.exports = router
