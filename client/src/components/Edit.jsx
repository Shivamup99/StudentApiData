import React, { useState,useEffect } from "react";
import "../App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios'
import { useHistory,useParams ,Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required("Name should be required please").min(4,'Name must have atleast 4 char'),
  email: yup.string().required("Email should not be empty").email("Email should be valid"),
  phone: yup.number().required("Phone number should not empty"),
  department:yup.string().required('Should not be empty'),
  photo:yup.string()
});

function Form() {
    let history = useHistory()
    const _id = useParams()

    const [user,setUser] = useState({
        name:'' , email:'',phone:'',department:''
    })
    const [photo,setPhoto] = useState()
    const [profile,setProfile] = useState()

  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange = e=>{
      setUser({...user ,[e.target.name]:e.target.value})
  }

  const handlePhoto = e=>{
    setPhoto(e.target.files[0])
  }

  const submitForm = async() => {
   try {
    const formData = new FormData()
    formData.append("name",user.name)
    formData.append("email",user.email)
    formData.append("phone",user.phone)
    formData.append("department",user.department)
    formData.append("photo",photo)
    console.log(user)
     const result= await axios.put(`http://localhost:8000/api/user/update/${_id._id}`,formData);
     setUser(result.data)
     let pic = result.data.photo.replace("public/","")
     setProfile(pic)
     history.push('/home')
   } catch (error) {
     alert('somthing went wrong')
   }
  };
   
    useEffect(() => {
    loadUser()
   }, [])

  const loadUser = async()=>{
   // console.log(id)
   await axios.get(`http://localhost:8000/api/user/users/${_id._id}`).then((result)=>{
    console.log(result)
    setUser(result.data)
    let pic = result.data.photo.replace("public/","")
    setProfile(pic)
   }).catch((err)=>console.log(err))
    
  }
  return (
    <div className="Form">
      <div className="title">Update Profile</div>
      <div className="inputs">
        <form onSubmit={handleSubmit(e=>submitForm(e))}>
        <img className="list-group-item" src={`http://localhost:8000/${profile}`} alt='avtar'/> 

          <input type="file" name="photo" className="form-control-file" 
           ref={register} onChange={e=>handlePhoto(e)} required={false} /> 

          <input
            type="text"
            name="name"
            value={user.name}
            onChange={e=>handleChange(e)}
            ref={register}
            placeholder="Name"
          />
          <p> {errors.name?.message} </p>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={e=>handleChange(e)}
            placeholder="Email"
            ref={register}
          />
          <p> {errors.email?.message} </p>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={e=>handleChange(e)}
            placeholder="Phone"
            ref={register}
          />
          <p> {errors.phone?.message} </p>
          <input
            type="text"
            name="department"
            value={user.department}
            onChange={e=>handleChange(e)}
            placeholder="Department"
            ref={register}
          />
          <p> {errors.department?.message} </p>

         <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
}

export default Form;
