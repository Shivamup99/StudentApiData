import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'


function View() {
    const [users,setUsers] = useState({})
     const [records,setRecords] = useState([])
     const [profile,setProfile] = useState('')

    useEffect(() => {
        loadUser()
    }, [])

    const loadUser = async()=>{
        const result = await axios.get(`http://localhost:8080/api/user/users/${localStorage.getItem('_id')}`)
        setUsers(result.data)
        setRecords(result.data.record)
        let pic = result.data.photo.replace("public/","")
        setProfile(pic)
        console.log(result.data.record)
    }
    return (
        <>
        <div className="container">
            <h1>Profile</h1>
            <div className="card" style={{width: '30rem'}}>
            <img className="list-group-item" src={`http://localhost:8080/${profile}`} alt='avtar'/>
            <div className="card-body">
            <h5 className="card-title">User Info</h5>
            <p>
                <h4>Name  : {users.name}</h4>
                <h4>Email  : {users.email}</h4>
                <h4>Phone  : {users.phone}</h4>
                <h4>Department : {users.department}</h4>
                <h4>My Role :{users.roles}</h4>
                  {records.map((user,input)=>(
                    <div key={input}>
                    <h4>Birthday : {user.dob}</h4>
                    <h4>State : {user.state}</h4>
                    <h4>PostalCode : {user.postcode}</h4>
                    <h4>Country : {user.country}</h4>
                    <h4>10th-CGPA : {user.xcgpa}</h4>
                    <h4>10th-PassingYear : {user.xpass}</h4>
                    <h4>12th-CGPA : {user.xiicgpa}</h4>
                    <h4>12th-PassingYear : {user.xiipass}</h4>
                    </div> 
                ))}    
            </p>

            {localStorage.getItem('token') && localStorage.getItem('_id')===users._id &&
           <td>
            <Link className="btn btn-success" to={`/edit/${users._id}`}> Edit </Link>  
          </td>
          }
            </div>
            </div>
        </div>
        </>
    )
}

export default View
