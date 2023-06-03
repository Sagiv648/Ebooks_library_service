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
import Loader from '../components/Loader'
import Spinner from 'react-bootstrap/esm/Spinner'
import StorageClient from '../api/StorageClient'
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import crypto from 'crypto-js'
//TODO: Fix or remove features from the avatar upload
const Profile = () => {
  
  const [profile,setProfile] = useState({})
  
  const [avatar,setAvatar] = useState(null)
  const inputCoverRef = useRef();
  const [uploadedBooksCount, setUploadedBooksCount] = useState(0)
  const [uploadedBooks, setUploadedBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [itemToDelete,setItemToDelete] = useState({})
  const [username,setUsername] = useState("")
  const [description,setDescription] = useState("")
  const [newAvatar,setNewAvatar] = useState("")
  const fetchProfile = () => {
    const profile1 = HttpClient.GetProfile();
    if(profile1)
    {
      setProfile(profile1)
      if(profile1.avatar)
        setAvatar(profile1.avatar)
      else
        setAvatar("../user.png")
      setUsername(profile1.username)
      setDescription(profile1.description)
    }
    

  }
  const fetchBooks = async() => {
    
    
    setIsLoading(true)
    HttpClient.GetUserBooks().then((res) => {
      
      setUploadedBooks(res.uploaded_books)
      setUploadedBooksCount(res.uploaded_books_count)
      
      setIsLoading(false)
    })
    .catch((err) => {
      
      setIsLoading(false)
    })
      
    

    
  }

  const saveChanges = async ()=> {
    
    
    console.log("xxx");
    const data = {...profile,username: username, description: description, avatar : profile.avatar}
    if(avatar instanceof Blob )
    {
      const file_name = crypto.SHA256(`${profile.id}`)
      //console.log("it's a blob");
      const mime = avatar.name.split('.').slice(-1)
      const image = await StorageClient.Upload(avatar, "avatars", `${file_name}.${mime}`)
      //profile.avatar = await StorageClient.UploadAvatar({avatar: avatar, id: profile.id})
      if(!image)
      {
        toast.error("Error occured while uploading the avatar")
        return;
      }
      //console.log(image);
      
      data.avatar = image.download_url
      setAvatar(image.download_url)
      //console.log(profile.avatar);
    }
    else if(avatar === '../user.png')
      data.avatar = ""
    
    
    
    //setAvatar(profile.avatar ? profile.avatar : "../user.png")
    
    HttpClient.EditProfile(data)
    .then((newProfile) => {
      console.log("xyz");
      toast.success("Profile successfully updated.")
      //fetchProfile()
      setProfile(newProfile)
    })
    .catch((err) => {
      toast.error(`Error occured`)
    })
    
    //const newProfile = await HttpClient.EditProfile(data)
    // if(newProfile instanceof Error)
    // {
    //   toast.error(`Error occured`)
    // }
    // else
    // {
    //   toast.success("Profile successfully updated.")
    //   setProfile(newProfile)
  
    //   setNewAvatar("")
    // }
    //const picture = await StorageClient.UploadAvatar()
  }


  useEffect(() => {
    
    fetchBooks();
    fetchProfile();
    
    
  },[])

  useEffect(() => {
    setAvatar( profile && profile.avatar ? profile.avatar : "../user.png")
  },[profile])


  return (
    
      <Container style={{backgroundColor: 'AppWorkspace',marginTop: 20,width: '80%',borderRadius: 25, borderStyle: 'outset',borderWidth: 1}} fluid>
        
        <Row >
        <Col >
          <Row style={{justifyContent: 'center'}}>
            <Row style={{fontSize: 20, justifyContent: 'center',marginTop: 20}}>Uploaded books:</Row>
            {
              isLoading ?
              
              <p style={{alignSelf: 'center'}}>Gathering items...</p>
              
              
              :
              <Container style={{marginTop: 30, marginBottom: 20}}>
              <Accordion defaultActiveKey={"0"}>
                {uploadedBooks.length != 0 ? uploadedBooks.map((book,ind) => {

                  return (<Accordion.Item style={{alignItems: 'center'}} key={book._id} eventKey={ind}>
                    <BookEntry uploadedBooks={uploadedBooks} setUploadedBooks={setUploadedBooks}  itemToDelete={itemToDelete} setItemToDelete={setItemToDelete} book={book}/>
                    
                  </Accordion.Item>)
                })
                :
                  <Row style={{justifyContent: 'center'}}>You haven't uploaded any books.</Row>
              }
                
              </Accordion>
              
            </Container>
            }
            

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
              
            backgroundImage: `url(${avatar instanceof Blob ? URL.createObjectURL(avatar) : avatar })`}}>

              
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
            //setAvatar(profile.avatar)
            if(profile.avatar)
              setAvatar(profile.avatar)
            else
              setAvatar("../user.png")
          }} style={{ width: '20%',height: 60,marginTop: 10, marginRight: 10}}>Clear picked avatar</Button>
          <Button variant='secondary' onClick={()=> {
           
            setAvatar("../user.png")
            
          }} style={{ width: '20%',height: 60,marginTop: 10}}>Set default avatar</Button>
          </Row>
          
          <Row style={{marginTop: 20}}>
            <Col lg={2}>
            <Form.Label style={{}}>Username: </Form.Label>
            </Col>
            <Col lg={7}>
            <FormControl onChange={(e) => {
              setUsername(e.target.value)
            }} value={username}/>
            </Col>
          
            
          </Row>
          <Row style={{justifyContent: 'center', alignItems: 'center'}}>
          <Form.Label >Description: </Form.Label>
          <FormControl onChange={(e) => {
            setDescription(e.target.value)
          }} style={{marginBottom: 10, marginRight: 10}} rows={5} maxLength={200} as={'textarea'} value={description}/>
          </Row>
          {
          (profile && (username !== profile.username || description !== profile.description || avatar instanceof Blob || (profile.avatar && avatar === '../user.png'))) &&
           <Row style={{justifyContent: 'center', marginTop: 20, marginBottom: 10}}>
            <Button onClick={async () => {
              
              await saveChanges()
            }} variant='success' style={{width: '50%'}}>Save changes</Button>
          </Row>
        }
        </Col>
        
        
        </Row>
      

      
    </Container>
    
  )
}

export default Profile