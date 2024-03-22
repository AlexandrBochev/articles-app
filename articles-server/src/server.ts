
import app from './app'
import env from './utils/validateEnv'
import mongoose from "mongoose"

const port = env.PORT

mongoose.connect(env.MONGO_DB_CONNECTION)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err)
  })