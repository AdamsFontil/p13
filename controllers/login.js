const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Session } = require('../models')
const { SECRET } = require('../util/config')


router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })


  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

    if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }


  const token = jwt.sign(userForToken, SECRET)
  console.log('WHAT IS TOKEN', token);
  console.log('WHAT IS userForToken', userForToken);
  console.log('WHAT IS USER', user);

  const session = await Session.create({ userId: user.id, authToken: token })
  console.log('what is Session', session);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
