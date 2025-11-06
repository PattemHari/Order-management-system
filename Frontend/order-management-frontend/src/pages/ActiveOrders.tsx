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
    status: "Order Placed" | "Order Picked" | "Delivered";
}

const statusFlow: Order["status"][] = ["Order Placed", "Order Picked", "Delivered"];

const ActiveOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const getstatus = async () => {
            const res = await api.get(`orders/activeOrders/${localStorage.getItem("userId")}`)
            const mappedOrders: Order[] = res.data.map((o: any) => ({
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

    const handleNextStatus = async (orderId: number, status: string) => {
        try {
            await api.post(`/orders/changestatus/${orderId}/${localStorage.getItem("userId")}/${status}`);
            setOrders(prev =>
                prev.map(order => {
                    if (order.id === orderId) {
                        const currentIndex = statusFlow.indexOf(order.status);
                        if (currentIndex < statusFlow.length - 1) {
                            return { ...order, status: statusFlow[currentIndex + 1] };
                        }
                    }
                    return order;
                })
            );
            // console.log(await api.post("/send-email", {
            //     email: "pattemsrihari7@gmail.com",
            //     subject: "Order Delivered",
            //     body: "<h3>Your order has been successfully delivered!</h3>"
            // }));
            toast.success("Successfully order status changes to " + status)
        } catch (error) {
            toast.error("Somting went wrong try again")
        }
    };

    const getStatusButton = (status: Order["status"], orderId: number) => {
        const currentIndex = statusFlow.indexOf(status);
        const nextStatus = statusFlow[currentIndex + 1];
        const colors: Record<Order["status"], string> = {
            "Order Placed": "info",
            "Order Picked": "primary",
            Delivered: "success",
        };
        return (
            <Button
                size="sm"
                variant={colors[status]}
                disabled={!nextStatus}
                onClick={() => nextStatus && handleNextStatus(orderId, nextStatus)}
            >
                {status} {nextStatus ? `→ ${nextStatus}` : ""}
            </Button>
        );
    };

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
                    <h2 className="text-primary fw-bold">Active Orders</h2>
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
                        {filteredOrders.filter(order => order.status !== "Delivered").map(order => (
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
                                    {getStatusButton(order.status, order.id)}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ActiveOrders;
