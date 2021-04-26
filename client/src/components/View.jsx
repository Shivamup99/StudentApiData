import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'


function View() {
    let _id=localStorage.getItem('_id')
    const [users,setUsers] = useState({})
     const [records,setRecords] = useState([])
     const [profile,setProfile] = useState('')

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = async()=>{
       
        console.log(_id)
        const result = await axios.get(`api/user/users/${_id}`)
        setUsers(result.data)
       // setRecords(result.data.record)
        let pic = result.data.photo.replace("public/","")
        setProfile(pic)
        //console.log(result.data.record)
    }
    return (
        <>
        <div className="container">
            <h1>Profile</h1>
            <div className="card" style={{width: '30rem'}}>
            <img className="list-group-item" src={`${profile}`} alt='avtar'/>
            <div className="card-body">
            <h5 className="card-title">User Info</h5>
                <h4>_Id : {users._id}</h4>
                <h4>Name  : {users.name}</h4>
                <h4>Email  : {users.email}</h4>
                <h4>Phone  : {users.phone}</h4>
                <h4>Department : {users.department}</h4>
                <h4>My Role :{users.roles}</h4>
            <Link className="btn btn-success" to={`edit/${_id}`}> Edit </Link>  
         
            </div>
            </div>
        </div>
        </>
    )
}

export default View
