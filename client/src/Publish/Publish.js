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
//TODO: Publish
const Publish = () => {

  const [bookName, setBookName] = useState("")
  const [bookAuthors, setBookAuthors] = useState("")
  const [bookPublishDate, setBookPublishDate] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const inputCoverRef = useRef(null);
  const [file,setFile] = useState(null)
  const filePickerRef = useRef(null)
  const [categories,setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("Select a category")
  
  const fetchCategories = async () => {
    const cats = await HttpClient.GetCategories();
    if(cats instanceof Error)
      alert(cats.message)
    else
      setCategories(cats)
  }

  useEffect(() => {
    if(HttpClient.isAuth())
      fetchCategories();
  },[])


  const uploadFileTesting = async () => {
    const URL = "http://localhost:5089/weatherforecast/thisisabucket"
    const data = new FormData();

    var start = 0;
    var offset = 8192;
    var len = file.size;
    data.append("File",file.slice(start,offset))
    data.append("Name", file.name)
    data.append("FileSize", file.size)
    data.append("Start", start)
    data.append("Length", offset);
    try {
      // const res = await fetch(URL, {method: 'POST', body: file.slice(0,100), headers: {
      
      // }
        
      // })
      // const r = await res.json();
      // console.log(r);
      var finished = true;
      
        console.log(start);
         for(;start < len;)
         {
            const res = await axios.post(URL, data, {headers: {
              "Content-Type": "multipart/form-data",
              
            }})

            if(res.status == 200)
            {
              start += offset;
              console.log(start);
              data.set("File",file.slice(start,start+offset))
              data.set("Start", start);
              
            }
          
            
          
         
         
        
        }
      
    } catch (error) {
      console.log(error.message);
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
setBookAuthors(null)
setBookPublishDate(null)
setCoverImage(null)
setFile(null)
filePickerRef.current.value = ""
}
//TODO: Submit in the storage class
const submit = async () => {
  await uploadFileTesting();
}
  return (
    <Container style={{margin: 10}}>
      <Form style={{backgroundColor: 'azure', borderStyle: 'inset', borderRadius: 10}}>
      <Row>
        <Col style={{marginLeft: 10}}>
          <Row>

          <FormGroup style={{marginTop: 10}}>
            <Form.Label>Book name:</Form.Label>
            <FormControl type='text' style={{width: '60%'}}></FormControl>
          </FormGroup>

          </Row>
          <Row>
          <FormGroup style={{marginTop: 10}}>
            <Form.Label>Book authors:</Form.Label>
            <FormControl type='text' style={{width: '60%'}}></FormControl>
          </FormGroup>
          </Row>
          <Row>
            <FormGroup style={{marginTop: 10}}>
              <Form.Label>Publish date:</Form.Label>
              <FormControl type='date' style={{width: '60%'}}></FormControl>
            </FormGroup>
          </Row>
          <Row> 
            <Form.Label style={{marginTop: 10}}>Category:</Form.Label>
            <DropDown >
              <DropDown.Toggle variant='info' style={{width: '60%'}}>{selectedCategory}</DropDown.Toggle>
              <DropDown.Menu>
                {categories.length > 0 && categories.map((val,ind) => 
                (<DropDown.Item onClick={(e) => setSelectedCategory(val.name)} key={ind}>{val.name}</DropDown.Item>))}
              </DropDown.Menu>
            </DropDown>
            
          </Row>
        </Col>
        <Col>
        <FormGroup style={{marginTop: 10, marginBottom: 10}} >
            <Form.Label >Upload:</Form.Label>
            <FormControl onChange={(e) => {

              pickFile(e.target.files[0])
            }} ref={filePickerRef} id='file-picker' type='file' size='small'></FormControl>
          </FormGroup>
          {
            file &&
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
                <FormControl onChange={(e) => {
                  if(e.target.files[0].type.split('/')[0] == 'image')
                    setCoverImage(e.target.files[0])
                  
                }}  id='cover-file' ref={inputCoverRef} style={{visibility: 'hidden'}} type='file'/>

              </FormGroup>
             
            </Container>
           
            
              
          </Row>
          <Row style={{justifyContent: 'center'}}> 
          <Button onClick={()=> {
            setCoverImage(null)
          }} style={{ width: 70,height: 60,marginTop: 10}}>Clear image</Button>
          </Row>
        </Col>
       
        </Row>
        <Row>
          <FormGroup style={{marginTop: 10, marginBottom: 10}} >
            <Form.Label >Description:</Form.Label>
            <FormControl maxLength={1000} as={'textarea'} rows={6} type='text' size='small'></FormControl>
          </FormGroup>
        </Row>
        <Row style={{margin: 5}}> 
          <Col>
          <Button onClick={clearFields} >Clear</Button>
          </Col>
          <Col>
          <Button
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