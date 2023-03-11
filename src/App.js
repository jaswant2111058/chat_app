import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useState,useEffect} from "react";
import axios from "axios";
import Test from "./Elements/Test/Test";
import SignUp from "./Elements/SignUp/SignUp";
import SignIn from "./Elements/SignIn/SignIn";
import OTP from "./Elements/SignUp/otpVerification";
import './Elements/Play/Play.css'
import './Elements/Test/Test.css'
import './Elements/SignUp/SignUp.css'

// <Route exact path ="/" element={<JoinRoom setSocket={setSocket}/>}/>
            

function App()
{  
  const [email,setEmail]= useState();
  const [user,setUser]= useState(null);
 const getUser= async()=>{
  try{
    const url ="http://localhost:5000/googlelogin"
    const{data}= await axios.get(url,{withCredentials:true});
    setUser(data.user);
    localStorage.setItem('user',JSON.stringify(data.user))
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
              <Route exact path ="/" element={<SignUp setEmail={setEmail} user={user} />}/>
              <Route path='/otpVerify' element={<OTP email={email}/>}/>
              <Route path ='/signIn' element={user?<Navigate to='/Test'/>:<SignIn />}/>
              <Route path ='/Test' element={<Test/>}/>
              </Routes>
              </BrowserRouter>
         
 

  );
}


export default App;
