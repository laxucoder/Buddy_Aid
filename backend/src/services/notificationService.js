import Notification from '../models/Notification.js';
export async function createNotification({userId,title,message,type='system',emergencyId}){if(!process.env.MONGODB_URI)return null;return Notification.create({userId,title,message,type,emergencyId});}
