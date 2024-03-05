import { useCallback, useEffect, useState } from 'react';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { Box, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { TCell } from '../../types';
import { useGetRowQuery, useGetUserQuery, useUpdateRowMutation } from '../../app/services/api';
import LabelMenu from '../../features/dataCollections/LabelMenu';
import PeopleMenu from '../../features/dataCollections/PeopleMenu';
import DateInput from '../../features/dataCollections/DateInput';
import TextInput from '../../features/dataCollections/TextInput';
import NoteModal from '../../features/dataCollections/NoteModal';
import { Link, useParams } from 'react-router-dom';
import UploadModal from './UploadModal';

interface IProps {
    cells?: TCell[];
    columns: any;
    rowData: any;
    value: any;
    // handleChange?: any;
}

const ViewRef = ({ columns, rowData, value }: IProps) => {
    const { id, dataCollectionId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: rowFetched } = useGetRowQuery({ rowId: rowData._id, workspaceId: id, dataCollectionId });
    const [updateRow] = useUpdateRowMutation();

    const [currentColumns, setCurrentColumns] = useState<any>(columns);

    const [row, setRow] = useState(rowFetched);

    useEffect(() => {
        console.log(rowData);
        console.log(rowFetched);
        setRow(rowFetched);
    }, [rowFetched, rowData]);

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
            console.log(value);
            setRow({ ...row, values: { ...row.values, [columnName]: value } });
            updateRow({ ...row, values: { ...row.values, [columnName]: value } });
        },
        [row]
    );

    const handleUpdateRow = (row: any) => {
        console.log(row);
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
            <Box ml={'12px'} pb={'4px'} onClick={onOpen} cursor={'pointer'} overflow={'hidden'} textOverflow={'ellipsis'}>
                <Text overflow={'hidden'} textOverflow={'ellipsis'} color={'blue'} _hover={{ textDecoration: 'underline' }}>
                    {value}
                </Text>
            </Box>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={'Edit row'}>
                <Flex>
                    <Box mr={'10px'}>
                        <NoteModal row={row} updateRow={handleUpdateRow} />
                    </Box>
                    <Box>
                        <>{console.log(row)}</>
                        <UploadModal rowDocuments={row !== undefined ? row.docs : []} getDocs={getDocs} getUpdatedDoc={getUpdatedDoc} removeDoc={removeDoc} />
                    </Box>
                    <Spacer />
                    <Box>
                        <Text fontSize={'14px'} color={'blue'}>
                            <Link to={`/workspaces/${id}/dataCollections/${rowData.dataCollection}`} target="_blank">
                                Go to collection
                            </Link>
                        </Text>
                    </Box>
                </Flex>
                {currentColumns.map((column: any, columnIndex: number) => {
                    return (
                        <div
                            key={columnIndex}
                            className={'cell'}
                            style={{
                                whiteSpace: 'nowrap',
                                fontSize: '12px',
                                borderBottom: '1px solid #edf2f7',
                            }}
                        >
                            <Box py={'15px'} h={'80px'}>
                                <Text mb={'8px'} fontSize={'13px'}>{`${column.name[0].toUpperCase()}${column.name
                                    .slice(1, column.name.length)
                                    .split('_')
                                    .join(' ')}`}</Text>
                                {column.type === 'label' || column.type === 'priority' || column.type === 'status' ? (
                                    <LabelMenu
                                        id={0}
                                        labels={column.labels}
                                        columnName={column.name}
                                        value={row ? row.values[column.name] : ''}
                                        onChange={onChange}
                                    />
                                ) : column.type === 'people' ? (
                                    <PeopleMenu
                                        row={row}
                                        columnName={column.name}
                                        people={column.people}
                                        value={row ? row.values[column.name] : ''}
                                        onChange={onChange}
                                    />
                                ) : column.type === 'date' ? (
                                    <DateInput value={row ? row.values[column.name] : ''} columnName={column.name} onChange={onChange} />
                                ) : (
                                    <TextInput
                                        id={row ? row._id : ''}
                                        columnName={column.name}
                                        value={row ? row.values[column.name] : ''}
                                        type="form"
                                        onChange={onChange}
                                    />
                                )}
                                {/* {row.values[column.name]} */}
                            </Box>
                        </div>
                    );
                })}
                <Flex mt={'10px'} width={'full'}>
                    <Spacer />
                    {/* <PrimaryButton onClick={updateData}>SAVE</PrimaryButton> */}
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default ViewRef;
