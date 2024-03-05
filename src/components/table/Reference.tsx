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

const Reference = ({ column, refs, onRefChange, onRemoveRef }: { column: any; refs: any; onRefChange: any; onRemoveRef: any }) => {
    const { data: rowsData } = useGetRowsQuery({
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
        let rowKey;

        columns?.map((column: any) => {
            if (column.position === 1) {
                console.log(column.name);
                rowKey = column.name;
            }
        });

        setRowKey(rowKey);
    }, [rowsData, columns]);

    useEffect(() => {
        console.log(refs);
        setRows(refs || []);
    }, [refs]);

    useEffect(() => {
        const rowIds: any = refs.map((row: any) => {
            return row._id;
        });

        console.log(rowsData);

        if (rowsData === undefined) {
            setRowsList([]);
        } else {
            setRowsList(
                rowsData?.filter((row: any) => {
                    return !rowIds.includes(row._id);
                })
            );
        }
    }, [rowsData]);

    const handleAddRow = (columnName: any, row: any) => {
        console.log(row);
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
        console.log(ref);
        onRemoveRef(columnName, ref);
        setRows((prev: any) =>
            prev.filter((row: any) => {
                return ref._id !== row._id;
            })
        );

        setRowsList((prev: any) => {
            return [...prev, ref];
        });
    };
    return (
        <Center>
            <Popover>
                <PopoverTrigger>
                    <Button size={'xs'} variant={'ghost'} color={rows.length < 1 ? 'lightgray' : 'gray'}>
                        {rows.length < 1 ? `Choose ${dataCollection?.name}` : `${rows.map((row: any) => `${row.values[rowKey]}, `)}`}
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>{dataCollection?.name}</PopoverHeader>
                    <PopoverBody>
                        <Box height={'150px'} overflowY={'scroll'}>
                            {rows.map((row: any, index: number) => {
                                // return <Box>{row.values[rowKey]}</Box>;
                                console.log(row);
                                return (
                                    <Flex key={index}>
                                        <ViewRef columns={columns !== undefined ? columns : []} rowData={row} value={row.values[rowKey]} />
                                        <Spacer />
                                        <Box ml={'10px'} pt={'2px'} pr={'10px'} onClick={() => handleRemoveRef(column.name, row)}>
                                            <Text fontSize={'9px'} cursor={'pointer'} color={'gray'}>
                                                <CloseIcon />
                                            </Text>
                                        </Box>
                                    </Flex>
                                );
                            })}
                        </Box>
                    </PopoverBody>
                    {rows.length > 0 ? <Divider /> : null}
                    <PopoverHeader>{`Choose ${dataCollection?.name}`}</PopoverHeader>
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
                </PopoverContent>
            </Popover>
        </Center>
    );
};

export default Reference;
