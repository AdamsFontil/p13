const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserReadingList extends Model {}

UserReadingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' },
    field: 'blog_id'

  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    field: 'user_id'
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'reading_list'
})


module.exports = UserReadingList
