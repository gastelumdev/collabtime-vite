import DataCollection from '../dataCollections/DataCollection';
import { useDeleteDataCollectionViewMutation, useGetDataCollectionsQuery, useGetRowsQuery } from '../../app/services/api';
import { useEffect, useState } from 'react';
import { Box, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import Create from './Create';
import { emptyPermissions, emptyViewPermissions } from '../workspaces/UserGroups';

const View = ({
    dataCollectionView,
    userGroup = { name: '', workspace: '', users: [], permissions: emptyPermissions },
    refetchUserGroup,
}: {
    dataCollectionView: any;
    userGroup: any;
    refetchUserGroup: any;
}) => {
    const { data: rows } = useGetRowsQuery({
        dataCollectionId: dataCollectionView.dataCollection || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        showEmptyRows: false,
    });
    const [deleteDataCollectionView] = useDeleteDataCollectionViewMutation();
    const { data } = useGetDataCollectionsQuery(null);
    const [viewPermissions, setViewPermissions] = useState(emptyViewPermissions);

    useEffect(() => {
        if (userGroup !== undefined) {
            const viewPermissions = userGroup.permissions.views.find((item: any) => {
                return item.view === dataCollectionView._id;
            });

            if (viewPermissions !== undefined) {
                setViewPermissions(viewPermissions.permissions);
            } else {
                refetchUserGroup();
            }
        }
    }, [userGroup, dataCollectionView]);
    return (
        <Box>
            <Divider />
            <Box pt={'25px'} pb={'4px'} mt={'20px'}>
                <Flex>
                    <Text fontSize={'20px'} className="dmsans-400">
                        {dataCollectionView.name}
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
            <DataCollection
                showDoneRows={true}
                rowsProp={rows}
                dataCollectionView={dataCollectionView}
                rowsAreDraggable={false}
                hasCheckboxOptions={false}
                hasColumnOptions={false}
                columnsAreDraggable={false}
                hasCreateColumn={false}
                // userGroup={userGroup}
            />
        </Box>
    );
};

export default View;
