const router = require('express').Router()
const tokenExtractor = require('../util/middleware')


router.delete('/', tokenExtractor, async (req, res) => {
  try {
    await req.targetSession.destroy()
    return res.status(204).end()
  } catch (error) {
    return res.status(501).json({ error: 'Something else went wrong with logout'})
  }

})

module.exports = router
