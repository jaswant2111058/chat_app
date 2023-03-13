import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useState,useEffect} from "react";
import axios from "axios";
import Test from "./Elements/Test/Test";
import SignUp from "./Elements/SignUp/SignUp";
import SignIn from "./Elements/SignIn/SignIn";
import OTP from "./Elements/SignUp/otpVerification";
import './Elements/Test/Test.css'
import './Elements/SignUp/SignUp.css'

// <Route exact path ="/" element={<JoinRoom setSocket={setSocket}/>}/>
            

function App()
{  
  const [email,setEmail]= useState();
  const [user,setUser]= useState(null);
 const getUser= async()=>{
  try{
    const url ="https://chat-app-pt84.onrender.com/googlelogin"
    const user = JSON.parse(localStorage.getItem('user'))
        if(!user){
    const{data}= await axios.get(url,{withCredentials:true});
    setUser(data.user);
    localStorage.setItem('user',JSON.stringify(data.user))
        }
        else{
          setUser(user)
        }
  }
  catch(err)
  {
    console.log(err)
  }
 }
 //user?<Navigate to='/Test'/>:
      useEffect(()=>{

        getUser();
      },[])
            return (
              <BrowserRouter>
              <Routes>
              <Route exact ="/signup" element={<SignUp setEmail={setEmail} user={user} />}/>
              <Route exact path ="/" element={user?<Navigate to='/test'/>:<SignIn />}/>
              <Route path='/otpverify' element={<OTP email={email}/>}/>
              <Route path ='/signin' element={<SignIn />}/>
              <Route path ='/test' element={<Test/>}/>
              </Routes>
              </BrowserRouter>
         
 

  );
}


export default App;
