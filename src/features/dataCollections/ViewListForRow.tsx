import {
    useGetDataCollectionsQuery,
    useGetUserQuery,
    useGetOneWorkspaceQuery,
    useGetDataCollectionViewsQuery,
    useGetUserGroupsQuery,
    useGetRowsQuery,
} from '../../app/services/api';

import { Box, Card, CardBody, Center, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emptyPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';
import DataCollection from './DataCollection';

const ViewListForRow = ({}: { allowed?: boolean }) => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const navigate = useNavigate();
    const { rowId } = useParams();
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data } = useGetDataCollectionsQuery(null);
    const { data: _dataCollectionViews, refetch: refetchViews } = useGetDataCollectionViewsQuery(null);
    const { data: workspace } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');

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
            refetchViews();
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // const handleCloseTagButtonClick = async (dataCollection: TDataCollection, tag: TTag) => {
    //     const { tags } = dataCollection;

    //     // Filter out the tag clicked on from the data collection tags
    //     const filteredTags = tags.filter((item) => {
    //         return tag.name !== item.name;
    //     });

    //     // Create a new data collection with the updated tags
    //     const addNewDataCollection = { ...dataCollection, tags: filteredTags };
    //     // update the data collection and get the updated data collection
    //     await updateDataCollection(addNewDataCollection);
    //     // const updatedDataCollection = updatedDataCollectionRes.data;

    //     let workspaceTags;

    //     if (workspace) {
    //         workspaceTags = workspace.workspaceTags;
    //     }

    //     const thisTagExistsRes: any = await tagExists(tag);

    //     if (!thisTagExistsRes.data.tagExists) {
    //         const filteredWorkspaceTags = workspaceTags?.filter((item: TTag) => {
    //             return item.name !== tag.name;
    //         });
    //         const newUpdatedWorkspace: any = { ...workspace, workspaceTags: filteredWorkspaceTags };

    //         await updateWorkspace(newUpdatedWorkspace);
    //         await deleteTag(tag);
    //     }
    // };

    return (
        <>
            <Box
                cursor={'pointer'}
                my={'12px'}
                pl={'12px'}
                onClick={() => {
                    navigate(-1);
                }}
            >
                <Text>{'< Go back'}</Text>
            </Box>
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
                                        <TabList>{userGroup.permissions.viewActions.view ? <Tab>Dashboard</Tab> : null}</TabList>

                                        <TabPanels>
                                            {userGroup.permissions.viewActions.view ? (
                                                <TabPanel>
                                                    <Box>
                                                        {userGroup.permissions.viewActions.view
                                                            ? dataCollections?.map((dc: any, index: number) => {
                                                                  console.log(dc);
                                                                  console.log(userGroups);
                                                                  console.log(userGroup.permissions);

                                                                  //   const viewPermissions: any = userGroup.permissions.views.find((item: any) => {
                                                                  //       return item.view === dc._id;
                                                                  //   });

                                                                  //   if (viewPermissions !== undefined) {
                                                                  //       if (!viewPermissions.permissions.view.view) {
                                                                  //           return null;
                                                                  //       }
                                                                  //   }

                                                                  console.log(dc);
                                                                  let viewDC = false;
                                                                  const dataCollectionPermissions: any = userGroup.permissions.dataCollections.find(
                                                                      (item: any) => {
                                                                          console.log(item.dataCollection);
                                                                          return item.dataCollection === dc.appModel;
                                                                      }
                                                                  );

                                                                  if (dataCollectionPermissions !== undefined) {
                                                                      for (const permission of dataCollectionPermissions.permissions.columns) {
                                                                          console.log(permission.permissions.column.view);
                                                                          if (permission.permissions.column.view) {
                                                                              viewDC = true;
                                                                          }
                                                                      }
                                                                  }

                                                                  let dataCollection = null;
                                                                  if (dc.inParentToDisplay == rowId) {
                                                                      dataCollection = dc;
                                                                  }
                                                                  return dataCollection !== null && viewDC ? (
                                                                      <Box mt={index === 0 ? '0' : '40px'} key={dataCollection.name}>
                                                                          <Text fontSize={'xl'}>{`${dataCollection.name} ${dataCollection.appType}`}</Text>
                                                                          <OneDataCollection
                                                                              dataCollection={dataCollection}
                                                                              dataCollectionId={dataCollection._id as string}
                                                                              appModel={dataCollection.appModel}
                                                                          />
                                                                      </Box>
                                                                  ) : null;
                                                              })
                                                            : null}
                                                    </Box>
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
        </>
    );
};

const OneDataCollection = ({ dataCollection, dataCollectionId, appModel }: { dataCollection: any; dataCollectionId?: string; appModel: string }) => {
    const {
        data: rowsData,
        // refetch,
        // isFetching: rowsAreFetching,
        // isLoading: rowsAreLoading,
    } = useGetRowsQuery({
        dataCollectionId: dataCollectionId || '',
        limit: 0,
        skip: 0,
        sort: 1,
        sortBy: 'createdAt',
        filters: JSON.stringify(dataCollection.filters),
    });
    useEffect(() => {}, [rowsData]);
    return <DataCollection showDoneRows={true} rowsProp={rowsData} hideEmptyRows={true} dcId={dataCollectionId} appModel={appModel} />;
};

export default ViewListForRow;
