import React from "react";
import { Modal, Button, Card, Row, Col } from "react-bootstrap";
import OrderStatusTracker from "./OrderStatusTracker";
import type { Order } from "../../pages/Orders";


interface Props {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => {
  return (
    <Modal show onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="text-block">
        <Modal.Title>Order Details - {order.product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="gap-3">
          <Col md={4} className="border-end pe-3">
            <h6 className="fw-bold mb-3">Delivery Status</h6>
            <OrderStatusTracker currentStatus={order.order_status} />
          </Col>
         <Col md={7}>
  <h6 className="fw-bold mb-3">Product Details</h6>
  <Card className="shadow-sm border-0 rounded-4">
    <Card.Body>
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span className="fw-semibold">Order ID:</span>
          <span className="text-muted">{order.id}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span className="fw-semibold">Product Name:</span>
          <span className="text-muted">{order.product.name}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span className="fw-semibold">Quantity:</span>
          <span className="text-muted">{order.quantity}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span className="fw-semibold">Price:</span>
          <span className="text-success fw-semibold">₹{order.price.toLocaleString()}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span className="fw-semibold">Subtotal:</span>
          <span className="fw-bold">₹{(order.price * order.quantity).toLocaleString()}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
          <span className="fw-semibold">Current Status:</span>
          <span className={`fw-bold ${order.order_status === "Cancelled" ? "text-danger" : "text-primary"}`}>
            {order.order_status}
          </span>
        </li>
      </ul>
    </Card.Body>
  </Card>
</Col>

        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
