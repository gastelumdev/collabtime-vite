import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useGetColumnsQuery, useGetDataCollectionQuery, useGetRowsQuery } from '../../app/services/api';
import ViewRef from './ViewRef';
import { CloseIcon } from '@chakra-ui/icons';
import { TRow } from '../../types';

const Reference = ({
    column,
    refs,
    onRefChange,
    onRemoveRef,
    allowed = false,
}: {
    column: any;
    refs: any;
    onRefChange: any;
    onRemoveRef: any;
    allowed?: boolean;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: rowsData, refetch } = useGetRowsQuery({
        dataCollectionId: column.dataCollectionRef._id !== undefined ? column.dataCollectionRef._id : column.dataCollectionRef,
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
    });
    const { data: columns } = useGetColumnsQuery(column.dataCollectionRef._id !== undefined ? column.dataCollectionRef._id : column.dataCollectionRef);
    const { data: dataCollection } = useGetDataCollectionQuery(
        column.dataCollectionRef._id !== undefined ? column.dataCollectionRef._id : column.dataCollectionRef
    );

    const [rowKey, setRowKey] = useState<any>('');
    const [rowsList, setRowsList] = useState<any>([]);
    const [rows, setRows] = useState(refs || []);
    const [refIds, setRefIds] = useState(
        refs
            ? refs.map((item: TRow) => {
                  return item._id;
              })
            : []
    );

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        let rowKey = null;
        columns?.map((col: any) => {
            if (col.name === column.dataCollectionRefLabel) {
                rowKey = col.name;
            }
        });

        if (rowKey === null) {
            const firstColumn = columns?.find((_item: any) => {
                return true;
            });
            rowKey = firstColumn?.name;
        }
        setRowKey(rowKey);
    }, [rowsData, columns]);

    useEffect(() => {
        setRows(refs || []);
        if (refs) {
            setRefIds(
                refs.map((item: TRow) => {
                    return item._id;
                })
            );
        }
    }, [refs]);

    useEffect(() => {
        if (rowsData === undefined) {
            setRowsList([]);
        } else {
            setRowsList(
                rowsData?.filter((row: any) => {
                    return !row.isEmpty;
                })
            );
        }
    }, [rowsData]);

    // useEffect(() => {
    //     if (refs && refs !== undefined) {
    //         const existingRowIds = refs.map((item: TRow) => {
    //             return item._id;
    //         });

    //         setRowsList(
    //             rowsData?.filter((item: TRow) => {
    //                 return !existingRowIds.includes(item._id);
    //             })
    //         );
    //     } else {
    //         setRowsList([]);
    //     }
    // }, [refs, rowsData]);

    const handleAddRow = (columnName: any, row: any) => {
        onRefChange(columnName, row);
        setRows((prev: any) => {
            return [...prev, row];
        });
        setRowsList(
            rowsList.filter((thisRow: any) => {
                return thisRow._id !== row._id;
            })
        );
    };

    const handleRemoveRef = (columnName: any, ref: any) => {
        onRemoveRef(columnName, ref);
        setRows((prev: any) =>
            prev.filter((row: any) => {
                return ref._id !== row._id;
            })
        );

        setRowsList((prev: any) => {
            return [...prev, ref];
        });

        // const rowToReinsert = rowsData?.find((row: any) => {
        //     return row.
        // })
    };
    return (
        <Center px={'10px'}>
            {dataCollection?.name !== undefined ? (
                <>
                    <Box overflow={'hidden'}>
                        {allowed ? (
                            <Box textAlign={'left'} overflow={'hidden'}>
                                <Button
                                    size={'xs'}
                                    variant={'ghost'}
                                    color={rows.length < 1 ? 'lightgray' : 'black'}
                                    fontSize={'12px'}
                                    overflow={'hidden'}
                                    onClick={onOpen}
                                    pt={'6px'}
                                >
                                    {rows.length < 1
                                        ? `Choose ${dataCollection?.name}`
                                        : rows.map((row: any, index: number) => {
                                              if (row.values[rowKey] === undefined) return null;
                                              return index === rows.length - 1 ? row.values[rowKey] : `${row.values[rowKey]}, `;
                                              //   return `${row.values[rowKey]} `;
                                          })}
                                </Button>
                            </Box>
                        ) : (
                            <Text mt={'5px'}>
                                {rows.length < 1
                                    ? `Choose ${dataCollection?.name}`
                                    : rows.map((row: any, index: number) => {
                                          if (row.values[rowKey] === undefined) return null;
                                          return index === rows.length - 1 ? row.values[rowKey] : `${row.values[rowKey]}, `;
                                          //   return `${row.values[rowKey]} `;
                                      })}
                            </Text>
                        )}
                        <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
                            <ModalOverlay />
                            <ModalContent maxW="700px">
                                <ModalHeader>
                                    <Center>{`${dataCollection?.name}`}</Center>
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody pl={'10px'}>
                                    <Box h={'600px'}>
                                        <Flex>
                                            <Box>
                                                <Box mb={'5px'} mr={'14px'}>
                                                    <Center>
                                                        <Text fontSize={'14px'} fontWeight={'semibold'}>{`Select ${dataCollection?.name}`}</Text>
                                                    </Center>
                                                </Box>
                                                <Divider />
                                                <Box h={'570px'} w={'330px'} mt={'6px'} overflowY={'scroll'}>
                                                    {rowsList.map((row: any, index: number) => {
                                                        if (refIds.includes(row._id)) return null;
                                                        if (row.values[rowKey] !== '') {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    pl={'10px'}
                                                                    pt={'2px'}
                                                                    pb={'5px'}
                                                                    cursor={'pointer'}
                                                                    onClick={() => handleAddRow(column.name, row)}
                                                                    overflow={'hidden'}
                                                                    _hover={{ backgroundColor: '#3d96ee', color: 'white' }}
                                                                >
                                                                    <HStack>
                                                                        {/* <Box
                                                                            ml={'10px'}
                                                                            pt={'2px'}
                                                                            pr={'10px'}
                                                                            onClick={() => handleRemoveRef(column.name, row)}
                                                                            _hover={{ color: 'white' }}
                                                                        >
                                                                            <Text fontSize={'9px'} fontWeight={'semibold'} cursor={'pointer'} color={'gray'}>
                                                                                <AddIcon />
                                                                            </Text>
                                                                        </Box> */}
                                                                        <Box>
                                                                            <Text
                                                                                fontSize={'13px'}
                                                                                overflow={'hidden'}
                                                                                textOverflow={'ellipsis'}
                                                                                fontWeight={'semibold'}
                                                                            >
                                                                                {row.values[rowKey]}
                                                                            </Text>
                                                                        </Box>
                                                                    </HStack>
                                                                </Box>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Box mb={'5px'}>
                                                    <Center>
                                                        <Text fontSize={'14px'} fontWeight={'semibold'}>{`${dataCollection?.name}`}</Text>
                                                    </Center>
                                                </Box>
                                                <Divider />
                                                <Box h={'570px'} w={'330px'} mt={'6px'} overflowY={rows.length > 0 ? 'scroll' : 'hidden'}>
                                                    {rows.length > 0 ? (
                                                        rows.map((row: any, index: number) => {
                                                            // return <Box>{row.values[rowKey]}</Box>;
                                                            return (
                                                                <Flex key={index}>
                                                                    <ViewRef
                                                                        columns={columns !== undefined ? columns : []}
                                                                        rowData={row}
                                                                        value={row.values[rowKey]}
                                                                        allowed={allowed}
                                                                    />
                                                                    <Spacer />
                                                                    {allowed ? (
                                                                        <Box
                                                                            ml={'10px'}
                                                                            pt={'2px'}
                                                                            pr={'10px'}
                                                                            onClick={() => handleRemoveRef(column.name, row)}
                                                                        >
                                                                            <Text fontSize={'9px'} cursor={'pointer'} color={'gray'}>
                                                                                <CloseIcon />
                                                                            </Text>
                                                                        </Box>
                                                                    ) : null}
                                                                </Flex>
                                                            );
                                                        })
                                                    ) : (
                                                        <Center>
                                                            <Text fontSize={'12px'}>{`No ${dataCollection.name} selected.`}</Text>
                                                        </Center>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Flex>
                                    </Box>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </Box>
                    {/* <Popover>
                        {allowed ? (
                            <PopoverTrigger>
                                <Box textAlign={'left'} overflow={'hidden'}>
                                    <Button size={'xs'} variant={'ghost'} color={rows.length < 1 ? 'lightgray' : 'gray'} fontSize={'12px'} overflow={'hidden'}>
                                        {rows.length < 1
                                            ? `Choose ${dataCollection?.name}`
                                            : rows.map((row: any, index: number) => {
                                                  if (row.values[rowKey] === undefined) return null;
                                                  return index === rows.length - 1 ? row.values[rowKey] : `${row.values[rowKey]}, `;
                                                  //   return `${row.values[rowKey]} `;
                                              })}
                                    </Button>
                                </Box>
                            </PopoverTrigger>
                        ) : (
                            <Text mt={'5px'}>
                                {rows.length < 1
                                    ? `Choose ${dataCollection?.name}`
                                    : rows.map((row: any, index: number) => {
                                          if (row.values[rowKey] === undefined) return null;
                                          return index === rows.length - 1 ? row.values[rowKey] : `${row.values[rowKey]}, `;
                                          //   return `${row.values[rowKey]} `;
                                      })}
                            </Text>
                        )}
                        {createPortal(
                            <>
                                <PopoverContent w={'600px'}>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverHeader>
                                        <Text fontSize={'14px'}>{dataCollection?.name}</Text>
                                    </PopoverHeader>
                                    <PopoverBody>
                                        <Box h={'200px'}>
                                            <Flex>
                                                <Box h={'200px'} w={'280px'} overflowY={'scroll'}>
                                                    {rows.length > 0 ? (
                                                        rows.map((row: any, index: number) => {
                                                            // return <Box>{row.values[rowKey]}</Box>;
                                                            return (
                                                                <Flex key={index}>
                                                                    <ViewRef
                                                                        columns={columns !== undefined ? columns : []}
                                                                        rowData={row}
                                                                        value={row.values[rowKey]}
                                                                        allowed={allowed}
                                                                    />
                                                                    <Spacer />
                                                                    {allowed ? (
                                                                        <Box
                                                                            ml={'10px'}
                                                                            pt={'2px'}
                                                                            pr={'10px'}
                                                                            onClick={() => handleRemoveRef(column.name, row)}
                                                                        >
                                                                            <Text fontSize={'9px'} cursor={'pointer'} color={'gray'}>
                                                                                <CloseIcon />
                                                                            </Text>
                                                                        </Box>
                                                                    ) : null}
                                                                </Flex>
                                                            );
                                                        })
                                                    ) : (
                                                        <Center>
                                                            <Text fontSize={'12px'}>{`No ${dataCollection.name} selected.`}</Text>
                                                        </Center>
                                                    )}
                                                </Box>
                                                <Box h={'200px'} overflowY={'scroll'}>
                                                    {rowsList.map((row: any, index: number) => {
                                                        if (row.values[rowKey] !== '') {
                                                            return (
                                                                <Box
                                                                    key={index}
                                                                    pl={'12px'}
                                                                    pt={'2px'}
                                                                    pb={'2px'}
                                                                    cursor={'pointer'}
                                                                    onClick={() => handleAddRow(column.name, row)}
                                                                    overflow={'hidden'}
                                                                    _hover={{ backgroundColor: 'lightgray' }}
                                                                >
                                                                    <Text fontSize={'13px'} overflow={'hidden'} textOverflow={'ellipsis'}>
                                                                        {row.values[rowKey]}
                                                                    </Text>
                                                                </Box>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </Box>
                                            </Flex>
                                        </Box>
                                    </PopoverBody>
                                </PopoverContent>
                            </>,
                            document.body
                        )}
                    </Popover> */}
                </>
            ) : (
                <Text>Does not exist.</Text>
            )}
        </Center>
    );
};

export default Reference;
