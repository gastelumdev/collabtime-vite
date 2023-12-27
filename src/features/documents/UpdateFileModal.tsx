import {
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { FaRegEdit } from "react-icons/fa";
import { TDocument } from "../../types";
import { useUpdateDocumentMutation } from "../../app/services/api";

interface IProps {
    document: TDocument;
}

const UpdateFileModal = ({ document }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [updateDocument] = useUpdateDocumentMutation();

    const [fileNameValue, setFileNameValue] = useState<string>(document.filename);

    const handleClick = () => {
        updateDocument({ ...document, filename: fileNameValue });
        onClose();
    };
    return (
        <>
            <Text
                p={"2px"}
                onClick={onOpen}
                cursor={"pointer"}
                color={"rgb(123, 128, 154)"}
                fontSize={"14px"}
                _hover={{ color: "red" }}
            >
                <FaRegEdit />
            </Text>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Rename file</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            value={fileNameValue}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                setFileNameValue(event.target.value)
                            }
                        />
                    </ModalBody>

                    <ModalFooter>
                        <PrimaryButton onClick={handleClick}>SAVE</PrimaryButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateFileModal;
