import 'dotenv/config'; import mongoose from 'mongoose'; import app from './app.js';
const port=process.env.PORT||4000; if(!process.env.JWT_SECRET)throw new Error('JWT_SECRET is required.');
try{await mongoose.connect(process.env.MONGODB_URI||process.env.MONGO_URI||'mongodb://127.0.0.1:27017/foundit');console.log(`FoundIt database connected (${mongoose.connection.name})`);app.listen(port,()=>console.log(`FoundIt API listening on ${port}`));}catch(error){console.error('Database connection failed:',error.message);process.exit(1);}
