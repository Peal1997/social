import mongoose from 'mongoose'


//MongoDb connection
export const mongoDbConnection = async() => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongoDb connected succesful`.bgCyan.black);
  } catch (error) {
    console.log(error.message);
  }
}


