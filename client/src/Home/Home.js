import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import { useNavigation } from 'react-router-dom'
import FormControl from 'react-bootstrap/FormControl'
import FormLabel from 'react-bootstrap/esm/FormLabel'

import DropDown from 'react-bootstrap/Dropdown'
import HttpClient from '../api/HttpClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem'
//background color #9DA2AB
import BookDisplayEntry from '../components/BookDisplayEntry'


const Home = () => {

  const [books, setAllBooks] = useState([])
  const fetchAllBooks = async () => {

    const res = await HttpClient.GetBooks();
    if(res instanceof Error)
    {
      toast.error(res.message)
    }
    else
    {
      setAllBooks(res)
     
    }
  }

  useEffect(() => {
    fetchAllBooks();
  },[])
  const nav = useNavigation();
  const [name, setName] = useState("")
  
  const [selectedCategory, setSelectedCategory] = useState({name: "Category..."}) 
  const [categories, setCategories] = useState([])
  return (
    <Container>
      <ToastContainer/>
      <Row>
        <Col><FormLabel>Search by name:</FormLabel><FormControl value={name} style={{width: '60%'}} onChange={(e) => setName(e.target.value)} type='text'/></Col>
        <Col>
        <FormLabel>Search by category:</FormLabel>
        <DropDown>
            <DropDown.Toggle variant='info' style={{width: '60%'}}>{selectedCategory.name}</DropDown.Toggle>
              <DropDown.Menu>
                {categories.length > 0 && categories.map((val,ind) => 
                (<DropDown.Item onClick={(e) => setSelectedCategory(val)} key={ind}>{val.name}</DropDown.Item>))}
              </DropDown.Menu>
          </DropDown></Col>
      </Row>
          
          {
            books.length > 0 && 
            (
              <ListGroup style={{alignItems: 'center', marginTop: 30}}>
                {books.map((book, index) => {
                  return (<ListGroupItem  key={index}>
                    <BookDisplayEntry book={book}/>
                  </ListGroupItem>)
                })}
              </ListGroup>
            )
          }
          
    </Container>
  )
}

export default Home