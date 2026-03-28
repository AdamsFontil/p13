const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res) => {
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
    return res.status(400).json({ error: error.message })
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

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
