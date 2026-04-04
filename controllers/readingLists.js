const router = require('express').Router()
const { Blog, User, UserReadingList } = require('../models')
const { Sequelize } = require('sequelize');




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

module.exports = router;
