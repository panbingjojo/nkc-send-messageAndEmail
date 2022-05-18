import mongoose from 'mongoose';
import {ErrorLog, InfoLog} from './logger';

export async function ConnectDatabase() {
  InfoLog('Connecting to database...');
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
    InfoLog('Database connected');
  } catch (err) {
    ErrorLog('Database connection failed');
    ErrorLog(<Error>err);
  }
}

ConnectDatabase().catch(console.error);

export {mongoose};
