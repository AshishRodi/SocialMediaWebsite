import React, {useState, useContext} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext'
function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    const navigate = useNavigate(); 
    const login = () =>{
        const data = {username: username, password: password}
        axios.post("https://socialmediawebsite-production.up.railway.app/auth/login", data).then((response) =>{
          if(!response.data.error){ 
            localStorage.setItem("accessToken", response.data.token);
            setAuthState({username: response.data.username, id: response.data.id, status: true});
            navigate("/");
          }
          
        })
        .catch((error) => {
            if (error.response) {
              // Server responded with a status outside 2xx
              console.error("Login failed:", error.response.data.error);
              alert(error.response.data.error);  // Show error to user
            } else {
              // Network or other Axios error
              console.error("Error:", error.message);
              alert("Network error. Please try again.");
            }
          });
    }
  return (
    <div className='loginContainer'>
      <label>Username: </label>
      <input type="text" onChange={(event)=>{setUsername(event.target.value)}}/>
      <label>Password: </label>
      <input type="password"  onChange={(event)=>{setPassword(event.target.value)}}                /> 
      <button onClick={login}>Login</button>
    </div>
  )
}

export default Login
