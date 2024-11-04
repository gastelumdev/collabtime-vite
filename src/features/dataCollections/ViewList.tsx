import {
    useGetDataCollectionsQuery,
    useCreateDataCollecionMutation,
    useDeleteDataCollectionMutation,
    useUpdateDataCollectionMutation,
    useGetUserQuery,
    useGetOneWorkspaceQuery,
    useDeleteTagMutation,
    useTagExistsMutation,
    useUpdateWorkspaceMutation,
    useGetDataCollectionViewsQuery,
    useGetUserGroupsQuery,
} from '../../app/services/api';

import {
    Box,
    Card,
    CardBody,
    Center,
    Container,
    Flex,
    Spacer,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    TagCloseButton,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import Edit from './Edit';
import Create from './Create';
import { useEffect, useState } from 'react';
import TagsModal from '../tags/TagsModal';
import { TDataCollection, TTag } from '../../types';
import { Link } from 'react-router-dom';
import Delete from './Delete';
// import Templates from './Templates';
import CreateDataCollectionView from '../dataCollectionViews/Create';
import View from '../dataCollectionViews/View';
import { emptyPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';

const ViewList = ({}: { allowed?: boolean }) => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data } = useGetDataCollectionsQuery(null);
    const { data: dataCollectionViews, refetch: refetchViews } = useGetDataCollectionViewsQuery(null);
    const { data: workspace } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');
    const [createDataCollection] = useCreateDataCollecionMutation();
    const [updateDataCollection] = useUpdateDataCollectionMutation();
    const [deleteDataCollection] = useDeleteDataCollectionMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [permissions, setPermissions] = useState<number>();

    const [dataCollections, setDataCollections] = useState(data);

    useEffect(() => {
        permissions;
        getPermissions();

        setDataCollections(data);
    }, [user, workspace, data]);

    // useEffect(() => {}, [dataCollectionViews]);

    const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
    const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });

    useEffect(() => {
        if (userGroups !== undefined) {
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });

            console.log(ug);

            setUserGroup(ug);
        } else {
            refetchUserGroups();
        }
    }, [userGroups]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on('update views', () => {
            console.log('UPDATE VIEWS');
            refetchViews();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleCloseTagButtonClick = async (dataCollection: TDataCollection, tag: TTag) => {
        const { tags } = dataCollection;

        // Filter out the tag clicked on from the data collection tags
        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        // Create a new data collection with the updated tags
        const addNewDataCollection = { ...dataCollection, tags: filteredTags };
        // update the data collection and get the updated data collection
        await updateDataCollection(addNewDataCollection);
        // const updatedDataCollection = updatedDataCollectionRes.data;

        let workspaceTags;

        if (workspace) {
            workspaceTags = workspace.workspaceTags;
        }

        const thisTagExistsRes: any = await tagExists(tag);

        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags?.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace: any = { ...workspace, workspaceTags: filteredWorkspaceTags };

            await updateWorkspace(newUpdatedWorkspace);
            await deleteTag(tag);
        }
    };

    return (
        <Card>
            <CardBody p={1} pt={7} pb={6}>
                <Box>
                    <Flex
                    // minH={'100vh'}
                    // justify={"center"}
                    // bg={'#eff2f5'}
                    >
                        <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                            {/* {allowed ? (
                                <Flex h={'50px'} mb={'10px'}>
                                    
                                    <Spacer />
                                    <Box pb={'20px'} mr={'10px'}>
                                        <Templates />
                                    </Box>
                                    <Box>
                                        <Create addNewDataCollection={createDataCollection} />
                                    </Box>
                                </Flex>
                            ) : null} */}
                            {userGroup.permissions.dataCollectionActions.view || userGroup.permissions.viewActions.view ? (
                                <Tabs>
                                    <TabList>
                                        {userGroup.permissions.viewActions.view ? <Tab>Dashboard</Tab> : null}
                                        {userGroup.permissions.dataCollectionActions.view ? <Tab>Data Collections</Tab> : null}
                                    </TabList>

                                    <TabPanels>
                                        {userGroup.permissions.viewActions.view ? (
                                            <TabPanel>
                                                <Box mt={3}>
                                                    <Flex mb={'10px'}>
                                                        {/* <Box>
                                                    <Text fontSize={'20px'}>Views</Text>
                                                </Box> */}
                                                        <Spacer />
                                                        <Box>
                                                            {userGroup.permissions.viewActions.create ? (
                                                                <CreateDataCollectionView dataCollections={data!} />
                                                            ) : null}
                                                        </Box>
                                                    </Flex>
                                                    {dataCollectionViews?.length < 1 ? (
                                                        <Center>
                                                            <Text>{'There are currently no views in your dashboard.'}</Text>
                                                        </Center>
                                                    ) : null}
                                                </Box>
                                                <Box>
                                                    {userGroup.permissions.viewActions.view
                                                        ? dataCollectionViews?.map((dcView: any) => {
                                                              console.log(dcView);
                                                              console.log(userGroups);
                                                              console.log(userGroup.permissions.viewActions.view);

                                                              const viewPermissions: any = userGroup.permissions.views.find((item: any) => {
                                                                  return item.view === dcView._id;
                                                              });

                                                              if (viewPermissions !== undefined) {
                                                                  if (!viewPermissions.permissions.view.view) {
                                                                      return null;
                                                                  }
                                                              }

                                                              return (
                                                                  <View
                                                                      key={dcView.name}
                                                                      dataCollectionView={dcView}
                                                                      userGroup={userGroup}
                                                                      refetchUserGroup={refetchUserGroups}
                                                                  />
                                                              );
                                                          })
                                                        : null}
                                                </Box>
                                            </TabPanel>
                                        ) : null}
                                        {userGroup.permissions.dataCollectionActions.view ? (
                                            <TabPanel>
                                                <Box mt={3}>
                                                    <Flex h={'50px'} mb={'10px'}>
                                                        <Box>
                                                            <Text fontSize={'20px'}>Data Collections</Text>
                                                        </Box>
                                                        <Spacer />
                                                        {userGroup.permissions.dataCollectionActions.create ? (
                                                            <>
                                                                {/* <Box pb={'20px'} mr={'10px'}>
                                                                    <Templates />
                                                                </Box> */}
                                                                <Box>
                                                                    <Create addNewDataCollection={createDataCollection} />
                                                                </Box>
                                                            </>
                                                        ) : null}
                                                    </Flex>
                                                    {dataCollections && dataCollections.length > 0 ? (
                                                        <TableContainer>
                                                            <Table size="sm">
                                                                <Thead>
                                                                    <Tr bgColor={'#F5FAFF'}>
                                                                        {userGroup.permissions.dataCollectionActions.update ||
                                                                        userGroup.permissions.dataCollections.find((item: any) => {
                                                                            return item.permissions.dataCollection.update;
                                                                        }) ||
                                                                        userGroup.permissions.dataCollectionActions.delete ||
                                                                        userGroup.permissions.dataCollections.find((item: any) => {
                                                                            return item.permissions.dataCollection.delete;
                                                                        }) ||
                                                                        userGroup.permissions.dataCollectionActions.tag ||
                                                                        userGroup.permissions.dataCollections.find((item: any) => {
                                                                            return item.permissions.dataCollection.tag;
                                                                        }) ? (
                                                                            <Th pb={'35px'}></Th>
                                                                        ) : null}
                                                                        <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                            Name
                                                                        </Th>
                                                                        <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                            Description
                                                                        </Th>

                                                                        {(userGroup.permissions.dataCollectionActions.tag ||
                                                                            userGroup.permissions.dataCollections.find((item: any) => {
                                                                                return item.permissions.dataCollection.tag;
                                                                            })) &&
                                                                        data?.find((item: any) => {
                                                                            return item.tags.length > 0 && item.inParentToDisplay === null;
                                                                        }) !== undefined ? (
                                                                            <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                                Tags
                                                                            </Th>
                                                                        ) : null}
                                                                    </Tr>
                                                                </Thead>
                                                                <Tbody>
                                                                    {data?.map((dataCollection: any, index: number) => {
                                                                        if (dataCollection.inParentToDisplay !== null) return null;
                                                                        const dataCollectionPermissions: any = userGroup.permissions.dataCollections.find(
                                                                            (item: any) => {
                                                                                return item.dataCollection === dataCollection._id;
                                                                            }
                                                                        );

                                                                        if (!dataCollectionPermissions?.permissions.dataCollection.view) {
                                                                            return null;
                                                                        }

                                                                        if (!dataCollection.main) {
                                                                            return null;
                                                                        }
                                                                        return (
                                                                            <Tr key={index}>
                                                                                {userGroup.permissions.dataCollectionActions.update ||
                                                                                userGroup.permissions.dataCollections.find((item: any) => {
                                                                                    return item.permissions.dataCollection.update;
                                                                                }) ||
                                                                                userGroup.permissions.dataCollectionActions.delete ||
                                                                                userGroup.permissions.dataCollections.find((item: any) => {
                                                                                    return item.permissions.dataCollection.delete;
                                                                                }) ||
                                                                                userGroup.permissions.dataCollectionActions.tag ||
                                                                                userGroup.permissions.dataCollections.find((item: any) => {
                                                                                    return item.permissions.dataCollection.tag;
                                                                                }) ? (
                                                                                    <Td w={'120px'} p={0}>
                                                                                        <Flex>
                                                                                            {userGroup.permissions.dataCollectionActions.update ||
                                                                                            dataCollectionPermissions.permissions.dataCollection.update ? (
                                                                                                <Box mr={'8px'} cursor={'pointer'}>
                                                                                                    <Edit
                                                                                                        dataCollection={dataCollection}
                                                                                                        updateDataCollection={updateDataCollection}
                                                                                                    />
                                                                                                </Box>
                                                                                            ) : null}
                                                                                            {userGroup.permissions.dataCollectionActions.delete ||
                                                                                            dataCollectionPermissions.permissions.dataCollection.delete ? (
                                                                                                <Box mr={'8px'} cursor={'pointer'}>
                                                                                                    <Delete
                                                                                                        dataCollection={dataCollection}
                                                                                                        deleteDataCollection={deleteDataCollection}
                                                                                                    />
                                                                                                </Box>
                                                                                            ) : null}
                                                                                            {userGroup.permissions.dataCollectionActions.tag ||
                                                                                            dataCollectionPermissions.permissions.dataCollection.tag ? (
                                                                                                <Box cursor={'pointer'}>
                                                                                                    <TagsModal
                                                                                                        tagType={'dataCollection'}
                                                                                                        data={dataCollection}
                                                                                                        tags={dataCollection.tags}
                                                                                                        update={updateDataCollection}
                                                                                                        workspaceId={workspace?._id || ''}
                                                                                                    />
                                                                                                </Box>
                                                                                            ) : null}
                                                                                        </Flex>
                                                                                    </Td>
                                                                                ) : null}
                                                                                <Td>
                                                                                    <Link
                                                                                        to={`/workspaces/${workspace?._id}/dataCollections/${dataCollection._id}`}
                                                                                    >
                                                                                        <Text fontSize={'sm'} color={'#666666'} fontWeight={'semibold'}>
                                                                                            {dataCollection.name}
                                                                                        </Text>
                                                                                    </Link>
                                                                                </Td>
                                                                                <Td>
                                                                                    <Text fontSize={'sm'} color={'#666666'}>
                                                                                        {dataCollection.description}
                                                                                    </Text>
                                                                                </Td>

                                                                                {userGroup.permissions.dataCollectionActions.tag ||
                                                                                userGroup.permissions.dataCollections.find((item: any) => {
                                                                                    return item.permissions.dataCollection.tag;
                                                                                }) ? (
                                                                                    <Td w={'300px'}>
                                                                                        {dataCollection.tags.map((tag: TTag, index: number) => {
                                                                                            return (
                                                                                                <Tag
                                                                                                    key={index}
                                                                                                    size={'sm'}
                                                                                                    variant="subtle"
                                                                                                    colorScheme="blue"
                                                                                                    mr={'5px'}
                                                                                                    zIndex={1000}
                                                                                                >
                                                                                                    <TagLabel pb={'2px'}>{tag.name}</TagLabel>
                                                                                                    {userGroup.permissions.dataCollectionActions.tag ? (
                                                                                                        <TagCloseButton
                                                                                                            onClick={() =>
                                                                                                                handleCloseTagButtonClick(dataCollection, tag)
                                                                                                            }
                                                                                                            zIndex={1000}
                                                                                                        />
                                                                                                    ) : null}
                                                                                                </Tag>
                                                                                            );
                                                                                        })}
                                                                                    </Td>
                                                                                ) : null}
                                                                            </Tr>
                                                                        );
                                                                    })}
                                                                </Tbody>
                                                            </Table>
                                                        </TableContainer>
                                                    ) : (
                                                        <Box mt={'30px'}>
                                                            <Center>
                                                                <Text>{'There are currently no data collections in your dashboard.'}</Text>
                                                            </Center>
                                                        </Box>
                                                    )}
                                                </Box>
                                                {data?.find((item: any) => {
                                                    console.log(item.inParentToDisplay);
                                                    return item.inParentToDisplay !== null;
                                                }) !== undefined ? (
                                                    <Box mt={12}>
                                                        <Flex h={'50px'} mb={'10px'}>
                                                            <Box>
                                                                <Text fontSize={'20px'}>Row App Data Collections</Text>
                                                            </Box>
                                                        </Flex>
                                                        {dataCollections && dataCollections.length > 0 ? (
                                                            <TableContainer>
                                                                <Table size="sm">
                                                                    <Thead>
                                                                        <Tr bgColor={'#F5FAFF'}>
                                                                            {userGroup.permissions.dataCollectionActions.update ||
                                                                            userGroup.permissions.dataCollections.find((item: any) => {
                                                                                return item.permissions.dataCollection.update;
                                                                            }) ||
                                                                            userGroup.permissions.dataCollectionActions.delete ||
                                                                            userGroup.permissions.dataCollections.find((item: any) => {
                                                                                return item.permissions.dataCollection.delete;
                                                                            }) ||
                                                                            userGroup.permissions.dataCollectionActions.tag ||
                                                                            userGroup.permissions.dataCollections.find((item: any) => {
                                                                                return item.permissions.dataCollection.tag;
                                                                            }) ? (
                                                                                <Th pb={'35px'}></Th>
                                                                            ) : null}
                                                                            <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                                Name
                                                                            </Th>
                                                                            <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                                Description
                                                                            </Th>
                                                                            <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                                App Type
                                                                            </Th>
                                                                            <Th color={'#666666'} fontWeight={'semibold'} fontSize={'sm'}>
                                                                                Data Collection
                                                                            </Th>

                                                                            {(userGroup.permissions.dataCollectionActions.tag ||
                                                                                userGroup.permissions.dataCollections.find((item: any) => {
                                                                                    return item.permissions.dataCollection.tag;
                                                                                })) &&
                                                                            data?.find((item: any) => {
                                                                                return item.tags.length > 0 && item.inParentToDisplay !== null;
                                                                            }) !== undefined ? (
                                                                                <Th color={'#666666'} fontWeight={'semibold'}>
                                                                                    Tags
                                                                                </Th>
                                                                            ) : null}
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {data?.map((dataCollection: any, index: number) => {
                                                                            const dataCollectionPermissions: any = userGroup.permissions.dataCollections.find(
                                                                                (item: any) => {
                                                                                    return item.dataCollection === dataCollection._id;
                                                                                }
                                                                            );

                                                                            if (!dataCollectionPermissions?.permissions.dataCollection.view) {
                                                                                return null;
                                                                            }

                                                                            if (!dataCollection.main || dataCollection.inParentToDisplay === null) {
                                                                                return null;
                                                                            }

                                                                            const appModel = data?.find((item: any) => {
                                                                                return item._id === dataCollection.inParentToDisplay;
                                                                            });

                                                                            const appModelName = appModel?.name;
                                                                            return (
                                                                                <Tr key={index}>
                                                                                    {userGroup.permissions.dataCollectionActions.update ||
                                                                                    userGroup.permissions.dataCollections.find((item: any) => {
                                                                                        return item.permissions.dataCollection.update;
                                                                                    }) ||
                                                                                    userGroup.permissions.dataCollectionActions.delete ||
                                                                                    userGroup.permissions.dataCollections.find((item: any) => {
                                                                                        return item.permissions.dataCollection.delete;
                                                                                    }) ||
                                                                                    userGroup.permissions.dataCollectionActions.tag ||
                                                                                    userGroup.permissions.dataCollections.find((item: any) => {
                                                                                        return item.permissions.dataCollection.tag;
                                                                                    }) ? (
                                                                                        <Td w={'120px'} p={0}>
                                                                                            <Flex>
                                                                                                {userGroup.permissions.dataCollectionActions.update ||
                                                                                                dataCollectionPermissions.permissions.dataCollection.update ? (
                                                                                                    <Box mr={'8px'} cursor={'pointer'}>
                                                                                                        <Edit
                                                                                                            dataCollection={dataCollection}
                                                                                                            updateDataCollection={updateDataCollection}
                                                                                                        />
                                                                                                    </Box>
                                                                                                ) : null}
                                                                                                {userGroup.permissions.dataCollectionActions.delete ||
                                                                                                dataCollectionPermissions.permissions.dataCollection.delete ? (
                                                                                                    <Box mr={'8px'} cursor={'pointer'}>
                                                                                                        <Delete
                                                                                                            dataCollection={dataCollection}
                                                                                                            deleteDataCollection={deleteDataCollection}
                                                                                                        />
                                                                                                    </Box>
                                                                                                ) : null}
                                                                                                {userGroup.permissions.dataCollectionActions.tag ||
                                                                                                dataCollectionPermissions.permissions.dataCollection.tag ? (
                                                                                                    <Box cursor={'pointer'}>
                                                                                                        <TagsModal
                                                                                                            tagType={'dataCollection'}
                                                                                                            data={dataCollection}
                                                                                                            tags={dataCollection.tags}
                                                                                                            update={updateDataCollection}
                                                                                                            workspaceId={workspace?._id || ''}
                                                                                                        />
                                                                                                    </Box>
                                                                                                ) : null}
                                                                                            </Flex>
                                                                                        </Td>
                                                                                    ) : null}
                                                                                    <Td>
                                                                                        <Link
                                                                                            to={`/workspaces/${workspace?._id}/dataCollections/${dataCollection._id}`}
                                                                                        >
                                                                                            <Text color={'#666666'} fontSize={'sm'} fontWeight={'semibold'}>
                                                                                                {dataCollection.name}
                                                                                            </Text>
                                                                                        </Link>
                                                                                    </Td>
                                                                                    <Td>
                                                                                        <Text color={'#666666'} fontSize={'sm'}>
                                                                                            {dataCollection.description}
                                                                                        </Text>
                                                                                    </Td>
                                                                                    <Td>
                                                                                        <Text color={'#666666'} fontSize={'sm'}>
                                                                                            {`${dataCollection.appType
                                                                                                .slice(0, 1)
                                                                                                .toUpperCase()}${dataCollection.appType.slice(1)}`}
                                                                                        </Text>
                                                                                    </Td>
                                                                                    <Td>
                                                                                        <Text color={'#666666'} fontSize={'sm'}>
                                                                                            {appModelName}
                                                                                        </Text>
                                                                                    </Td>

                                                                                    {userGroup.permissions.dataCollectionActions.tag ||
                                                                                    userGroup.permissions.dataCollections.find((item: any) => {
                                                                                        return item.permissions.dataCollection.tag;
                                                                                    }) ? (
                                                                                        <Td w={'300px'}>
                                                                                            {dataCollection.tags.map((tag: TTag, index: number) => {
                                                                                                return (
                                                                                                    <Tag
                                                                                                        key={index}
                                                                                                        size={'sm'}
                                                                                                        variant="subtle"
                                                                                                        colorScheme="blue"
                                                                                                        mr={'5px'}
                                                                                                        zIndex={1000}
                                                                                                    >
                                                                                                        <TagLabel pb={'2px'}>{tag.name}</TagLabel>
                                                                                                        {userGroup.permissions.dataCollectionActions.tag ? (
                                                                                                            <TagCloseButton
                                                                                                                onClick={() =>
                                                                                                                    handleCloseTagButtonClick(
                                                                                                                        dataCollection,
                                                                                                                        tag
                                                                                                                    )
                                                                                                                }
                                                                                                                zIndex={1000}
                                                                                                            />
                                                                                                        ) : null}
                                                                                                    </Tag>
                                                                                                );
                                                                                            })}
                                                                                        </Td>
                                                                                    ) : null}
                                                                                </Tr>
                                                                            );
                                                                        })}
                                                                    </Tbody>
                                                                </Table>
                                                            </TableContainer>
                                                        ) : (
                                                            <Box mt={'30px'}>
                                                                <Center>
                                                                    <Text>{'There are currently no views in your dashboard.'}</Text>
                                                                </Center>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ) : null}
                                            </TabPanel>
                                        ) : null}
                                    </TabPanels>
                                </Tabs>
                            ) : (
                                <Center>
                                    <Text>Contact your system administrator for access.</Text>
                                </Center>
                            )}
                        </Container>
                    </Flex>
                </Box>
            </CardBody>
        </Card>
    );
};

export default ViewList;
