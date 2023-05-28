import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/esm/Container'
import BookDisplayEntry from './BookDisplayEntry'

const BookEntry = (props) => {
    const [book, setBook] = useState(props.book)
    
 
  return (
    <Container>
        <Accordion.Header>{book.name}</Accordion.Header>
        <Accordion.Body>
          <BookDisplayEntry deleteAble={true} book={book} noExpand={true}/>
        </Accordion.Body>
    </Container>
  )
}

export default BookEntry