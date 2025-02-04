import {
    Box,
    Button,
    Divider,
    Flex,
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
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import CreateColumn from '../../features/dataCollections/CreateColumn';
import { useUpdateColumnMutation } from '../../app/services/api';
import { emptyColumnPermissions, emptyDataCollectionPermissions } from '../../features/workspaces/UserGroups';
import { useEffect, useState } from 'react';
import { BsSortAlphaDownAlt, BsSortAlphaUp } from 'react-icons/bs';
import { PiTrashSimple } from 'react-icons/pi';
import { tableFontColor } from '../../features/dataCollections/DataCollection';
// import { useParams } from 'react-router-dom';

const hoverColor = '#eff2f5';

const ColumnMenu = ({
    column,
    columns,
    handleDeleteColumn,
    handleAddNewColumnToRows,
    index,
    handleSortByColumnAsc,
    handleSortByColumnDes,
    dataCollectionView = null,
    dataCollectionPermissions = emptyDataCollectionPermissions,
    appModel = null,
    handleSetColumns,
    handleModifyColumnNameInRows,
}: {
    column: any;
    columns: any;
    handleDeleteColumn: any;
    handleAddNewColumnToRows: any;
    index: number;
    handleSortByColumnAsc?: any;
    handleSortByColumnDes?: any;
    dataCollectionView?: any;
    dataCollectionPermissions?: any;
    appModel?: string | null;
    handleSetColumns?: any;
    handleModifyColumnNameInRows?: any;
}) => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const [updateColumn, { isLoading: columnIsUpdating }] = useUpdateColumnMutation();
    const [columnPermissions, setColumnPermissions] = useState(emptyColumnPermissions);

    useEffect(() => {
        if (dataCollectionPermissions) {
            const columnPermissions = dataCollectionPermissions.columns.find((item: any) => {
                return item.name === column?.name;
            });

            if (columnPermissions !== undefined) {
                setColumnPermissions(columnPermissions.permissions);
            }
        }
    }, [dataCollectionPermissions, column]);

    const handleDeleteColumnClick = async () => {
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
                <Button variant={'unstyled'} fontSize={'14px'} fontWeight={'normal'} h={'20px'} w={'100px'} color={tableFontColor} onClick={onToggle}>
                    {`${column?.name[0].toUpperCase()}${column?.name.slice(1, column?.name.length).split('_').join(' ')}`}
                </Button>
            </PopoverTrigger>
            <Portal>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        <Box px={'6px'}>
                            <Box>
                                <Text fontWeight={'semibold'}>Column Options</Text>
                            </Box>
                        </Box>
                        <Divider mt={'6px'} mb={'6px'} />
                        <Box>
                            <Box
                                onClick={sortByColumnAsc}
                                textAlign={'left'}
                                fontSize={'14px'}
                                cursor={'pointer'}
                                py={'3px'}
                                px={'6px'}
                                _hover={{ bgColor: hoverColor }}
                            >
                                <Flex>
                                    <Text mr={'8px'} mt={'3px'}>
                                        <BsSortAlphaUp />
                                    </Text>
                                    <Text>Sort ascending</Text>
                                </Flex>
                            </Box>

                            <Box
                                onClick={sortByColumnDes}
                                textAlign={'left'}
                                fontSize={'14px'}
                                cursor={'pointer'}
                                py={'3px'}
                                px={'6px'}
                                _hover={{ bgColor: hoverColor }}
                            >
                                <Flex>
                                    <Text mr={'8px'} mt={'3px'}>
                                        <BsSortAlphaDownAlt />
                                    </Text>
                                    <Text>Sort descending</Text>
                                </Flex>
                            </Box>
                            {index !== 0 &&
                            dataCollectionView === null &&
                            dataCollectionPermissions &&
                            dataCollectionPermissions.columnActions.update &&
                            appModel === null &&
                            !column.permanent ? (
                                <Box textAlign={'left'} fontSize={'14px'} cursor={'pointer'} py={'3px'} px={'6px'} _hover={{ bgColor: hoverColor }}>
                                    <CreateColumn
                                        column={column}
                                        columns={columns}
                                        updateColumn={updateColumn}
                                        addNewColumnToRows={handleAddNewColumnToRows}
                                        columnIsUpdating={columnIsUpdating as boolean}
                                        handleSetColumns={handleSetColumns}
                                        handleModifyColumnNameInRows={handleModifyColumnNameInRows}
                                    />
                                </Box>
                            ) : null}
                            {index !== 0 &&
                            dataCollectionView === null &&
                            dataCollectionPermissions &&
                            (dataCollectionPermissions.columnActions.delete || columnPermissions.column.delete) &&
                            appModel === null &&
                            !column.permanent ? (
                                <Box py={'3px'} px={'6px'} _hover={{ bgColor: hoverColor }}>
                                    <DeleteModal column={column} handleDeleteColumnClick={handleDeleteColumnClick} />
                                </Box>
                            ) : null}
                        </Box>
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
            <Flex>
                <Text fontSize={'8px'} mr={'8px'} mt={'3px'}>
                    <PiTrashSimple />
                </Text>
                <Box w={'100%'} textAlign={'left'} fontSize={'14px'} cursor={'pointer'} onClick={onOpen}>
                    Delete column
                </Box>
            </Flex>

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
