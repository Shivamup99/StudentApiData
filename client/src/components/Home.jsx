import React, { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'


function Home(){
return (
    <>
     <h1>This is Home page</h1>
     <Link className="btn btn-primary" to={`/view`}>View User</Link> 
    </>
)
}

export default Home
