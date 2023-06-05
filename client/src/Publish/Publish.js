import React, { useEffect, useRef, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import './publish.css'
import Button from 'react-bootstrap/esm/Button'
import axios from 'axios'
import HttpClient from '../api/HttpClient'
import DropDown from 'react-bootstrap/Dropdown'
import StorageClient from '../api/StorageClient'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import UploadDetails from './UploadDetails'
import crypto from 'crypto-js'

const Publish = () => {

  const [bookName, setBookName] = useState("")
  const [bookAuthors, setBookAuthors] = useState("")
  const [bookPublishDate, setBookPublishDate] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const inputCoverRef = useRef(null);
  const [file,setFile] = useState(null)
  const filePickerRef = useRef(null)
  const [categories,setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState({name: "Select a category"})
  const [description,setBookDescription] = useState("")
  const [uploadStart, setUploadStart] = useState(false)
  const [uploadFinished, setUploadFinished] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadError, setUploadError] = useState("")
  const [permissions,setPermissions] = useState({})
  const [isSmallerView,setSmallerView] = useState(false)
  const fetchCategories = async () => {
    const cats = await HttpClient.GetCategories();
    if(cats instanceof Error)
      alert(cats.message)
    else
      setCategories(cats)
  }
  const fetchPermissions = async () => {
    const res = await HttpClient.GetPermissions()
    console.log(res);
    if(res instanceof Error)
      toast.error(`Error with retrieving permissions ${res.message}`)
    else
    {
     
        setPermissions(res)
    }
      

      
  }
  useEffect(() => {
    if(HttpClient.isAuth())
    {
      fetchCategories();
      fetchPermissions()
    }
    if(window.innerWidth <= 760)
    setSmallerView(true)

    const resizeSubscriber = window.addEventListener('resize', (e) => {
      if(window.innerWidth <= 760)
        setSmallerView(true)
      else
        setSmallerView(false)
        console.log(window.innerWidth);
    })
    return () => {
      window.removeEventListener("resize",resizeSubscriber)
    }
  },[])


  const handleUpload = async () => {
    

    if(selectedCategory.name === "Select a category" || file === null || bookName === "")
    {
      toast.error("Invalid fields at file/category/book name")
      return;
    }
    else
    {
      let data = {name: bookName, category: selectedCategory._id}
      const upload_date = Date.now()
      const userId = HttpClient.GetProfile().id
      data.uploaded_at = upload_date
      if(coverImage)
      {
        const mime = coverImage.name.split('.').slice(-1)
        const fileName = crypto.SHA256(`${userId}_${upload_date}`).toString()
        const res = await StorageClient.Upload(coverImage, "covers",fileName + `.${mime}`)
        data.cover_image = res.download_url
      }
        
      if(bookPublishDate)
        data.publishDate = bookPublishDate;
      if(bookAuthors)
        data.authors = bookAuthors
      if(description)
        data.description = description

        const mime = file.name.split('.').slice(-1)[0]
      
      
      const book_file_name = crypto.SHA256(`${userId}_${upload_date}`).toString()

      const book = await StorageClient.Upload(file, "ebooks",book_file_name + `.${mime}`, () => {
        setUploadFinished(false)
        setUploadStart(true)
        setUploadProgress("0/100")
    },
    (progressData) => {
      setUploadProgress(progressData)
    },() => {
      console.log("finished here?");
      setUploadFinished(true)
      //setUploadStart(false)
      setUploadProgress("")
      clearFields()
    }, (error) => {
      setUploadError(error.message)
    })
    if(book instanceof Error)
    {
      toast.error(`Upload failed with error ${res.message}`)
      return;
    }
      data.download_url = book.download_url
      

  

      const res = await HttpClient.UploadBook(data)
      if(res instanceof Error)
      {
        toast.error("Failed to add the book with error " + res.message)
      }
      else
        toast.success(`Book named ${data.name} successfully added.`)

    }
    
  }
 
  const pickFile = (file) => {
    
    const extension = file.name.split('.').slice(-1);
    if(extension == 'pdf')
      setFile(file)

    else
      {
        alert("The file has to be a pdf file")
        setFile(null)
      }
      console.log(file);
  }
const clearFields = () => {
setBookName("")
setBookAuthors("")
setBookPublishDate("")
setCoverImage("")
setFile("")
setBookDescription("")
filePickerRef.current.value = ""

}

const submit = async () => {
  handleUpload()
  //await uploadFileTesting();
}
  return (
    <Container style={isSmallerView ? {marginTop: 10} : {margin: 10}}>
      {
        uploadStart &&
        <UploadDetails 
        uploadFinished={uploadFinished} 
        
        setUploadFinished={setUploadFinished} 
        setUploadStart={setUploadStart}
        uploadStart={uploadStart} bookName={bookName} progressData={uploadProgress} uploadError={uploadError}/>
      }
      <Form style={{backgroundColor: 'azure', borderStyle: 'inset', borderRadius: 10}}>
      <Row>
        
        <Col style={{marginLeft: 10}}>
          {
          permissions.upload_ban &&
          <Row style={{marginLeft: 20}}>You are banned from uploading books.</Row>
          }
          <Row>

          <FormGroup style={{marginTop: 10}}>
            <Form.Label>Book name:</Form.Label>
            <FormControl disabled={permissions.upload_ban} value={bookName} onChange={(e) => setBookName(e.target.value) } type='text' style={ isSmallerView ? {width: '100%'}: {width: '60%'}}></FormControl>
          </FormGroup>

          </Row>
          <Row>
          <FormGroup style={{marginTop: 10}}>
            <Form.Label>Book authors:</Form.Label>
            <FormControl disabled={permissions.upload_ban} value={bookAuthors} onChange={(e) => setBookAuthors(e.target.value) } type='text' style={ isSmallerView ? {width: '100%'}:{width: '60%'}}></FormControl>
          </FormGroup>
          </Row>
          <Row>
            <FormGroup style={{marginTop: 10}}>
              <Form.Label>Publish date:</Form.Label>
              <FormControl disabled={permissions.upload_ban} value={bookPublishDate} onChange={(e) => setBookPublishDate(e.target.value) } type='date' style={isSmallerView ? {width: '100%'}:{width: '60%'}}></FormControl>
            </FormGroup>
          </Row>
          <Row> 
            <Form.Label style={{marginTop: 10}}>Category:</Form.Label>
            <DropDown >
              <DropDown.Toggle disabled={permissions.upload_ban} variant='info' style={{width: 'auto'}}>{selectedCategory.name}</DropDown.Toggle>
              <DropDown.Menu>
                {categories.length > 0 && categories.map((val,ind) => 
                (<DropDown.Item onClick={(e) => setSelectedCategory(val)} key={ind}>{val.name}</DropDown.Item>))}
              </DropDown.Menu>
            </DropDown>
            
          </Row>
        </Col>
        <Col>
        <FormGroup style={{marginTop: 10, marginBottom: 10}} >
            <Form.Label >Upload:</Form.Label>
            <FormControl disabled={permissions.upload_ban} onChange={(e) => {

              pickFile(e.target.files[0])
            }} ref={filePickerRef} id='file-picker' type='file' size='small'></FormControl>
          </FormGroup>
          {
            file && !isSmallerView &&
            <Container>
              <Row>File name: {file.name}</Row>
            <Row>File size: {file.size}</Row>
            <Row>Last Modification: {new Date(file.lastModified).toUTCString()}</Row>
            </Container>
            
          }
          
        </Col>
        <Col>
          <Row style={{justifyContent: 'flex-end'}}>
            <Container
            onClick={() => {
              inputCoverRef.current.click();
             
              
            }}
            className='cover-image'
            style={{ cursor: 'pointer', 
            justifyContent: 'center', 
            textAlign: 'center',
              height: 300,marginTop: 10 ,width: 200,
            backgroundImage: `url(${coverImage ? URL.createObjectURL(coverImage) : '../default-cover.png'})`}}>

              
              <FormGroup>
                <Form.Label>
                  Click to choose a cover image
                </Form.Label>
                <FormControl disabled={permissions.upload_ban} onChange={(e) => {
                  if(e.target.files[0].type.split('/')[0] == 'image')
                    setCoverImage(e.target.files[0])
                  
                }}  id='cover-file' ref={inputCoverRef} style={{visibility: 'hidden'}} type='file'/>

              </FormGroup>
             
            </Container>
           
            
              
          </Row>
          <Row style={{justifyContent: 'center'}}> 
          <Button disabled={permissions.upload_ban} onClick={()=> {
            setCoverImage(null)
          }} style={{ width: 70,height: 60,marginTop: 10}}>Clear image</Button>
          </Row>
        </Col>
       
        </Row>
        <Row>
          <FormGroup style={{marginTop: 10, marginBottom: 10}} >
            <Form.Label >Description:</Form.Label>
            <FormControl disabled={permissions.upload_ban} value={description} onChange={(e) => {
              setBookDescription(e.target.value)
            }} maxLength={1000} as={'textarea'} rows={6} type='text' size='small'></FormControl>
          </FormGroup>
        </Row>
        <Row style={{margin: 5}}> 
          <Col>
          <Button onClick={clearFields} >Clear</Button>
          </Col>
          <Col>
          <Button disabled={permissions.upload_ban}
          onClick={ async () => {
            
            await submit();
          }}
          style={{width: 200}}>Submit</Button>
          </Col>
        </Row>
        
        
        
       
        
        
       
      </Form>
      </Container>
  )
}

export default Publish