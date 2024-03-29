import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnect = async () => {
  const connection = await mongoose.connect(process.env.DATABASE_URL!);
  console.log('DB connected successfully');
  return connection;
};

export default mongoConnect;
