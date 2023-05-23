import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
const BookDisplayEntry = props => {
    const [book, setBook] = useState(props.book)
    return (
        <Card style={{width: 250,alignItems: 'center'}}>
            <Card.Img variant='top' style={{width: '75%', height: 200}} src={book.cover ? book.cover : '../default-cover.png'}/>
            <Card.Title>{book.name}</Card.Title>
            {
                book.authors && 
                <Card.Header>{book.authors}</Card.Header>
            }
            
                
                <Row style={{marginTop: 20, justifyContent: 'center'}}>
                    <Col style={{height: 100}}><Button>Expand</Button></Col>
                    <Col style={{height: 100}}><Button variant='success'>Download</Button></Col>
                </Row>
               
            
            

        </Card>
    )
}

export default BookDisplayEntry