import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Button from 'react-bootstrap/esm/Button'
import HttpClient from '../api/HttpClient'
import crypt from 'crypto-js'
const PasswordChange = (props) => {

  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const viewSetter = props.viewSetter
  const validPasswords = () => {

    return password.length >= 5 && confirmPassword.length >= 5;
  }
  const equalPasswords = () => {
    return password === confirmPassword
  }
  const changePassword = async () => {
    if(!validPasswords())
      alert("invalid passwords")
    if(!equalPasswords())
      alert("passwords must be equal")
    const hashed_password = crypt.SHA256(password).toString();
    const res = await HttpClient.SetPassword(hashed_password)
    if(res instanceof Error)
      alert(res.message)
    else
    {
      alert("Password successfully changed.")
      viewSetter('login')
    }
  }

  return (
    <Container style={{backgroundColor: 'bisque', borderStyle: 'outset', borderRadius: 30,borderWidth: 0.5, width: '50%', marginTop: 30}}>
      <Form style={{marginLeft: 20,marginBottom: 20}}>
        <Row>
          <Col>
          <FormGroup>
        <Row>
        
         <Form.Label >New Password:</Form.Label>
        <FormControl onChange={(e) => {
          setPassword(e.target.value)
        }} value={password} style={{width: 250}} type='password'/>
      
        </Row>
      </FormGroup>
      <FormGroup>
      <Row style={{marginTop: 30}}>
        
        <Form.Label >Confirm New Password:</Form.Label>
       <FormControl onChange={(e) => {
        setConfirmPassword(e.target.value)
       }} value={confirmPassword} style={{width: 250}} type='password'/>
     
       </Row>
      </FormGroup>
          </Col>
          <Col style={{alignSelf: 'center'}}>
            <Button
              onClick={async () => {
                await changePassword();
              }}
            style={{height:50}}>Change password</Button>
          </Col>
        </Row>
        
      </Form>

    </Container>
  )
}

export default PasswordChange