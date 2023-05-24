
import React, { useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Modal from 'react-bootstrap/Modal'

const BookDisplayExpansion = props => {
    const expansion = props.expansionSetter
    const [expandedBook, setExpandedBook] = useState(props.expandedBook)
    return (
        <Container style={{justifyContent: 'center'}}>
            <Modal show onHide={() => {
            expansion(false)
            
        }} >
           
           <Modal.Header closeButton>{expandedBook.name}</Modal.Header>
           <img style={{width: 200, height: 200}} src={expandedBook.cover_image ? expandedBook.cover_image : '../default-cover.png'}/>
           <Modal.Title style={{alignSelf: 'center'}} >{expandedBook.name}</Modal.Title>
           <Modal.Title style={{alignSelf: 'center'}}>{expandedBook.category.name}</Modal.Title>
           {expandedBook.authors && <Modal.Title style={{alignSelf: 'center'}}>{expandedBook.authors}</Modal.Title>}
           {
               expandedBook.description &&
               <Modal.Body>
                    {expandedBook.description}
               </Modal.Body>
           }
           
                
            
        </Modal>
        </Container>
        
    )
}

export default BookDisplayExpansion