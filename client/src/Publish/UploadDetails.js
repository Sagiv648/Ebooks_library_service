import Button from 'react-bootstrap/esm/Button'
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
const UploadDetails = props => {
    const bookName = props.bookName
    const progressData = props.progressData
    const uploadError = props.uploadError
    const uploadStart = props.uploadStart
    const uploadFinished= props.uploadFinished
    const setUploadStart=props.setUploadStart
    const [exit,setExit] = useState(true)
  return (
    <Modal show={exit}>
        <Modal.Header>{uploadFinished ? "Upload finished" : "Uploading... please don't exit the browser until the upload is finished."}</Modal.Header>
        <Modal.Title>{bookName}</Modal.Title>
        <Modal.Title>{uploadFinished ? "Uploading finished." : progressData.progress + " bytes uploaded." } </Modal.Title>
        {
            uploadError &&
            <Modal.Body>An error occured with the upload: {uploadError}</Modal.Body>
        }
        {
            uploadFinished && 
            <Button variant='success' style={{width: 100, alignSelf: 'center'}} onClick={(e) => {
                setUploadStart(false)
                setExit(!exit)
                
            }}>
            Ok
        </Button>
        }
        
    </Modal>
  )
}

export default UploadDetails