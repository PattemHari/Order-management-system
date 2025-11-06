import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModel";
import { useAuth } from "../../context/AuthContext";

const NavbarComponent = () => {
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem("user");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        logout();

        navigate("/");

    };

    const handleProtectedNav = (path: string) => {
        if (user) {
            navigate(path);
        } else {
            setShowLogin(true);
        }
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container fluid>
                    <Navbar.Brand as={Link} to="/" className="fw-bold ms-3">
                        Order Management System
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto justify-content-center">
                            {user && <Nav.Link onClick={() => handleProtectedNav("/")}>
                                Home
                            </Nav.Link>}
                            {user?.role === "user" && (
                                <>
                                    <Nav.Link onClick={() => handleProtectedNav("/orders")}>
                                        Your Orders
                                    </Nav.Link>
                                    <Nav.Link onClick={() => handleProtectedNav("/cart")}>
                                        View Cart
                                    </Nav.Link>
                                </>
                            )}

                            {user?.role === "admin" && (
                                <>
                                    <Nav.Link onClick={() => handleProtectedNav("/add-product")}>
                                        Add Product
                                    </Nav.Link>
                                </>
                            )}

                            {user?.role === "employee" && (
                                <>
                                    <Nav.Link onClick={() => handleProtectedNav("/accept-orders")}>
                                        Accept Orders
                                    </Nav.Link>
                                      <Nav.Link onClick={() => handleProtectedNav("/active-orders")}>
                                        Active Orders
                                    </Nav.Link>
                                    <Nav.Link onClick={() => handleProtectedNav("/delivery-history")}>
                                        Delivered Orders History
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>

                        <Nav className="ms-auto me-3">
                            {user ? (
                                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                            ) : (
                                <Nav.Link onClick={() => setShowLogin(true)}>Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
        </>
    );
};

export default NavbarComponent;
