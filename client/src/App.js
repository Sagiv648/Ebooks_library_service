import Books from './Books/Books';
import Home from './Home/Home';
import logo from './logo.svg';
//import './App.css';
import Root from './Root/Root';
import 'bootstrap/dist/css/bootstrap.min.css'

import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Publish from './Publish/Publish';
import Profile from './Profile/Profile';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateThunk, populate } from './features/auth/authSlice';
import HttpClient from './api/HttpClient';
import StorageClient from './api/StorageClient';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        
        index: true,
        element: <Home/>
      },
      {
        path: 'books',
        element: <Books/>
      },
      {
        path: 'publish',
        element: <Publish/>
      },
      {
        path: 'profile',
        element: <Profile/>
      }
      
    ]
  }
])
const authRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        
        index: true,
        element: <Home/>
      },
      {
        path: 'books',
        element: <Books/>
      },
      {
        path: 'publish',
        element: <Publish/>
      },
      {
        path: 'profile',
        element: <Profile/>
      },
      {
        path: 'signin',
        element: <SignIn/>
      },
      {
        path: 'signup',
        element: <SignUp/>,
        
      }
    
      
    ]
  }
])
function App() {
  const auth = useSelector(state => state.auth)
  
  const [connected, setConnected] = useState(null)
  const [renderRouter, setRenderRouter ] = useState(authRouter)
  
  //console.log(connected);
  //console.log(auth);

  return (
    <RouterProvider router={authRouter}/>
  );
}

export default App;
