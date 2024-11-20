import DataCollection from '../dataCollections/DataCollection';
import { useDeleteDataCollectionViewMutation, useGetDataCollectionsQuery, useGetRowsQuery } from '../../app/services/api';
import { useEffect, useState } from 'react';
import { Box, Center, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import Create from './Create';
import { emptyPermissions, emptyViewPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';

const View = ({
    dataCollectionView,
    userGroup = { name: '', workspace: '', users: [], permissions: emptyPermissions },
    refetchUserGroup,
}: {
    dataCollectionView: any;
    userGroup: any;
    refetchUserGroup: any;
}) => {
    const { data: rows, refetch: refetchRows } = useGetRowsQuery({
        dataCollectionId: dataCollectionView.dataCollection || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        showEmptyRows: false,
        filters: JSON.stringify(dataCollectionView.filters),
    });
    const [deleteDataCollectionView] = useDeleteDataCollectionViewMutation();
    const { data } = useGetDataCollectionsQuery(null);
    const [viewPermissions, setViewPermissions] = useState(emptyViewPermissions);

    useEffect(() => {
        refetchRows();
    }, []);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update views', () => {
            console.log('UPDATE VIEWS');
            refetchRows();
        });

        socket.on('update swift sensor data', () => {
            console.log('Swift sensors');
            refetchRows();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const viewPermissions = userGroup.permissions.views.find((item: any) => {
            return item.view === dataCollectionView._id;
        });

        if (viewPermissions !== undefined) {
            setViewPermissions(viewPermissions.permissions);
        } else {
            refetchUserGroup();
        }
    }, [userGroup, dataCollectionView]);
    return (
        <Box>
            <Divider />
            <Box pt={'25px'} pb={'4px'} mt={'20px'}>
                <Flex>
                    <Text fontSize={'20px'} className="dmsans-400">
                        <span>{dataCollectionView.name}</span>
                        <span style={{ marginLeft: '20px', fontSize: '12px', color: '#2B6CB0', fontWeight: 'bold' }}>
                            {dataCollectionView.public &&
                            (userGroup.permissions.viewActions.update ||
                                userGroup?.permissions.viewActions.delete ||
                                viewPermissions.view.update ||
                                viewPermissions.view.delete)
                                ? 'Public'
                                : ''}
                        </span>
                    </Text>
                    <Spacer />

                    {userGroup.permissions.viewActions.update ||
                    userGroup?.permissions.viewActions.delete ||
                    viewPermissions.view.update ||
                    viewPermissions.view.delete ? (
                        <Menu>
                            <MenuButton>
                                <Text fontSize={'24px'}>
                                    <PiDotsThreeVerticalBold />
                                </Text>
                            </MenuButton>
                            <MenuList fontSize={'14px'}>
                                {userGroup.permissions.viewActions.update || viewPermissions.view.update ? (
                                    <Create
                                        dataCollections={data!}
                                        view={dataCollectionView}
                                        dataCollection={data?.find((dc) => {
                                            return dc._id == dataCollectionView.dataCollection;
                                        })}
                                    />
                                ) : null}
                                {userGroup.permissions.viewActions.delete || viewPermissions.view.delete ? (
                                    <MenuItem
                                        onClick={() => {
                                            deleteDataCollectionView(dataCollectionView._id);
                                        }}
                                    >
                                        <Text>Delete View</Text>
                                    </MenuItem>
                                ) : null}
                            </MenuList>
                        </Menu>
                    ) : null}
                </Flex>
            </Box>
            {rows && rows?.length > 0 ? (
                <Box borderBottom={'1px solid #EDF2F7'}>
                    <DataCollection
                        showDoneRows={true}
                        rowsProp={rows}
                        dataCollectionView={dataCollectionView}
                        rowsAreDraggable={false}
                        hasCheckboxOptions={false}
                        hasColumnOptions={false}
                        columnsAreDraggable={false}
                        hasCreateColumn={false}
                        refetchRows={refetchRows}
                        viewPermissions={viewPermissions}
                        // userGroup={userGroup}
                    />
                </Box>
            ) : (
                <Box p={'20px'} bgColor={'#F5FAFF'}>
                    <Center>
                        <Text fontSize={'14px'}>This view is empty.</Text>
                    </Center>
                </Box>
            )}
        </Box>
    );
};

export default View;
