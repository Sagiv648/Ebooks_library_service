import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import { useNavigate, useNavigation, useParams } from 'react-router-dom'
import FormControl from 'react-bootstrap/FormControl'
import FormLabel from 'react-bootstrap/esm/FormLabel'

import DropDown from 'react-bootstrap/Dropdown'
import HttpClient from '../api/HttpClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ListGroup from 'react-bootstrap/ListGroup'
//background color #9DA2AB
import BookDisplayEntry from '../components/BookDisplayEntry'
import Button from 'react-bootstrap/esm/Button'
import Marquee from 'react-fast-marquee'
import { useLocation } from 'react-router-dom'
const Home = () => {

  


  const location = useLocation();
  const [books, setAllBooks] = useState([])
  const [expandedBook, setExpandedBook] = useState({})
  const [search, setSearch] = useState(false)
  const [queriedBooks,setQueriedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [topFiveDownloads,setTopFiveDownloads]=useState([])
  const [downloadedBook, setDownloadedBook] = useState("")
 
  const fetchAllBooks = async () => {
    setIsLoading(true)
     HttpClient.GetBooks().then((res) => {
      setAllBooks(res)
        const sorted = res.sort((entry1,entry2) => entry2.downloads_count - entry1.downloads_count)
        const topfive =[]
        for(let i = 0; i < sorted.length && i < 5; i++)
        {
          topfive.push(sorted[i])
        }
        setTopFiveDownloads(topfive)
        
        
     })
     .catch((err) => {
      toast.error(err.message)
      setIsLoading(false)
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
    setIsLoading(false)
  })
  .catch((err) => {
    console.log(err.message);
    setIsLoading(false)
  })
}
  useEffect(() => {
    fetchAllBooks();
    fetchCategories()
    
    

  },[])
  

  useEffect(() => {
    HttpClient.PublishDownloadCountUpdates(downloadedBook)
  },[downloadedBook])

  const nav = useNavigate();
  const [name, setName] = useState("")
  
  const [selectedCategory, setSelectedCategory] = useState({name: "All"}) 
  const [categories, setCategories] = useState([{name: "All"}])
  const [exapnded,setExpanded] = useState(false)
  //console.log(downloadedBooks);
  const query = () => {

    

    
    if(selectedCategory.name !== 'All')
      setQueriedBooks(books.filter((book,index) => book.category.name === selectedCategory.name && book.name.includes(name)))
    else
      setQueriedBooks(books.filter((book,index) => book.name.includes(name)))
    
  }
  
  return (
    
    !exapnded ?
    search ?
    <Container>
    <Button onClick={() => {
            
            setSearch(false)
           }}>Clear</Button>
           <Row style={{fontSize: 30}}>Results:</Row>

              <ListGroup style={{ marginTop: 30}}>
                <Row>
                {
                  queriedBooks.map((book, index) => {
                    return (
                      <Col style={{marginBottom: 30}} key={book._id}>
                      
                      <BookDisplayEntry downloadedBook={downloadedBook} setDownloadedBooks={setDownloadedBook}  expandedBookSetter={setExpandedBook} expansionSetter={setExpanded} book={book}/>
                  
                      </Col>
                    )
                  })
                }
                
                </Row>
                
                
                
              </ListGroup>


    </Container>
    :
    <Container>
      <ToastContainer/>
      <Row>
        <Col>
        <FormLabel>Search by name:</FormLabel>
        <FormControl value={name} style={{width: '60%'}} onChange={(e) => setName(e.target.value)} type='text'/></Col>
        <Col>
        <FormLabel>Search by category:</FormLabel>
        <DropDown>
            <DropDown.Toggle variant='info' style={{width: '60%'}}>{selectedCategory.name}</DropDown.Toggle>
              <DropDown.Menu>
                {categories.length > 0 && categories.map((val,ind) => 
                (<DropDown.Item onClick={(e) => setSelectedCategory(val)} key={ind}>{val.name}</DropDown.Item>))}
              </DropDown.Menu>
          </DropDown>
          </Col>
          
         
          
          
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
        topFiveDownloads.length !== 0 &&
        <Container style={{alignSelf: 'center'}}>
        <Row style={{alignSelf: 'center'}}>
          <Marquee speed={50}>
          {topFiveDownloads.map((entry) => (<BookDisplayEntry key={entry._id}
            downloadedBook={downloadedBook} 
            setDownloadedBook={setDownloadedBook} 
            expandedBookSetter={setExpandedBook} 
            expansionSetter={setExpanded} 
            book={entry}/>))}
          
          </Marquee>
        </Row>
      </Container>
      }
      
       <Container style={{backgroundColor: 'whitesmoke', borderWidth: 1, borderStyle: 'outset',marginTop: 20}} >
         {
        isLoading ? 
        
        <p style={{alignSelf: 'center'}}>Gathering items...</p>
        :
        (
        <Container>
        {
        books.length !== 0 &&
        <ListGroup style={{ marginTop: 30}}>
                <Row>
                {
                  books.map((book, index) => {
                    return (
                      <Col style={{marginBottom: 30}} key={book._id}>
                      
                      <BookDisplayEntry 
                      downloadedBook={downloadedBook} 
                      setDownloadedBook={setDownloadedBook}  
                      expandedBookSetter={setExpandedBook} 
                      expansionSetter={setExpanded} book={book}/>
                  
                      </Col>
                    )
                  })
                }
                
                </Row>
                
                
                
              </ListGroup>
        }
      </Container>)
       }
       </Container>
      
      
      
      
      
          
          
          
    </Container>
    : 
    
    <Container>
    
    {/* <BookDisplayExpansion expandedBook={expandedBook} expansionSetter={setExpanded}/> */}
    </Container>
  )
}

export default Home