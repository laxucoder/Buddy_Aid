import {createContext,useContext,useState} from 'react';
const ToastContext=createContext(null);
export function ToastProvider({children}){const [toast,setToast]=useState(null);const show=(message,type='success')=>{setToast({message,type});setTimeout(()=>setToast(null),2600)};return <ToastContext.Provider value={{show}}>{children}{toast&&<div className={`toast toast-${toast.type}`}>{toast.message}</div>}</ToastContext.Provider>}
export const useToast=()=>useContext(ToastContext);
