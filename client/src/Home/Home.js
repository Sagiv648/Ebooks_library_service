import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'
import { useNavigation } from 'react-router-dom'
import FormControl from 'react-bootstrap/FormControl'
import FormLabel from 'react-bootstrap/esm/FormLabel'
import Card from 'react-bootstrap/Card'
import DropDown from 'react-bootstrap/Dropdown'
//background color #9DA2AB



const Home = () => {

  const nav = useNavigation();
  const [name, setName] = useState("")
  
  const [selectedCategory, setSelectedCategory] = useState({name: "Category..."}) 
  const [categories, setCategories] = useState([])
  return (
    <Container>

      <Row>
        <Col><FormLabel>Search by name:</FormLabel><FormControl value={name} style={{width: '60%'}} onChange={(e) => setName(e.target.value)} type='text'/></Col>
        <Col>
        <FormLabel>Search by category:</FormLabel>
        <DropDown>
            <DropDown.Toggle variant='info' style={{width: '60%'}}>{selectedCategory.name}</DropDown.Toggle>
              <DropDown.Menu>
                {categories.length > 0 && categories.map((val,ind) => 
                (<DropDown.Item onClick={(e) => setSelectedCategory(val)} key={ind}>{val.name}</DropDown.Item>))}
              </DropDown.Menu>
          </DropDown></Col>
      </Row>
            
    </Container>
  )
}

export default Home