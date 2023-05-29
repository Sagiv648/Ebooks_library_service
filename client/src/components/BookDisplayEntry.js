import React, { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import HttpClient from '../api/HttpClient'
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const BookDisplayEntry = props => {
    const [book, setBook] = useState(props.book)
    //console.log(props.book);
    const expansion = props.expansionSetter
    const exapndedBookSetter = props.expandedBookSetter
    const uploadedBooks=props.uploadedBooks
    const setUploadedBooks=props.setUploadedBooks
    const noExpand = props.noExpand;
    const deleteAble = props.deleteAble
    const deleteBook = async () => {
        const res = await HttpClient.DeleteBook(book)
        if(res instanceof Error)
            alert(res.message)
        else
        {
            setUploadedBooks(uploadedBooks.filter((entry) => entry._id !== book._id))
            toast.success(`Book ${book.name} successfully deleted.`)
        }
            

    }
    return (
        <Card style={{width: 250,alignItems: 'center'}}>
            <ToastContainer/>
            <Card.Img variant='top' style={{width: '75%', height: 200}} src={book.cover_image ? book.cover_image : '../default-cover.png'}/>
            <Card.Title>{book.name}</Card.Title>
            {
                book.authors && 
                <Card.Header>{book.authors}</Card.Header>
            }
                <Card.Body>{book.category.name}</Card.Body>
                
                <Row style={{marginTop: 20, justifyContent: 'center'}}>
                    {
                        !noExpand &&
                        <Col style={{height: 100}}><Button onClick={() => {
                            expansion(true)
                            exapndedBookSetter(book)
                            
                        }}>Expand</Button></Col>
                    }
                    
                    <Col style={{height: 100}}><Button onClick={() => {
                        window.open(book.download_url, book.name)
                        
                    }} variant='success'>Download</Button>
                    {deleteAble &&
                        <Row style={{marginTop: 5}}>
                            <Button variant='danger' onClick={async (e) => {
                                await deleteBook()
                                
                            }}>
                            Delete
                            </Button>
                        </Row>
                    }
                    </Col>
                </Row>
                
               
            
            

        </Card>
    )
}

export default BookDisplayEntry