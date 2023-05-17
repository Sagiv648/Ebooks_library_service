import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import Row from 'react-bootstrap/esm/Row'
import FormControl from 'react-bootstrap/FormControl'
import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import { useNavigate } from 'react-router-dom'
import HttpClient from '../api/HttpClient'
const PasswordReset = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShwon, setPasswordShown] = useState(false)
    const [toastDisplay, setToastDisplay] = useState(false)
    const [error, setError] = useState("")
    const viewSetter = props.viewSetter;
    const emailSentSetter = props.emailSentSetter
    const navigator = useNavigate()
    
    
  const sendReset = async () => {
    const res = await HttpClient.RequestResetPassword(email)
    if(res instanceof Error)
      alert(res.message)
    else
    viewSetter("codeInput")
  }
      
    
    return (
      <Container>
        
        
        <Container style={{minHeight: '95vh', alignItems: 'center',display: 'flex', justifyContent: 'center',width: 'auto', paddingBottom: 10}} fluid>
        <Form style={{marginTop: -200,backgroundColor: '#98B9AB', padding: 50, borderRadius: 25, borderStyle: 'outset'}}>
          <img src='../logo.png'/>
          
          <Row > 
            <Form.Group >
              <Form.Label style={{fontSize: 'large'}}>Enter the email address:</Form.Label>
              <FormControl onChange={(e) => {
                
                setEmail(e.target.value)
              }} value={email} type='email' placeholder='Email...'/>
            
          </Form.Group>
          </Row>
          
          <Row style={{marginTop: 50}}><Button onClick={async () => {
  
            
           
            }} size='lg'>Send an email</Button></Row>
          <Row style={{marginTop: 50}}><Button onClick={async () => {
  
            
            viewSetter("login")
          }} size='lg'>Back to sign in</Button></Row>
          
        
        </Form>
      </Container>
      </Container>
      
    )
  
}

export default PasswordReset