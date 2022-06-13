import mongoose from "mongoose";

async function connectDB() {
    try{
        await mongoose.connect(`mongodb+srv://walterleo:l8QKlldZhH7TAd4R@cluster0.ifuk3.mongodb.net/scheduler-app`);
        console.log('Mongo db connected');
    }catch(error){
        console.error(error);
    }
}

connectDB();