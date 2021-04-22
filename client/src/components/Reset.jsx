import React, { useState } from "react";
import "../App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios'
import { useHistory,useParams } from "react-router-dom";


const schema = yup.object().shape({
  password: yup.string().required('Password should not be empty').min(6,'Password should have atleast 4 char').max(15,'max char 15'),
  cpassword: yup.string().required('Confirm password is required').oneOf([yup.ref("password"), 'Password does not match']),
});

function Reset() {
    let history = useHistory()
    const token = useParams()
    const [user,setUser] = useState({
     password:'',cpassword:''
    })

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange = e=>{
      setUser({...user ,[e.target.name]:e.target.value})
  }
 
  const submitForm = async() => {
      console.log(token.token)
   try {
    const response = await axios.put('api/user/resetpassword' ,({password:user.password, token:token.token}));
    alert('Password updated')
    console.log(response)
    history.push('/login')
   } catch (error) {
       console.log(error)
   }
  };

    return (
        <>
        <h1>Reset your password</h1>
        <div className="inputs ml-2">
         <form onSubmit={handleSubmit(e=>submitForm(e))} >
           <input
            type="password"
            name="password"
            value={user.password}
            onChange={e=>handleChange(e)}
            placeholder="New Password"
            ref={register}
          />
          <p className="errors"> {errors.password?.message} </p>
           <input
            type="password"
            name="cpassword"
            onChange={e=>handleChange(e)}
            placeholder="Confirm Password"
            ref={register}
          />
          <p className="errors"> {errors.cpassword && "Passwords Should Match!"} </p> 
          <button className="btn btn-primary ml-2" disabled={user.password.length<4||user.cpassword.length<4}>Reset</button>
          </form>
        </div>
        </>
    )
}

export default Reset
