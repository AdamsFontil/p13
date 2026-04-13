const router = require('express').Router()
const { Blog, User, UserReadingList } = require('../models')
const tokenExtractor = require('../util/middleware')




router.post('/', async (req, res) => {
  const { userId, blogId } = req.body

  if (userId === undefined) {
    return res.status(400).json({ error: 'userId is required' })
  }
  if (blogId === undefined) {
    return res.status(400).json({ error: 'blogId is required' })
  }

  try {
    const userExist = await User.findByPk(userId)
    const blogExist = await Blog.findByPk(blogId)

    if (userExist && blogExist) {
      console.log('BOTH USER AND BLOG EXIST');
    const alreadyExists = await UserReadingList.findOne({
      where: {
        userId: userId,
        blogId: blogId
      }
    })

      if (alreadyExists) {
      console.log('DID NOT ADD TO READING LIST');
      return res.status(400).json({ error: 'This blog is already in the user\'s reading list' })
    } else {
      const user_readings = await UserReadingList.create({
          ...req.body
        })

      console.log('DID ADD TO READING LIST---', user_readings);
        console.log('RAW RESPONSE:', JSON.stringify(user_readings.toJSON(), null, 2))
      res.status(201).json(user_readings)
    }
    } else if (!userExist) {
      return res.status(404).json({ error: `The USERID: --${userId}-- does not exist`})
    } else if (!blogExist) {
      return res.status(404).json({ error: `The BLOGID: --${blogId}-- does not exist`})
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  const readings = await UserReadingList.findAll()
  console.log('WHAT IS READINGS', readings);
  res.json(readings)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params
  if (req.body.read === undefined) {
    return res.status(400).json({ error: "Missing 'read' field in request body" });
  }
  try {
    const reading = await UserReadingList.findByPk(id)
    if (!reading) {
      return res.status(404).json({ error: 'Reading not found, issue with finding entry from the provided ID'})
    }
    if (reading.userId !== req.targetSessions.userId) {
      console.log('r.userid', reading.userId);
      console.log('req.decodedToken.id', req.decodedToken.id);
      return res.status(400).json({ error: 'Only the creator of reading list can modify it'})
    }
    console.log('READING BEFORE', reading.dataValues);
    reading.read = req.body.read
    await reading.save()
    console.log('READING AFTER', reading.dataValues);
    return res.status(200).json(reading)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }

})




module.exports = router;
