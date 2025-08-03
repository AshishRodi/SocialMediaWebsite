import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import PageNotFound from './pages/PageNotFound';
import { AuthContext } from './helpers/AuthContext';
import { useEffect, useState } from 'react';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import axios from 'axios';

function App() {
  const [authState, setAuthState] = useState({ username: "", id: 0, status: false });
  const [loading, setLoading] = useState(true); // ✅ New loading state

  useEffect(() => {
    axios.get('http://localhost:3001/auth/auth', {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState((prev) => ({ ...prev, status: false }));
      } else {
        setAuthState({ username: response.data.username, id: response.data.id, status: true });
      }
      setLoading(false); // ✅ Stop loading once auth is checked
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
  };

  if (loading) return <div>Loading...</div>; // ✅ Wait for auth check

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className='navbar'>
            {!authState.status ? (
              <>
                <Link to="/login"> Login </Link>
                <Link to="/registration"> Registration</Link>
              </>
            ) : (
              <>
                <Link to="/"> Home Page</Link>
                <Link to="/createpost"> Create A Post</Link>
                <button onClick={logout}>Logout</button>
              </>
            )}
            <h1>{authState.username}</h1>
          </div>

          <Routes>
            <Route
              path="/"
              element={authState.status ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/createpost"
              element={authState.status ? <CreatePost /> : <Navigate to="/login" replace />}
            />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
