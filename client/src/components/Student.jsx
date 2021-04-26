import React ,{useState,useEffect} from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'
function Student() {
    const [student,setStudent] = useState([])
    const[profile,setProfile]=useState()
    useEffect(()=>{
        loadStudent()
    },[])

    const loadStudent = async()=>{
        let result = await axios.get(`api/user/course/get/${ localStorage.getItem('_id')}`)
        setStudent(result.data)
        console.log(result.data)
        let str=result.data.photo.replace("public/", "")
        setProfile(str)
        console.log(result.data.course[0])
    }
    return (
        <>
        <h1 className="tag">This is student data </h1>
        <div className="col d-flex justify-content-center mt-3 ml-3">
           
            <div className="card" style={{width:'28rem'}}>
            <div className="card-body">
            <h5 className="card-title">My profile</h5>
            <p className="card-text">My status</p>
            </div>
                  
                <ul className="list-group list-group-flush">
                <img className="list-group-item" src={`${profile}`} alt='avtar'/> 
                <li className="list-group-item">Student_Id : {student._id}</li>
                  <li className="list-group-item">Name : {student.name}</li>
                  <li className="list-group-item">Email : {student.email}</li>
                  <li className="list-group-item">Phone : {student.phone}</li>
                  <li className="list-group-item">Department : {student.department}</li>
                  </ul>
                 <Link to="/subject" className="alert alert-success">Check your courses</Link>
           
           </div>
           </div>
        </>
    )
}

export default Student
