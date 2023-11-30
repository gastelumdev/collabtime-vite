import React, { useEffect, useState } from "react";
import { INote, TRow } from "../../types";
import {
    Box,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { FaRegStickyNote } from "react-icons/fa";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { IconContext } from "react-icons";
import { formatTime } from "../../utils/helpers";
import { useGetOneWorkspaceQuery, useGetUserQuery } from "../../app/services/api";
import { io } from "socket.io-client";

interface IProps {
    row: TRow;
    updateRow: any;
    rowCallUpdate: any;
}

const NoteModal = ({ row, updateRow, rowCallUpdate }: IProps) => {
    const { isOpen: notesIsOpen, onOpen: notesOnOpen, onClose: notesOnClose } = useDisclosure();
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    const { data: workspace } = useGetOneWorkspaceQuery(localStorage.getItem("workspaceId") || "");

    // const [data, setData] = useState<TRow>(row);
    const [note, setNote] = useState<INote>({
        content: "",
        owner: `${user?.firstname} ${user?.lastname}`,
        createdAt: "",
        read: false,
        people: [],
    });
    const [hasUnreadItems, setHasUnreadItems] = useState<boolean>();

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on("update row", () => {
            setHasUnreadItems(false);
            setUnreadItems();
            rowCallUpdate(null);
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        return () => {
            socket.disconnect();
        };
    }, [row]);

    useEffect(() => {
        setUnreadItems();
    }, [row]);

    const setUnreadItems = () => {
        for (const note of row.notesList) {
            for (const people of note.people) {
                if (people.email == user?.email) {
                    setHasUnreadItems(true);
                }
            }
        }
    };

    const handleOpen = () => {
        notesOnOpen();
        console.log(row);

        if (hasUnreadItems) {
            const rowCopy = row;
            let filteredPeople: any = [];
            let newNote = [];
            for (const note of rowCopy.notesList) {
                filteredPeople = note.people.filter((item) => {
                    return item.email != user?.email;
                });
                newNote.push({ ...note, people: filteredPeople });
            }

            const result = { ...rowCopy, notesList: newNote };
            console.log(result);

            updateRow(result);
            setHasUnreadItems(false);
        }
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote({ ...note, content: event.target.value });
    };

    const handleNoteClick = () => {
        setNote({ ...note, createdAt: new Date().toISOString(), people: workspace?.members || [] });

        const dataCopy = row;
        const notesList = dataCopy.notesList;
        console.log(dataCopy);

        const result = [
            ...notesList,
            { ...note, createdAt: new Date().toISOString(), people: workspace?.members || [] },
        ];
        // setData({ ...data, notesList: result });
        updateRow({ ...row, notesList: result });
        setNote({
            content: "",
            owner: `${user?.firstname} ${user?.lastname}`,
            createdAt: "",
            read: false,
            people: [],
        });
        notesOnClose();
    };

    return (
        <>
            <Box ml={"10px"} pt={"1px"} onClick={handleOpen}>
                <IconContext.Provider
                    // value={{ color: data.notesList.length > 0 ? "#cccccc" : "#16b2fc", size: "16px" }}
                    value={{
                        color: row?.notesList.length < 1 ? "#cccccc" : hasUnreadItems ? "#ffa507" : "#16b2fc",
                        size: "16px",
                    }}
                >
                    <FaRegStickyNote
                        style={{
                            color: row?.notesList.length < 1 ? "#cccccc" : hasUnreadItems ? "#ffa507" : "#16b2fc",
                            size: "30px",
                        }}
                    />
                </IconContext.Provider>
            </Box>
            <Modal isOpen={notesIsOpen} onClose={notesOnClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Notes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {row.notesList.map((note, index) => {
                            return (
                                <Box key={index} mb={"20px"} px={"6px"}>
                                    <Flex mb={"5px"}>
                                        <Text fontSize={"14px"}>{`${note.owner} - `}</Text>
                                        <Text ml={"3px"} fontSize={"12px"} pt={"2px"}>
                                            {formatTime(new Date(note.createdAt))}
                                        </Text>
                                    </Flex>
                                    <Text fontSize={"14px"}>{note.content}</Text>
                                </Box>
                            );
                        })}
                        <Textarea
                            value={note.content}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => handleNoteChange(event)}
                            placeholder={"Enter notes..."}
                            size={"sm"}
                            rows={10}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <PrimaryButton onClick={() => handleNoteClick()}>SAVE</PrimaryButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default NoteModal;
