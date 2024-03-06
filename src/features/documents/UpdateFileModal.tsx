import { Box, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { FaRegEdit } from 'react-icons/fa';
import { TDocument } from '../../types';
import { useUpdateDocumentMutation } from '../../app/services/api';

interface IProps {
    document: TDocument;
    documents: TDocument[];
}

const UpdateFileModal = ({ document, documents }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [updateDocument] = useUpdateDocumentMutation();

    const [fileNameValue, setFileNameValue] = useState<string>(document.filename);

    const [docNames, setDocNames] = useState<any>(documents);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const filteredDocuments = documents.filter((doc: any) => {
            return doc.filename !== document.filename;
        });
        console.log(filteredDocuments);
        setDocNames(
            filteredDocuments.map((doc: any) => {
                return doc.filename;
            })
        );
    }, [documents]);

    const handleChange = (filename: string) => {
        if (docNames.includes(filename)) {
            setError(true);
        } else {
            setError(false);
        }
        setFileNameValue(filename);
    };

    const handleClick = () => {
        updateDocument({ ...document, filename: fileNameValue });
        onClose();
    };

    const handleClose = () => {
        setFileNameValue(document.filename);
        onClose();
    };
    return (
        <>
            <Text p={'2px'} onClick={onOpen} cursor={'pointer'} color={'rgb(123, 128, 154)'} fontSize={'14px'} _hover={{ color: 'blue' }}>
                <FaRegEdit />
            </Text>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Rename file</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input value={fileNameValue} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)} />
                        <Box h={'30px'}>{error ? <Text color={'red'}>A file with this name already exists.</Text> : null}</Box>
                    </ModalBody>

                    <ModalFooter>
                        <PrimaryButton onClick={handleClick} isDisabled={error}>
                            SAVE
                        </PrimaryButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateFileModal;
