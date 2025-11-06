import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button, Form } from "react-bootstrap";
import api from "../api/api";
import { toast } from "react-toastify";

interface Order {
  id: number;
  productName: string;
  quantity: number;
  userName: string;
  userAddress: string;
  status: "Pending" | "Accepted" | "Cancelled";
}

const AcceptOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const getPendingOrders = async () => {
      const res = await api.get(`/orders/pending/${localStorage.getItem("userId")}`)
      const mappedOrders: Order[] = res.data.map((o: any) => ({
        id: o.id,
        productName: o.product_name,
        quantity: o.quantity,
        userName: o.user_name,
        userAddress: o.user_address,
        status: "Pending"
      }));
      if (mappedOrders.length) {
        setOrders(mappedOrders);
      }
    }
    if (!orders.length) {
      getPendingOrders();
    }
  });

  const handleAccept = async (orderId: number) => {
    try {
      await api.post(`/orders/process/${orderId}/${localStorage.getItem("userId")}?action=accept`);
      setOrders(prev =>
        prev.map(order => (order.id === orderId ? { ...order, status: "Accepted" } : order))
      );
      toast.success("Order accepted  successfully");
    } catch (error: any) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Not allowed");
      } else {
        toast.error("Something went wrong. Try again!");
      }
    }
  };

  const handleReject = async (orderId: number) => {
    try {
      await api.post(`/orders/process/${orderId}/${localStorage.getItem("userId")}?action=reject`);
      setOrders(prev =>
        prev.map(order => (order.id === orderId ? { ...order, status: "Cancelled" } : order))
      );
      toast.success("Order rejected successfully");
    } catch (error: any) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Not allowed");
      } else {
        console.log(error);
        toast.error("Something went wrong. Try again!");
      }
    }
  };


  const pendingOrders = orders.filter(o => o.status === "Pending");

  const filteredOrders = pendingOrders.filter(order =>
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary fw-bold mb-4">New Orders</h2>

      {/* Search Box */}
      <Row className="mb-3">
        <Col md={4} className="ms-auto">
          <Form.Control
            type="text"
            placeholder="Search by product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <ListGroup>
            {filteredOrders.length === 0 && (
              <p className="text-muted text-center">No new orders to accept</p>
            )}
            {filteredOrders.map(order => (
              <ListGroup.Item
                key={order.id}
                className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2 rounded-3 shadow-sm"
              >
                <div>
                  <h6>{order.productName}</h6>
                  <small className="text-muted">Order ID: {order.id}</small>
                  <small className="text-muted ms-3">Qty: {order.quantity}</small>
                  <div className="mt-1">
                    <small className="text-muted">User: {order.userName}</small>
                    <small className="text-muted ms-3">Address: {order.userAddress}</small>
                  </div>
                </div>
                <div className="mt-2 mt-md-0 d-flex gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleAccept(order.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleReject(order.id)}
                  >
                    Reject
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default AcceptOrders;
