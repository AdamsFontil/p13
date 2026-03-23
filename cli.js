require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query("SELECT * FROM notes", { type: QueryTypes.SELECT })
    console.log('blogs--', blogs)
    console.log('url', process.env.DATABASE_URL);
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
