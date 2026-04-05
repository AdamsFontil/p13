const router = require('express').Router()
const { Blog, User, UserReadingList } = require('../models')
const tokenExtractor = require('../util/middleware')




router.post('/', async (req, res) => {
  const { userId, blogId } = req.body
  try {
    const userExist = await User.findByPk(userId)
    const blogExist = await Blog.findByPk(blogId)

    if (userExist && blogExist) {
      console.log('BOTH USER AND BLOG EXIST');
        const user_readings = await UserReadingList.create({
          ...req.body
        })
      console.log('USER READINGS ADDED---',user_readings );
      res.json(user_readings)
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
  console.log('CHANGING THINGS');
  const { id } = req.params
  if (req.body.read === undefined) {
    return res.status(400).json({ error: "Missing 'read' field in request body" });
  }
  try {
    const reading = await UserReadingList.findByPk(id)
    if (!reading) {
      return res.status(404).json({ error: 'Reading not found, issue with finding entry from the provided ID'})
    }
    if (reading.userId !== req.decodedToken.id) {
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
