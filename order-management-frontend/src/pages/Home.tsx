import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export interface Prodect {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
}

export interface Cart {
  productId: string;
  productName: string;
}
export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

function Home() {
  const [products, setProducts] = useState<Array<Prodect>>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>(""); // <-- search state
  const { user } = useAuth();

  useEffect(() => {
    const getProducts = async () => {
      const res = await api.get("/getData");
      setProducts(res.data);
    };
    if (!products.length) {
      getProducts();
    }
  }, [products.length]);

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = async (product: Prodect) => {
    const data = {
      id: product.id,
      userId: user?.id,
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantities[product.id || 0] ?? 1,
    };
    try {
      console.log(await api.post("/cart/add", data));
      toast.success("Product added successfully!");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toast.error("Not allowed to add into cart");
      } else {
        toast.error("Something went wrong. Try again!");
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary mb-3">
          Welcome to the Order Management System 🎉
        </h2>
        <p className="text-muted fs-5">
          Browse our amazing collection and add your favorite products!
        </p>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row justify-content-center">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            className="col-md-4 mb-4 d-flex justify-content-center"
          >
            <div
              className="card shadow-lg border-0 rounded-4"
              style={{ width: "20rem" }}
            >
              {/* <img
                src={"https://via.placeholder.com/300x200.png?text=XYZ"}
                className="card-img-top rounded-top-4"
                alt={product.name}
              /> */}
              {/* <img src="http://placehold.it/300x200?text=Test" alt="Test" /> */}
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">{product.name}</h5>
                <p className="card-text text-secondary">{product.description}</p>
                <p className="fw-bold text-success fs-5"> ₹ {product.price}</p>
                {user?.role === "user" && (
                  <>
                    <div className="d-flex justify-content-center align-items-center mb-3">
                      <label
                        htmlFor={`quantity-${index}`}
                        className="me-2 fw-semibold"
                      >
                        Qty:
                      </label>
                      <select
                        id={`quantity-${index}`}
                        className="form-select w-50 rounded-pill text-center"
                        onChange={(e) =>
                          handleQuantityChange(
                            Number(product.id),
                            Number(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="btn btn-outline-primary rounded-pill px-4"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
