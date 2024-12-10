import {
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Spacer,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useGetColumnsQuery, useGetDataCollectionQuery, useGetRowsQuery } from '../../app/services/api';
import ViewRef from './ViewRef';
import { CloseIcon } from '@chakra-ui/icons';
import { createPortal } from 'react-dom';

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
    }, [refs]);

    useEffect(() => {
        // const rowIds: any = refs.map((row: any) => {
        //     return row._id;
        // });

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
                <Popover>
                    {allowed ? (
                        <PopoverTrigger>
                            <Box textAlign={'left'} overflow={'hidden'}>
                                <Button size={'xs'} variant={'ghost'} color={rows.length < 1 ? 'lightgray' : 'gray'} overflow={'hidden'}>
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
                            <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>{dataCollection?.name}</PopoverHeader>
                                <PopoverBody>
                                    <Box height={'150px'} overflowY={'scroll'}>
                                        {rows.map((row: any, index: number) => {
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
                                                        <Box ml={'10px'} pt={'2px'} pr={'10px'} onClick={() => handleRemoveRef(column.name, row)}>
                                                            <Text fontSize={'9px'} cursor={'pointer'} color={'gray'}>
                                                                <CloseIcon />
                                                            </Text>
                                                        </Box>
                                                    ) : null}
                                                </Flex>
                                            );
                                        })}
                                    </Box>
                                </PopoverBody>
                                {rows.length > 0 && allowed ? <Divider /> : null}
                                {allowed ? <PopoverHeader>{`Choose ${dataCollection?.name}`}</PopoverHeader> : null}
                                {allowed ? (
                                    <PopoverBody>
                                        <Box height={'150px'} overflowY={'scroll'}>
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
                                                            <Text overflow={'hidden'} textOverflow={'ellipsis'}>
                                                                {row.values[rowKey]}
                                                            </Text>
                                                        </Box>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </Box>
                                    </PopoverBody>
                                ) : null}
                            </PopoverContent>
                        </>,
                        document.body
                    )}
                </Popover>
            ) : (
                <Text>Does not exist.</Text>
            )}
        </Center>
    );
};

export default Reference;
