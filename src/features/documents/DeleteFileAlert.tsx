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
} from "@chakra-ui/react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDeleteDocumentMutation } from "../../app/services/api";
import { TDocument } from "../../types";
import { useRef } from "react";

interface IProps {
    document: TDocument;
}

const DeleteFileAlert = ({ document }: IProps) => {
    const cancelRef = useRef<any>();
    const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure();
    const [deleteDocument] = useDeleteDocumentMutation();

    const handleDeleteDocument = (document: TDocument) => {
        deleteDocument(document);
        deleteOnClose();
        // setDuplicateFiles([]);
    };
    return (
        <>
            <Text
                p={"2px"}
                onClick={deleteOnOpen}
                cursor={"pointer"}
                color={"rgb(123, 128, 154)"}
                fontSize={"12px"}
                _hover={{ color: "red" }}
            >
                <FaRegTrashAlt />
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
