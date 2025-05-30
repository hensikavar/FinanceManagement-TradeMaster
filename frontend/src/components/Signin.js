import React , {useState} from 'react'
import "./Signin.css"
import { Link ,useNavigate } from 'react-router-dom'
import {toast} from "react-toastify"
import Navebar from './Navebar'

const Signin = () => {
  const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const [password , setPassword]= useState("");

    //email pattern
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    //Toast function
    const notifyerr = (msg)=>toast.error(msg);
    const notifysucc = (msg)=>toast.success(msg);

    const postData = ()=>{
        //checking email and password
        if(!emailRegex.test(email)){
            notifyerr("Invalid Email");
            return
        }

        console.log('Before fetch');

        //sending data to server
        fetch("http://localhost:5000/users/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                notifyerr(data.error);
                return
            }
            else{
                notifysucc(data.message);
                navigate("/layout");
            }
            console.log(data);
        })
        console.log('After fetch');
    }
  return (
    <>
        <Navebar/>
    <div className='sigin'>
      <div className='maincontainer'>
        <div className='form-box'>
            <h1>Sign In</h1>
                <div className='input-group'>
                    <div className='input-fields'>
                        <i class="fa-solid fa-envelope"></i>
                        <input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email'/>
                    </div>
                    <div className='input-fields'>
                        <i class="fa-solid fa-lock"></i>
                        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
                    </div>
                </div>
                <input type='submit' onClick={()=>{postData()}} id='login-btn' value="Sign In"/>
                <div className='form-2'>
                    Don't have an account?
                    <Link to="/signup"><span style={{color:"rgb(65,9,165)", cursor:"pointer",textDecoration: "none"}}> Sign Up</span></Link> 
                </div>
          </div>
      </div>
    </div>
    </>
  )
}

export default Signin
