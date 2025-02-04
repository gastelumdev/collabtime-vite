import {
    Box,
    Center,
    Container,
    Divider,
    Grid,
    GridItem,
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
import { TRow } from '../../types';
import { FaCodeCompare } from 'react-icons/fa6';

const Reference = ({
    row = null,
    column,
    refsProp,
    onRefChange,
    onRemoveRef,
    allowed = false,
    fontWeight = 'normal',
}: {
    row?: any;
    column: any;
    refsProp: any;
    onRefChange?: any;
    onRemoveRef?: any;
    allowed?: boolean;
    fontWeight?: string;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: rowsData, refetch } = useGetRowsQuery({
        dataCollectionId: column.dataCollectionRef._id !== undefined ? column.dataCollectionRef._id : column.dataCollectionRef,
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
    });
    const { data: columns, refetch: refetchColumns } = useGetColumnsQuery(
        column.dataCollectionRef._id !== undefined ? column.dataCollectionRef._id : column.dataCollectionRef
    );
    const { data: dataCollection } = useGetDataCollectionQuery(
        column.dataCollectionRef._id !== undefined ? column.dataCollectionRef._id : column.dataCollectionRef
    );

    const [rowKey, setRowKey] = useState<any>('');
    const [availableRefs, setAvailableRefs] = useState<any>([]);
    const [refs, setRefs] = useState(refsProp || []);
    const [refIds, setRefIds] = useState(
        refsProp
            ? refsProp.map((item: TRow) => {
                  return item._id;
              })
            : []
    );
    const [hoveredRefs, setHoveredRefs] = useState<string | null>(null);

    useEffect(() => {
        refetch();
        refetchColumns();
    }, []);

    useEffect(() => {
        let rowKey = null;
        columns?.map((col: any) => {
            if (!col.isEmpty && col.name === column.dataCollectionRefLabel) {
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
        setRefs(refsProp || []);
        if (refsProp) {
            setRefIds(
                refsProp.map((item: TRow) => {
                    return item._id;
                })
            );
        }
    }, [refsProp]);

    useEffect(() => {
        if (rowsData === undefined) {
            setAvailableRefs([]);
        } else {
            setAvailableRefs(
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
        setRefs((prev: any) => {
            return [...prev, row];
        });
        setAvailableRefs(
            availableRefs.filter((thisRow: any) => {
                return thisRow._id !== row._id;
            })
        );
    };

    const handleRemoveRef = (columnName: any, ref: any) => {
        onRemoveRef(columnName, ref);
        setRefs((prev: any) =>
            prev.filter((row: any) => {
                return ref._id !== row._id;
            })
        );

        setAvailableRefs((prev: any) => {
            return [...prev, ref];
        });

        // const rowToReinsert = rowsData?.find((row: any) => {
        //     return row.
        // })
    };

    const handleOnOpen = () => {
        const availableRefs = rowsData?.filter((item: TRow) => {
            for (const selectedRef of refsProp) {
                if (selectedRef._id === item._id) {
                    return false;
                }
            }
            return true;
        });

        setAvailableRefs(availableRefs);
        onOpen();
    };
    return (
        <Center px={'10px'} onClick={handleOnOpen} cursor={'pointer'}>
            {dataCollection?.name !== undefined ? (
                <>
                    <Box overflow={'hidden'}>
                        {allowed ? (
                            <Box
                                color={refs.length < 1 ? 'lightgray' : 'black'}
                                // fontWeight={rows.length < 1 ? 'normal' : 'semibold'}
                                fontWeight={fontWeight}
                                textAlign={'left'}
                                overflow={'hidden'}
                                onClick={handleOnOpen}
                                h={'28px'}
                                pt={'2px'}
                                cursor={'pointer'}
                                fontSize={'13px'}
                            >
                                <Text>
                                    {refs.length < 1
                                        ? row.isEmpty
                                            ? ''
                                            : `Choose ${dataCollection?.name}`
                                        : refs.map((row: any, index: number) => {
                                              if (row.values[rowKey] === undefined) return null;
                                              return index === refs.length - 1 ? row.values[rowKey] : `${row.values[rowKey]}, `;
                                          })}
                                </Text>
                            </Box>
                        ) : (
                            <Text mt={'5px'}>
                                {refs.length < 1
                                    ? `Choose ${dataCollection?.name}`
                                    : refs.map((row: any, index: number) => {
                                          if (row.values[rowKey] === undefined) return null;
                                          return index === refs.length - 1 ? row.values[rowKey] : `${row.values[rowKey]}, `;
                                      })}
                            </Text>
                        )}
                        <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader bgColor={'#f6f8fa'}>
                                    <Text fontSize={'xl'}>{`${dataCollection?.name}`}</Text>
                                </ModalHeader>
                                <ModalCloseButton />
                                <ModalBody bgColor={'#f6f8fa'}>
                                    <Container maxW={'container.lg'}>
                                        <Grid templateColumns={'50% 48%'} gap={3}>
                                            <GridItem h={'300px'} p={'10px'} pt={'30px'}>
                                                <Box>
                                                    <Box mb={'5px'}>
                                                        <Text fontSize={'16px'} fontWeight={'semibold'}>{`Avalilable ${dataCollection?.name}`}</Text>
                                                    </Box>
                                                    <Box mb={'5px'}>
                                                        <Text
                                                            fontSize={'12px'}
                                                            color={'gray'}
                                                            fontWeight={'semibold'}
                                                        >{`Select ${dataCollection?.name} to add them to Selected ${dataCollection?.name} column`}</Text>
                                                    </Box>
                                                    <Divider />
                                                    <Box h={'570px'} w={'100%'} mt={'6px'} overflowY={'scroll'}>
                                                        {availableRefs.map((row: any, index: number) => {
                                                            if (row.isEmpty) return null;
                                                            if (refIds.includes(row._id)) return null;
                                                            if (row.values[rowKey] !== '') {
                                                                return (
                                                                    <Box
                                                                        key={index}
                                                                        // w={'330px'}
                                                                        cursor={'pointer'}
                                                                        onClick={() => handleAddRow(column.name, row)}
                                                                        overflow={'hidden'}
                                                                        bgColor={'white'}
                                                                        mb={'8px'}
                                                                        p={'3px'}
                                                                        boxShadow={'xs'}
                                                                    >
                                                                        <HStack
                                                                            p={'9px'}
                                                                            _hover={{ bgColor: 'gray.100' }}
                                                                            onMouseEnter={() => {
                                                                                setHoveredRefs(row._id);
                                                                            }}
                                                                            onMouseLeave={() => {
                                                                                setHoveredRefs(null);
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                mr={'10px'}
                                                                                ml={'5px'}
                                                                                p={'8px'}
                                                                                bgColor={'rgb(35, 148, 234)'}
                                                                                borderRadius={'5px'}
                                                                            >
                                                                                <Text color={'rgb(255, 255, 255)'}>
                                                                                    <FaCodeCompare size={'22px'} />
                                                                                </Text>
                                                                            </Box>
                                                                            <Box>
                                                                                <Text
                                                                                    fontSize={'13px'}
                                                                                    overflow={'hidden'}
                                                                                    textOverflow={'ellipsis'}
                                                                                    fontWeight={'semibold'}
                                                                                    color={'gray.400'}
                                                                                >
                                                                                    {`${column.dataCollectionRefLabel}`}
                                                                                </Text>
                                                                                <Text
                                                                                    overflow={'hidden'}
                                                                                    textOverflow={'ellipsis'}
                                                                                    fontWeight={'semibold'}
                                                                                    fontSize={'15px'}
                                                                                    color={'rgb(17, 72, 114)'}
                                                                                >{`${row.values[rowKey]}`}</Text>
                                                                            </Box>
                                                                            <Spacer />
                                                                            {/* <Box>
                                                                                <Text
                                                                                    fontSize={'16px'}
                                                                                    fontWeight={'semibold'}
                                                                                    color={hoveredRefs === row._id ? 'gray.400' : 'white'}
                                                                                >
                                                                                    Add
                                                                                </Text>
                                                                            </Box> */}
                                                                        </HStack>
                                                                    </Box>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </Box>
                                                </Box>
                                            </GridItem>
                                            <GridItem h={'300px'} p={'10px'} pt={'30px'}>
                                                <Box>
                                                    <Box mb={'5px'}>
                                                        <Text fontSize={'16px'} fontWeight={'semibold'}>
                                                            {`Selected ${dataCollection?.name}`}
                                                        </Text>
                                                    </Box>
                                                    <Box mb={'5px'}>
                                                        <Text
                                                            fontSize={'12px'}
                                                            color={'gray'}
                                                            fontWeight={'semibold'}
                                                        >{`Click on one of the ${dataCollection?.name} to view further`}</Text>
                                                    </Box>
                                                    <Divider />
                                                    <Box h={'570px'} mt={'6px'} overflowY={refs.length > 0 ? 'scroll' : 'hidden'}>
                                                        {refs.length > 0 ? (
                                                            refs.map((row: any, index: number) => {
                                                                // return <Box>{row.values[rowKey]}</Box>;
                                                                return (
                                                                    <ViewRef
                                                                        key={index}
                                                                        columns={columns !== undefined ? columns : []}
                                                                        rowData={row}
                                                                        value={row.values[rowKey]}
                                                                        allowed={allowed}
                                                                        columnName={column.refer}
                                                                        dataCollection={dataCollection}
                                                                        column={column}
                                                                        handleRemoveRef={handleRemoveRef}
                                                                        hoveredRefs={hoveredRefs}
                                                                        setHoveredRefs={setHoveredRefs}
                                                                    />
                                                                );
                                                            })
                                                        ) : (
                                                            <Center>
                                                                <Text fontSize={'12px'}>{`No ${dataCollection.name} selected.`}</Text>
                                                            </Center>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </GridItem>
                                        </Grid>
                                    </Container>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                    </Box>
                </>
            ) : (
                <Text>Does not exist.</Text>
            )}
        </Center>
    );
};

export default Reference;
