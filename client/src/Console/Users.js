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
import {FaLevelUpAlt, FaLevelDownAlt} from 'react-icons/fa'
import ModalDialog from 'react-bootstrap/esm/ModalDialog'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/esm/Spinner'
const Users = props => {

    const [allUsers, setAllUsers] = useState([])
    const [allUsersLoading, setAllUsersLoading] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [userName, setUserName] = useState("")
    
    const [permissionsElevationDialog,setPermissionElevationDialog] = useState("")
    const [userElevation, setUserElevation] = useState(null)
    const [userDisciplineryActionDialog,setUserDiciplineryActionDialog] = useState("")
    const [elevationPermissionLoader,setElevationPermissionLoader] = useState(false)
    const [disciplinedUser,setDisciplinedUser] = useState(null)
    const [disciplineUserLoader,setDisciplineUserLoader] = useState(false)
    const fetchAllUsers = async () => {
        setAllUsersLoading(true)
        const res = await HttpClient.GetAllUsers()
        
        if(res instanceof Error)
            toast.error(res.message)
        else
        {
            setAllUsers(res)
            
            
            
        }
            
        setAllUsersLoading(false)
    }

    const editPermissions = async () => {
        if(!userElevation)
        {
            toast.error("No user chosen")
            return;
        }
        
        setElevationPermissionLoader(true)
        console.log(userElevation);
        const res = await HttpClient.EditPermissions({userId: userElevation._id, level: permissionsElevationDialog === "UP" ? 1 : 2})
        if(res instanceof Error)
            toast.error("Error occured with permissions editing " + res.message)
        else
        {
            setAllUsers(allUsers.map((entry) => entry._id === userElevation._id ? {...entry, privilege: permissionsElevationDialog === "UP" ? 1 : 2} : entry))
            setElevationPermissionLoader(false)
            setPermissionElevationDialog("")
            
            toast.success(`Permissions of user with email ${userElevation.email} was successfully changed.`)
            setUserElevation(null)
        }
    }

    
    const disciplineUser = async () => {
        if(!disciplinedUser)
        {
            toast.error("No user chosen")
            return;
        }
        setDisciplineUserLoader(true)
        const res = await HttpClient.DisciplineUser({userId: disciplinedUser._id, action: userDisciplineryActionDialog})
        if(res instanceof Error)
            toast.error(`Error occured with the disciplinary action ${res.message}`)
        else
        {
            setAllUsers(allUsers.map((entry) => entry._id === disciplinedUser._id ? res : entry))
            setDisciplinedUser(null)
            setUserDiciplineryActionDialog("")
            toast.success(`Action has been on user with email ${res.email}`)
        }
        setDisciplineUserLoader(false)

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
                       
                        
                    </Row>
                    
                    {
                        permissionsElevationDialog &&
                        <Modal show onHide={() => {
                            setPermissionElevationDialog("")
                            setUserElevation(null)
                        }}>
                            {
                                permissionsElevationDialog === "UP" ?
                                <Modal.Header>Elevate permissions for user with email: {userElevation.email}</Modal.Header>
                                :
                                <Modal.Header>Remove permissions for user with email: {userElevation.email}</Modal.Header>
                            }
                            <Modal.Body>
                                <Button onClick={async () => {
                                    await editPermissions()
                                }} variant='success'>Yes</Button>
                                {
                                    elevationPermissionLoader && <Spinner size='large'/>
                                }
                                
                                <Button onClick={() => {
                                    setUserElevation(null)
                                    setPermissionElevationDialog("")
                                }} variant='danger'>No</Button>
                            </Modal.Body>
                            
                        </Modal>
                    }
                    {
                        userDisciplineryActionDialog &&
                        <Modal show onHide={() => {
                            setUserDiciplineryActionDialog("")
                            setDisciplinedUser(null)
                        }}>
                            {
                                userDisciplineryActionDialog === "REVIEW BAN" ?
                                <Modal.Header>Do you wish to ban user with email {disciplinedUser.email} from posting reviews?</Modal.Header> 
                                : userDisciplineryActionDialog === "REVIEW UNBAN" ?
                                <Modal.Header>Do you wish to allow user with email {disciplinedUser.email} to post reviews?</Modal.Header> 
                                : userDisciplineryActionDialog === "UPLOAD BAN" ?
                                <Modal.Header>Do you wish to ban user with email {disciplinedUser.email} from uploading books?</Modal.Header>
                                : userDisciplineryActionDialog === "UPLOAD UNBAN" ?
                                <Modal.Header>Do you wish to allow user with email {disciplinedUser.email} to upload books?</Modal.Header> 
                                : <></>
                            }
                            <Modal.Body>
                                <Button onClick={async () => {
                                    await disciplineUser()
                                }} variant='success'>Yes</Button>
                                {
                                    disciplineUserLoader && <Spinner size='large'/>
                                }
                                
                                <Button onClick={() => {
                                    setUserDiciplineryActionDialog("")
                            setDisciplinedUser(null)
                                }} variant='danger'>No</Button>
                            </Modal.Body>
                        </Modal>
                    }
                    
                        
                    
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
                            <th>Edit permissions</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    
                        {
                             allUsersQuery.length !== 0 &&
                            allUsersQuery.map((entry,index) => {
                                return (<tr key={entry._id} >
                                    
                                    
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
                                    
                                        
                                        
                                        

                                        <td>
                                            {
                                                

                                                entry.upload_ban  ?
                                                    <Button onClick={() => {
                                                       setDisciplinedUser(entry)
                                                       setUserDiciplineryActionDialog("UPLOAD UNBAN")
                                                    }} variant='success' size='small'>
                                                    Allow to upload books
                                                    </Button>
                                                    :
                                                     <Button onClick={() => {
                                                        setDisciplinedUser(entry)
                                                        setUserDiciplineryActionDialog("UPLOAD BAN")

                                                     }} variant='danger' size='small'>
                                                    Ban from uploading
                                                    </Button>
                                                   
                                                
                                            }
                                             
                                           
                                            </td>
                                        <td>
                                        {
                                            

                                            entry.review_ban ?
                                            <Button 
                                            onClick={() => {
                                                setDisciplinedUser(entry)
                                                setUserDiciplineryActionDialog("REVIEW UNBAN")
                                            }}
                                            variant='success' size='small'>
                                                Allow to post reviews
                                            </Button>
                                            :
                                            <Button onClick={() => {
                                                setDisciplinedUser(entry)
                                                setUserDiciplineryActionDialog("REVIEW BAN")
                                            }} variant='danger' size='small'>
                                                Ban from review posting
                                            </Button>
                                            
                                            }
                                        
                                        </td>
                                        
                                        
                                    
                                    
                                         
                                        <td>
                                            {
                                                HttpClient.isRingZero() &&
                                                entry.privilege === 2 ?
                                                <>
                                                <FaLevelUpAlt onClick={() =>{
                                                    setUserElevation(entry)
                                                    setPermissionElevationDialog("UP")
                                                }}  cursor={'pointer'} size={20}/>
                                                </>


                                                : HttpClient.isRingZero() && entry.privilege === 1 ?
                                                <>
                                                 <FaLevelDownAlt onClick={() => {
                                                    setUserElevation(entry)
                                                    setPermissionElevationDialog("DOWN")
                                                }} cursor={'pointer'} size={20}/>
                                                </>
                                                
                                                : <></>
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