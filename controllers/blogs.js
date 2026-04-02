const router = require('express').Router()
const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.substring]: req.query.search } },
      { author: { [Op.substring]: req.query.search } }
    ]
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name', 'username']
    },
    where,
    order:[ ['likes', 'DESC'] ]
  })
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs)
})



const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

  router.post('/', tokenExtractor, async (req, res) => {
  const currentYear = new Date().getFullYear();
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.body.yearWritten >= 1991 && req.body.yearWritten <= currentYear) {
      console.log('PROVIDED CORRECT YEAR', req.body.yearWritten);
      const blog = await Blog.create({
      ...req.body, updatedAt: new Date(),
      userId: user.id
      })
      res.json(blog)
    } else {
      console.log('WRONG YEAR', req.body.year_written);
      return res.status(402).json({ error: `Year book written must be between 1991 and ${currentYear}`})
    }
  } catch(error) {
    return res.status(400).json({ error })
  }
})



const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}




router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res) => {
  req.blog.likes = req.body.likes
  console.log('UPDATED, NEW LIKES---', req.blog.toJSON());
  await req.blog.save()
  res.json(req.blog)
})


router.delete('/:id',tokenExtractor, blogFinder, async (req, res) => {
  console.log('deleting---', req.blog.toJSON());
  try {
    const user = await User.findByPk(req.decodedToken.id)
    console.log('USER FOUND---', user.id);
    console.log('BLOG ID', req.blog.userId);
    if (user.id === req.blog.userId) {
      console.log('MATCH FOUND--- DELETING BLOG NOW');
      await req.blog.destroy()
      res.status(204).end()
    } else {
      return res.status(401).json({ error: 'ONLY THE USER WHO MADE THE BLOG CAN DELETE IT' })
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(401).json({ error:`Sequelize ISSUE: ${error.message}` })
  } else if (error) {
    return response.status(402).json({ error: `OTHER ERROR: ${error.message}` })
  }

  next(error)
}

router.use(errorHandler)

module.exports = router
