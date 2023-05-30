import React, { useEffect, useLayoutEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import  Nav  from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom'
import './root.css'
import Row  from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import NavDropdown  from 'react-bootstrap/NavDropdown'
import HttpClient from '../api/HttpClient'
import StorageClient from '../api/StorageClient'
import Loader from '../components/Loader'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


//Task lists:
//TODO: 1) Use own storage api for the files storage, write StorageClient to do so
//TODO: 2) Implement avatar upload
//TODO: 3) Implement username for a new user, implement edit profile to edit username
//TODO: 4) Implement reviews page
//TODO: 5) Implement most downloaded books screen horizontal runner, (Implement download count in the server)
//TODO: 6) Implement HTTP call for download count increment
//TODO: 7) Implement a button to add a review for the book
const Root = () => {

  const [collapsed, setCollapsed] = useState(false)
  
  const [profile,setProfile] = useState(null)
 
  const [uploads, setUploads] = useState([])
  const [privileged, setPrivileged] = useState(false)
  const [downloadedBooks,setDownloadedBooks] = useState({})
  const nav = useNavigate();
  const location = useLocation();

  const logout = () => {
    HttpClient.SignOut();
  }

  
  

  const isAuthRoute = () => {
    return location.pathname === '/auth'
  }
  const isProtectedRoute = () => {
    return location.pathname === '/publish' || location.pathname === '/profile'
  }
  
  const isPrivilegedRoute = () => {
    return location.pathname === '/console'
  }

  useEffect(() => {
    console.log("it renderes once no?");
    HttpClient.FetchStorage((profile) => {
      setProfile(profile);
    })
    HttpClient.SubscribeAuthState((profile) => {
      if(profile)
      {
        setProfile(profile)
        
      }
      else
      {
        setProfile(null)
      }
      })
      HttpClient.SubscribeProfileChange({id: "root", cb: (data) => {
        setProfile(data)
      }})
    
      
     
    return () => {
      HttpClient.UnsubscribeProfileChange("root")
      
      
    }
  },[])

  

  // useLayoutEffect(() => {
    
  //   if(isAuthRoute() && HttpClient.isAuth())
  //   {
      
  //     nav('/', {replace: true})
      
  //   }
  //   else if(isProtectedRoute() && !HttpClient.isAuth())
  //   {
      
  //     nav('/auth', {replace: true, })
      
  //   }
  //   else if(isPrivilegedRoute() && !HttpClient.isAuth())
  //   {
  //     nav('/', {replace: true})
  //   }
    
    
  // },[location])

  useEffect(() => {
    

    if(isAuthRoute() && HttpClient.isAuth())
    {
      
      nav('/', {replace: true})
      
    }
    else if(isProtectedRoute() && !HttpClient.isAuth())
    {
      
      nav('/auth', {replace: true, })
      
    }
    else if(isPrivilegedRoute() && !HttpClient.isPrivileged())
    {
      nav('/', {replace: true})
    }

    if(HttpClient.isPrivileged())
      setPrivileged(true)
    
      if(location.pathname === '/')
      {
          HttpClient.SubscribeDownloadCountUpdate({id: 'root', cb: (updates) => {
          setDownloadedBooks(updates)
          console.log("we get the publishling");
          console.log(updates);
        }})
      }
      else
      { 
        HttpClient.UnsubscribeDownloadCountUpdate("root")
      }
      
    
  },[location])

  
  

  return (
    <>
    <Navbar className='navbar-header' bg='light' expand="lg" onToggle={() => {
      setCollapsed(!collapsed)
      
    }}>
      <Container fluid>
        <Navbar.Brand className='navbar-brand'>
          <Link to={'/'}>
          <img className='navbar-brand-img' src='../logo.png'/>
          </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse style={collapsed ? {backgroundColor: '#E9F7CA'}  :{} } id='basic-navbar-nav'>
          {
            profile ? (
              <Nav className='me-auto'>
            
              <Nav.Item><Link className='nav-item' to={'/'}>Home</Link></Nav.Item>
              
              <Nav.Item> <Link className='nav-item' to={"publish"}>Upload a book</Link></Nav.Item>
              <Nav.Item><Link className='nav-item' to={"profile"}>Profile</Link></Nav.Item>
              {
                privileged && <Nav.Item><Link className='nav-item' to={'console'}>Console</Link></Nav.Item>
              }
              
              {/* <Nav.Item>
                <Link className='nav-item' to={'uploads'}>Uploads</Link>
                {
                  uploads.filter((upload) => upload.finished == false).length > 0 &&
                  (<Container style={{borderWidth: 1,backgroundColor: '#2596be', width: 50,textAlign: 'center',  borderRadius: 20, borderStyle: 'outset'}}>
                    {uploads.filter((upload) => upload.finished == false).length}
                  </Container>)
                }
              
              </Nav.Item> */}
              <Nav.Item onClick={() => {
                logout();
                
              }}><Link className='nav-item'>Logout</Link></Nav.Item>
            </Nav>
            ) : 
            (
              <Nav className='me-auto'>
            
              <Nav.Item><Link className='nav-item' to={'/'}>Home</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to={"publish"}>Upload a book</Link></Nav.Item>
              <Nav.Item><Link className='nav-item' to={"profile"}>Profile</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to={"auth"}>Sign in</Link></Nav.Item>
              
            </Nav>
            )
          }
          {
            profile ? <Navbar.Brand>{profile.username ? profile.username : profile.email}</Navbar.Brand> : <Navbar.Brand>Guest</Navbar.Brand>
          }
          
          {profile && <Navbar.Brand onClick={() => {
              //setAvatarClicked(!avatarClicked)

          }}><img className='avatar-img' src={profile.avatar ? profile.avatar : "../user.png"}/></Navbar.Brand>}
          
          </Navbar.Collapse>
          
             
        {/* {
        operationProgress && (<Navbar.Brand>{operationProgress}</Navbar.Brand>)
        } */}
          
          <ToastContainer/>
      </Container>
      
          
    </Navbar>
      
        <Outlet context={[]}/>
      
      
    
    
    </>
    
  )

}

export default Root

