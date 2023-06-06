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
  
  const [avatar,setAvatar] = useState("")
  const inputCoverRef = useRef();
  const [uploadedBooksCount, setUploadedBooksCount] = useState(0)
  const [uploadedBooks, setUploadedBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [itemToDelete,setItemToDelete] = useState({})
  const [username,setUsername] = useState("")
  const [description,setDescription] = useState("")
  const [newAvatar,setNewAvatar] = useState(null)
  const [action,setAction] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [isSmallerView,setSmallerView] = useState(false)
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
    
    
    
    const data = {...profile,username: username, description: description, avatar : profile.avatar}
    if(avatar instanceof Blob )
    {
      const file_name = crypto.SHA256(`${profile.id}`)
     
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
     
    }
    else
      data.avatar = ""
    
    
    
    
    //setAvatar(profile.avatar ? profile.avatar : "../user.png")
    
    HttpClient.EditProfile(data)
    .then((newProfile) => {
      console.log("xyz");
      toast.success("Profile successfully updated.")
      
      setProfile(newProfile)
      setAvatar(newProfile.avatar)
      
    })
    .catch((err) => {
      toast.error(`Error occured`)
    })
    
    
  }


  useEffect(() => {
    
    if(window.innerWidth <= 760)
        setSmallerView(true)

        const resizeSubscriber = window.addEventListener('resize', (e) => {
          if(window.innerWidth <= 760)
            setSmallerView(true)
          else
            setSmallerView(false)
            console.log(window.innerWidth);
        })


    fetchBooks();
    fetchProfile();
    
    return () => {
      window.removeEventListener("resize",resizeSubscriber)
    }
  },[])
  useEffect(() => {
    switch (action) {
      case "CLEAR":
        
        //URL.revokeObjectURL(fileUrl)
        setFileUrl(URL.revokeObjectURL(fileUrl))
        if(profile.avatar)
          setAvatar(profile.avatar)
        else
          setAvatar("../user.png")
        break;
    
      case "DEFAULT":
        setAvatar("../user.png")
        break;
    }
  },[action])

  return (
    
      <Container style={{backgroundColor: 'AppWorkspace',width: '88%',marginTop: 20,borderRadius: 25, borderStyle: 'outset',borderWidth: 1}} fluid>
        
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
                    <BookEntry uploadedBooks={uploadedBooks} setUploadedBooks={setUploadedBooks} itemToDelete={itemToDelete} setItemToDelete={setItemToDelete} book={book}/>
                    
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
              
            backgroundImage: `url(${fileUrl ? fileUrl : avatar })`}}>

              
              <FormGroup>
                <Form.Label>
                  Click to choose an avatar
                </Form.Label>
                <FormControl onChange={(e) => {
                  if(e.target.files[0].type.split('/')[0] == 'image')
                  {
                    // if(fileUrl)
                    //   setFileUrl(URL.revokeObjectURL(fileUrl))
                    setAvatar(e.target.files[0])
                    setFileUrl(URL.createObjectURL(e.target.files[0]))
                    setAction("")
                  }
                    
                    
                }}  id='cover-file' ref={inputCoverRef} style={{visibility: 'hidden'}} type='file'/>

              </FormGroup>
             
            </Container>
          </Row>
          <Row style={{justifyContent: 'center'}}> 
          <Button onClick={()=> {
            setAction("CLEAR")
            
            //setAvatar(profile.avatar)
            
          }} style={{ width: '20%',height: 80,marginTop: 10, marginRight: 10}}>Clear picked avatar</Button>
          <Button variant='secondary' onClick={()=> {
            setAction("DEFAULT")
            
            
            
          }} style={{ width: '20%',height: 80,marginTop: 10}}>Set default avatar</Button>
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
          }} style={isSmallerView ? {marginBottom: 10, marginRight: 10,width: 350} : {marginBottom: 10, marginRight: 10}} rows={5} maxLength={200} as={'textarea'} value={description}/>
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