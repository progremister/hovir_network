import  mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_DATABASE_URI}`);
    } catch (err) {
        console.error(err);
    }
}

export default connectDB;