import React, { useState } from "react";
import "./ViewFlashcard.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { flashcards } from "./Folder.js";
import { useNavigate } from "react-router";
import axios from "axios";
import CloseButton from "react-bootstrap/esm/CloseButton";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import saveicon from "../images/saveicon.png";
import Dropdown from "react-bootstrap/Dropdown";
import { FlashcardArray } from "react-quizlet-flashcard";
import { Link } from "react-router-dom";
//export var flashcardid = null;
export var image = "";

export var cardsQuiz = [{ front: "a", back: "b" }];

export var flashcardid = null;
var toDeleteFlashcard = {
  front: "defaultname flashcard",
};
function RestrictedViewFlashcard() {
  const fileReader = new FileReader();
  const [showEdit, setShowEdit] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [update, setUpdate] = useState(
    JSON.parse(localStorage.getItem("flashcards"))
  );
  const [show, setShow] = useState(false);
  const [showFlashcardDeleteConfirm, setShowFlashcardDeleteConfirm] =
    useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [newfront, setNewfront] = useState();
  const [newback, setNewback] = useState();
  const [currSort, setCurrSort] = useState("c_a");
  const [newDiff, setNewDiff] = useState();
  const [sendUsername, setSendUsername] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const handleShowSaved = () => {
    setShowSaved(true);
  };
  const handleCloseSaved = () => {
    setShowSaved(false);
  };
  const handleCloseDownload = () => setShowDownload(false);
  const handleShowDownload = () => setShowDownload(true);
  const handleCloseFlashDelCon = () => {
    setShowFlashcardDeleteConfirm(false);
  };
  const handleShowFlashcardDeleteConfirm = async (flashcard_id) => {
    let res = await axios.post("http://localhost:3001/flsahcard", {
      flashcardid: flashcard_id,
    });
    toDeleteFlashcard = res.data;
    setShowFlashcardDeleteConfirm(true);
  };
  const handleNote = (e) => {
    localStorage.setItem("img", JSON.stringify(e.currentTarget.value));
    console.log(JSON.parse(localStorage.getItem("img")));
  };

  const handleStartQuiz = () => {
    var ready = false;
    cardsQuiz = [];
    Object.values(update.flashcardset.flashcard).map((item) => {
      cardsQuiz.push({ front: item.front, back: item.back });
    });
    console.log(cardsQuiz);
    console.log("verify flashcards still exist");
    console.log(update);
    if (cardsQuiz != null && cardsQuiz.length >= 4) {
      navigate("/quizselection");
    } else {
      alert("not enough cards for quiz: Need at least 4");
    }
  };
  const handleimage = (e, i) => {
    const { name } = e.target;
    const list = [...inputList];
    fileReader.onload = (r) => {
      list[i][name] = r.target.result;
    };
    fileReader.readAsDataURL(e.target.files[0]);
    setinputList(list);
  };
  const handleRemoveNote = async (e) => {
    let res = await axios.post("http://localhost:3001/removeNote", {
      flashcardid: e.currentTarget.value,
    });
    handlerefresh(update.flashcardset._id);
  };
  const handleDeleteFlashcard = async (flashcard) => {
    const id = flashcard._id;
    let res = await axios.post("http://localhost:3001/deletFlashcard", {
      flashcardid: id,
    });

    handlerefresh(update.flashcardset._id);

    if (res.data == true) {
      handleCloseFlashDelCon();
      handleShowSaved();
    }
  };

  const [inputList, setinputList] = useState([
    { front: "", back: "", drate: "3", img: "" },
  ]);
  const navigate = useNavigate();
  const handleClose = () => {
    setinputList([{ front: "", back: "", drate: "3", img: "" }]);
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const handleaddmore = () => {
    setinputList([...inputList, { front: "", back: "", drate: "3", img: "" }]);
  };
  const handleeditClick = async (id) => {
    setShowEdit(true);
    flashcardid = id;
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
  };
  const handleSaveEdit = async (event) => {
    handlerefresh(update.flashcardset._id);

    let res = await axios.post("http://localhost:3001/edit", {
      flashcardid: flashcardid,
      newfront: newfront,
      newback: newback,
      newDiff: newDiff,
    });
    console.log(flashcardid);
    handleCloseEdit();
    handlerefresh(update.flashcardset._id);
    if (res.data == true) {
      handleShowSaved();
    }
  };
  const handleShowSend = () => {
    setShowSend(true);
  };
  const handleCloseSend = () => {
    setShowSend(false);
  };
  const handleChangeSendName = (event) => {
    setSendUsername(event.target.value);
  };
  const handleSubmitSend = async (event) => {
    event.preventDefault();
    let res = await axios.post("http://localhost:3001/send", {
      setID: update.flashcardset._id,
      userName: sendUsername,
    });
    if (res.data === true) {
      handleShowSaved();
    } else {
      alert("Invalid username!");
    }
  };
  const handlerefresh = async (id) => {
    let res = await axios.post("http://localhost:3001/flsahcardset", {
      setid: id,
    });
    localStorage.setItem("flashcards", JSON.stringify(res.data));
    update.flashcardarray = res.data.flashcardarray;
    update.sortedarray = res.data.sortedarray;
    update.flashcard_id = res.data.flashcard_id;
    if (currSort === "c_a") {
      setCards("creation", true);
    } else if (currSort === "c_d") {
      setCards("creation", false);
    } else if (currSort === "d_a") {
      setCards("diff", true);
    } else if (currSort === "d_d") {
      setCards("diff", false);
    }
  };

  const handleinputchange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setinputList(list);
    console.log(inputList);
  };
  const handleSave = async (event) => {
    event.preventDefault();
    console.log(inputList);
    let res = await axios.post("http://localhost:3001/addmoreFlashcards", {
      inputList: inputList,
      setid: update.flashcardset._id,
    });
    if (res.data == true) {
      handleShowSaved();
      handleClose();
      handlerefresh(update.flashcardset._id);
    }
    setinputList([{ front: "", back: "", drate: "3", img: "" }]);
  };
  let temp = [];
  for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
    let idnum = i;
    let front = Object.values(update.flashcardarray)[i].front;
    let back = Object.values(update.flashcardarray)[i].back;
    let flashcard_id = Object.values(update.flashcardarray)[i]._id;
    let image = Object.values(update.flashcardarray)[i].image;
    let drate = Object.values(update.flashcardarray)[i].difficulty;
    temp.push({
      id: idnum,
      front: front,
      back: back,
      flashcard_id: flashcard_id,
      image: image,
      drate: drate,
    });
  }
  const [cards, setCard] = useState(temp);

  const setCards = (arr, ascending) => {
    let new_cards = [];
    if (arr === "creation" && ascending) {
      for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
        let idnum = i;
        let front = Object.values(update.flashcardarray)[i].front;
        let back = Object.values(update.flashcardarray)[i].back;
        let flashcard_id = Object.values(update.flashcardarray)[i]._id;
        let image = Object.values(update.flashcardarray)[i].image;
        let drate = Object.values(update.flashcardarray)[i].difficulty;
        new_cards.push({
          id: idnum,
          front: front,
          back: back,
          flashcard_id: flashcard_id,
          image: image,
          drate: drate,
        });
        setCurrSort("c_a");
      }
    } else if (arr === "creation" && !ascending) {
      for (let i = 0; i < Object.values(update.flashcardarray).length; i++) {
        let idnum = i;
        let front = Object.values(update.flashcardarray)[
          Object.values(update.flashcardarray).length - i - 1
        ].front;
        let back = Object.values(update.flashcardarray)[
          Object.values(update.flashcardarray).length - i - 1
        ].back;
        let flashcard_id = Object.values(update.flashcardarray)[
          Object.values(update.flashcardarray).length - i - 1
        ]._id;
        let image = Object.values(update.flashcardarray)[
          Object.values(update.flashcardarray).length - i - 1
        ].image;
        let drate = Object.values(update.flashcardarray)[
          Object.values(update.flashcardarray).length - i - 1
        ].difficulty;
        new_cards.push({
          id: idnum,
          front: front,
          back: back,
          flashcard_id: flashcard_id,
          image: image,
          drate: drate,
        });
        setCurrSort("c_d");
      }
    } else if (arr === "diff" && ascending) {
      for (let i = 0; i < Object.values(update.sortedarray).length; i++) {
        let idnum = i;
        let front = Object.values(update.sortedarray)[
          Object.values(update.sortedarray).length - i - 1
        ].front;
        let back = Object.values(update.sortedarray)[
          Object.values(update.sortedarray).length - i - 1
        ].back;
        let flashcard_id = Object.values(update.sortedarray)[
          Object.values(update.sortedarray).length - i - 1
        ]._id;
        let image = Object.values(update.sortedarray)[
          Object.values(update.sortedarray).length - i - 1
        ].image;
        let drate = Object.values(update.sortedarray)[
          Object.values(update.sortedarray).length - i - 1
        ].difficulty;
        new_cards.push({
          id: idnum,
          front: front,
          back: back,
          flashcard_id: flashcard_id,
          image: image,
          drate: drate,
        });
        setCurrSort("d_a");
      }
    } else {
      for (let i = 0; i < Object.values(update.sortedarray).length; i++) {
        let idnum = i;
        let front = Object.values(update.sortedarray)[i].front;
        let back = Object.values(update.sortedarray)[i].back;
        let flashcard_id = Object.values(update.sortedarray)[i]._id;
        let image = Object.values(update.sortedarray)[i].image;
        let drate = Object.values(update.sortedarray)[i].difficulty;
        new_cards.push({
          id: idnum,
          front: front,
          back: back,
          flashcard_id: flashcard_id,
          image: image,
          drate: drate,
        });
        setCurrSort("d_d");
      }
    }
    setCard(new_cards);
  };
  const setSort = (e) => {
    if (e === "creation_date_ascend") {
      setCards("creation", true);
    } else if (e === "creation_date_desc") {
      setCards("creation", false);
    } else if (e === "diff_ascend") {
      setCards("diff", true);
    } else if (e === "diff_desc") {
      setCards("diff", false);
    }
  };
  const handleFlag = async () => {
    console.log(update.flashcardset._id);
    let res = await axios.post("http://localhost:3001/report", {
      reportsetid: update.flashcardset._id,
    });
    if (res.data == true) {
      alert("This Set Has Been Reported!");
    }
    handlerefresh(update.flashcardset._id);
  };
  return (
    <div style={{ display: "block", width: "100%" }}>
      <div
        style={{ paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem" }}
      >
        <CloseButton variant="white" onClick={() => navigate(-1)} />
      </div>
      <div className="test">
        <FlashcardArray
          cards={cards}
          containerStyle={{ paddingRight: "9rem" }}
        />
      </div>
      <div
        style={{
          width: "100%",
          height: "70%",
          paddingRight: "2rem",
          paddingLeft: "2rem",
        }}
      >
        <Dropdown style={{ float: "right" }}>
          <Dropdown.Toggle variant="info">Options</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleShowDownload}>
              Download this Set
            </Dropdown.Item>
            <Dropdown.Item onClick={handleStartQuiz}>
              Quiz Yourself!
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShowSend}>
              Share this Flashcard Set
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button
          style={{ float: "right" }}
          variant="danger"
          onClick={handleFlag}
        >
          Flag
        </Button>
        <Modal
          show={showDownload}
          onHide={handleCloseDownload}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Download this Flashcardset</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Once you click Download, press ctrl+p to download locally
          </Modal.Body>
          <Modal.Footer>
            <Link to="/downloadset" target="_blank">
              <Button varient="primary" onClick={handleCloseDownload}>
                Download
              </Button>
            </Link>
          </Modal.Footer>
        </Modal>
        <Modal show={showSend} onHide={handleCloseSend} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Share this Flashcard Set</Modal.Title>
          </Modal.Header>
          <Modal.Body>Who do you want to send this set to?</Modal.Body>
          <Form onSubmit={handleSubmitSend}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="name"
                placeholder="Username"
                onChange={handleChangeSendName}
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Send Flashcard Set
            </Button>
          </Form>
        </Modal>
        <Dropdown as={ButtonGroup} style={{ float: "left" }}>
          <Button variant="secondary">Sort By:</Button>
          <Dropdown.Toggle
            split
            variant="secondary"
            id="dropdown-split-basic"
          />

          <Dropdown.Menu>
            <Dropdown.Item onClick={(e) => setSort("creation_date_ascend")}>
              Creation Date Ascending
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setSort("creation_date_desc")}>
              Creation Date Descending
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setSort("diff_ascend")}>
              Difficulty Ascending
            </Dropdown.Item>
            <Dropdown.Item onClick={(e) => setSort("diff_desc")}>
              Difficulty Descending
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Table
          striped
          bordered
          hover
          style={{
            color: "gold",
            paddingRight: "1.5rem",
            paddingLeft: "1.5rem",
          }}
        >
          <thead>
            <tr>
              <th>Flashcard</th>
              <th>Front</th>
              <th>Back</th>
              <th>Difficulty Level</th>
            </tr>
            {cards.map((item, index) => {
              return (
                <tr>
                  <th>
                    #{index + 1}
                    {item.image !== "" && (
                      <Link to="/note" target="_blank">
                        <Button
                          variant="link"
                          value={item.image}
                          onClick={(e) => handleNote(e)}
                        >
                          Image
                        </Button>
                      </Link>
                    )}
                    {item.image !== "" && (
                      <Button
                        variant="danger"
                        size="sm"
                        value={item.flashcard_id}
                        onClick={(e) => handleRemoveNote(e)}
                      >
                        X
                      </Button>
                    )}
                  </th>
                  <th>{item.front}</th>
                  <th>{item.back}</th>
                  <th>{item.drate}</th>
                </tr>
              );
            })}
          </thead>
        </Table>
      </div>

      <Modal show={showSaved} onHide={() => handleCloseSaved()}>
        <Modal.Header closeButton={() => handleCloseSaved()}>
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

export default RestrictedViewFlashcard;
