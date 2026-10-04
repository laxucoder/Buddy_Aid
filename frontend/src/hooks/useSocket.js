import {useEffect,useMemo} from 'react';import {io} from 'socket.io-client';
export function useSocket(){const url=useMemo(()=>{const api=import.meta.env.VITE_API_URL||'http://localhost:5000/api';return api.replace(/\/api\/?$/,'')},[]);const socket=useMemo(()=>io(url,{autoConnect:false}),[url]);useEffect(()=>()=>socket.disconnect(),[socket]);return socket;}
