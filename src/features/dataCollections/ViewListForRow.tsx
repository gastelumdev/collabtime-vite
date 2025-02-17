import {
    useGetDataCollectionsQuery,
    useGetUserQuery,
    useGetOneWorkspaceQuery,
    useGetDataCollectionViewsQuery,
    useGetUserGroupsQuery,
    useGetRowByIdQuery,
} from '../../app/services/api';

import { Box, Card, CardBody, Center, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emptyPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';
import PlannerApp from './apps/PlannerApp';
import FilteredApp from './apps/FilteredApp';
import ResourcePlanningApp from './apps/ResourcePlanningApp';
import MainApp from './apps/MainApp';

const ViewListForRow = ({}: { allowed?: boolean }) => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const navigate = useNavigate();
    const { rowId } = useParams();
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data } = useGetDataCollectionsQuery(null);
    const { data: _dataCollectionViews, refetch: refetchViews } = useGetDataCollectionViewsQuery(null);
    const { data: workspace } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');
    const { data: row, refetch: refetchRow } = useGetRowByIdQuery(rowId);

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
                    <Box px={'20px'}>
                        <Flex>
                            <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                                {userGroup.permissions.dataCollectionActions.view || userGroup.permissions.viewActions.view ? (
                                    <>
                                        {userGroup.permissions.viewActions.view ? (
                                            <>
                                                <Tabs>
                                                    <TabList>
                                                        <Tab>Details</Tab>
                                                        <Tab>Planner</Tab>
                                                        {userGroup.permissions.viewActions.view
                                                            ? dataCollections?.map((dc: any) => {
                                                                  let viewDC = false;
                                                                  const dataCollectionPermissions: any = userGroup.permissions.dataCollections.find(
                                                                      (item: any) => {
                                                                          return item.dataCollection === dc.appModel || item.dataCollection === dc._id;
                                                                      }
                                                                  );
                                                                  if (dataCollectionPermissions !== undefined) {
                                                                      for (const permission of dataCollectionPermissions.permissions.columns) {
                                                                          if (permission.permissions.column.view) {
                                                                              viewDC = true;
                                                                          }
                                                                      }
                                                                  }

                                                                  let dataCollection = null;
                                                                  if (dc.inParentToDisplay == rowId || dc.template == 'filtered') {
                                                                      dataCollection = dc;
                                                                  }

                                                                  //   if (dataCollection !== null && viewDC) {
                                                                  //       if (dataCollection.template == 'planner') {
                                                                  //           return <Tab>Planner</Tab>;
                                                                  //       }

                                                                  //       if (dataCollection.template == 'filtered') {
                                                                  //           return <Tab>Filtered</Tab>;
                                                                  //       }
                                                                  //   }
                                                                  if (workspace?.type === 'resource planning' && dc?._id === row?.dataCollection) {
                                                                      return <Tab>Resource Planning</Tab>;
                                                                  }
                                                                  return null;
                                                              })
                                                            : null}
                                                    </TabList>
                                                    <TabPanels>
                                                        {userGroup.permissions.viewActions.view
                                                            ? dataCollections?.map((dc: any) => {
                                                                  if (dc?._id === row?.dataCollection) {
                                                                      return (
                                                                          <TabPanel key={dc?._id}>
                                                                              <MainApp
                                                                                  row={row}
                                                                                  values={row.values}
                                                                                  dataCollection={dc}
                                                                                  refetchRow={refetchRow}
                                                                              />
                                                                          </TabPanel>
                                                                      );
                                                                  }
                                                                  if (dc?.name === 'Planner Tasks') {
                                                                      return (
                                                                          <TabPanel key={dc?._id}>
                                                                              <PlannerApp
                                                                                  key={dc._id}
                                                                                  dataCollection={dc}
                                                                                  dataCollectionId={dc?._id as string}
                                                                                  appModel={dc.appModel}
                                                                                  userGroup={userGroup}
                                                                              />
                                                                          </TabPanel>
                                                                      );
                                                                  }
                                                                  return null;
                                                              })
                                                            : null}
                                                        {userGroup.permissions.viewActions.view
                                                            ? dataCollections?.map((dc: any) => {
                                                                  let viewDC = false;
                                                                  const dataCollectionPermissions: any = userGroup.permissions.dataCollections.find(
                                                                      (item: any) => {
                                                                          return item.dataCollection === dc.appModel || item.dataCollection === dc._id;
                                                                      }
                                                                  );
                                                                  if (dataCollectionPermissions !== undefined) {
                                                                      for (const permission of dataCollectionPermissions.permissions.columns) {
                                                                          if (permission.permissions.column.view) {
                                                                              viewDC = true;
                                                                          }
                                                                      }
                                                                  }

                                                                  let dataCollection = null;
                                                                  if (dc.inParentToDisplay == rowId || dc.template == 'filtered') {
                                                                      dataCollection = dc;
                                                                  }

                                                                  if (dataCollection !== null && viewDC) {
                                                                      //   if (dataCollection.template == 'planner') {
                                                                      //       return (
                                                                      //           <TabPanel>
                                                                      //               <PlannerApp
                                                                      //                   key={dc._id}
                                                                      //                   dataCollection={dataCollection}
                                                                      //                   dataCollectionId={dataCollection._id as string}
                                                                      //                   appModel={dataCollection.appModel}
                                                                      //                   userGroup={userGroup}
                                                                      //               />
                                                                      //           </TabPanel>
                                                                      //       );
                                                                      //   }

                                                                      if (dataCollection.template == 'filtered') {
                                                                          return (
                                                                              <TabPanel>
                                                                                  <FilteredApp
                                                                                      key={dc._id}
                                                                                      dataCollection={dataCollection}
                                                                                      dataCollectionId={dataCollection._id as string}
                                                                                      appModel={dataCollection.appModel}
                                                                                      userGroup={userGroup}
                                                                                  />
                                                                              </TabPanel>
                                                                          );
                                                                      }
                                                                  }
                                                                  if (workspace?.type === 'resource planning' && dc?._id === row?.dataCollection) {
                                                                      return (
                                                                          <TabPanel>
                                                                              <ResourcePlanningApp
                                                                                  key={dc._id}
                                                                                  project={row}
                                                                                  values={row.values}
                                                                                  dataCollection={dc}
                                                                                  refetchProject={refetchRow}
                                                                              />
                                                                          </TabPanel>
                                                                      );
                                                                  }
                                                                  return null;
                                                              })
                                                            : null}
                                                    </TabPanels>
                                                </Tabs>
                                            </>
                                        ) : null}
                                    </>
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

export default ViewListForRow;
