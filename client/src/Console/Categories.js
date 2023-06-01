import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/esm/Table'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import FormControl from 'react-bootstrap/FormControl'
import HttpClient from './../api/HttpClient'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {FiDelete} from 'react-icons/fi'
import Button from 'react-bootstrap/esm/Button'
import Spinner from 'react-bootstrap/Spinner'
const Categories = () => {
  const [allCategories, setAllCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [categoryName, setCategoryName] = useState("")
  const [categoryAddingLoading,setNewCategoryAddingLoading] = useState(false)
  const fetchCategories = async () => {
    setCategoriesLoading(true)
    const res = await HttpClient.GetCategories()
    if(res instanceof Error)
      toast.error("Error occured with categories retrival")
    else
      setAllCategories(res)
    setCategoriesLoading(false)
  }
  const appendCategory = async ()=>{

    if(allCategories.filter((entry) => entry.name === newCategory).length !== 0)
    {
      toast.error(`Category ${newCategory} already exists`)
      return;
    }

    setNewCategoryAddingLoading(true)
    const res = await HttpClient.AppendCategory(newCategory)
    if(res instanceof Error)
      toast.error("Error occured with category appending")
    else
    {
      toast.success(`Category ${newCategory} successfully added.`)
      setNewCategory("")
      setAllCategories([res, ...allCategories])
    }
    setNewCategoryAddingLoading(false)
      
  }
  useEffect(() => {
    fetchCategories()
  },[])

  const queriedCategories = allCategories.filter((entry) => entry.name.includes(categoryName))

  return (
    <Container>
        <Container >
          <Row style={{marginTop: 10, marginBottom: 20}}>
            <Col lg={2}>
              <Row>
                Category name:
               
              </Row>
            </Col>
            <Col lg={4}>
            <FormControl placeholder='Category to append...' value={newCategory} onChange={(e) => {
            setNewCategory(e.target.value)
          }}/>
            </Col>
            <Col >
            {
              categoryAddingLoading ? 
              <Spinner size='large' style={{alignSelf: 'center'}} />
              :
              <Button onClick={async () => {
                await appendCategory()
              }} variant='success'>Append category</Button>
            }
              
            </Col>
          </Row>


          <Row style={{marginTop: 10}}>
            <Col lg={2}>
            Search category:
            </Col>
            <Col lg={4}>
            <FormControl placeholder='Category to search...' value={categoryName} onChange={(e) => {
            setCategoryName(e.target.value)
          }}/>
            </Col>
          </Row>
          
         
        </Container>
        {
          categoriesLoading ?
          <Row>Gathering items...</Row>
          :
          <Table>
          <thead>
              <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <td>Books count</td>
              </tr>
          </thead>
          <tbody>
            {queriedCategories.length !== 0 &&
              queriedCategories.map((entry) => {
                return (<tr>
                  <td>{entry._id}</td>
                  <td>{entry.name}</td>
                  <td>{entry.books_count}</td>
                  <td>

                    <FiDelete size={20} style={{cursor: 'pointer', color: 'red'}}></FiDelete>
                  </td>
                  
                  
                </tr>)
              })}
          </tbody>
      </Table>
        }
        
    </Container>
  )
}

export default Categories