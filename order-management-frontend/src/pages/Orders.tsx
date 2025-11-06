import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import OrderDetailsModal from "../component/ui/OrderDetailsModal";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

// interface Order {
//   id: number;
//   productName: string;
//   quantity: number;
//   price: number;
//   status: "Pending" | "Order Placed" | "Order Picked" | "Delivered" | "Cancelled";
// }
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface Order {
  id: number;
  user_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  order_status: "Pending" | "Order Placed" | "Order Picked" | "Delivered" | "Cancelled";
  created_at?: string;
  product: Product;
}

const Orders: React.FC = () => {
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Array<Order>>([])
  // const orders: Order[] = [
  //   { id: 1, productName: "Laptop", quantity: 2, price: 50000, status: "Delivered" },
  //   { id: 2, productName: "Mouse", quantity: 1, price: 500, status: "Pending" },
  //   { id: 3, productName: "Keyboard", quantity: 1, price: 1500, status: "Order Picked" },
  //   { id: 4, productName: "Monitor", quantity: 1, price: 12000, status: "Order Placed" },
  //   { id: 5, productName: "Chair", quantity: 1, price: 3500, status: "Cancelled" },
  // ];

  useEffect(() => {
    const getOrderDetails = async () => {
      const res = await api.get(`/orders/${user?.id}`)
       if (res.data && Array.isArray(res.data)) {
          const formattedOrders: Order[] = res.data.map((item: any) => ({
            id: item.order.id,
            user_id: item.order.user_id,
            product_id: item.order.product_id,
            product_name: item.order.product_name,
            quantity: item.order.quantity,
            price: item.order.price,
            total_price: item.order.total_price,
            order_status: item.order.order_status,
            created_at: item.order.created_at,
            product: {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description,
              price: item.product.price,
              image: item.product.image,
            },
          }));
          setOrders(formattedOrders);
        }
    }
    if (user?.id && !orders.length) {
      getOrderDetails();
    }

  })

  return (
    <Container className="py-5 mt-5">
      <Card className="shadow-lg border-0 rounded-4 p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">📦 Your Orders</h2>
          <p className="text-muted">Track your orders and check delivery status</p>
        </div>

        {orders.length > 0 ? (
          <div className="list-group">
            {orders.map((order, idx) => (
              <div
                key={idx}
                className="list-group-item d-flex justify-content-between align-items-center mb-2 shadow-sm rounded-3"
              >
                <div>
                  <h5 className="mb-1">{order.product.name}</h5>
                  <small className="text-muted">Order ID: {order.id}</small>
                  <small className="ms-3 text-muted">Quantity: {order.quantity}</small>
                  <small className="ms-3 text-success fw-semibold">
                    ₹{(order.price * order.quantity).toLocaleString()}
                  </small>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  Order details
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <h5 className="text-secondary">You have no orders yet 🛍️</h5>
            <p>
              Go back to{" "}
              <a href="/" className="text-primary fw-semibold">
                shop products
              </a>{" "}
              and place your order.
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </Card>
    </Container>
  );
};

export default Orders;
