import {  useState } from "react";
import { api } from "../../lib/axios";
import { AuthContext } from "./AuthContext"


export const AuthProvider=({children})=>{
    const [loggedIn,setLoggedIn]=useState(false);
    const [loading,setLoading]=useState(true);
    
    const checkAuth=async()=>{
        try {
            const res= await api.get("/auth/profile",{withCredentials:true});
            if(res.status==200){
                setLoggedIn(true);
                
                
            }
            else{
                setLoggedIn(false);
              
            }
        } catch (error) {
            console.log(error);
            setLoggedIn(false);
           
            
        }
        finally{
            setLoading(false);
        }
    }
    
   
     const logout=async(navigate)=>{
        try {
            const res=await api.get("/auth/logout",{withCredentials:true});
            if(res.status==200){
                setLoggedIn(false);
               navigate("/login");
            }
            
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <AuthContext.Provider value={{loggedIn,logout,setLoggedIn,checkAuth,loading}}>
            {children}
        </AuthContext.Provider>
    )
}