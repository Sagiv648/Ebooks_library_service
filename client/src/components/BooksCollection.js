import React, { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import BookDisplayEntry from './BookDisplayEntry'
const BooksCollection = props => {
    const [books,setBooks] = useState(props.books)
    const expandedBookSetter = props.expandedBookSetter
    const expansionSetter=props.expansionSetter
  return (
    <ListGroup style={{ marginTop: 30}}>
                <Row>
                {
                  books.map((book, index) => {
                    return (
                      <Col style={{marginBottom: 30}} key={index}>
                      
                      <BookDisplayEntry expandedBookSetter={expandedBookSetter} expansionSetter={expansionSetter} book={book}/>
                  
                      </Col>
                    )
                  })
                }
                
                </Row>
                
                
                
              </ListGroup>
  )
}

export default BooksCollection