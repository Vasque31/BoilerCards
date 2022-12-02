import React, { useEffect, useState } from "react";
import "./HomeLibrary.css";
import Button from 'react-bootstrap/Button';
import CloseButton from "react-bootstrap/esm/CloseButton";
import { UNSAFE_enhanceManualRouteObjects, useNavigate } from 'react-router-dom';
import Header from "./Header";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useCookies } from 'react-cookie';
import { getCookie } from 'react-use-cookie';
import saveicon from "../images/saveicon.png";
import cookie from 'react-cookies'
export var flashcards = null;

//var to update modal display, initialized with dummy values to prevent null crash
var selectedFlashcardsetToDelete = {
    setname: "defaultname set",
};
var selectedFlashcardsetToCopy = {
    setname: "defaultname set",
}; 
var currentUser = {
    folder: new Map(), 
};
function Folder() {
    const navigate = useNavigate();
    const fileReader = new FileReader();
    const [show, setShow] = useState(false);
    const [statePrivate, setPrivate] = useState(true);
    const [TMPName, setTMPName] = useState("");
    const [showSetting, setShowSetting] = useState(false);
    const [cookie, setCookie] = useCookies([]);
    const [inputList, setinputList] = useState([{front:'', back:'', drate: '3', img:''}]);
    const [name, setName] = useState();
    const [folder, setFolder] = useState(JSON.parse(localStorage.getItem('folder')));
    const [library, setLibrary] = useState(JSON.parse(localStorage.getItem('libdata')));
    const [destFolder, setDestFolder] = useState("");
    const [showFolderDeleteConfirm, setShowFolderDeleteConfirm] = useState(false);
    const [showFlashcardsetDeleteConfirm, setShowFlashcardsetDeleteConfirm] = useState(false);
    const [showFlashcardsetCopy, setShowFlashcardsetCopy] = useState(false);
    const [showFlashcardsetDeleteGroupConfirm, setShowFlashcardsetDeleteGroupConfirm] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [selectall, setSelectAll] = useState(false);
    const [selected, setSelected] = useState([]);

    const [copyDestFolderList, setCopyDestFolderList] = useState(new Map()); //map
    const [copyDestFolderSelect, setCopyDestFolderSelect] = useState(""); //id 

    const handleShowSaved = () => { setShowSaved(true);}
    useEffect(() => {
        const getLibrary = async () => {
          handlerefresh();
        };
        getLibrary();
      }, []);
    const handleCloseSaved = () => { 
        setShowSaved(false);
        handlerefresh();
    }
    const handleCloseFlashsetDelCon = () => {setShowFlashcardsetDeleteConfirm(false);}
    const handleCloseFolderDeleteConfirm = () => {setShowFolderDeleteConfirm(false);}
    const handleShowFolderDeleteConfirm = () => {setShowFolderDeleteConfirm(true);}

    const handleShowFlashcardsetGroupDeleteConfirm = () => {setShowFlashcardsetDeleteGroupConfirm(true);}
    const handleCloseFlashcardsetGroupDeleteConfirmation = () => {setShowFlashcardsetDeleteGroupConfirm(false);}
    const [checkedState, setCheckedState] = useState([])
    const [setting, setSetting] = useState(false);
    const [showChangeLabel, setShowChangeLabel] = useState(false);
    const [newLabel, setNewLabel] = useState('');

    const handleSettingClick = () => {
        setSetting(!setting);
        setSelectAll(false);
    }
    const handleCloseChangeLabel = () => {
        setShowChangeLabel(false);
        setNewLabel('');
    }
    const handleShowChangeLabel = () => {
        setShowChangeLabel(true);
    }
    const handleSaveChangeLabel = async () => {
        console.log(newLabel);
        let res = await axios.post("http://localhost:3001/addLabel", {
            label:newLabel,
            folderid: folder._id
        });
        handlerefresh();
        handleCloseChangeLabel();
    }

    const handleAddGroup = (e, i) => {
        console.log(e.currentTarget.value)
        if (e.target.checked) {
            console.log('✅ Checkbox is checked');

            setSelected([...selected, {
                setid: e.currentTarget.value,
                id: i,
            }]);
        
        } else {
            console.log('⛔️ Checkbox is NOT checked');
            console.log(e.currentTarget.value)
            setSelected((current) =>
            current.filter((set) => !(set.id === i))
            )
        }
        console.log(selected);
    };
    const handleselectall = () => {
        setSelectAll(!selectall)
        setSelected([]);
    }

    const handleShowFlashcardsetDeleteConfirm = async (id) => {
        let res = await axios.post("http://localhost:3001/flsahcardset",{
            setid:id,
        });
        selectedFlashcardsetToDelete = res.data;
        console.log();
        selectedFlashcardsetToDelete.setname = selectedFlashcardsetToDelete.flashcardset.setname;
        setShowFlashcardsetDeleteConfirm(true);
    }
    const handleShowFlashcardsetCopy = async (id) =>{
        let res = await axios.post("http://localhost:3001/loadspace", {
            uid:getCookie('userid'),
        });
        setCopyDestFolderList(res.data); //Map
        let resSet = await axios.post("http://localhost:3001/flsahcardset",{
            setid:id,
        });
        selectedFlashcardsetToCopy = resSet.data; //not flashcardset object, but folderinfo object
        selectedFlashcardsetToCopy.setname = selectedFlashcardsetToCopy.flashcardset.setname;
        
        setShowFlashcardsetCopy(true);
    }

    const handleCloseFlashcardsetCopy = () => {
        setShowFlashcardsetCopy(false);
    }
    const handleCopyFlashcardset = async () => {
        //creates set in other folder

        //get flashcards
        /*var inputList = [];
        Object.values(selectedFlashcardsetToCopy.flashcardarray).map(item => { //pull each card from array create from set to copy
            inputList.push({front: item.front, back: item.back, drate: item.drate, image: item.image}); //add flashcard to list
        });
        console.log(inputList);*/
        //create in new folder
        let res = await axios.post("http://localhost:3001/copy", {
            groups: selectedFlashcardsetToCopy.flashcardset._id,
            dest: copyDestFolderSelect,
        });

        if (res.data == true) {
            handleShowSaved();
            handleCloseFlashcardsetCopy(); //close modal display
        }

    }


    {/* Delete Handlers Folder/FlashcardSets */}

    const handleDeleteFolder = async(object) => {
        let res = await axios.post("http://localhost:3001/deletefolder",{
            folder:folder,
        });
        let res1 = await axios.post("http://localhost:3001/loadspace", {
                uid:getCookie('userid'),
            });
            
            
            
            
            localStorage.setItem('libdata', JSON.stringify(res1.data));
        if (res.data == true) {
            handleShowSaved();
            navigate("/HomePage"); //folder deleted, leave it
        }
        
    }
    const handlerefresh = async () => {     
        console.log(folder._id);
        let res = await axios.post("http://localhost:3001/folder", {
            folderid:folder._id
        });
        console.log(res.data);
        setFolder(res.data);
        localStorage.setItem('folder', JSON.stringify(res.data));
    }
    //passes in the set to be deleted
    const handleDeleteFlashcardset = async (object) => {
        const setinfo = object;
        setinfo.setid = object._id;
        let res = await axios.post("http://localhost:3001/deleteset",{
            setid: object._id,
        });
        if (res.data == true) {
            handleCloseFlashsetDelCon(); //remove confirmation upon success
            handleShowSaved();
        }
        handlerefresh();
    }

    {/* Click Flashcard Handler */}

    const handleFlashcardClick = async (id) => {
        //prevents page reload
        console.log(id);
        let res = await axios.post("http://localhost:3001/flsahcardset", {
            setid:id 
        });
        flashcards = res.data;
        localStorage.setItem('flashcards', JSON.stringify(res.data));
        console.log(res.data);
        console.log(flashcards);
        navigate('/flashcard');
    };

    {/* Create Flashcard Modal Handlers */}

    const handleaddmore = () => {
        setinputList([...inputList, {front:'', back:'', drate:'3', img: ''}]);
    }
    const handleinputchange = (e, index) => {
        const {name, value} = e.target;
        const list = [...inputList];
        list[index][name]=value;
        setinputList(list);
        console.log(inputList)
    } 

    //Not on backend yet
    const handleFolderNameChange = (e) => {
        setTMPName(e.target.value); 
        console.log(TMPName);
        handlerefresh();
        /*let res = await axios.post("http://localhost:3001/renamefolder", {
            folderid: library._id,
            newname: e.target.value,
        }
        );
        if (res.data == true) {
            handleShowSaved();
        }
        */


    }

    const handleCreateFlashCardSet = async(event) => {
        event.preventDefault();

        const flashcardInfo = {
            inputList:inputList,
            name:name,
            statePrivate:statePrivate,
            folderid:folder._id
        }
        console.log(flashcardInfo);
        let res = await axios.post("http://localhost:3001/createflashcardset", {
            inputList:flashcardInfo.inputList,
            name:flashcardInfo.name,
            public:flashcardInfo.statePrivate,
            folderid:flashcardInfo.folderid,
        });

        if(res.data===true){
            handleShowSaved();
        }
        handleClose();
        handlerefresh();
        console.log(flashcardInfo);
    }
    const handleClose = () => {
        setShow(false);
        setinputList([{front:'', back:'', drate:'3', img:''}]);
    }
    const handleShow = () => setShow(true);

    {/* Edit Folder Name Modal Handlers */}

    const handleSave = async(event) => {
        event.preventDefault();
        console.log(folder);
        folder.foldername = TMPName;
    
        let res = await axios.post("http://localhost:3001/editfolder", {
            folder:folder,
        });
        
        if(res.data===true){
            handleShowSaved();
        }
        handlerefresh();
        handleCloseSetting();
    }

    const handleCloseSetting = () => {
        setShowSetting(false);
        setTMPName("");
    }
    const handleShowSetting = () => setShowSetting(true);

    {/* Group Handlers */}

    const handleGroupCopy = async() => {
        if (destFolder !== '') {
            let res = await axios.post("http://localhost:3001/groupcopy", {
                groups:selected,
                dest:destFolder,
            });
            handlerefresh();
            handleselectall();
            if (res.data == true) {
                handleShowSaved();
            }
            }
    
    }

    const handleGroupDelete = async() => {
        let res = await axios.post("http://localhost:3001/groupdelete", {
            groups:selected,
            folder:folder,
        });
        handlerefresh();
        handleselectall();
        handleCloseFlashcardsetGroupDeleteConfirmation();
        if (res.data == true) {
            handleShowSaved();
        }
    }

    const handleGroupMove = async() => {
        if (destFolder !== '') {
        let res = await axios.post("http://localhost:3001/groupmove", {
            groups:selected,
            dest: destFolder,
            folder:folder,
        });
        handlerefresh();
        handleselectall();
        if (res.data == true) {
            handleShowSaved();
        }
    }
    }

    {/* Image Handlers */}
    const handleimage = (e, i) => {
        const {name} = e.target;
        const list = [...inputList];
        fileReader.onload = r => {
            list[i][name]=r.target.result;
        };
        fileReader.readAsDataURL(e.target.files[0]);
        setinputList(list);
    }
    return (
        <div>
            <Header/>
            <div style={{paddingTop: "1rem", paddingLeft: "9rem", fontSize: " 2rem"}}>
                <CloseButton variant= "white" onClick={() => navigate(-1)}/>
            </div>
            
            <div className="box">

                <heading className="section-title">{folder.foldername}</heading>
                <div></div>
                <heading style={{color: "white"}}>Label: {folder.label}</heading>
                {!setting && <div style ={{textAlign: "right", paddingBottom: "0.5rem"}}>
                {!selectall &&
                <>
                    <Button variant="warning" onClick={handleselectall}>
                        Select
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="warning" onClick={handleShow}>
                        Create Flashcard Set
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant='light' onClick={handleSettingClick}><div style={{color: 'black'}}>Settings</div></Button>
                    </>
                }
                {selectall &&
                <>
                    <Button variant="warning" onClick={handleselectall}>
                        UnSelect
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="warning" onClick={handleGroupMove}>
                        Move
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="warning" onClick={handleGroupCopy}>
                        Copy
                    </Button>
                    &nbsp;&nbsp;
                    <select name="selectList" id="selectList" onChange={(e) => setDestFolder(e.currentTarget.value)}>
                        <option value="">---Choose Destination---</option>
                        {Object.values(library).map(item => {
                            return (
                                <option value={item._id}>{item.foldername}</option>    
                            );
                        })}
                    </select>
                    <Button variant='danger' value={library._id} onClick={handleShowFlashcardsetGroupDeleteConfirm}>Delete</Button>

                    </>
                }
                </div>}
                {setting && 
                    <div style ={{textAlign: "right", paddingBottom: "0.5rem"}}>
                    <Button variant="warning" onClick={handleShowSetting}>
                        Rename Folder
                    </Button>
                    &nbsp;&nbsp;
                    <Button variant="warning" onClick={handleShowChangeLabel}>
                        Change Label
                    </Button>
                    {folder.foldername !== "Home" && <>&nbsp;&nbsp;
                    <Button variant='danger' value={folder._id} onClick={() => handleShowFolderDeleteConfirm()}>Delete Folder</Button></>}
                    &nbsp;&nbsp;
                    <Button variant='light' onClick={handleSettingClick}><div style={{color: 'black'}}>Close Settings</div></Button>
                    </div>}
                <div className= "library-box">
                <table>
                    {Object.values(folder.flashcardset).map((item, i) => {
                        
                        return (
                            <row>
                                {/*<h1>{item._id}</h1>*/}
                                &nbsp; &nbsp;
                                {selectall && <input name="folderid" value={item._id} onClick={(e) => handleAddGroup(e, i)} type="checkbox" />}
                                <Button variant='warning' className= "library-buttons" value={item._id} onClick={(e) => handleFlashcardClick(e.target.value)}>
                                    {item.setname}
                                </Button>
                                &nbsp; &nbsp;
                                {!selectall &&
                                <Button variant='danger' size='sm' className= "library-buttons" value={item._id} onClick={(e) => handleShowFlashcardsetDeleteConfirm(e.target.value)}>
                                    x
                                </Button>}
                                {!selectall &&
                                <Button size='sm'className= "library-buttons" value={item._id} onClick={(e) => handleShowFlashcardsetCopy(e.target.value)}>
                                    Copy
                                </Button>
                                }
                                &nbsp; &nbsp;
                            </row>
                            
                        );
                    })}
                </table>
                </div>
            </div>
            <div
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
                  >
                    <Modal
                      show={show}
                      onHide={handleClose}
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
                        <Button variant="primary" onClick={handleCreateFlashCardSet}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
            <Modal show={showSetting} onHide={handleCloseSetting} dialogClassName="general-box-createflash">
                <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>
                        <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Rename Folder</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}>
                    <Form>
                        <Form.Group style={{color: "gold"}}>
                            New Folder Name: <input onChange={e => handleFolderNameChange(e)}></input>
                        </Form.Group>
                    </Form>                    
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button variant="secondary" onClick={handleCloseSetting}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFolderDeleteConfirm} onHide={() => handleCloseFolderDeleteConfirm()}>
                <Modal.Header closeButton={() => handleCloseFolderDeleteConfirm()} style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> Are you sure you want to delete {folder.foldername}?</Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => handleDeleteFolder(folder)}> Delete </Button>
                    <Button onClick={() => handleCloseFolderDeleteConfirm()}> Cancel </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showChangeLabel} onHide={handleCloseChangeLabel} dialogClassName="general-box-createflash">
                <Modal.Header style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>
                        <h1 style ={{fontSize: "5rem", color:"gold", textAlign: "center"}}>BOILERCARDS</h1>
                        <h2 style ={{fontSize: "2rem", color:"gold", textAlign: "center"}}>Change Label</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}>
                    <Form>
                        
                        <Form.Group style={{color: "gold"}}>
                            New Label: <input onChange={e => setNewLabel(e.currentTarget.value)}></input>
                        </Form.Group>
                    </Form>                    
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button variant="secondary" onClick={handleCloseChangeLabel}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChangeLabel}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showFlashcardsetDeleteConfirm} onHide={() => handleCloseFlashsetDelCon()}>
                <Modal.Header closeButton={() => handleCloseFlashsetDelCon()} style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> Are you sure you want to delete {selectedFlashcardsetToDelete.setname}?</Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => handleDeleteFlashcardset(selectedFlashcardsetToDelete.flashcardset)}> Delete </Button>
                    <Button onClick={() => handleCloseFlashsetDelCon()}> Cancel </Button>
                </Modal.Footer>
            </Modal>    
            <Modal show={showFlashcardsetDeleteGroupConfirm} onHide={() => handleCloseFlashcardsetGroupDeleteConfirmation()}>
                <Modal.Header closeButton={() => handleCloseFlashcardsetGroupDeleteConfirmation()} style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> Are you sure you want to delete the selected items?</Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => handleGroupDelete()}> Delete </Button>
                    <Button onClick={() => handleCloseFlashcardsetGroupDeleteConfirmation()}> Cancel </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showFlashcardsetCopy} onHide={() => handleCloseFlashcardsetCopy()}>
                <Modal.Header closeButton={() => handleCloseFlashcardsetCopy()} style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title>Copy {selectedFlashcardsetToCopy.setname}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> Select where to copy {selectedFlashcardsetToCopy.setname}:
                                <div>
                                    <select name="selectList" id="selectList" onChange={(e) => setCopyDestFolderSelect(e.currentTarget.value)}>
                                                <option value="">---Choose---</option>
                                                {Object.values(copyDestFolderList).map(item => {
                                                    return (
                                                        <option value={item._id}>{item.foldername}</option>    
                                                    );
                                                })}
                                    </select>
                                </div>
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => handleCloseFlashcardsetCopy()}> Cancel </Button>
                    <Button onClick={() => handleCopyFlashcardset()}> Copy </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showSaved} onHide={() => handleCloseSaved()}>
                <Modal.Header closeButton={() => handleCloseSaved()} style={{backgroundColor: 'black', color: 'gold'}}>
                    <Modal.Title> Successful Operation</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'dimgrey', color: 'gold'}}> 
                        <img className="photo" src= {saveicon}/>
                </Modal.Body>
                <Modal.Footer style={{backgroundColor: 'black', color: 'gold'}}>
                    <Button onClick={() => handleCloseSaved()}> Acknowledge </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default Folder;
