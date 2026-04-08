const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        req.targetSession = await Session.findOne({
        where: { auth_token: authorization.substring(7) }
      })
      console.log('found target Session???', req.targetSession);
      if (!req.targetSession) {
        return res.status(404).json({ error: 'Session not found'})
      }
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


module.exports = tokenExtractor
