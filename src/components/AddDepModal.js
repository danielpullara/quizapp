import React from 'react';
import {
  Modal,
  // Button, 
  // Form 
} from 'react-bootstrap'
import Login from './Login'

function AddDepModal(props) {
  console.log(props.show)

  return (
    <Modal className="modal-class" show={props.show} onHide={props.onHide}>
      <Login />
    </Modal>

  )

}


export default AddDepModal
