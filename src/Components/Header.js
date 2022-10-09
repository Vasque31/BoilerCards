import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import "./Header.css";
import Form from 'react-bootstrap/Form';



function Header() {

    return (
        <div>
            <Navbar bg="warning" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="#home">BoilerCards</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="dark">Search</Button>
                        </Form>
                        <NavDropdown title="Create" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Class
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Folder
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">
                                Flashcard Set
                            </NavDropdown.Item> 
                        </NavDropdown>
                        
                        <NavDropdown title="Profile" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Account Data
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Settings
                            </NavDropdown.Item> 
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>  
                </Container>
            </Navbar>
        </div>
    );
}

export default Header;