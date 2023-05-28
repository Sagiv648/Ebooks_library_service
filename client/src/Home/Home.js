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
import Button from 'react-bootstrap/esm/Button'
import BookDisplayExpansion from '../components/BookDisplayExpansion'
import SearchResults from '../components/SearchResults'
import BooksCollection from '../components/BooksCollection'


const Home = () => {
  
  const [books, setAllBooks] = useState([])
  const [expandedBook, setExpandedBook] = useState({})
  const [search, setSearch] = useState(false)
  const [queriedBooks,setQueriedBooks] = useState([]);
  console.log(search);
  const fetchAllBooks = async () => {
  
     HttpClient.GetBooks().then((res) => {
      console.log(res);
        setAllBooks(res)
     })
     .catch((err) => {
      toast.error(err.message)
     })
    // if(res instanceof Error)
    // {
    //   toast.error(res.message)
    // }
    // else
    // {
    //   console.log(res);
      
      
    // }
  }
const fetchCategories = async () => {

  HttpClient.GetCategories().then((res) => {
    
    
    setCategories([...res,{name: "All"}] )
    setSelectedCategory(categories[categories.length-1])
  })
  .catch((err) => {
    console.log(err.message);
  })
}
  useEffect(() => {
    fetchAllBooks();
    fetchCategories()
  },[])

  const nav = useNavigation();
  const [name, setName] = useState("")
  
  const [selectedCategory, setSelectedCategory] = useState({name: "All"}) 
  const [categories, setCategories] = useState([{name: "All"}])
  const [exapnded,setExpanded] = useState(false)
  
  const query = () => {

    

    
    if(selectedCategory.name !== 'All')
      setQueriedBooks(books.filter((book,index) => book.category.name === selectedCategory.name && book.name.includes(name)))
    else
      setQueriedBooks(books.filter((book,index) => book.name.includes(name)))
    
  }
  const qbooks = books.filter((book) => book.name.includes(name))
  return (
    
    !exapnded ?
    search ?
    <Container>
    <Button onClick={() => {
            setSearch(false)
           }}>Clear</Button>
    <BooksCollection expansionSetter={setExpanded} expandedBookSetter={setExpandedBook} books={queriedBooks} />

    </Container>
    :
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
      <Row>
        <Col>
        
          
            <Button style={{marginTop: 10, width: 200, height: 50}} onClick={() => {
              if(name !== "" || selectedCategory.name !== 'All')
              {
                query()
                setSearch(true)
              }
            
            
          }}>Search</Button>
        
       
        </Col>
     
      </Row>
       
      
      
      {
        books.length !== 0 &&
        <BooksCollection expansionSetter={setExpanded} expandedBookSetter={setExpandedBook} books={books} />
      }
      
          
          
          
    </Container>
    : 
    
    <>
    <BookDisplayExpansion expandedBook={expandedBook} expansionSetter={setExpanded}/>
    </>
  )
}

export default Home