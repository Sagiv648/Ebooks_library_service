import React, { useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import  Nav  from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import {Link, Outlet, useNavigate} from 'react-router-dom'
import './root.css'
import Row  from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import  NavDropdown  from 'react-bootstrap/NavDropdown'
import HttpClient from '../api/HttpClient'

const Root = () => {

  const [collapsed, setCollapsed] = useState(false)
  const [profile,setProfile] = useState(null)
  const [connection,setConnection] = useState(null)
  const nav = useNavigate();
  const logout = () => {
    HttpClient.SignOut();
  }
  const fetchStorage = () => {
    const item = localStorage.getItem("token")
    
    //console.log(item);
    if(item)
    {
      console.log(item);
      //const itemJson = JSON.parse(item);
      HttpClient.SetToken(item)
      setConnection(item)
    }
  }

  HttpClient.SubscribeAuthState((token) => {
    if(token)
    {
      setConnection(token)
    }
    else
    {
      setConnection(null)
    }
  })
  useEffect(() => {
    fetchStorage();
    console.log("it renderes atleast once yes?");
    return () => {
      
    }
  },[])

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
            connection ? (
              <Nav className='me-auto'>
            
              <Nav.Item><Link className='nav-item' to={'/'}>Home</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to ={'books'}>Books</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to={"publish"}>Publish a book</Link></Nav.Item>
              <Nav.Item><Link className='nav-item' to={"profile"}>Profile</Link></Nav.Item>
              <Nav.Item onClick={() => {
                logout();
                
              }}><Link className='nav-item'>Logout</Link></Nav.Item>
            </Nav>
            ) : 
            (
              <Nav className='me-auto'>
            
              <Nav.Item><Link className='nav-item' to={'/'}>Home</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to ={'books'}>Books</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to={"publish"}>Publish a book</Link></Nav.Item>
              <Nav.Item><Link className='nav-item' to={"profile"}>Profile</Link></Nav.Item>
              <Nav.Item> <Link className='nav-item' to={"signin"}>Sign in</Link></Nav.Item>
              <Nav.Item><Link className='nav-item' to={"signup"}>Sign up</Link></Nav.Item>
            </Nav>
            )
          }
          {
            connection && <Navbar.Brand>Test</Navbar.Brand>
          }
          
          </Navbar.Collapse>
          
          
          
      </Container>

    </Navbar>
    <Outlet/>
    </>
    
  )

  return (
    <>
      <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )

}

export default Root

