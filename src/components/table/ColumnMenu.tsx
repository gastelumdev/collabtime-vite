import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Portal,
} from '@chakra-ui/react';
import React from 'react';

const ColumnMenu = ({ column, handleDeleteColumn }: { column: any; handleDeleteColumn: any }) => {
    const handleDeleteColumnClick = () => {
        handleDeleteColumn(column);
    };
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant={'unstyled'} fontSize={'14px'} fontWeight={'normal'} h={'20px'} w={'100px'}>
                    {`${column.name[0].toUpperCase()}${column.name.slice(1, column.name.length).split('_').join(' ')}`}
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} onClick={handleDeleteColumnClick}>
                            Delete column
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

export default ColumnMenu;
