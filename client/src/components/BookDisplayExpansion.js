
import React, { useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
const BookDisplayExpansion = props => {
    const expansion = props.expansionSetter
    const [expandedBook, setExpandedBook] = useState(props.expandedBook)
    return (
        <Container style={{justifyContent: 'center'}}>
            <Modal show  onHide={() => {
            expansion(false)
            
        }} >
            <Modal.Header style={{alignSelf: 'center'}} >{expandedBook.name}</Modal.Header>
           <img style={{width: 200, height: 200, alignSelf: 'center'}} src={expandedBook.cover_image ? expandedBook.cover_image : '../default-cover.png'}/>
           <Modal.Title style={{alignSelf: 'center'}} >{expandedBook.name}</Modal.Title>
           <Modal.Title style={{alignSelf: 'center'}}>{expandedBook.category.name}</Modal.Title>
           {expandedBook.authors && <Modal.Title style={{alignSelf: 'center'}}>Authors: {expandedBook.authors}</Modal.Title>}
           {
               expandedBook.description &&
               <Modal.Body style={{alignSelf: 'center'}}>
                <FormControl style={{width: 400}} value={expandedBook.description} maxLength={1000} as={'textarea'} disabled rows={6}/>
            
                    
               </Modal.Body>
           }
           
           
           
           
            
        </Modal>
          
        </Container>
        
    )
}

export default BookDisplayExpansion