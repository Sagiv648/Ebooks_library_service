import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/esm/Container'
import BookDisplayEntry from './BookDisplayEntry'
import Row from 'react-bootstrap/esm/Row'
import FormControl from 'react-bootstrap/FormControl'
import Col from 'react-bootstrap/esm/Col'
const BookEntry = (props) => {
    const [book, setBook] = useState(props.book)
    
 
  return (
    <Container>
        <Accordion.Header>{book.name}</Accordion.Header>
        <Accordion.Body style={{justifyContent: 'center'}}>
          <Row >
            <Col><BookDisplayEntry deleteAble={true} book={book} noExpand={true}/>
            </Col>
          <Col><FormControl style={{width: 250}} value={book.description} maxLength={1000} as={'textarea'} disabled rows={6}/>
          </Col>
          
          {/* <BookDisplayEntry deleteAble={true} book={book} noExpand={true}/> */}
          </Row>
          
        </Accordion.Body>
    </Container>
  )
}

export default BookEntry