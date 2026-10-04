import {Server} from 'socket.io';
export let io;
export function initSocket(server){io=new Server(server,{cors:{origin:process.env.FRONTEND_URL?.split(',')||'*',credentials:true}});io.on('connection',socket=>{socket.on('admin:join',()=>socket.join('admins'));socket.on('emergency:join',id=>socket.join(`emergency:${id}`));socket.on('emergency:location',({emergencyId,latitude,longitude})=>io.to(`emergency:${emergencyId}`).emit('emergency:location',{latitude,longitude}));});return io;}
