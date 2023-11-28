import React, { useState } from "react";
import { TRow } from "../../types";
import {
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import { FaRegStickyNote } from "react-icons/fa";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { IconContext } from "react-icons";

interface IProps {
    row: TRow;
    updateRow: any;
}

const NoteModal = ({ row, updateRow }: IProps) => {
    const { isOpen: notesIsOpen, onOpen: notesOnOpen, onClose: notesOnClose } = useDisclosure();

    const [data, setData] = useState<TRow>(row);

    const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData({ ...data, notes: event.target.value });
    };

    const handleNoteClick = () => {
        updateRow(data);
        notesOnClose();
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
                        <Textarea
                            value={data.notes}
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
