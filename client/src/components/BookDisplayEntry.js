import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
const BookDisplayEntry = props => {
    const [book, setBook] = useState(props.book)
    console.log(props.book);
    const expansion = props.expansionSetter
    const exapndedBookSetter = props.expandedBookSetter

    


    return (
        <Card style={{width: 250,alignItems: 'center'}}>
            <Card.Img variant='top' style={{width: '75%', height: 200}} src={book.cover_image ? book.cover_image : '../default-cover.png'}/>
            <Card.Title>{book.name}</Card.Title>
            {
                book.authors && 
                <Card.Header>{book.authors}</Card.Header>
            }
                <Card.Body>{book.category.name}</Card.Body>
                
                <Row style={{marginTop: 20, justifyContent: 'center'}}>
                    <Col style={{height: 100}}><Button onClick={() => {
                        expansion(true)
                        exapndedBookSetter(book)
                    }}>Expand</Button></Col>
                    <Col style={{height: 100}}><Button onClick={() => {
                        window.open(book.download_url, book.name)
                        
                    }} variant='success'>Download</Button></Col>
                </Row>
               
            
            

        </Card>
    )
}

export default BookDisplayEntry