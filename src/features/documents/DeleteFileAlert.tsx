import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useDeleteDocumentMutation } from '../../app/services/api';
import { TDocument } from '../../types';
import { useRef } from 'react';

interface IProps {
    document: TDocument;
    fromRow?: boolean;
    handleRemoveDoc?: any;
}

const DeleteFileAlert = ({ document, fromRow = false, handleRemoveDoc }: IProps) => {
    const cancelRef = useRef<any>();
    const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
    const [deleteDocument] = useDeleteDocumentMutation();

    const handleDeleteDocument = (document: TDocument) => {
        console.log(document);
        deleteDocument(document);
        if (fromRow) handleRemoveDoc(document);
        deleteOnClose();
        // setDuplicateFiles([]);
    };
    return (
        <>
            <Text onClick={deleteOnOpen} cursor={'pointer'} color={'gray'} fontSize={'14px'} _hover={{ color: 'red' }}>
                <FaRegTrashAlt />
                {/* <CloseIcon /> */}
            </Text>
            <AlertDialog isOpen={deleteIsOpen} leastDestructiveRef={cancelRef} onClose={deleteOnClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Customer
                        </AlertDialogHeader>

                        <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={deleteOnClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={() => handleDeleteDocument(document)} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default DeleteFileAlert;
