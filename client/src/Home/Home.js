import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import { useNavigation } from 'react-router-dom'
//background color #9DA2AB

const Home = () => {

  const nav = useNavigation();

  

  return (
    <Container fluid>

      List of all the books

    </Container>
  )
}

export default Home