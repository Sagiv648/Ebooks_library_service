import React, { useEffect, useRef, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import crypt from 'crypto-js'
import FormGroup from 'react-bootstrap/esm/FormGroup';
import Alert from 'react-bootstrap/Alert'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { useNavigate } from 'react-router-dom';
import HttpClient from '../api/HttpClient';
const SignUp = (props) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordShwon, setPasswordShown] = useState(false)
  const [toastDisplay, setToastDisplay] = useState(false)
  const [error, setError] = useState("")
  const [username,setUsername] = useState("")
  const [description, setDescription] = useState("")
  const navigator = useNavigate()
  const viewSetter = props.viewSetter;
  const emailSentSetter = props.emailSentSetter
  const lengthValidation = (email,password) => {
    return email != "" && password != ""
  }
  const emailValidation = (email) => {
    
    const emailSplit = email.split('@')
    console.log(emailSplit.length);
    return emailSplit.length == 2
  }
  const passwordValidation = (password) => {
    return password.length >= 5
  }

  const signup = async () => {
         
    if(!lengthValidation(email,password))
    {
      setError("Email and password have to be present.")
      setToastDisplay(true)
      return;
    }
    else if(!emailValidation(email))
    {
      setError("Email has to be valid.")
      setToastDisplay(true)
      return;
    }

    else if(!passwordValidation(password))
    {
      setError("Password must contain atleast 5 characters.")
      setToastDisplay(true)
      return;
      
    }
    const hashed = crypt.SHA256(password).toString();
    const res = await HttpClient.SignUp({email: email, password: hashed, username: username, description: description})
    console.log(res.message);
    if(res instanceof Error)
    {
      
      setError(res.message)
      setToastDisplay(true)
    }
    else
    {
      viewSetter('login')
      alert("A verification email was sent to you.")
      
    }    
  

    
  }
  return (
    <Container>
      <ToastContainer position='top-end'>
      <Toast autohide delay={10000} show={toastDisplay} onClose={() => {
        setToastDisplay(false)
        }}>
        <Toast.Header style={{backgroundColor: '#9B240B', color: '#F35C3C'}}>Error</Toast.Header>
        <Toast.Body >{error}</Toast.Body>
      </Toast>
      </ToastContainer>
      
      <Container style={{minHeight: '95vh', alignItems: 'center',display: 'flex', justifyContent: 'center',width: 'auto', paddingBottom: 10}} fluid>

        
      <Form style={{marginTop: -200,backgroundColor: 'gray', padding: 50, borderRadius: 25, borderStyle: 'outset'}}>
        <img src='../logo.png'/>
        
        <Row>
        <Col > 
          <Form.Group >
            <Form.Label style={{fontSize: 'large'}}>Email address:</Form.Label>
            <FormControl onChange={(e) => {
              
              setEmail(e.target.value)
            }} value={email} type='email' placeholder='Email...'/>
          
        </Form.Group>
        </Col>
        <Col >
          <Form.Group>
            
            <Form.Label style={{fontSize: 'large'}}>Password</Form.Label>
            <FormControl onChange={(e) => {
              setPassword(e.target.value)
            }} value={password} type={passwordShwon ? "text" : "password"} placeholder='Password...'/>
          
        </Form.Group>
        <Form.Check 
            label="Display password"
            type='checkbox'
            onChange={(e) => {
              
              setPasswordShown(!passwordShwon)
            }}/>
        </Col>
        
        </Row>
        <Row>
        <Form.Group>
            
            <Form.Label style={{fontSize: 'large'}}>Username</Form.Label>
            <FormControl onChange={(e) => {
              setUsername(e.target.value)
            }} value={username} placeholder='Username...'/>
          
        </Form.Group>
        <Form.Group>
            
            <Form.Label style={{fontSize: 'large'}}>Description</Form.Label>
            <FormControl onChange={(e) => {
              setDescription(e.target.value)
            }} rows={4} as={'textarea'} maxLength={200} value={description} placeholder='Tell the community a little bit about yourself...'/>
          
        </Form.Group>
        </Row>
        
        
        <Row style={{marginTop: 50}}><Button onClick={async () => {

          await signup();

        }} size='lg'>Sign up</Button></Row>
         <Row style={{marginTop: 50}}><Button onClick={async () => {

          viewSetter("login")

}} size='lg'>Sign in</Button></Row>
      </Form>
    </Container>
    </Container>
    
  )
}

export default SignUp


/*
import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import './RegisterForm.css'; // import your custom CSS styles

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group controlId="formEmail" md="6">
          <Form.Label>Email address</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="email"
              required
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formPassword" md="6">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>🔒</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formConfirmPassword" md="6">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>🔒</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="password"
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please confirm your password.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form.Row>

      <Button variant="primary" type="submit">Register</Button>
    </Form>
 
*/