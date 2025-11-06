import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Button, Form } from "react-bootstrap";
import api from "../api/api";

interface Order {
    id: number;
    productName: string;
    quantity: number;
    userName: string;
    userAddress: string;
    status: "Order Placed" | "Order Picked" | "Delivered";
}

const DeliveryHistory: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

       useEffect(() => {
        const getstatus = async () => {
            const res = await api.get(`orders/activeOrders/${localStorage.getItem("userId")}`)
            const mappedOrders: Order[] = res.data.filter((o: any) => o.order_status == 'Delivered').map((o: any) => ({
                id: o.id,
                productName: o.product_name,
                quantity: o.quantity,
                userName: o.user_name,
                userAddress: o.user_address,
                status: o.order_status
            }));
            if (mappedOrders.length) {
                setOrders(mappedOrders);
            }
        }
        if (!orders.length) {
            getstatus();
        }
    });
    const filteredOrders = orders.filter(
        order =>
            order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-5">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="text-primary fw-bold">Delivered Orders History</h2>
                </Col>
                <Col md="auto">
                    <Form.Control
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <ListGroup>
                        {filteredOrders.length === 0 && (
                            <p className="text-muted text-center">No orders found</p>
                        )}
                        {filteredOrders.filter(order => order.status === "Delivered").map(order => (
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
                                <div className="mt-2 mt-md-0 d-flex align-items-start gap-2">
                                    <label className="fw-semibold mb-1">Delivery Status:</label>
                                    <Button
                                        size="sm"
                                        variant={'success'}
                                        disabled={true}
                                    >
                                        Delivered ✅
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

export default DeliveryHistory;
