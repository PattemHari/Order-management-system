import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

import Register from "../../pages/Register";
import Login from "../../pages/Login";
interface LoginModalProps {
  show: boolean;
  onHide: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onHide }) => {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="d-flex justify-content-center align-items-center">
          {isRegister ? (
            <h3 className="text-center mb-0">Create an Account</h3>
          ) : (
            <h3 className="text-center mb-0">Login to Your Account</h3>
          )}
        </div>

      </Modal.Header>
      <Modal.Body>
        {isRegister ? <Register onHide={onHide} onShowRegister={() => setIsRegister(false)} /> :
          <Login onHide={onHide} onShowRegister={() => setIsRegister(true)} />}
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
