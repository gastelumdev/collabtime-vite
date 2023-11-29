import React, { useState } from "react";
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
import { useGetUserQuery } from "../../app/services/api";

interface IProps {
    row: TRow;
    updateRow: any;
}

const NoteModal = ({ row, updateRow }: IProps) => {
    const { isOpen: notesIsOpen, onOpen: notesOnOpen, onClose: notesOnClose } = useDisclosure();
    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");

    const [data, setData] = useState<TRow>(row);
    const [note, setNote] = useState<INote>({
        content: "",
        owner: `${user?.firstname} ${user?.lastname}`,
        createdAt: "",
    });

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote({ ...note, content: event.target.value });
    };

    const handleNoteClick = () => {
        setNote({ ...note, createdAt: new Date().toISOString() });

        const dataCopy = data;
        const notesList = dataCopy.notesList;
        console.log(dataCopy);

        const result = [...notesList, { ...note, createdAt: new Date().toISOString() }];
        setData({ ...data, notesList: result });
        updateRow({ ...data, notesList: result });
        setNote({
            content: "",
            owner: `${user?.firstname} ${user?.lastname}`,
            createdAt: "",
        });
    };

    return (
        <>
            <Box ml={"10px"} pt={"1px"} onClick={notesOnOpen}>
                <IconContext.Provider value={{ color: data.notes == "" ? "#cccccc" : "#16b2fc", size: "16px" }}>
                    <FaRegStickyNote style={{ color: data.notes == "" ? "#cccccc" : "#16b2fc", size: "30px" }} />
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
