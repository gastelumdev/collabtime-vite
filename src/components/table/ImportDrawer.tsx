import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    ListItem,
    Progress,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    UnorderedList,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface IProps {
    columns: any;
    handleImportRows: any;
    isFetching: boolean;
    isLoading: boolean;
}

const ImportDrawer = ({ columns, handleImportRows, isFetching, isLoading }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // const [file, setFile] = useState<any>();
    const [array, setArray] = useState<any>([]);
    const [error, setError] = useState<string>('');
    const [unmatchingColumns, setUnmatchingColumns] = useState<string[]>([]);

    const fileReader = new FileReader();

    const csvFileToArray = (string: string) => {
        const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
        const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

        const formattedCsvHeaders = csvHeader.map((header) => {
            // return header.split('"')[1];
            return header.replace(/(\r\n|\n|\r)/gm, '');
        });

        let allColumnsMatch = true;

        for (const column of columns) {
            if (!formattedCsvHeaders.includes(column.name)) {
                allColumnsMatch = false;
                setUnmatchingColumns([...unmatchingColumns, column.name]);
            }
        }

        if (allColumnsMatch) {
            const array = csvRows.map((i) => {
                const values = i.split(',');
                const obj = formattedCsvHeaders.reduce((object: any, header: any, index: number) => {
                    object[header] = values[index];
                    return object;
                }, {});
                return obj;
            });

            setArray(array);
        } else {
            setError('All columns from import file must match the columns of this data collection. Please try again.');
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let f;
        if (event.target.files) {
            // setFile(event.target.files[0]);
            f = event.target.files[0];
        }

        if (f) {
            fileReader.onload = function (event) {
                const csvOutput: any = event.target?.result;
                csvFileToArray(csvOutput);
            };

            fileReader.readAsText(f);
        }
    };

    const handleOnSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        await handleImportRows(array);

        if (!isFetching && !isLoading) {
            handleCloseDrawer();
        }
    };

    const handleCloseDrawer = () => {
        setArray([]);
        setError('');
        setUnmatchingColumns([]);
        onClose();
    };

    const headerKeys = Object.keys(Object.assign({}, ...array));

    return (
        <>
            <Text onClick={() => onOpen()}>Import</Text>
            <Drawer isOpen={isOpen} onClose={handleCloseDrawer} size={'full'}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Import</DrawerHeader>

                    <DrawerBody>
                        <input type={'file'} accept={'.csv'} onChange={handleOnChange} />

                        <Box h={'4px'} mt={'10px'}>
                            {isFetching || isLoading ? <Progress size="xs" isIndeterminate /> : null}
                        </Box>
                        <Box color={'red'}>
                            {error !== '' ? '**' : null} {error}
                        </Box>
                        {error ? (
                            <Box mt={'12px'}>
                                <Text>These columns are missing from import: </Text>
                                <UnorderedList>
                                    {unmatchingColumns.map((unmatchingColumn, index) => {
                                        return (
                                            <ListItem key={index} color={'blue.500'}>
                                                <Text color={'blue.500'}>{unmatchingColumn}</Text>
                                            </ListItem>
                                        );
                                    })}
                                </UnorderedList>
                            </Box>
                        ) : null}
                        <TableContainer mt={'30px'}>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        {headerKeys.map((key, index) => (
                                            <Th key={index}>{key}</Th>
                                        ))}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {array.map((item: any, itemIndex: number) => {
                                        return (
                                            <Tr key={itemIndex}>
                                                {Object.values(item).map((val: any, index) => (
                                                    <Td key={index}>{val}</Td>
                                                ))}
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        {/* <table>
                            <thead>
                                <tr key={'header'}>
                                    {headerKeys.map((key) => (
                                        <th>{key}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {array.map((item: any) => (
                                    <tr key={item.id}>
                                        {Object.values(item).map((val: any) => (
                                            <td>{val.split('"')[1]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table> */}
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={handleCloseDrawer}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleOnSubmit} isDisabled={array.length < 1 || error !== ''}>
                            Import
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ImportDrawer;
