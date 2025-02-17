import { useCallback, useEffect, useState } from 'react';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { Box, Flex, HStack, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { TCell, TColumn } from '../../types';
import { useGetRowByIdQuery, useGetUserQuery, useUpdateRowMutation } from '../../app/services/api';
import LabelMenu from '../../features/dataCollections/LabelMenu';
import PeopleMenu from '../../features/dataCollections/PeopleMenu';
import DateInput from '../../features/dataCollections/DateInput';
import TextInput from '../../features/dataCollections/TextInput';
import NoteModal from '../../features/dataCollections/NoteModal';
// import { Link, useParams } from 'react-router-dom';
import UploadModal from './UploadModal';
import Reference from './Reference';
import { FaCodeCompare } from 'react-icons/fa6';
import { CloseIcon } from '@chakra-ui/icons';

interface IProps {
    cells?: TCell[];
    columns: any;
    rowData: any;
    value: any;
    allowed?: boolean;
    columnName: string;
    dataCollection: any;
    column: TColumn;
    handleRemoveRef: any;
    hoveredRefs: string | null;
    setHoveredRefs: any;
    // handleChange?: any;
}

// const borderColor = 'gray.600';

const ViewRef = ({ columns, rowData, value, allowed = false, dataCollection, column, handleRemoveRef, setHoveredRefs }: IProps) => {
    // const { id } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: rowFetched, refetch } = useGetRowByIdQuery(rowData._id);
    const [updateRow] = useUpdateRowMutation();

    const [currentColumns, setCurrentColumns] = useState<any>(columns);

    const [row, setRow] = useState(rowFetched);

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        setRow(rowFetched);
    }, [rowFetched]);

    useEffect(() => {
        setCurrentColumns(columns);
    }, [columns]);
    const [_, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    const onChange = useCallback(
        (columnName: string, value: string) => {
            setRow({ ...row, values: { ...row.values, [columnName]: value } });
            updateRow({ ...row, values: { ...row.values, [columnName]: value } });
        },
        [row]
    );

    const handleUpdateRow = (row: any) => {
        updateRow(row);

        setRow(row);
    };

    const getDocs = (documents: any) => {
        updateRow({ ...row, docs: [...row.docs, ...documents] });
        setRow({ ...row, docs: [...row.docs, ...documents] });
    };

    const getUpdatedDoc = (document: any) => {
        const newDocs: any = row.docs.map((rowDoc: any) => {
            return rowDoc._id === document._id ? document : rowDoc;
        });
        updateRow({ ...row, docs: newDocs });
        setRow({ ...row, docs: newDocs });
    };

    const removeDoc = (document: any) => {
        const newDocs: any = row.docs.filter((rowDoc: any) => {
            return rowDoc._id !== document._id;
        });

        updateRow({ ...row, docs: newDocs });
        setRow({ ...row, docs: newDocs });
    };
    return (
        <>
            <Box overflow={'hidden'} bgColor={'white'} mb={'8px'} p={'3px'} boxShadow={'xs'}>
                <HStack>
                    <HStack
                        onClick={onOpen}
                        cursor={'pointer'}
                        w={'390px'}
                        p={'9px'}
                        _hover={{ bgColor: 'gray.100' }}
                        onMouseEnter={() => {
                            setHoveredRefs(row._id);
                        }}
                        onMouseLeave={() => {
                            setHoveredRefs(null);
                        }}
                    >
                        <Box mr={'10px'} ml={'5px'} p={'8px'} bgColor={'rgb(35, 148, 234)'} borderRadius={'5px'}>
                            <Text color={'rgb(255, 255, 255)'}>
                                <FaCodeCompare size={'22px'} />
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize={'13px'} overflow={'hidden'} textOverflow={'ellipsis'} fontWeight={'semibold'} color={'gray.400'}>
                                {`${column.dataCollectionRefLabel}`}
                            </Text>
                            <Text
                                overflow={'hidden'}
                                textOverflow={'ellipsis'}
                                fontWeight={'semibold'}
                                fontSize={'15px'}
                                color={'rgb(17, 72, 114)'}
                            >{`${value}`}</Text>
                        </Box>
                        <Spacer />
                        {/* <Box>
                            <Text fontSize={'16px'} fontWeight={'semibold'} color={row && hoveredRefs === row._id ? 'gray.400' : 'white'}>
                                View
                            </Text>
                        </Box> */}
                    </HStack>
                    <Spacer />
                    {allowed ? (
                        <Box p={'22px'} cursor={'pointer'} onClick={() => handleRemoveRef(column.name, row)} _hover={{ bgColor: 'gray.100' }}>
                            <Text fontSize={'9px'} color={'gray'}>
                                <CloseIcon />
                            </Text>
                        </Box>
                    ) : null}
                </HStack>
            </Box>
            <PrimaryDrawer size="md" onClose={onClose} isOpen={isOpen} title={`${dataCollection.name} Reference`}>
                <Flex>
                    <Box mr={'10px'}>
                        <NoteModal row={row} updateRow={handleUpdateRow} allowed={allowed} />
                    </Box>
                    <Box>
                        <UploadModal
                            rowDocuments={row !== undefined && row !== null ? row.docs : []}
                            getDocs={getDocs}
                            getUpdatedDoc={getUpdatedDoc}
                            removeDoc={removeDoc}
                            allowed={true}
                        />
                    </Box>
                    <Spacer />
                    {/* <Box>
                        <Text fontSize={'14px'} color={'#16b2fc'} fontWeight={'semibold'}>
                            <Link to={`/workspaces/${id}/dataCollections/${rowData.dataCollection}`} target="_blank">
                                View collection
                            </Link>
                        </Text>
                    </Box> */}
                </Flex>
                <Box>
                    {currentColumns.map((column: any, columnIndex: number) => {
                        if (column.isEmpty) return null;

                        if (row) {
                            // console.log(row.values[column.name]);
                        } else {
                            return null;
                        }

                        return (
                            <Box key={columnIndex}>
                                <Box py={'15px'} h={'80px'}>
                                    <Text mb={'8px'} fontSize={'13px'}>{`${column.name[0].toUpperCase()}${column.name
                                        .slice(1, column.name.length)
                                        .split('_')
                                        .join(' ')}`}</Text>
                                    <Box borderWidth={'1px'} borderStyle={'solid'} borderColor={'gray.200'} borderRadius={'2px'} h={'31px'}>
                                        {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                            <LabelMenu
                                                id={0}
                                                labels={column.labels}
                                                columnName={column.name}
                                                value={row ? row.values[column.name] : ''}
                                                onChange={onChange}
                                                allowed={false}
                                            />
                                        ) : column.type === 'people' ? (
                                            <PeopleMenu
                                                row={row}
                                                columnName={column.name}
                                                people={column.people}
                                                values={row ? row.values[column.name] : []}
                                                onChange={onChange}
                                                allowed={false}
                                            />
                                        ) : column.type === 'date' ? (
                                            <DateInput value={row ? row.values[column.name] : ''} columnName={column.name} onChange={onChange} />
                                        ) : column?.type === 'reference' ? (
                                            <Reference
                                                column={column !== undefined ? column : {}}
                                                refsProp={row.refs && row.refs[column?.name] !== undefined ? row.refs[column?.name] : []}
                                                // onRefChange={onRefChange}
                                                // onRemoveRef={onRemoveRef}
                                                allowed={false}
                                            />
                                        ) : (
                                            <TextInput
                                                id={row ? row._id : ''}
                                                columnName={column.name}
                                                value={row ? row.values[column.name] : ''}
                                                type="form"
                                                onChange={onChange}
                                                allowed={false}
                                                prefix={column.prefix}
                                            />
                                        )}
                                    </Box>
                                    {/* {row.values[column.name]} */}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
                <Flex mt={'10px'} width={'full'}>
                    <Spacer />
                    {/* <PrimaryButton onClick={updateData}>SAVE</PrimaryButton> */}
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default ViewRef;
