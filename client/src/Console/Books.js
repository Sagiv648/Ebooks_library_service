import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/esm/Table'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import FormControl from 'react-bootstrap/FormControl'
import HttpClient from './../api/HttpClient'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {FiDelete} from 'react-icons/fi'
import Button from 'react-bootstrap/esm/Button'
import Spinner from 'react-bootstrap/Spinner'
import Modal from 'react-bootstrap/Modal'
import Dropdown from 'react-bootstrap/Dropdown'

const Books = () => {

  const [allBooks,setAllBooks] = useState([])
  const [booksLoading,setBooksLoading] = useState(false)
  const [bookToDelete,setBookToDelete] = useState(null)
  const [deletionDialog,setDeletionDialog] = useState(false)
  const [bookDeletionLoading,setBookDeletionLoading] = useState(false)
  const fetchBooks = async () => {
    setBooksLoading(true)
    const res = await HttpClient.GetBooksUnfiltered()
    if(res instanceof Error)
      toast.error(`Error occured with ${res.message}`)
    else
      setAllBooks(res)
    setBooksLoading(false)
  }

  const deleteBook = async () => {
    if(!bookToDelete){
      toast.error("Error with book deletion, no book selected")
      return;
    }
    setBookDeletionLoading(true)
    const res = await HttpClient.DeleteBookAdmin(bookToDelete._id)
    if(res instanceof Error)
      toast.error(`Error occured with deletion, ${res.message}`)
    else
    {
      setAllBooks(allBooks.filter((entry) => entry._id !== bookToDelete._id))
      toast.success(`Book named ${bookToDelete.name} and id'ed ${bookToDelete._id} has been successfully deleted`)
      setBookToDelete(null)
      
    }
      setBookDeletionLoading(false)
      setDeletionDialog(false)
  }

  useEffect(() => {
    fetchBooks()
  },[])

  return (
    <Container>
      <Container>

      </Container>

      {
      deletionDialog &&
      
      <Modal show onHide={() => {
        setBookToDelete(null)
        setDeletionDialog(false)
      }}>
        <Modal.Header>Are you sure you wish to delete book Id'ed {bookToDelete._id} and named {bookToDelete.name}</Modal.Header> 
        <Modal.Body>
          <Row>
            <Col lg={2}><Button disabled={bookDeletionLoading} onClick={async () => {
                await deleteBook()
            }} variant='success'>Yes</Button></Col>
            {
              bookDeletionLoading &&
              <Col lg={1}><Spinner size='large'/></Col>
            }
            <Col lg={2}><Button disabled={bookDeletionLoading}  onClick={() => {
              setBookToDelete(null)
              setDeletionDialog(false)
            }} variant='danger'>No</Button></Col>
          </Row>
        </Modal.Body>
      </Modal>
      }


      {
        booksLoading ?
        <Row>Gathering items...</Row>
        :
        <Table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Category</th>
          <th>Authors</th>
          <th>Publish date</th>
          <th>Uploading date</th>
          
          <th>Uploader's email</th>
          <th>Downloads count</th>
          
          <th>Number of reports</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {allBooks.map((entry) => {
          return (<tr style={entry.report_count >= 50 ? {borderWidth: 3, borderStyle: 'solid', borderColor: 'yellow', borderRadius: 5} : {}}>
            <td>{entry._id}</td>
            <td>{entry.name}</td>
            <td>{entry.category.name}</td>
            <td>{entry.authors}</td>
            <td>{entry.published_at}</td>
            <td>{entry.uploaded_at}</td>
            <td>{entry.user.email}</td>
            <td>{entry.downloads_count}</td>
            
            <td>{entry.report_count}</td>
            <td><FiDelete onClick={async () => {
                setBookToDelete(entry)
                setDeletionDialog(true)
            }} cursor={'pointer'} size={30} color='red'/></td>
          </tr>)
        })}
      </tbody>
    </Table>
      }
    
    </Container>
  )
}

export default Books