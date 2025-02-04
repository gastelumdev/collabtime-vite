// import { useEffect, useState } from 'react';
import { TColumn, TRow, TUser } from '../../../../types';
import { Box, Container, Flex, SimpleGrid, Text } from '@chakra-ui/react';
// import { useGetColumnsQuery, useGetRowsQuery, useGetUserGroupsQuery, useUpdateRowMutation } from '../../../app/services/api';
// import { emptyDataCollectionPermissions, emptyPermissions } from '../../workspaces/UserGroups';
import NoteModal from '../../NoteModal';
import { FaRegFile } from 'react-icons/fa';
import UploadModal from '../../../../components/table/UploadModal';
import { IoAttach } from 'react-icons/io5';
import Reference from '../../../../components/table/Reference';
import LabelMenu from '../../LabelMenu';
import PeopleMenu from '../../PeopleMenu';
import DateInput from '../../DateInput';
import TextInput from '../../TextInput';

interface IProjectDetails {
    projectState: TRow;
    handleChange: any;
    dataCollectionPermissions: any;
    project: TRow;
    getDocs: any;
    getUpdatedDoc: any;
    removeDoc: any;
    columns: TColumn[];
    values: any;
    onChange: any;
    onRefChange: any;
    onRemoveRef: any;
}

const ProjectDetails = ({
    projectState,
    handleChange,
    dataCollectionPermissions,
    project,
    getDocs,
    getUpdatedDoc,
    removeDoc,
    columns,
    values,
    onChange,
    onRefChange,
    onRemoveRef,
}: IProjectDetails) => {
    return (
        <Container maxW={{ sm: 'container.md', md: 'container.xl' }}>
            <Flex mb={'15px'}>
                <Box pt={'2px'}>
                    <NoteModal
                        row={projectState}
                        updateRow={handleChange}
                        // rowCallUpdate={rowCallUpdate}
                        allowed={dataCollectionPermissions.notes.create}
                        icon={<FaRegFile />}
                    />
                </Box>
                <Box ml={'10px'} cursor={'pointer'}>
                    <UploadModal
                        rowDocuments={project.docs}
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
                    if (column.isEmpty) return null;
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
                        <Box key={column._id} fontSize={'14px'} pt={'20px'}>
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
                                        value={project.values !== undefined ? value : null}
                                        onChange={onChange}
                                        allowed={allowed}
                                        fontWeight={fontWeight}
                                        // light={(dataCollectionView && isLast && !isFilteredColumn) || (!dataCollectionView && row.isEmpty)}
                                    />
                                ) : column?.type === 'people' ? (
                                    <PeopleMenu
                                        row={project}
                                        columnName={column?.name}
                                        people={column?.people as TUser[]}
                                        values={project.values !== undefined ? value : null}
                                        onChange={onChange}
                                        allowed={allowed}
                                        fontWeight={fontWeight}
                                    />
                                ) : column?.type === 'date' ? (
                                    <DateInput
                                        value={project.values !== undefined ? value : null}
                                        columnName={column?.name}
                                        onChange={onChange}
                                        allowed={allowed}
                                        fontWeight={fontWeight}
                                    />
                                ) : column?.type === 'reference' ? (
                                    <Reference
                                        column={column !== undefined ? column : {}}
                                        refsProp={project.refs && project.refs[column?.name] !== undefined ? project.refs[column?.name] : []}
                                        onRefChange={onRefChange}
                                        onRemoveRef={onRemoveRef}
                                        allowed={allowed}
                                    />
                                ) : (
                                    <TextInput
                                        id={project._id}
                                        columnName={column?.name}
                                        inputType={column?.type}
                                        value={project.values !== undefined ? value : null}
                                        onChange={onChange}
                                        allowed={allowed || editable || (column?.autoIncremented !== undefined && !column?.autoIncremented)}
                                        isCustomLink={isCustomLink && !project.isEmpty}
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

export default ProjectDetails;
