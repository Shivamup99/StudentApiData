import React, { useState, useEffect } from 'react'
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import Home from './components/Home';
import View from './components/View';
import {Route,Switch} from 'react-router-dom'
import Register from './components/Register';
import Navbar from './components/Navbar';
import Registerd from './components/Registerd';
import Login from './components/Login';
import Edit from './components/Edit';
import Logout from './components/Logout'
import Course from './components/Course'
import Student from './components/Student'
import Cget from './components/Cget'
import Cadd from './components/Cadd'
import Forgot from './components/Forgot'
import Reset from './components/Reset'
import Subject from './components/Subject'
 axios.defaults.headers.common['x-api-key'] = localStorage.getItem('token');

function App() {

  const [users,setUsers] = useState()
  useEffect(() => {
    try {
      let jwt = localStorage.getItem('token')
      const user = jwt_decode(jwt)
      setUsers(user)
    } catch (ex) {}
  }, [])


  return (
    <div className="App">
      <Navbar user={users}/>
      <Switch>
        <Route path='/' exact render={props=>{
          if(!users) return <Redirect to="/login"/>
          return <Home {...props} />
        }} />
        <Route path='/view' render={user=><View {...user} user={users}/>} /> 
         {/* <Route path='/myprofile/:_id' component={Profile} />  */}
        <Route path='/edit/:_id' component={Edit}/> 
        <Route path ='/register' component={Register} />
        <Route path ="/users" component={Registerd}/>
        <Route path = "/login" component={Login}/>
        <Route path = "/logout" component={Logout}/>
        <Route path = '/course' component={Course} />
        <Route path = '/student' user={users} component={Student} />
        <Route path = '/subject' component={Subject}/>
        <Route path = '/cget' component={Cget} />
        <Route path = '/cadd/:_id' component={Cadd} />
        <Route path = '/forgot' component={Forgot}/>
        <Route path = '/resetpassword/:token' component={Reset}/>
      </Switch> 
    </div>
  );
}

export default App;
