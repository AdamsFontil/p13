const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')


class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
  type: DataTypes.NOW,
  allowNull: true,
  },
  updatedAt: {
  type: DataTypes.DATE,
  allowNull: true
  },
  yearWritten: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
    min: {
      args: [1991],
      msg: "Year written must be after 1990"
    },
    max: {
      args: [new Date().getFullYear()],
      msg: `The year written cannot be after the current year of ${new Date().getFullYear()}`
    }
  }

  }
},

  {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog
