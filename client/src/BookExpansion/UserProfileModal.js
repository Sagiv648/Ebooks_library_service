import React, { useState } from 'react'
import Container from 'react-bootstrap/esm/Container'
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'
const UserProfileModal = props => {
    const [user,setUser] = useState(props.user)
    const setUserLinkClicked = props.setUserLinkClicked
    console.log(user);
  return (
    <Container style={{justifyContent: 'center'}}>
            <Modal show  onHide={() => {
            setUserLinkClicked(false)
            
        }} >
            <Modal.Header style={{alignSelf: 'center'}} >{user.username}</Modal.Header>
           <img style={{width: 200, height: 200, alignSelf: 'center'}} src={user.avatar ? user.avatar : '../user.png'}/>
           
           {
               user.description &&
               <Modal.Body style={{alignSelf: 'center'}}>
                <FormControl style={{width: 400}} value={user.description} maxLength={1000} as={'textarea'} disabled readOnly rows={6}/>
            
                    
               </Modal.Body>
           }
           
           
           
           
            
        </Modal>
          
        </Container>
  )
}

export default UserProfileModal