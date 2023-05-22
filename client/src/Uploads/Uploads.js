import React, { useEffect } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/esm/Row'
import StorageClient from '../api/StorageClient'
import { useOutletContext } from 'react-router-dom'
const Uploads = () => {


const [context] = useOutletContext()

useEffect(() => {

    

},[])

  return (
    <Container>
        <Row style={{color: '#FFBC42'}}>Pending uploads</Row>
        <Table>
            <thead>
                <tr>
                    <th>Book name:</th>
                    <th>Progress</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>name...</td>
                    <td>percentage</td>
                </tr>
            </tbody>
        </Table>
        <Row style={{color: '#87FF65'}}>Completed uploads</Row>
        <Table>
            <thead>
                <tr>
                    <th>Book name:</th>
                    <th>Progress</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>name...</td>
                    <td>percentage</td>
                </tr>
            </tbody>
        </Table>
    </Container>
  )
}

export default Uploads