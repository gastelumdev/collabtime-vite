import { Box, Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Portal } from '@chakra-ui/react';

const ColumnMenu = ({ column, handleDeleteColumn, index }: { column: any; handleDeleteColumn: any; index: number }) => {
    const handleDeleteColumnClick = () => {
        console.log(column);
        handleDeleteColumn(column);
    };
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant={'unstyled'} fontSize={'14px'} fontWeight={'medium'} h={'20px'} w={'100px'} color={'#666666'}>
                    {`${column.name[0].toUpperCase()}${column.name.slice(1, column.name.length).split('_').join(' ')}`}
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        {index !== 0 ? (
                            <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} onClick={handleDeleteColumnClick}>
                                Delete column
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
