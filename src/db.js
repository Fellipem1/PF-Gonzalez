import mongoose from 'mongoose';

const dbURI = 'mongodb+srv://fellipem0113:Vb775GR1cjjdTOnB@cluster0.zevhw.mongodb.net/phoenixcontact?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;

