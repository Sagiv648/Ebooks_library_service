import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Col from 'react-bootstrap/esm/Col'
import Users from './Users'
import Categories from './Categories'
import Books from './Books'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
//Ring one admins can see all users
//Ring one admins can post new categories
//Ring one admins can delete categories
//Ring one admins can see all books (along with report count)
//Ring one admins can delete books
//Ring one admins can delete reviews
//Ring zero admins can do all that ring one admins can but can also elevate permissions

const Console = () => {
  const [page,setPage] = useState("users")

  return (
    <Container>
      <Navbar style={{backgroundColor: 'ButtonFace',borderWidth: 2, borderStyle: 'outset', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
        
          <Col >
          
          <Nav.Link  onClick={() => {
              setPage("users")
            }}>
              <Nav.Item style={page === "users" ? {color: 'blue'} : {}}>
                Users
              </Nav.Item>
            </Nav.Link>
          
            
          </Col>
          <Col>
            <Nav.Link onClick={() => {
              setPage("categories")
            }}>
              <Nav.Item style={page === "categories" ? {color: 'blue'}: {}}>
                Categories
              </Nav.Item>
            </Nav.Link>
          </Col>
          <Col>
            <Nav.Link onClick={() => {
              setPage("books")
            }}>
              <Nav.Item style={page === "books" ? {color: 'blue'} : {}}>
                Books
              </Nav.Item>
            </Nav.Link>
          </Col>
          

        
         
        
        
          
        
      </Navbar>
      
      {
        page === "users" ?
        <Users/>
        : page === "categories" ?
        <Categories/> 
        : page === "books" ?
         <Books/> 
         : 
         <></>

      }
    </Container>
  )
}

export default Console