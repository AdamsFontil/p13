const Blog = require('./blog')
const User = require('./user')
const UserReadingList = require('./user_reading_list')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserReadingList, as: 'reading_list' })
Blog.belongsToMany(User, { through: UserReadingList, as: 'users_marked' })


User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog,
  User,
  UserReadingList,
  Session
}
