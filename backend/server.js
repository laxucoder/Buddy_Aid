import 'dotenv/config';import http from 'http';import app from './src/app.js';import {connectDB} from './src/config/database.js';import {initSocket} from './src/sockets/socketServer.js';
const port=process.env.PORT||5000;const server=http.createServer(app);initSocket(server);connectDB().finally(()=>server.listen(port,()=>console.log(`Buddy Aid API running on ${port}`)));
