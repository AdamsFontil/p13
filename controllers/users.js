const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Blog } = require('../models')


router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['']},
    include: [{
      model: Blog,
      attributes: ['title', 'author', 'likes', 'id']
    },
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: [''] },
        through: {
          attributes: ['read', 'id', 'blog_id', 'user_id']
        },
        include: {
          model: User,
          attributes: ['name']
        }
    }
  ]
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id,
    {
      attributes: ['name', 'username'],
      include: [{
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: []
        },
      }]
    }
  )
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
  const { username, name, password } = req.body
 console.log('what was received', username, name, password);

  if (!password) {
    return res.status(400).json({ error: 'Password is missing' })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await User.create({
      username,
      name,
      passwordHash
    })
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})



router.put('/:username', async (req, res) => {
  try {
    const targetUser = await User.findOne({
      where: { username: req.params.username }
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    targetUser.username = req.body.username;
    await targetUser.save();
    return res.status(200).json(targetUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeValidationError') { // if there are multiple validation errors
    const messages = error.errors.map(err => err.message).join(', ')
    return response.status(400).json({ error: messages })
  } else if (error) {
    return response.status(402).json({ error: `OTHER ERROR: ${error.message}` })
  }

  next(error)
}

router.use(errorHandler)

module.exports = router
