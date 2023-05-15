import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import FormLabel from 'react-bootstrap/esm/FormLabel'
import Row from 'react-bootstrap/esm/Row'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/esm/Button'
import HttpClient from '../api/HttpClient'
//TODO: Profile
const Profile = () => {
  const [isSmallWindow, setIsSmallWindow] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profile,setProfile] = useState(null)
  const fetchProfile = () => {
    const profile = HttpClient.GetProfile();
    if(profile)
      setProfile(profile)
    else
      console.log("do smth");
  }
  useEffect(() => {
    window.addEventListener("resize", (e) => {
      if(window.innerWidth < 720)
        setIsSmallWindow(true)
      else 
        setIsSmallWindow(false)
    })
    fetchProfile();
  },[])
  return (
    <Container >
      <Container style={{minHeight: '97vh', alignItems: 'center',display: 'flex', justifyContent: 'center',width: 'auto', paddingBottom: 10}} fluid>

      

      <Form style={{backgroundColor: 'AppWorkspace', padding: 50, borderRadius: 25, borderStyle: 'outset'}}>
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
      </Form>
    </Container>
    </Container>
  )
}

export default Profile