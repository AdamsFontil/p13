const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('user_reading_lists', {
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
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id'}
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id'}
      }

    })
  },



  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('user_reading_lists')
  },
}
