const router = require('express').Router()
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create({ ...req.body })
  return res.json(blog)
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


router.delete('/:id', blogFinder, async (req, res) => {
  console.log('deleting---', req.blog.toJSON());
  await req.blog.destroy()
  res.status(204).end()
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
