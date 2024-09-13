import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Portal,
    useDisclosure,
} from '@chakra-ui/react';
import CreateColumn from '../../features/dataCollections/CreateColumn';
import { useUpdateColumnMutation } from '../../app/services/api';

const ColumnMenu = ({
    column,
    columns,
    handleDeleteColumn,
    handleAddNewColumnToRows,
    index,
    handleSortByColumnAsc,
    handleSortByColumnDes,
}: {
    column: any;
    columns: any;
    handleDeleteColumn: any;
    handleAddNewColumnToRows: any;
    index: number;
    handleSortByColumnAsc?: any;
    handleSortByColumnDes?: any;
}) => {
    const { isOpen, onToggle, onClose } = useDisclosure();

    const [updateColumn, { isLoading: columnIsUpdating }] = useUpdateColumnMutation();

    const handleDeleteColumnClick = () => {
        console.log(column);
        handleDeleteColumn(column);
        onClose();
    };

    const sortByColumnAsc = () => {
        handleSortByColumnAsc(column);
        onClose();
    };

    const sortByColumnDes = () => {
        handleSortByColumnDes(column);
        onClose();
    };
    return (
        <Popover isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
                <Button variant={'unstyled'} fontSize={'14px'} fontWeight={'medium'} h={'20px'} w={'100px'} color={'#666666'} onClick={onToggle}>
                    {`${column.name[0].toUpperCase()}${column.name.slice(1, column.name.length).split('_').join(' ')}`}
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        {index !== 0 ? (
                            <>
                                <Box onClick={sortByColumnAsc} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} mb={'4px'}>
                                    Sort ascending
                                </Box>
                                <Box onClick={sortByColumnDes} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} mb={'4px'}>
                                    Sort descending
                                </Box>
                                <Box>
                                    <CreateColumn
                                        column={column}
                                        columns={columns}
                                        updateColumn={updateColumn}
                                        addNewColumnToRows={handleAddNewColumnToRows}
                                        columnIsUpdating={columnIsUpdating as boolean}
                                    />
                                </Box>
                                <Box>
                                    <DeleteModal column={column} handleDeleteColumnClick={handleDeleteColumnClick} />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box onClick={sortByColumnAsc} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} mb={'4px'}>
                                    Sort ascending
                                </Box>
                                <Box onClick={sortByColumnDes} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} mb={'4px'}>
                                    Sort descending
                                </Box>
                                <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'default'} color="lightgray">
                                    Delete column
                                </Box>
                            </>
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

function DeleteModal({ column, handleDeleteColumnClick }: { column: any; handleDeleteColumnClick: any }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOnClose = () => {
        handleDeleteColumnClick();
        onClose();
    };
    return (
        <>
            <Box w={'100%'} mt={'4px'} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} onClick={onOpen}>
                Delete column
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete Column</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{`Are you sure you want to delete the "${column.name}" column?`}</ModalBody>

                    <ModalFooter>
                        <Button colorScheme="gray" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant={'outline'} colorScheme={'red'} onClick={handleOnClose}>
                            Delete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ColumnMenu;
