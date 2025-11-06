import React, { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import api from "../api/api";
import TableComponent from "../component/ui/TableComponet";
import { toast } from "react-toastify";

const columns = [
  { key: "id", label: "#" },
  { key: "productName", label: "Product Name" },
  {
    key: "price",
    label: "Price (₹)",
    render: (item: CartItem) => (
      <span className="text-success fw-semibold">
        ₹{item.price}
      </span>
    ),
  },
  { key: "quantity", label: "Quantity" },
  {
    key: "totalPrice",
    label: "Subtotal (₹)",
    render: (item: CartItem) => (
      <span className="fw-bold text-dark">
        ₹{item.totalPrice}
      </span>
    ),
  },
];

export interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart/${localStorage.getItem("userId")}`);
        console.log(res)
        setCartItems(res.data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    if (!cartItems.length && localStorage.getItem("userId")) {
      fetchCart();
    }
  }, []);

  const handleCheckout = async () => {
    try {
      console.log(cartItems);
      const res = await api.post('/cart/checkout', cartItems);
      toast.success("Orded successful!");
      setCartItems([])
      console.log(res);
    } catch (error) {
      toast.error("Somting went wrong try again!");
    }
  }

  return (
    <Container className="py-5 mt-5">
      <Card className="shadow-lg border-0 rounded-4 p-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">🛒 Your Shopping Cart</h2>
          <p className="text-muted">Manage your cart and proceed to checkout</p>
        </div>

        {cartItems.length > 0 ? (
          <>
            <TableComponent
              columns={columns}
              data={cartItems.map((p, i) => ({ ...p, id: i + 1, totalPrice: p.price * p.quantity }))}
              title="Cart Items"
              itemsPerPage={5}
            />

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4">
              <h4 className="fw-bold mb-3 mb-md-0">
                Total: <span className="text-success">₹ {cartItems.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0)}</span>
              </h4>
              <Button variant="success" size="lg" className="rounded-pill px-5" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <h5 className="text-secondary">Your cart is empty 🛍️</h5>
            <p>
              Go back to{" "}
              <a href="/" className="text-primary fw-semibold">
                add products
              </a>{" "}
              to your cart.
            </p>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Cart;
