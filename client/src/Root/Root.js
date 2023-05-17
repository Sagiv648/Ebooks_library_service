import React, { useEffect, useState } from 'react'
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


const Root = () => {

  const [collapsed, setCollapsed] = useState(false)
  
  const [profile,setProfile] = useState(null)
  const [operationProgress, setOperationProgress] = useState(0)
  const [operationProgressBar, setOperationProgressBar] = useState([])
  const nav = useNavigate();
  const location = useLocation();
  
  const logout = () => {
    HttpClient.SignOut();
  }

  
  

  const isAuthRoute = () => {
    return location.pathname == '/signup' || location.pathname == '/signin'
  }
  const isProtectedRoute = () => {
    return location.pathname == '/profile' || location.pathname == '/publish'
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
    StorageClient.SubscribeOperationsUpdates((x) => {
      if(x == -1)
      {
        setOperationProgressBar([])
        setOperationProgress(-1)
      }
      else
      {
        setOperationProgressBar([...operationProgressBar,operationProgress])
        setOperationProgress(x)
      }
      
    })
    
    
   
    return () => {
      
    }
  },[])

  useEffect(() => {
    


    if(isAuthRoute() && HttpClient.isAuth())
    {
      nav('/', {replace: true})
    }
    else if(isProtectedRoute() && !HttpClient.isAuth())
    {
      nav('/signin', {replace: true})
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
            profile ? <Navbar.Brand>{profile.email}</Navbar.Brand> : <Navbar.Brand>Guest</Navbar.Brand>
          }
          {profile && <Navbar.Brand><img className='avatar-img' src={profile.avatar ? profile.avatar : "../user.png"}/></Navbar.Brand>}
          
          </Navbar.Collapse>
          
             
          
          
          
      </Container>
      {
        operationProgressBar.length > 0 && (<Navbar.Brand>{operationProgress}</Navbar.Brand>)
      }
          
    </Navbar>
    <Outlet/>
    </>
    
  )

}

export default Root

