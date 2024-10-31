import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { TDataCollection } from '../../types';
import { GoTrash } from 'react-icons/go';

interface IProps {
    dataCollection: TDataCollection;
    deleteDataCollection: any;
}

const Delete = ({ dataCollection, deleteDataCollection }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<any>(null);
    return (
        <>
            {/* <Button flex="1" variant="unstyled" h={'10px'} w={'5px'} leftIcon={<AiOutlineDelete />} color={'#b3b8cf'} zIndex={10} onClick={onOpen}></Button> */}
            <Box onClick={onOpen} fontSize={'md'}>
                <Text color={'#b3b8cf'}>
                    <GoTrash />
                </Text>
            </Box>
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
                                    deleteDataCollection(dataCollection._id as string);
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
