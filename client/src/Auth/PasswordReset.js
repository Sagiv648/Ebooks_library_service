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
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'


const PasswordReset = (props) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShwon, setPasswordShown] = useState(false)
    const [toastDisplay, setToastDisplay] = useState(false)
    const [error, setError] = useState("")
    const viewSetter = props.viewSetter;
    const emailSentSetter = props.emailSentSetter
    const navigator = useNavigate()
    
  const validEmail = () => {
    const emailSplit = email.split('@')
    return emailSplit.length == 2;
  }
  const sendReset = async () => {

    if(!validEmail())
      return;

    const res = await HttpClient.RequestResetPassword(email)
    if(res instanceof Error)
      alert(res.message)
    else
    {
      alert("Email sent.")
      viewSetter("codeInput")
    }
    
    
  }
      
    
    return (
      <Container>
        {
          toastDisplay &&
          <ToastContainer position='middle-center'>
          <Toast >
            <Toast.Header>Email sent</Toast.Header>
            <Toast.Body>Check your email</Toast.Body>
          </Toast>
          </ToastContainer>
          
        }
        
        
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
  
              await sendReset();
           
            }} size='lg'>Send an email</Button></Row>

          <Row style={{marginTop: 10}}><Button onClick={async () => {

          viewSetter("codeInput")

          }} size='lg'>Already have a code? click here</Button></Row>

          <Row style={{marginTop: 50}}><Button onClick={async () => {
  
            
            viewSetter("login")
          }} size='lg'>Back to sign in</Button></Row>
          
        
        </Form>
      </Container>
      </Container>
      
    )
  
}

export default PasswordReset