import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductCard from "../component/ui/ProductCard";

const Index: React.FC = () => {
  return (
    <div className="d-flex flex-column">
        <ProductCard id={1} name={"card1"} price={200}/>
      <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light text-center">
        <div className="container py-5">
          <h1 className="display-5 fw-bold mb-4 text-dark">
            Welcome to Order Management System
          </h1>
          <p className="lead text-secondary mb-4">
            Manage your product orders easily — track, deliver, and analyze in one place.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
