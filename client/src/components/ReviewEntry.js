import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Card from 'react-bootstrap/Card'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/esm/Button'
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify'
import HttpClient from '../api/HttpClient'
const ReviewEntry = props => {
    const [review,setReview] = useState(props.review)
    const [reportClicked, setReportClicked] = useState(false)
    const auth = props.auth
    const reportReview = async () => {

        const res = await HttpClient.SubmitReviewReport(review._id)
        if(res instanceof Error)
            toast.error(`An error occured: ${res.message}`)
        else
            toast.success(`Report was submitted and the review will be checked`)
    }
    
  return (
    <Container>
        <Card>
            
            <Card.Body>
                <Row>
                     <Col lg={10}>
                     <FormControl  value={review && review.review_content} as={'textarea'} rows={4} maxLength={500} disabled readOnly/>
                    {/* <Button onClick={async (e) => {
                        if(!reportClicked)
                        {
                            setReportClicked(true)
                            await reportReview()
                        }
                            

                    }} disabled={!auth ? true : reportClicked ? true:  false} variant='warning' style={{marginTop: 5}}>Report for an inappropriate review</Button> */}
                        Post date: {review.created_at}
                </Col>
                
                <Col>
                    <Container>
                        <Card >
                            <Card.Img style={{width: 100, height: 100}} src={review && review.user.avatar ? review.user.avatar : "../user.png"}/>
                            <Card.Body>
                                
                                <Row >
                                    {review && review.user.username ? review.user.username : "No name"}
                                </Row>
                                {
                                    review &&

                                    review.recommend !== null && review.recommend === true ?
                                    
                                    <Row style={{color: "green"}}>Recommended</Row> :
                                    review.recommend !== null && review.recommend === false ?
                                    <Row style={{color: "red"}}>Not Recommended</Row>
                                    :
                                    <Row>No recommendation</Row>

                                }
                               
                            </Card.Body>
                        </Card>
                    </Container>
                    
                </Col>
                </Row>
               
            </Card.Body>
        </Card>
    </Container>
  )
}

export default ReviewEntry