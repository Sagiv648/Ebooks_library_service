import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/esm/Container'
import HttpClient from '../api/HttpClient'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/esm/Button'

const Users = props => {

    const [allUsers, setAllUsers] = useState([])
    const [allUsersLoading, setAllUsersLoading] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [userName, setUserName] = useState("")
    const [initalReviewBanned,setInitialReviewBanned] = useState([])
    const [initalUploadBanned,setInitalUploadBanned] = useState([])
    const [newReviewBanned, setNewReviewBanned] = useState([])
    const [newUploadBanned, setNewUploadBanned] = useState([])
    const [newReviewUnbanned,setNewReviewUnbanned] = useState([])
    const [newUploadUnbanned,setNewUploadUnbanned] = useState([])
    const fetchAllUsers = async () => {
        setAllUsersLoading(true)
        const res = await HttpClient.GetAllUsers()
        
        if(res instanceof Error)
            toast.error(res.message)
        else
        {
            setAllUsers(res)
            
            setInitialReviewBanned(res.filter((entry) => entry.review_ban))
            setInitalUploadBanned(res.filter((entry) => entry.upload_ban))
            
        }
            
        setAllUsersLoading(false)
    }

    const saveChanges = async () => {
        console.log("changes saved");
    }
    
useEffect(() => {
    fetchAllUsers()
},[])
const allUsersQuery = allUsers.filter((entry) => entry.username.includes(userName) && entry.email.includes(userEmail))
  return (
    
           
            
            <Container style={{marginTop: 10}}>
                <Container style={{marginBottom: 10}}>
                    <Row>
                        <Col lg={11}>
                        <Row>
                        
                        <Col lg={2}>
                            <h6>Search by email:</h6>
                        
                        </Col>
                        <Col lg={3}>
                        <FormControl value={userEmail} placeholder='Email...' onChange={(e) => {
                            setUserEmail(e.target.value)
                        }} type='text'/>
                        </Col>
                       
                    </Row>
                    <Row style={{marginTop: 20}}>
                        
                        <Col lg={2}>
                            <h6>Search by username:</h6>
                        
                        </Col>
                        <Col lg={3}>
                        <FormControl value={userName} placeholder='Username...' onChange={(e) => {
                            setUserName(e.target.value)
                        }} type='text'/>
                        </Col>
                    </Row>
                        </Col>
                        {
                            newReviewBanned.length !== 0 && newUploadBanned.length !== 0 && (newReviewBanned.length !== initalReviewBanned.length || newUploadBanned.length !== initalUploadBanned) &&
                            <Col lg={1}>
                                <Button onClick={async () => {
                                    await saveChanges()
                                }} size='bg' variant='warning'>Save changes</Button>
                            </Col>
                        }
                        
                    </Row>
                    
                    
                    
                        
                    
                </Container>
                {
                    allUsersLoading ?  
                    <Row>Gathering items...</Row>
                    :
                    <Table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Uploaded books count</th>
                            {/* <th>Uploaded books</th> */}
                            <th>Joined at</th>
                            <th>Review banned</th>
                            <th>Upload banned</th>
                            <th>Privilege</th>
                            <th>Upload ban</th>
                            <th>Review ban</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    
                        {
                             allUsersQuery.length !== 0 &&
                            allUsersQuery.map((entry,index) => {
                                return (<tr >
                                    
                                    <td>{entry.email}</td>
                                    <td>{entry.username}</td>
                                    <td>{entry.uploaded_books_count}</td>
                                    <td>{entry.created_at}</td>
                                    <td>{entry.review_ban}</td>
                                    <td>{entry.upload_ban}</td>
                                    {/* <td><tr>
                                        {entry.uploaded_books.map((entry) => <tr>{entry}</tr>)}
                                        </tr></td> */}
                                    <td>{entry.privilege}</td>
                                    <td> {initalUploadBanned.filter((subEntry) => entry._id === subEntry._id).length !== 0 ?
                                        <Button onClick={() => {
                                            // setInitalUploadBanned(newUploadBanned.filter((subEntry) => subEntry._id !== entry._id))
                                            // setNewUploadUnbanned([...newUploadUnbanned, entry])
                                            // setNewUploadBanned(newUploadBanned.filter((subEntry) => subEntry._id !== entry._id))
                                        }} variant='success' size='small'>
                                        Allow to upload books
                                        </Button>
                                        :
                                         <Button onClick={() => {
                                        //     setInitalUploadBanned([...initalUploadBanned, entry])
                                        //     setNewUploadBanned([...newUploadBanned, entry])
                                        //    setNewUploadUnbanned(newUploadUnbanned.filter((subEntry) => subEntry._id !== entry._id))
                                         }} variant='danger' size='small'>
                                        Ban from uploading
                                        </Button>
                                    }
                                       
                                        </td>
                                    <td>
                                        {
                                            initalReviewBanned.filter((subEntry) => entry._id === subEntry._id).length !== 0 ?
                                            <Button 
                                            onClick={() => {
                                                setInitialReviewBanned(initalReviewBanned.filter((subEntry) => entry._id !== subEntry._id))
                                                setNewReviewUnbanned([...newReviewUnbanned, entry])
                                                setNewReviewBanned(newReviewBanned.filter((subEntry) => subEntry._id !== entry._id))
                                            }}
                                            variant='success' size='small'>
                                                Allow to post reviews
                                            </Button>
                                            :
                                            <Button onClick={() => {
                                                setNewReviewBanned([...newReviewBanned, entry])
                                                setInitialReviewBanned([...initalReviewBanned,entry])
                                                setNewReviewUnbanned(newReviewUnbanned.filter((subEntry) => subEntry._id !== entry._id))
                                            }} variant='danger' size='small'>
                                                Ban from review posting
                                            </Button>
                                        }
                                        
                                        </td>
                                </tr>)
                            })
                        }
                    </tbody>
                </Table>
                }
                
           
                
            
            </Container>
  )
}

export default Users