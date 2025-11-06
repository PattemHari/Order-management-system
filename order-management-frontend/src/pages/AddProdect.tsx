import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Prodect } from "./Home";
import InputBox from "../component/ui/InputBox";
import TableComponent from "../component/ui/TableComponet";
import api from "../api/api";
import { toast } from "react-toastify";

const columns = [
    { key: "index", label: "#" },
    { key: "name", label: "Product Name" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
    {
        key: "image",
        label: "Image",
        render: (item: any) => (
            <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                className="rounded"
                style={{ width: "80px", height: "60px", objectFit: "cover" }}
            />
        ),
    },
];

function AddProduct() {
    const [product, setProduct] = useState<Prodect>({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
    });

    const [addedProducts, setAddedProducts] = useState<Array<Prodect>>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            const res = await api.get("/getProduct")
            setAddedProducts(res.data);
        }
        if (!addedProducts.length) {
            getProducts()
        }
    })

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product.name || !product.price || !product.description) {
            toast.error("Please fill requered fields");
            return;
        }
        const newProduct: Prodect = {
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
        };
        setAddedProducts([...addedProducts, newProduct]);
        try {
            await api.post("/product", newProduct)
            toast.success("Prodect added successful!");
            setShowModal(false);
        } catch (error) {
            toast.error("something wend wrong please tru again");
        }

    };



    return (
        <div className="container mt-5">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">🛍️ Product Management</h2>
                <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={() => setShowModal(true)}
                >
                    ➕ Add Product
                </button>
            </div>

            {addedProducts.length === 0 ? (
                <div className="text-center mt-5">
                    <h5 className="text-muted mb-3">No products found yet.</h5>
                    <p>
                        Want to add your first product?{" "}
                        <a
                            href="#"
                            className="text-primary fw-bold text-decoration-none"
                            onClick={() => setShowModal(true)}
                        >
                            Add Product
                        </a>
                    </p>
                </div>
            ) :
                (<TableComponent
                    columns={columns}
                    data={addedProducts.map((p, i) => ({ ...p, index: i + 1 }))}
                    title="Added Products"
                />)}

            {showModal && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 shadow-lg">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold text-primary">Add New Product</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleAddProduct}>
                                    <div className="mb-3">
                                        <InputBox
                                            label="Product Name"
                                            value={product.name}
                                            placeholder="Enter product name"
                                            onChange={(e) =>
                                                setProduct((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Description</label>
                                        <textarea
                                            name="description"
                                            value={product.description}
                                            onChange={(e) =>
                                                setProduct((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            className="form-control rounded-4"
                                            placeholder="Enter product description"
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <InputBox
                                            label="Price"
                                            value={product.price}
                                            placeholder="Enter product price (e.g. 50 RS)"
                                            onChange={(e) =>
                                                setProduct((prev) => ({ ...prev, price: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <InputBox
                                            label="Product Image URL"
                                            placeholder="Paste product image link"
                                            onChange={(e) =>
                                                setProduct((prev) => ({ ...prev, imageUrl: e.target.value }))
                                            }
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4 rounded-pill fw-semibold"
                                        >
                                            Save Product
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddProduct;
