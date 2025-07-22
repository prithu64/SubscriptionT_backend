import mongoose from 'mongoose'

const connectDB = async() =>{
   try {
    const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}`);
    console.log(`\n Database connected !!DB HOST : ${connectionInstance.connection.host} `)
  } catch (error) {
    console.log("Error  : ",error)
    process.exit(1)
  }
}

export default connectDB;