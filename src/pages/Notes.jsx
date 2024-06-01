import { Box, styled, InputBase, Card, Typography, Button, Modal, TextareaAutosize } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const MainContainer = styled(Box)({
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "2rem 5rem",
});
const AddNewBtn = styled(Button)({
    alignSelf: "flex-end",
});

const SubContainer = styled(Box)({
    padding: "1rem",
    display: "flex",
    width: "100%",
    gap: "1rem",
    flexWrap: "wrap",
});

const NoteCard = styled(Card)({
    minWidth: "250px",
    padding: "1rem",
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
});
const Title = styled(Typography)({});
const Content = styled(Typography)({});
const Buttons = styled(Box)({
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
});

const IputTitle = styled(Box)({
    width: "100%",
    minHeight: "3rem",
    padding: ".5rem 1rem",
    border: "1px solid black",
});
const IputContent = styled(Box)({
    width: "100%",
    minHeight: "10rem",
});

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
};

const Notes = () => {
    // ----modal-----
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [editModal, setEditModal] = useState(false);
    // ----modal-----

    const [notes, setNotes] = useState([]);
    const titleRef = useRef(null);
    const noteRef = useRef(null);

    const userId = localStorage.getItem("userId");

    const [editId, setEditId] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8000/notes");
            // console.log(response.data);
            const notess = response.data?.filter((item) => item.userId == userId);
            // console.log(notes);
            setNotes(notess);
        } catch (error) {
            console.log("Error fetching notes:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log("notesss", notes);
    const AddNote = async () => {
        const newNotes = {
            id: Date.now() * Math.random(),
            userId: Number(localStorage.getItem("userId")),
            title: titleRef.current.value,
            note: noteRef.current.value,
        };

        try {
            const response = await axios.post("http://localhost:8000/notes", newNotes);
            console.log(response);
            fetchData();
            alert("Note Created Successfully");
            handleClose();
        } catch (error) {
            alert("note creation failed", +error.message);
        }
    };
    // ---------------------edit functionality-----------------
    const ediTitleRef = useRef();
    const editNoteRef = useRef();

    const editOpen = (id) => {
        setEditModal(true);
        setEditId(id);
    };

    const editHandler = async () => {
        const updatedNote = {
            id: editId,
            userId: Number(localStorage.getItem("userId")),
            title: ediTitleRef.current.value,
            note: editNoteRef.current.value,
        };

        console.log('updateed note',updatedNote);
        console.log('updateed id',editId);

       
        try {
          
          
            await axios.put(`http://localhost:8000/notes/${editId}`, updatedNote);
            // setNotes([response.data]);
            // setNotes(notes.map(note => note.id === editId ? updatedNote : note));
            // console.log(response.data);

            alert("Note Updated Successfully");
            fetchData();
            setEditModal(false);
          
        } catch (error) {
            alert("Note update failed: " + error.message);
            setEditModal(false);
        }
    };

    const deleteHandler = async (id) => {
        const deleteID = id;

        try {
           await axios.delete(`http://localhost:8000/notes/${deleteID}`);
            // setNotes(notes.filter(note => note.id !== id));S
            // setNotes([response.data])
            // console.log(response);
            alert("note deleted successfully");
            await fetchData();
            setEditModal(false);
        } catch (error) {
            alert("Note deletion falied : " + error);
            setEditModal(false);
        }
    };

    return (
        <>
            <MainContainer>
                <AddNewBtn onClick={handleOpen}>Add New</AddNewBtn>
                <SubContainer>
                    {notes?.map((note) => (
                        <NoteCard key={note.id}>
                            <Box>
                                <Title variant="h5">{note.title}</Title>
                                <Content>{note.note}</Content>
                            </Box>
                            <Buttons>
                                <Button onClick={() => editOpen(note?.id)}>Edit</Button>
                                <Button onClick={() => deleteHandler(note?.id)}>Delete</Button>
                            </Buttons>
                            {/* --------------editModal-------------- */}
                            {note?.id === editId && (
                                <Modal
                                    open={editModal}
                                    // onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={style}>
                                        <IputTitle>
                                            <input
                                                ref={ediTitleRef}
                                                placeholder="Title"
                                                style={{ fontSize: "20px", width: "100%", outline: "none", border: "none" }}
                                                defaultValue={note.title}
                                            />
                                        </IputTitle>
                                        <IputContent>
                                            <TextareaAutosize
                                                ref={editNoteRef}
                                                color="success"
                                                minRows={10}
                                                style={{
                                                    width: "100%",
                                                    fontSize: "18px",
                                                    outline: "none",
                                                    padding: ".5rem 1rem",
                                                    resize: "none",
                                                }}
                                                defaultValue={note.note}
                                            />
                                        </IputContent>
                                        <Box sx={{ alignSelf: "flex-end" }}>
                                            <Button onClick={handleClose}>Discard</Button>
                                            <Button onClick={() => editHandler(note?.id)}>Add</Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            )}
                        </NoteCard>
                    ))}
                </SubContainer>
            </MainContainer>

            <Modal
                open={open}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IputTitle>
                        <input
                            ref={titleRef}
                            placeholder="Title"
                            style={{ fontSize: "20px", width: "100%", outline: "none", border: "none" }}
                        />
                    </IputTitle>
                    <IputContent>
                        <TextareaAutosize
                            ref={noteRef}
                            color="success"
                            minRows={10}
                            style={{
                                width: "100%",
                                fontSize: "18px",
                                outline: "none",
                                padding: ".5rem 1rem",
                                resize: "none",
                            }}
                        />
                    </IputContent>
                    <Box sx={{ alignSelf: "flex-end" }}>
                        <Button onClick={handleClose}>Discard</Button>
                        <Button onClick={AddNote}>Add</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Notes;
