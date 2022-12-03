import React, { useEffect, useRef, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import "./Header.css";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import cookie from "react-cookie";
import { useCookies } from "react-cookie";
import { getCookie } from "react-use-cookie";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { folder } from "./HomeLibrary";
import saveicon from "../images/saveicon.png";

import { libstorage } from "./signInPage.js";

function Header() {
  const [show, setShow] = useState(false);
  const fileReader = new FileReader();
  const [destFolder, setDestFolder] = useState("");
  const [showFolder, setShowFolder] = useState(false);
  const [searchMethod, setSearchMethod] = useState(true);
  const [inputList, setinputList] = useState([
    { front: "", back: "", drate: "3", img: "" },
  ]);
  const [folderName, setFoldername] = useState();
  const [subject, setSubject] = useState();
  const [statePrivate, setPrivate] = useState(true);
  const [name, setName] = useState();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [label, setLabel] = useState("");
  const [subjects, setSubjects] = useState([
    JSON.parse(localStorage.getItem("subjects")),
  ]);

  const [library, setLibrary] = useState(
    JSON.parse(localStorage.getItem("libdata"))
  );
  useEffect(() => {
    const getLibrary = async () => {
      let res = await axios.post("http://localhost:3001/loadspace", {
        uid: getCookie("userid"),
      });
      console.log(res.data);
      setLibrary(res.data);
      localStorage.setItem("libdata", JSON.stringify(res.data));
      res = await axios.get("http://localhost:3001/subjectarray", {});
      console.log(res.data);
      localStorage.setItem("subjects", JSON.stringify(res.data));
      setSubjects(JSON.parse(localStorage.getItem("subjects")));
    };
    getLibrary();
  }, []);

  const [showSaved, setShowSaved] = useState(false);

  const handleShowSaved = () => {
    setShowSaved(true);
  };
  const handleCloseSaved = () => {
    setShowSaved(false);
    window.location.reload(false);
  };
  {
    /* Image Handlers */
  }
  const handleimage = (e, i) => {
    const { name } = e.target;
    const list = [...inputList];
    fileReader.onload = (r) => {
      list[i][name] = r.target.result;
    };
    fileReader.readAsDataURL(e.target.files[0]);
    setinputList(list);
  };
  const handleaddmore = () => {
    setinputList([...inputList, { front: "", back: "", drate: "3", img: "" }]);
  };
  const handleinputchange = (e, index) => {
    const { name, value, rate } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setinputList(list);
    console.log(inputList);
  };
  const handleSave = async (event) => {
    if (destFolder !== "") {
      event.preventDefault();
      const flashcardInfo = {
        inputList: inputList,
        name: name,
        statePrivate: statePrivate,
        folderid: destFolder,
      };
      console.log(flashcardInfo);
      let res = await axios.post("http://localhost:3001/createflashcardset", {
        inputList: flashcardInfo.inputList,
        name: flashcardInfo.name,
        public: flashcardInfo.statePrivate,
        folderid: flashcardInfo.folderid,
      });

      if (res.data === true) {
        handleShowSaved();
      }
      handleClose();

      console.log(flashcardInfo);
    }
  };

  const handleClose = () => {
    setShow(false);
    setinputList([{ front: "", back: "", drate: "3", img: "" }]);
  };
  const handleShow = async () => {
    let res = await axios.post("http://localhost:3001/loadspace", {
      uid: getCookie("userid"),
    });
    setLibrary(res.data);
    setShow(true);
  };
  const handleShowFolder = () => setShowFolder(true);
  const handleCloseFolder = () => {
    setShowFolder(false);
  };
  const handleSaveFolder = async (event) => {
    let res = await axios.post("http://localhost:3001/createfolder", {
      folderName: folderName,
      label: subject,
      uid: getCookie("userid"),
    });

    handleCloseFolder();
    console.log("code beyond reload executes");
    if (res.data == true) {
      handleShowSaved(); //save icon
    }
    res = await axios.post("http://localhost:3001/loadspace", {
      uid: getCookie("userid"),
    });
    console.log(res.data);
    setLibrary(res.data);
    localStorage.setItem("libdata", JSON.stringify(res.data));
  };
  const onFileChange = () => {};
  const [search, setSearch] = useState("");
  const handleSearch = async () => {
    console.log(search);
    let res = await axios.post("http://localhost:3001/searchkeywords", {
      keyword: search,
    });
    localStorage.setItem("searchResults", JSON.stringify(res.data));
    console.log(res.data);
    navigate("/search");
    window.location.reload();
  };

  const handleSearchLabel = async () => {
    let res = await axios.post("http://localhost:3001/searchsubject", {
      subject: label,
    });
    localStorage.setItem("searchResults", JSON.stringify(res.data));
    console.log(res.data);
    navigate("/search");
    window.location.reload();
  };
  return (
    <div className="app">
      <Navbar variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>BoilerCards</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <Link to="/HomePage">
                  <Button variant="Light">Home</Button>
                </Link>
              </Nav.Link>
              {searchMethod && (
                <div style={{ paddingTop: "1rem", paddingRight: "0.5rem" }}>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Search By Keyword"
                      onClick={() => setSearchMethod(false)}
                    />
                  </Form>
                </div>
              )}
              {!searchMethod && (
                <div style={{ paddingTop: "1rem", paddingRight: "0.5rem" }}>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Search By Label"
                      onClick={() => setSearchMethod(true)}
                      defaultChecked
                    />
                  </Form>
                </div>
              )}

              {!searchMethod && (
                <div style={{ paddingTop: "1rem", paddingRight: "0.5rem" }}>
                  <select
                    name="LabelSelectList"
                    id="LabelList"
                    onChange={(e) => setLabel(e.currentTarget.value)}
                  >
                    <option value="">---Choose---</option>
                    {subjects.map((item) => {
                      return <option value={item}>{item}</option>;
                    })}
                  </select>
                  <Button variant="dark" onClick={handleSearchLabel}>
                    Search
                  </Button>
                </div>
              )}

              {searchMethod && (
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    id="search"
                    className="me-2"
                    aria-label="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="dark" onClick={handleSearch}>
                    Search
                  </Button>
                </Form>
              )}
              <NavDropdown
                title="Create"
                id="basic-nav-dropdown"
                style={{ paddingTop: "0.45rem" }}
              >
                <NavDropdown.Item href="#action/3.1">Class</NavDropdown.Item>
                <NavDropdown.Item>
                  <Button variant="Light" onClick={handleShowFolder}>
                    Folder
                  </Button>
                  <div onKeyDown={e => e.stopPropagation()}
                                        onClick={e => e.stopPropagation()}
                                        onFocus={e => e.stopPropagation()}
                                        onMouseOver={e => e.stopPropagation()} >
                    <Modal
                      show={showFolder}
                      onHide={handleCloseFolder}
                      backdrop="static"
                      dialogClassName="general-box-createfolder"
                    >
                      <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                        <Modal.Title >
                          <h1
                            style={{
                              fontSize: "3rem",
                              color: "gold",
                              textAlign: "center",
                            }}
                          >
                            BOILERCARDS
                          </h1>
                          <h2
                            style={{
                              fontSize: "1rem",
                              color: "gold",
                              textAlign: "center",
                            }}
                          >
                            Create Folder
                          </h2>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}>
                        <label
                          style={{
                            paddingRight: "1rem",
                            color: "gold",
                            fontSize: "1rem",
                          }}
                        >
                          Name of New Folder:{" "}
                        </label>
                        <input
                          type="text"
                          name="folderName"
                          onChange={(e) => setFoldername(e.target.value)}
                          required
                        />
                        <label
                          style={{
                            paddingRight: "1rem",
                            color: "gold",
                            fontSize: "1rem",
                          }}
                        >
                          Folder Subject:{" "}
                        </label>
                        <input
                          type="text"
                          name="subject"
                          onChange={(e) => setSubject(e.target.value)}
                          required
                        />
                      </Modal.Body>
                      <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                        <Button variant="secondary" onClick={handleCloseFolder}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveFolder}>
                          Save New Folder
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </NavDropdown.Item>

                {/* Create FlashcardSet DropDown Option */}

                <NavDropdown.Item>
                  <Button variant="Light" onClick={handleShow}>
                    Flashcard Set
                  </Button>
                  {/* Create FlashcardSet Modal */}
                  <div
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
                  >
                    <Modal
                      show={show}
                      onHide={handleClose}
                      backdrop="static"
                      dialogClassName="general-box-createflash"
                    >
                      <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                        <Modal.Title>
                          <h1
                            style={{
                              fontSize: "5rem",
                              color: "gold",
                              textAlign: "center",
                            }}
                          >
                            BOILERCARDS
                          </h1>
                          <h2
                            style={{
                              fontSize: "2rem",
                              color: "gold",
                              textAlign: "center",
                            }}
                          >
                            Create Flashcard Set
                          </h2>
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}>
                        <label style={{color: "gold" }}>
                          Destination Folder
                        </label>
                        &nbsp; &nbsp;
                        <select
                          name="selectList"
                          id="selectList"
                          onChange={(e) => setDestFolder(e.currentTarget.value)}
                        >
                          <option value="">---Choose---</option>
                          {Object.values(library.folder).map((item) => {
                            return (
                              <option value={item._id}>
                                {item.foldername}
                              </option>
                            );
                          })}
                        </select>
                        <h1></h1>
                        <label
                          style={{
                            paddingRight: "1rem",
                            color: "gold",
                            fontSize: "1rem",
                          }}
                        >
                          Name Of FlashCard Set
                        </label>
                        <input
                          type="text"
                          name="flashcardSetName"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <h1></h1>
                        <label style={{color: "gold" }}>
                          Private/Public
                        </label>
                        <select
                          name="pripub"
                          id="privlist"
                          onChange={(e) => setPrivate(e.currentTarget.value)}
                        >
                          <option value={true}>Private</option>
                          <option value={false}>Public</option>
                        </select>
                        {inputList.map((x, i) => {
                          return (
                            <Form>
                              <Form.Group style={{ color: "gold" }}>
                                <h1
                                  style={{color: "gold" }}
                                >
                                  #{i + 1}
                                </h1>
                                <Form.Label
                                  style={{color: "gold" }}
                                >
                                  Front of Card
                                </Form.Label>
                                <div>
                                  <textarea
                                    type="text"
                                    name="front"
                                    placeholder="Front of FlashCard"
                                    onChange={(e) => handleinputchange(e, i)}
                                  />
                                </div>
                              </Form.Group>

                              <Form.Group style={{ color: "gold" }}>
                                <Form.Label
                                  style={{color: "gold" }}
                                >
                                  Back of Card
                                </Form.Label>
                                <div>
                                  <textarea
                                    type="text"
                                    name="back"
                                    placeholder="Back of FlashCard"
                                    onChange={(e) => handleinputchange(e, i)}
                                  />
                                </div>
                              </Form.Group>
                              <input
                                type="file"
                                name="img"
                                accept="image/png"
                                onChange={(e) => handleimage(e, i)}
                              />
                              <Form.Group style={{ color: "gold" }}>
                                <Form.Label
                                  style={{color: "gold" }}
                                >
                                  Difficulty Rating
                                </Form.Label>
                                <select
                                  name="drate"
                                  id="Difficulty-Rating"
                                  onChange={(e) => handleinputchange(e, i)}
                                >
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option selected value={3}>
                                    3
                                  </option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                </select>
                              </Form.Group>
                            </Form>
                          );
                        })}
                        <div style={{ paddingTop: "1rem" }}>
                          <Button
                            varient="primary"
                            type="button"
                            onClick={handleaddmore}
                          >
                            Add FlashCard
                          </Button>
                        </div>
                      </Modal.Body>
                      <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </NavDropdown.Item>
              </NavDropdown>

              {/* Profile DropDown */}

              <NavDropdown
                title="Profile"
                id="basic-nav-dropdown"
                style={{ paddingTop: "0.45rem" }}
              >
                <NavDropdown.Item href="#action/3.1">
                  Account Data
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/settings">
                    <Button variant="Light">Settings</Button>
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Save Modal */}

      <Modal show={showSaved}>
        <Modal.Header closeButton onClick={() => handleCloseSaved()}>
          <Modal.Title> Successful Operation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img className="photo" src={saveicon} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleCloseSaved()}> Acknowledge </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;
