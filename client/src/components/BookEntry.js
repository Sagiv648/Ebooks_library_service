import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/esm/Container'
const BookEntry = (props) => {
    const [book, setBook] = useState(props.book)
    
 
  return (
    <Container>
        <Accordion.Header>Item 1</Accordion.Header>
        <Accordion.Body>this is item 1</Accordion.Body>
    </Container>
  )
}

export default BookEntry