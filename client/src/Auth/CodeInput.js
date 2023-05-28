import React, { useEffect, useRef, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import FormGroup from 'react-bootstrap/esm/FormGroup'
import Row from 'react-bootstrap/esm/Row'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import HttpClient from '../api/HttpClient'
const MAX_DIGITS = 6;
const CodeInput = (props) => {
  const viewSetter = props.viewSetter
  const [code,setCode] = useState([]);
  const generateColsArr = () => {
    const colsArr = []
    for(let i = 0; i < MAX_DIGITS; i++)
    {
      colsArr.push(MAX_DIGITS);
      
    }
    return colsArr
  }

 

  const handleCodeInput = () => {

    const parsed_code = code.join("")

    const res = HttpClient.CompareCodes(parsed_code)
    if(res instanceof Error)
      alert(res.message)
    else
      viewSetter("passwordChangeInput")
  }
 

  return (
    <Container style={{backgroundColor: 'wheat', width: '50%', borderStyle: 'inset' ,borderRadius: 10,marginTop: 30}}>
       <Form  > 
        <FormGroup >
        <Form.Label style={{fontSize: 20}}>Enter your code here:</Form.Label>
          <Row style={{justifyContent: 'center'}}>
            {
              generateColsArr().map((val,ind) => {
                return (
                  <FormControl
                  className={`${ind}`}
                  onChange={(e) => {
                    if(code.length < ind)
                      setCode([...code,e.target.value])
                    else
                      code[ind] = e.target.value;
                      
                        document.getElementById(`code-input-${ind+1}`).focus()
                  }}
                  style={{alignSelf: 'center',textAlign: 'center',fontSize: 40,width: 50, margin: 20}} key={ind} id={`code-input-${ind}`} maxLength={1} type='text'></FormControl>
                  )
                
              })
            }
            <FormControl disabled id='code-input-6' style={{visibility: 'hidden'}}/>
          </Row>
          
          
        </FormGroup>
       </Form>
       <Row style={{justifyContent: 'center'}}>
          <Button 
          onClick={() => {
            handleCodeInput();
          }}
          variant='success' style={{width: 300,height: 50}}>Submit</Button>
          </Row>
          
          <Row style={{justifyContent: 'center'}}>
          <Button onClick={() => {
              viewSetter("passwordReset")
          }} style={{width: 300,height: 50,marginTop: 30, marginBottom: 30}}>Go back</Button>
          </Row>
    </Container>
  )
}

export default CodeInput