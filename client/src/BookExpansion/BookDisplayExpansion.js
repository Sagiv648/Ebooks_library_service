
import React, { useEffect, useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
import {  Link, useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"
import HttpClient from "../api/HttpClient"
import ErrorPage from "../components/ErrorPage"
import FormGroup from "react-bootstrap/esm/FormGroup"
import Button from "react-bootstrap/esm/Button"
import Spinner from "react-bootstrap/esm/Spinner"
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ReviewEntry from "../components/ReviewEntry"
import UserProfileModal from "./UserProfileModal"



const BookDisplayExpansion = props => {
    const location = useLocation()
    
    const expansion = props.expansionSetter
    const {bookId} = useParams()
    const [auth, setAuth] = useState(false)
    const [error,setError] = useState(null)
    const [reviewContent, setReviewContent] = useState("")
    const [recommended, setRecommended] = useState("")
    const [reviewPublishing, setReviewPublishing] = useState(false)
    const [userLinkClicked, setUserLinkClicked] = useState(false)
    const [allReviews,setAllReviews] = useState([])
    const [allReviewsLoading, setAllReviewsLoading] = useState(false)
    const fetchUrlEnteredBook = async () => {
        const res = await HttpClient.GetBooks(bookId)
        if(res instanceof Error)
            setError(res)
        else
            setExpandedBook(res)
    }
    
    const publishReview = async () => {
        
        if(reviewContent)
        {
            let data = {review_content: reviewContent, bookId: expandedBook.book._id}
            if(recommended === 'recommended')
                data.recommend = true;
            else if(recommended === 'not recommended')
                data.recommend = false

            setReviewPublishing(true)
            const res = await HttpClient.PostReview(data)
            if(res instanceof Error)
                toast.error(`Error occured: ${res.message}`)
            else
            {
                setAllReviews([...allReviews, res ])
                setReviewContent("")
            }
                
            setReviewPublishing(false)
        }
        else
            toast.error("No review content.")
    }
    const fetchReviews = async () => {
        setAllReviewsLoading(true)
        const res = await HttpClient.GetReviews(expandedBook.book._id)
        if(res instanceof Error)
            alert(`Error occured: ${res.message}`)
        else
        {

            setAllReviews(res)
            
        }
        setAllReviewsLoading(false)
            
    }
    
    useEffect(() => {
        console.log(bookId);
        if(location.state === null)
        {
            fetchUrlEnteredBook();
        }
        if(HttpClient.isAuth())
            setAuth(true)
        if(!error)
            fetchReviews()
        console.log(expandedBook);
    },[])

const [expandedBook, setExpandedBook] = useState(location.state)
    return (
        
            error ?
             <ErrorPage/>
             :
             
             
            <Container>
            {
                expandedBook ?
                <Container style={{marginTop: 10}}>
                    
                    {
                    userLinkClicked && 
                        <UserProfileModal setUserLinkClicked={setUserLinkClicked} user={expandedBook.book.user}/>
                    }
                    {/* Book details row */}
                    <Row>
                        <Col lg={2}>
                        <Row>
                            <img style={{width: 200, height: 200}} src={expandedBook.cover ? expandedBook.cover : "../default-cover.png"}/>
                            
                        </Row>
                           <Button style={{ width: 100,marginTop: 5, marginBottom: 10,alignSelf: 'center'}} variant="success" onClick={(e) => {
                                    window.open(expandedBook.book.download_url,expandedBook.book.name)
                                }}>Download</Button>
                              
                        </Col>
                        <Col>
                        <Row>{expandedBook.book.name}</Row>
                        <Row>{expandedBook.book.category.name}</Row>
                        <Row>{expandedBook.book.authors}</Row>
                        <Row>{expandedBook.book.published_at}</Row>
                        <Row>{expandedBook.book.uploaded_at}</Row>
                        {
                            expandedBook.book.user.username &&
                            <>
                                <Row>Uploaded by:  {expandedBook.book.user.username}</Row>
                            <Row><Button style={{marginTop: 5}} onClick={() => {
                                setUserLinkClicked(true)
                            }}>Show profile</Button></Row>
                            </>
                            
                        }
                        
                        </Col>
                        <Col lg={8}>
                        <Container>
                            <FormControl as={'textarea'} disabled rows={6} value={expandedBook.book.description}/>
                            
                        </Container>
                        </Col>
                        
                    </Row>
                    {/* Insert a new review row */}
                    
                    <Row>
                        <Col lg={10}>
                            <FormGroup>
                            <FormControl onChange={(e) => {
                                setReviewContent(e.target.value)
                            }} value={reviewContent} disabled={!auth ? true : false} type="text" as={'textarea'} placeholder="Review content..." maxLength={500} rows={4}/>
                            </FormGroup>
                            
                            
                        </Col>
                        <Col >
                            <Row><Button style={recommended === 'recommended' ? {borderWidth: 3, borderStyle: 'inset', borderColor: 'blue'} : {}} 
                            onClick={() => {
                                if(recommended === "recommended")
                                    setRecommended("")  
                                else
                                    setRecommended("recommended")
                            }} variant="success">Recommended</Button></Row>
                            <Row style={{marginTop: 10}}><Button style={recommended === 'not recommended' ? {borderWidth: 3, borderStyle: 'inset', borderColor: 'blue'} : {}} 
                            onClick={(e) => {
                                if(recommended === 'not recommended')
                                    setRecommended("")
                                else
                                    setRecommended("not recommended")
                            }}
                            variant="danger">Not Recommended</Button></Row>
                            <Row style={{marginTop: 10, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                {
                                    reviewPublishing ? 
                                    <Spinner style={{alignSelf: 'center'}}/>
                                    : 
                                    <Button onClick={async () => {
                                        if(!auth)
                                            toast.info("Must be signed in to post a review")
                                        else
                                            await publishReview()
                                } } variant="info">Publish</Button>
                                }
                               </Row>
                        </Col>
                        
                        
                    </Row>
                    {
                        allReviewsLoading ? 
                        <Row>Gathering reviews...</Row>
                        :
                        allReviews.length !== 0 ?
                        allReviews.map((entry,index) => {
                            return (<ReviewEntry auth={auth} review={entry}/>)
                        })
                        :
                        <Row>No reviews yet.</Row>
                        
                    }
                    
                </Container>
                : 
                <Container>
                    Gathering the item...
                </Container>
            }
            
            </Container>
        
        
    )

}

export default BookDisplayExpansion