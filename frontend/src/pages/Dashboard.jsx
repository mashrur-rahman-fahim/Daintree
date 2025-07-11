import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Dashboard = () => {
    const navigate=useNavigate();
    const {loggedIn,logout}=useContext(AuthContext);
    useEffect(()=>{
       
       if(!loggedIn){
        navigate("/login");
       }
       
    },[navigate,loggedIn])
    const handleLogout=async()=>{
        logout(navigate);
    }
   
  return (
    <div>
        <button onClick={handleLogout} className='btn btn-primary '>Logout</button>
    </div>
  )
}
