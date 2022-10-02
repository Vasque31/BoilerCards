import React, { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


function Header() {

    return (
        <div>
            <Container>
                <Row>
                    <button className= "library-buttons">BoilerCards</button>
                    <button className= "library-buttons">Home</button>
                    <input type="text" name="fsearch"/>
                    <input type="submit" name="submit"/>
                    <Dropdown>
                        <DropdownToggle variant="Primary">
                        Open Menu
                        </DropdownToggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#">
                                    Home Page
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    Settings
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    Logout
                                </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Row>
            </Container>
        </div>
    );
}

export default Header;