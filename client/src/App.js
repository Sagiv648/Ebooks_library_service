import Books from './Books/Books';
import Home from './Home/Home';
import logo from './logo.svg';
//import './App.css';
import Root from './Root/Root';
import 'bootstrap/dist/css/bootstrap.min.css'

import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Publish from './Publish/Publish';
import Profile from './Profile/Profile';
import Auth from './Auth/Auth';
import Uploads from './Uploads/Uploads';
import Console from './Console/Console';
import ErrorPage from './components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <ErrorPage/>,
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
        path: 'auth',
        element: <Auth/>
      },
      {
        path: 'uploads',
        element: <Uploads/>
      },
      {
        path: 'console',
        element: <Console/>
      }
      
    
      
    ]
  }
])
function App() {

  


  return (
    <RouterProvider router={router}/>
  );
}

export default App;
