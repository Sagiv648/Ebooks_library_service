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
import {MdMore} from 'react-icons/md'

const Reviews = props => {

  const [allReviews,setAllReviews] = useState([])
  const [reviewsLoading,setReviewsLoading] = useState(false)
  const [reviewToDelete,setReviewToDelete] = useState(null)
  const [deletionDialog,setDeletionDialog] = useState(false)
  const [reviewDeletionLoading,setBookDeletionLoading] = useState(false)
  const [expandedReview,setExpandedReview] = useState(null)
  const [expanded,setExpanded] = useState(false)

  return (
    <Container>
      <Container>
        {/* TODO: Search by bookname, book category, post date and sort as descending order by report count */}
      </Container>
      {
        expanded &&
        <Modal  show onHide={() => {
          setExpandedReview(null)
          setExpanded(false)
        }}>
          
          <Modal.Body >
            
            <Row >
              <h5>Book name: {expandedReview.book.name}</h5>
              <h5>Book category: {expandedReview.book.category.na}</h5>
              <h5>Posted by: {expandedReview.user.email}</h5>
              
            </Row>
            <Row>
              <FormControl disabled readOnly value={expandedReview.review_content} as={'textarea'} rows={5} maxLength={500}/>
            </Row>
          </Modal.Body>
        </Modal>
      }
      {
        reviewsLoading ?
        <Row>Gathering items...</Row>
        :
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>User</th>
              <th>Date</th>
              <th>Report count</th>
               
            </tr>
          </thead>
          <tbody>
            {
              allReviews.length !== 0 &&
              allReviews.map((entry) => {
                return (<tr style={entry.report_count >= 50 ? {borderWidth: 2, borderStyle: 'solid', borderColor: 'yellow'} : {}}>
                  <td>{entry._id}</td>
                  <td>{entry.user.email}</td>
                  <td>{entry.uploaded_at}</td>
                  <td>{ entry.report_count}</td>
                  <td><MdMore onClick={() => {
                  setExpandedReview(entry)
                  setExpanded(true)
                }} cursor={'pointer'} size={30} color='blue'/></td>
                <td><FiDelete onClick={async () => {
                    setReviewToDelete(entry)
                    setDeletionDialog(true)
                }} cursor={'pointer'} size={30} color='red'/></td>
                </tr>)
              })
            }
          </tbody>
        </Table>
      }
    
    </Container>
  )
}

export default Reviews