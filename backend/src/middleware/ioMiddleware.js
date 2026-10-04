import {io} from '../sockets/socketServer.js';export function attachIo(req,res,next){req.io=io;next()}
