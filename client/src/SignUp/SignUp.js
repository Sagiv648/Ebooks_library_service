import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { authenticateThunk } from '../features/auth/authSlice';
import HttpClient from '../api/HttpClient';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {

  const nav = useNavigate();
  const isLogged = () => {
    const auth = HttpClient.GetToken();
    console.log(`Auth is ${auth}`);
    if(auth)
    nav('/');
  }
  useEffect(() => {
    isLogged();
  },[])
  return (
    <Container fluid>
      <Button onClick={async () => {
        console.log("clicked");
        
        const res = await HttpClient.SignUp({email: "t12@gmail.com", password: "12345"})
        console.log(res);
        nav('/')
      }}>click me to sign up</Button>

    </Container>
  )
}

export default SignUp