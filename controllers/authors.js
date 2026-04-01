const router = require('express').Router()
const { Blog } = require('../models')
const { Sequelize } = require('sequelize');




router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'blogs'],
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
      ],
      group: 'author'
    });

    console.log('Grouped Blogs:', JSON.stringify(blogs, null, 2));
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
