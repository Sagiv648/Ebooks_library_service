import React, { useState } from "react"
import Container from "react-bootstrap/esm/Container"
import Modal from 'react-bootstrap/Modal'
import Row from "react-bootstrap/esm/Row"
import BookDisplayEntry from "./BookDisplayEntry"
import ListGroup from 'react-bootstrap/ListGroup'
import Col from "react-bootstrap/esm/Col"
import BookDisplayExpansion from "./BookDisplayExpansion"
const SearchResults = props => {
    const searchSetter=props.searchSetter
    const search= props.search
    const [selfHide,setSelfHide] = useState(true)
    const [searchResults,setSearchResults] = useState(props.searchResults)
    const expansion = props.expansionSetter
    const [expandedBook, setExpandedBook] = useState(props.expandedBook)
    const expandedBookSetter = props.expandedBookSetter
    const expanded = props.expanded
    return (
        
            
            
            <Container style={{justifyContent: 'center'}}>
            {
            searchResults.length > 0 && 
            (
              <ListGroup style={{ marginTop: 30}}>
                <Row>
                {
                  searchResults.map((book, index) => {
                    return (
                      <Col style={{marginBottom: 30}} key={index}>
                      
                      <BookDisplayEntry expandedBookSetter={setExpandedBook} expansionSetter={expansion} book={book}/>
                  
                      </Col>
                    )
                  })
                }
                
                </Row>
                
                
                
              </ListGroup>
            )
          }
            {/* <Modal show onHide={() => {
            searchSetter(!search)

            
        }} >
           
           <Modal.Header closeButton>Results:</Modal.Header>
           {
            searchResults.length > 0 && 
            (
              <ListGroup style={{ marginTop: 30}}>
                <Row>
                {
                  searchResults.map((book, index) => {
                    return (
                      <Col style={{marginBottom: 30}} key={index}>
                      
                      <BookDisplayExpansion expandedBook={book}/>
                  
                      </Col>
                    )
                  })
                }
                
                </Row>
                
                
                
              </ListGroup>
            )
          }
           
           
           
                
            
        </Modal> */}
        </Container>
            
        // :
        // <>
        // <BookDisplayExpansion expandedBook={expandedBook} expandedBookSetter={expansion}/>
        // </>
        
        
        
    )
}

export default SearchResults