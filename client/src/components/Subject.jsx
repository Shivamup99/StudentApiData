import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link} from 'react-router-dom'
function Subject() {
    const [course , setcourse] = useState([])
    useEffect(()=>{
        loadcourse()
    },[])

    const loadcourse = async()=>{
        let result = await axios.get(`api/user/course/get/${ localStorage.getItem('_id')}`)
        setcourse(result.data.course)
        console.log(result.data.course)
    }

    return (
        <div>
            <h1>My courses</h1>
            <div className="card" style={{width: "22rem"}}>
            <div className="card-body">
            <h5 className="card-title">My Course</h5>
            <h6 className="card-subtitle mb-2 text-muted">courses</h6>
            <p className="card-text">
            {course.map((course,index)=>
                <p key={index} className="list-group list-group-flush">
                <p className="list-group-item">{course.cname}</p>
                <p className="list-group-item">{course.cdepartment}</p>
                <p className="list-group-item">{course._id}</p>
                <Link to="/cget" className="btn btn-dark">Go back</Link>
                <hr className="dark"/>
                </p>
            )}
            </p>
            </div>
            </div>
        </div>
    )
}

export default Subject
