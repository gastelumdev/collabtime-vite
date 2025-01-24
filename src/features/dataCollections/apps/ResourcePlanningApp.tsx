import { useEffect, useState } from 'react';
import { TColumn, TDataCollection, TDocument, TRow, TUser } from '../../../types';
import { Box, Container, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import { useGetColumnsQuery, useGetRowsQuery, useGetUserGroupsQuery, useUpdateRowMutation } from '../../../app/services/api';
import { emptyDataCollectionPermissions, emptyPermissions } from '../../workspaces/UserGroups';
import NoteModal from '../NoteModal';
import { FaRegFile } from 'react-icons/fa';
import UploadModal from '../../../components/table/UploadModal';
import { IoAttach } from 'react-icons/io5';
import Reference from '../../../components/table/Reference';
import LabelMenu from '../LabelMenu';
import PeopleMenu from '../PeopleMenu';
import DateInput from '../DateInput';
import TextInput from '../TextInput';

const ResourcePlanningApp = ({ row, values, dataCollection, refetchRow }: { row: TRow; values: any; dataCollection: TDataCollection; refetchRow: any }) => {
    const { refetch: refetch } = useGetRowsQuery({
        dataCollectionId: dataCollection._id || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        showEmptyRows: false,
        // filters: JSON.stringify(dataCollectionView.filters),
    });
    const { data: columns } = useGetColumnsQuery(dataCollection._id as string);

    const [rowState, setRowState] = useState(row);

    const [updateRow] = useUpdateRowMutation();

    const { data: userGroups } = useGetUserGroupsQuery(null);
    const [_userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });
    const [dataCollectionPermissions, setDataCollectionPermissions] = useState(emptyDataCollectionPermissions);

    useEffect(() => {
        if (userGroups !== undefined) {
            // Find the user group that the current user is in
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });

            let dcPermissions;
            if (ug !== undefined) {
                // Find the current data collection being viewed
                dcPermissions = ug.permissions.dataCollections.find((item: any) => {
                    return item.dataCollection === dataCollection._id;
                });

                if (dcPermissions !== undefined) {
                    // Set the user group and data collection
                    setUserGroup(ug);
                    setDataCollectionPermissions(dcPermissions.permissions);
                } else {
                    refetch();
                }
            } else {
                refetch();
            }
        } else {
            refetch();
        }
    }, [userGroups]);

    const handleChange = async (row: TRow) => {
        setRowState(row);
        await updateRow(row);
        refetchRow();
    };

    const getDocs = (documents: any[]) => {
        handleChange({ ...row, docs: [...row.docs, ...documents] });
    };

    const getUpdatedDoc = (document: TDocument) => {
        const newDocs: any = row.docs.map((rowDoc: any) => {
            return rowDoc._id === document._id ? document : rowDoc;
        });
        handleChange({ ...row, docs: newDocs });
    };

    const removeDoc = (document: TDocument) => {
        const newDocs: any = row.docs.filter((rowDoc: any) => {
            return rowDoc._id !== document._id;
        });

        handleChange({ ...row, docs: newDocs });
    };

    const onRefChange = (columnName: string, ref: any) => {
        const refs: any = [];
        if (row.refs === undefined) {
            refs.push(ref);
            handleChange({ ...row, refs: { [columnName]: refs } });
        } else {
            if (row.refs[columnName] === undefined) {
                handleChange({ ...row, refs: { ...row.refs, [columnName]: [ref] } });
            } else {
                handleChange({ ...row, refs: { ...row.refs, [columnName]: [...row.refs[columnName], ref] } });
            }
        }

        // handleChange({ ...row, refs: {...row.refs, [columnName]: [...row.refs[columnName], row]} });
    };

    const onRemoveRef = (columnName: string, ref: any) => {
        const rowCopy: any = row;
        const refs: any = rowCopy.refs;
        const refTarget: any = refs[columnName];

        const filteredRefs = refTarget.filter((r: any) => {
            return r._id !== ref._id;
        });

        handleChange({ ...row, refs: { ...row.refs, [columnName]: filteredRefs } });
    };

    const onChange = (columnName: string, value: string) => {
        // if (columnName === 'status' && value === 'Done') {
        //     setShowRow(false);
        // } else {
        //     setShowRow(true);
        // }
        handleChange({ ...row, values: { ...row.values, [columnName]: value }, isEmpty: false });
        // refetchRows();
    };

    return (
        <Container maxW={{ sm: 'container.md', md: 'container.xl' }}>
            <Flex mb={'15px'}>
                <Box pt={'2px'}>
                    <NoteModal
                        row={rowState}
                        updateRow={handleChange}
                        // rowCallUpdate={rowCallUpdate}
                        allowed={dataCollectionPermissions.notes.create}
                        icon={<FaRegFile />}
                    />
                </Box>
                <Box ml={'10px'} cursor={'pointer'}>
                    <UploadModal
                        rowDocuments={row.docs}
                        getDocs={getDocs}
                        getUpdatedDoc={getUpdatedDoc}
                        removeDoc={removeDoc}
                        permissions={dataCollectionPermissions}
                        Icon={<IoAttach />}
                        iconSize={'20px'}
                    />
                </Box>
            </Flex>
            <SimpleGrid columns={{ sm: 1, md: 2, lg: 2, xl: 3 }} spacingX="40px">
                {columns?.map((column: TColumn) => {
                    let allowed = true;
                    let value = values[column.name];
                    let bgColor = 'white';
                    let textColor = 'black';
                    let fontWeight = 'semibold';
                    let position = 'left';
                    let isCustomLink = false;
                    let editable = true;
                    let isDisabled = false;
                    let rowIndex = 0;
                    let prefix = column.prefix && column.prefix !== undefined ? column.prefix : '';

                    return (
                        <Box fontSize={'14px'} pt={'20px'}>
                            <Box mr={'7px'} mb={'7px'} w={'150px'}>
                                <Text color={'gray.500'} fontWeight={'semibold'}>{`${column.name.slice(0, 1).toUpperCase()}${column.name
                                    .split('_')
                                    .join(' ')
                                    .slice(1)}:`}</Text>
                            </Box>
                            <Box w={{ sm: '250px', md: '300px', lg: '375px' }} border={'1px solid #E6E6E6'}>
                                {column?.type === 'label' || column?.type === 'priority' || column?.type === 'status' ? (
                                    <LabelMenu
                                        id={rowIndex}
                                        labels={column.labels}
                                        columnName={column?.name}
                                        value={row.values !== undefined ? value : null}
                                        onChange={onChange}
                                        allowed={allowed}
                                        fontWeight={fontWeight}
                                        // light={(dataCollectionView && isLast && !isFilteredColumn) || (!dataCollectionView && row.isEmpty)}
                                    />
                                ) : column?.type === 'people' ? (
                                    <PeopleMenu
                                        row={row}
                                        columnName={column?.name}
                                        people={column?.people as TUser[]}
                                        values={row.values !== undefined ? value : null}
                                        onChange={onChange}
                                        allowed={allowed}
                                        fontWeight={fontWeight}
                                    />
                                ) : column?.type === 'date' ? (
                                    <DateInput
                                        value={row.values !== undefined ? value : null}
                                        columnName={column?.name}
                                        onChange={onChange}
                                        allowed={allowed}
                                        fontWeight={fontWeight}
                                    />
                                ) : column?.type === 'reference' ? (
                                    <Reference
                                        column={column !== undefined ? column : {}}
                                        refs={row.refs && row.refs[column?.name] !== undefined ? row.refs[column?.name] : []}
                                        onRefChange={onRefChange}
                                        onRemoveRef={onRemoveRef}
                                        allowed={allowed}
                                    />
                                ) : (
                                    <TextInput
                                        id={row._id}
                                        columnName={column?.name}
                                        inputType={column?.type}
                                        value={row.values !== undefined ? value : null}
                                        onChange={onChange}
                                        allowed={allowed || editable || (column?.autoIncremented !== undefined && !column?.autoIncremented)}
                                        isCustomLink={isCustomLink && !row.isEmpty}
                                        bgColor={bgColor}
                                        textColor={textColor}
                                        fontWeight={fontWeight}
                                        position={position}
                                        isDisabled={isDisabled}
                                        prefix={prefix}
                                    />
                                )}
                            </Box>
                        </Box>
                    );
                })}
                {/* <Box fontSize={'14px'} pt={'16px'}>
                    <Flex>
                        <Box mr={'7px'}>
                            <Text fontWeight={'semibold'}>Project No.:</Text>
                        </Box>
                        <Box>
                            <Text>{values['Project No.']}</Text>
                        </Box>
                    </Flex>
                </Box>
                <Box fontSize={'14px'} pt={'16px'}>
                    <Flex>
                        <Box mr={'7px'}>
                            <Text fontWeight={'semibold'}>Customer:</Text>
                        </Box>
                        <Box>
                            <Text>
                                {refs['customer'].map((customer: any) => {
                                    return customer.values.name;
                                })}
                            </Text>
                            <Reference
                                column={column !== undefined ? column : {}}
                                refs={row.refs && row.refs[column?.name] !== undefined ? row.refs[column?.name] : []}
                                onRefChange={onRefChange}
                                onRemoveRef={onRemoveRef}
                                allowed={allowed}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Box fontSize={'14px'} pt={'16px'}>
                    <Flex>
                        <Box mr={'7px'}>
                            <Text fontWeight={'semibold'}>Proposed Date:</Text>
                        </Box>
                        <Box>
                            <Text>{formatTime(values['proposed_date'], false)}</Text>
                        </Box>
                    </Flex>
                </Box> */}
            </SimpleGrid>
        </Container>
    );
};

export default ResourcePlanningApp;
