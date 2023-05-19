import React from 'react'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'


const Loader = () => {
  return (
        <Container>
            <Spinner animation='border'/>
        </Container>
  )
}

export default Loader