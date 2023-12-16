import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TWorkspace } from "../../types";

interface IProps {
    workspace: TWorkspace;
    deleteWorkspace: any;
}

const Delete = ({ workspace, deleteWorkspace }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<any>(null);
    return (
        <>
            <Button
                flex="1"
                variant="ghost"
                leftIcon={<AiOutlineDelete />}
                color={"rgb(123, 128, 154)"}
                zIndex={10}
                onClick={onOpen}
            ></Button>
            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Workspace
                        </AlertDialogHeader>

                        <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    deleteWorkspace(workspace._id as string);
                                    onClose();
                                }}
                                ml={3}
                            >
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default Delete;
