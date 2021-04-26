import React, { useState, useEffect } from 'react'
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import './App.css';
import 'bootstrap/dist/css/bootstrap.css'
import Home from './components/Home';
import View from './components/View';
import { BrowserRouter as Router,Route,Switch} from 'react-router-dom'
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
import Protected from './components/Protected'
import PageNot from './components/PageNot';
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
      <Router> 
       <Navbar user={users}/>
      
      <Switch>
        <Route path='/' exact render={props=>{
          if(!users) return <Redirect to="/login"/>
          return <Home {...props} />
        }} />  
        
        <Protected path='/home' exact component={Home} />
        <Protected path='/view'  exact component={View} /> 
        <Route path='/edit/:_id' exact  component={Edit}/> 
        <Protected path ="/users" exact component={Registerd}/>
        <Protected path = "/logout" exact component={Logout}/>
        <Protected path = '/course' exact component={Course} />
        <Protected path = '/student' exact  component={Student} />
        <Protected path = '/subject' exact component={Subject}/>
        <Protected  path = '/cget' exact component={Cget} />
        <Route path = '/cadd/:_id' exact component={Cadd} />
        <Route path = '/forgot' exact component={Forgot}/>
        <Route path = '/resetpassword/:token' exact component={Reset}/>
        <Route path ='/register' exact component={Register} />
        <Route path = "/login" exact component={Login}/>
        <Route path = '/404' component={PageNot} /> 
        <Redirect to='/404'/>
      </Switch> 
      
      </Router>
    </div>
  );
}

export default App;
