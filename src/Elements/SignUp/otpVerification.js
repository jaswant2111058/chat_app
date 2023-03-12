import axios from 'axios';
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './otpveri.css'

const OTP = ({email}) =>{
    const baseURL = "https://chat-app-pt84.onrender.com"
    const navigate = useNavigate()
    const [OTP,setOTP] = useState({
        email:email.email,
        otp:""
    })
    const handleChange = (e) => {
        const {name,value}=e.target;
        setOTP({
            ...OTP,
            [name]:value
        })
        
    }
    const handleClick = (e) => {
        e.preventDefault()
        console.log(OTP)
        axios.post(`${baseURL}/otpverification`,OTP)
        .then((res)=>{
            alert(res.data.msg)
            if(res.data.msg==="otp verified")
            navigate('/signin')
            else{
                alert('something went wrong please try after some time')
            }
        })
    }
    return<form className='basicForm2' style={{margin:"0px"}}>
            <span>
                <h4>OTP has been send to {email.email}</h4>
            <input
                placeholder="OTP"
                name="otp"
                onChange={handleChange}
                value={OTP.otp}
            />
            <button 
                onClick={handleClick}
            >Submit</button>
            </span> 
         </form> 
   
}

export default OTP