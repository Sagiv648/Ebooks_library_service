import React, { useEffect, useRef, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import Row from 'react-bootstrap/esm/Row'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/esm/Button'
import HttpClient from '../api/HttpClient'
import Col from 'react-bootstrap/esm/Col'
import Accordion from 'react-bootstrap/Accordion'
import BookEntry from '../components/BookEntry'
//TODO: Profile
const Profile = () => {
  
  const [profile,setProfile] = useState(null)
  
  const [avatar,setAvatar] = useState("")
  const inputCoverRef = useRef();
  const [uploadedBooksCount, setUploadedBooksCount] = useState(0)
  const [uploadedBooks, setUploadedBooks] = useState([])

  

  const fetchProfile = () => {
    const profile = HttpClient.GetProfile();
    if(profile)
    {
      setProfile(profile)
      setAvatar(profile.avatar)
      
    }

  }
  const fetchBooks = async() => {
    
    const res = await HttpClient.GetUserBooks();
    
    if(!res instanceof Error)
    {
      console.log(res);
      setUploadedBooks(res.uploaded_books)
      setUploadedBooksCount(res.uploaded_books_count)
    }
    
      
    

    
  }
  useEffect(() => {
    
    fetchBooks();
    fetchProfile();
    

    
    
  },[])


//TODO: Fetch the user's uploaded books
//TODO: Implement pagination
  return (
    
      <Container style={{backgroundColor: 'AppWorkspace',marginTop: 20,width: '80%',borderRadius: 25, borderStyle: 'outset',borderWidth: 1}} fluid>
        <Row >
        <Col >
          <Row style={{justifyContent: 'center'}}>
            <Row style={{fontSize: 20, justifyContent: 'center',marginTop: 20}}>Uploaded books:</Row>
            <Container style={{marginTop: 30, marginBottom: 20}}>
              <Accordion defaultActiveKey={"0"}>
                {uploadedBooks.length > 0 ? uploadedBooks.map((val,ind) => {

                  return (<Accordion.Item key={ind} eventKey={ind+1}>
                    <BookEntry book={val}/>
                  </Accordion.Item>)
                })
                :
                  <Row style={{justifyContent: 'center'}}>You haven't uploaded any books.</Row>
              }
                
              </Accordion>
              
            </Container>

          </Row>
        </Col>
        <Col >
          <Row style={{justifyContent: 'center', fontSize: 20}}>{profile && profile.email}</Row>
          <Row style={{justifyContent: 'center', fontSize: 20}}>
          <Container
            onClick={() => {
              inputCoverRef.current.click();
             
              
            }}
            className='cover-image'
            style={{ cursor: 'pointer', 
            justifyContent: 'center', 
            textAlign: 'center',
              height: 300,marginTop: 10 ,width: 200,
            backgroundImage: `url(${profile && avatar ? URL.createObjectURL(avatar) : '../user.png'})`}}>

              
              <FormGroup>
                <Form.Label>
                  Click to choose an avatar
                </Form.Label>
                <FormControl onChange={(e) => {
                  if(e.target.files[0].type.split('/')[0] == 'image')
                    setAvatar(e.target.files[0])
                    
                }}  id='cover-file' ref={inputCoverRef} style={{visibility: 'hidden'}} type='file'/>

              </FormGroup>
             
            </Container>
          </Row>
          <Row style={{justifyContent: 'center'}}> 
          <Button onClick={()=> {
            setAvatar(profile.avatar)
          }} style={{ width: '20%',height: 60,marginTop: 10, marginRight: 10}}>Clear picked avatar</Button>
          <Button variant='secondary' onClick={()=> {
            setAvatar("")
          }} style={{ width: '20%',height: 60,marginTop: 10}}>Set default avatar</Button>
          </Row>
          <Row style={{justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
            <Button variant='success' style={{width: '50%'}}>Set avatar</Button>
          </Row>
        </Col>
        </Row>
      

      {/* <Form >
        <Row style={{justifyContent: 'center'}}><img className='profile-img' onClick={() => {
          console.log("you click");
        }} style={{width: 150, height: 100}} src={profile && profile.avatar ? profile.avatar : "../user.png"}/></Row>
        <Row style={{justifyContent: 'center'}}>email placeholder</Row>
        <Row > 
          <Form.Group >
            <Form.Label style={{fontSize: 'large'}}>First Name:</Form.Label>
            <FormControl onChange={(e) => {
              
              setFirstName(e.target.value)
            }} value={firstName} type='text' placeholder='Email...'/>
          
        </Form.Group>
        </Row>
        <Row style={{marginTop: 50}}>
          <Form.Group>
            
            <Form.Label style={{fontSize: 'large'}}>Last Name:</Form.Label>
           
            <FormControl onChange={(e) => {
              setLastName(e.target.value)
            }} value={lastName} type={"text"} placeholder='Password...'/>
          
        </Form.Group>
        </Row>
        <Row style={{marginTop: 50}}>
          <Form.Group>
            
            <Form.Label style={{fontSize: 'large'}}>Password:</Form.Label>
           
            <FormControl onChange={(e) => {
              setNewPassword(e.target.value)
            }} value={newPassword} type={"password"} placeholder='Password...'/>
          
        </Form.Group>
        </Row>
        <Row style={{marginTop: 50}}>
          <Form.Group>
            
            <Form.Label style={{fontSize: 'large'}}>Confirm password:</Form.Label>
           
            <FormControl onChange={(e) => {
              setConfirmPassword(e.target.value)
            }} value={confirmPassword} type={"password"} placeholder='Password...'/>
          
        </Form.Group>
        </Row>
        <Row style={{marginTop: 50}}><Button onClick={async () => {

          

        }} size='lg'>Sign up</Button></Row>
      </Form> */}
    </Container>
    
  )
}

export default Profile