import React, { useState } from 'react'
import "./Signup.css"
import {Link,useNavigate} from 'react-router-dom'
import {toast} from "react-toastify"
import Navebar from './Navebar'

const Signup = () => {
    const navigate = useNavigate();

    //useStates
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    //variables of toastify
    const notifyerr = (msg)=>toast.error(msg);
    const notifysucc = (msg)=>toast.success(msg);

    //pattern for email and pass word
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;


    const postData = ()=>{

        //checking email and password
        if(!emailRegex.test(email)){
            notifyerr("Invalid Email");
            return
        }
        else if (!passRegex.test(password) && password){
            notifyerr("Enter a strong password");
            return
        }

        //fetching Api and sending data to server
        fetch("http://localhost:5000/users/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then((data)=>{
            if(data.error){
                notifyerr(data.error);
                return
            }
            else{
                notifysucc(data.message);
                navigate("/signin");
            }
            console.log(data);
        })
        .catch(error => {
            console.log('Error during fetch:', error);
        });
    }




  return (
    <>
    <Navebar/>
    <div className='signup'>
        <div className='maincontainer'>
            <div className='form-box'>
                <h1>Sign Up</h1>
                    <div className='input-group'>
                        <div className='input-fields'>
                            <i className="fa-solid fa-user"></i>
                            <input type='text'value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='Name'/>
                        </div>
                        <div className='input-fields'>
                            <i className="fa-solid fa-envelope"></i>
                            <input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Email'/>
                        </div>
                        <div className='input-fields'>
                            <i className="fa-solid fa-lock"></i>
                            <input type='password'value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
                        </div>
                        <input type='submit' onClick={()=>{postData()}} id='login-btn' value="Sign Up"/>
                    </div>
                    <div className='form-2'>
                        Already have an account ? 
                        <Link to="/signin" ><span style={{color:"rgc(65,9,165" , cursor:"pointer"}}> Sign In</span></Link>
                    </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Signup
