import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }catch(err){
        console.error('MongoDB connection failed:', err);
    }
}

export default connectDB;