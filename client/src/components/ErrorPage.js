import React from 'react'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'

const ErrorPage = () => {
  return (
    <Container>
        <Row>
            Oops!
        </Row>
        <Row>
            It seems you are trying to access an element that doesn't exist.
        </Row>
    </Container>
  )
}

export default ErrorPage