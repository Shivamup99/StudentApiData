import React,{useState} from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios'
import { useHistory,Link } from "react-router-dom";

const schema = yup.object().shape({
    email: yup.string().required("Email should not be empty").email("Email should be valid"),
});
function Forgot() {

    const [user,setUser] = useState({
        email:''
      });
    const { register, handleSubmit, errors } = useForm({
      resolver: yupResolver(schema),
    });
  
    const handleChange = e=>{
        setUser({...user ,[e.target.name]:e.target.value})
    }
    const submitForm = async() => {
        console.log(user)
        await axios.put('http://localhost:8080/api/user/forgot',user)
        alert('Email send successfully')
        // setUser('')
        // setTimeout(()=>{
        //     console.log('timeout')
        // },3000)
      
    }

    return (
        <>
         <h1> Get your new password </h1>
         <div className="inputs ml-2" >
          <form onSubmit={handleSubmit(e=>submitForm(e))}>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={e=>handleChange(e)}
            placeholder="Email"
            ref={register}
          />
          <p className="errors"> {errors.email?.message} </p>
          <button className = "btn btn-info ml-2" disabled={user.email.length<1}>Submit</button>
          </form>
        </div>
        </>
    )
}

export default Forgot
