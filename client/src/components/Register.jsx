import React, { useState } from "react";
import "../App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios'
import { useHistory } from "react-router-dom";


const schema = yup.object().shape({
  name: yup.string().required("Name should be required").min(4,'Name must have atleast 4 char').max(20,'Less than 20 char').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  email: yup.string().required("Email should not be empty").email("Email should be valid").min(9,'Email must have atleast 9 char').max(40,'Less than 40 char'),
  phone: yup.string().required("Phone number should not empty").min(10,'phone number should be 10 digit').max(10,'phone number should be 10 digit').matches(/^[0-9]*$/),
  department:yup.string().required('Should not be empty').min(2,'at least 2 char').max(10,'less than 10 char').matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
  password: yup.string().required('Password should not be empty').min(6,'Password should have atleast 4 char').max(15,'max char 15'),
  cpassword: yup.string().required('Confirm password is required').oneOf([yup.ref("password"), 'Password does not match']),
  roles:yup.string().required('Select your preferance'),
  photo:yup.string()
});

function Form() {
    let history = useHistory()
    const [user,setUser] = useState({
        name:'' , email:'',phone:'',department:'', password:'',cpassword:'',roles:''
    })
    const [photo,setPhoto] = useState('')
    const [error,setError] = useState([])
  const { register, handleSubmit, reset, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange = e=>{
      setUser({...user ,[e.target.name]:e.target.value})
  }

  const handlePhotoChange = e=>{
    setPhoto(e.target.files[0])
}

 
  const submitForm = async() => {
    try {
      let formData = new FormData()
      formData.append("name",user.name)
      formData.append("email",user.email)
      formData.append("password",user.password)
      formData.append("cpassword",user.cpassword)
      formData.append("phone",user.phone)
      formData.append("department",user.department)
      formData.append("roles",user.roles)
      formData.append("photo",photo)
     
      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }
      console.log(user)
      console.log(photo)
      const response = await axios.post('api/user/register',formData);
      localStorage.setItem("token",response.headers['x-api-key'])
      history.push("/login")
    } catch (error) {
      setError(<p className="alert alert-danger">Somthing went wrong fill all fields!</p>)
    }

  };
  return (
    <div className="Form">
      <div className="title">Sign Up</div>
      <div>{error?error:''}</div>
      <div className="inputs">
        <form onSubmit={handleSubmit(e=>submitForm(e))} onReset={reset} enctype="multipart/form-data">
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={e=>handleChange(e)}
            ref={register}
            placeholder="Name"
            className={`${errors.name ? 'is-invalid' : ''}`}
          />
          <p className="errors"> {errors.name?.message} </p>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={e=>handleChange(e)}
            placeholder="Email"
            ref={register}
          />
          <p className="errors"> {errors.email?.message} </p>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={e=>handleChange(e)}
            placeholder="Phone"
            ref={register}
          />
          <p className="errors"> {errors.phone?.message} </p>
          <input
            type="text"
            name="department"
            value={user.department}
            onChange={e=>handleChange(e)}
            placeholder="Department"
            ref={register}
          />
          <p className="errors"> {errors.department?.message} </p>

           <select className="form-select form-select-sm mb-2" 
           value={user.roles} name="roles" onChange={e=>handleChange(e)} ref={register} >
         <option>Select your role</option>
         <option>user</option>
          <option>admin</option> 
         </select> 
         <br/> 

          <input
            type="password"
            name="password"
            value={user.password}
            onChange={e=>handleChange(e)}
            placeholder="Password"
            ref={register}
          />
          <p className="errors"> {errors.password?.message} </p>
           <input
            type="password"
            name="cpassword"
            value={user.cpassword}
            onChange={e=>handleChange(e)}
            placeholder="Confirm Password"
            ref={register}
          />
          <p className="errors"> {errors.cpassword && "Passwords Should Match!"} </p> 

          <lable htmlFor ="photo" >Upload file</lable>
          <input type="file" name="photo" className="form-control-file" 
           ref={register} onChange={e=>handlePhotoChange(e)} /> 

         <button type="submit" className="btn btn-primary mt-1">Submit</button>
         <button className="btn btn-secondary ml-2" type="reset">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default Form;