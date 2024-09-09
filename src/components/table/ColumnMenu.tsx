import { Box, Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Portal, useDisclosure } from '@chakra-ui/react';
import CreateColumn from '../../features/dataCollections/CreateColumn';
import { useUpdateColumnMutation } from '../../app/services/api';

const ColumnMenu = ({
    column,
    columns,
    handleDeleteColumn,
    handleAddNewColumnToRows,
    index,
}: {
    column: any;
    columns: any;
    handleDeleteColumn: any;
    handleAddNewColumnToRows: any;
    index: number;
}) => {
    const { isOpen, onToggle, onClose } = useDisclosure();

    const [updateColumn, { isLoading: columnIsUpdating }] = useUpdateColumnMutation();

    const handleDeleteColumnClick = () => {
        console.log(column);
        handleDeleteColumn(column);
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
                            <Box>
                                <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} onClick={handleDeleteColumnClick}>
                                    Delete column
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
                            </Box>
                        ) : (
                            <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'default'} color="lightgray">
                                Delete column
                            </Box>
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

export default ColumnMenu;
