import {
    useGetDataCollectionsQuery,
    useGetUserQuery,
    useGetOneWorkspaceQuery,
    useGetDataCollectionViewsQuery,
    useGetUserGroupsQuery,
    useGetRowsQuery,
    useUpdateRowMutation,
} from '../../app/services/api';

import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Center,
    Checkbox,
    Container,
    Flex,
    Grid,
    GridItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { emptyPermissions } from '../workspaces/UserGroups';
import { io } from 'socket.io-client';
import DataCollection from './DataCollection';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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
                                            <Box>
                                                {userGroup.permissions.viewActions.view
                                                    ? dataCollections?.map((dc: any) => {
                                                          let viewDC = false;
                                                          const dataCollectionPermissions: any = userGroup.permissions.dataCollections.find((item: any) => {
                                                              return item.dataCollection === dc.appModel;
                                                          });

                                                          if (dataCollectionPermissions !== undefined) {
                                                              for (const permission of dataCollectionPermissions.permissions.columns) {
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
                                                              <Box key={dataCollection.name} mb={'30px'}>
                                                                  <Text fontSize={'xl'}>{`${dataCollection.name} ${dataCollection.appType}`}</Text>
                                                                  <Tabs
                                                                      onChange={() => {
                                                                          setTimeout(function () {
                                                                              window.dispatchEvent(new Event('resize'));
                                                                          }, 1);
                                                                      }}
                                                                  >
                                                                      <TabList>
                                                                          <Tab>Grid</Tab>
                                                                          <Tab>List</Tab>
                                                                          <Tab>Calendar</Tab>
                                                                      </TabList>
                                                                      {/* <TabPanels>
                                                                          <TabPanel>
                                                                              <Box>
                                                                                  <PlannerBoard
                                                                                      dataCollection={dataCollection}
                                                                                      dataCollectionId={dataCollection._id as string}
                                                                                      appModel={dataCollection.appModel}
                                                                                      userGroup={userGroup}
                                                                                  />
                                                                              </Box>
                                                                          </TabPanel>
                                                                          <TabPanel>
                                                                              <Box>
                                                                                  <OneDataCollection
                                                                                      dataCollection={dataCollection}
                                                                                      dataCollectionId={dataCollection._id as string}
                                                                                      appModel={dataCollection.appModel}
                                                                                      userGroup={userGroup}
                                                                                  />
                                                                              </Box>
                                                                          </TabPanel>
                                                                      </TabPanels> */}
                                                                      <PlannerApp
                                                                          dataCollection={dataCollection}
                                                                          dataCollectionId={dataCollection._id as string}
                                                                          appModel={dataCollection.appModel}
                                                                          userGroup={userGroup}
                                                                      />
                                                                  </Tabs>
                                                              </Box>
                                                          ) : null;
                                                      })
                                                    : null}
                                            </Box>
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

function renderEventContent(eventInfo: any) {
    return (
        <Box pl={'6px'} overflow={'hidden'}>
            <Flex>
                <Box mr={'7px'}>
                    <Text fontWeight={'bold'}>{eventInfo.timeText}</Text>
                </Box>
                <Box>
                    <Text>{eventInfo.event.title}</Text>
                </Box>
            </Flex>
        </Box>
    );
}

// const events = [
//     {
//         id: 0,
//         title: 'Project 1',
//         allDay: true,
//         start: new Date(2024, 10, 0),
//         end: new Date(2024, 10, 7),
//     },
//     {
//         id: 1,
//         title: 'Project 1',
//         allDay: true,
//         start: new Date(2024, 10, 0),
//         end: null,
//     },

//     {
//         id: 2,
//         title: 'DTS STARTS',
//         start: new Date(2016, 2, 13, 0, 0, 0),
//         end: new Date(2016, 2, 20, 0, 0, 0),
//     },

//     {
//         id: 3,
//         title: 'DTS ENDS',
//         start: new Date(2016, 10, 6, 0, 0, 0),
//         end: new Date(2016, 10, 13, 0, 0, 0),
//     },
// ];

const PlannerApp = ({
    dataCollection,
    dataCollectionId,
    // appModel,
    userGroup,
}: {
    dataCollection: any;
    dataCollectionId?: string;
    appModel: string;
    userGroup: any;
}) => {
    const {
        data: rowsData,
        refetch,
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
    useEffect(() => {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 1000);
    }, [rowsData]);
    return (
        <TabPanels>
            <TabPanel>
                <Box>
                    <PlannerBoard
                        dataCollection={dataCollection}
                        dataCollectionId={dataCollection._id as string}
                        appModel={dataCollection.appModel}
                        userGroup={userGroup}
                        rowsData={rowsData}
                        refetchRowsForApp={refetch}
                    />
                </Box>
            </TabPanel>
            <TabPanel>
                <Box>
                    <OneDataCollection
                        dataCollection={dataCollection}
                        dataCollectionId={dataCollection._id as string}
                        appModel={dataCollection.appModel}
                        userGroup={userGroup}
                        rowsData={rowsData}
                        refetchRowsForApp={refetch}
                    />
                </Box>
            </TabPanel>
            <TabPanel>
                <Box>
                    <Container maxW={'6xl'}>
                        <CalendarPanel
                            dataCollection={dataCollection}
                            dataCollectionId={dataCollection._id as string}
                            appModel={dataCollection.appModel}
                            userGroup={userGroup}
                            rowsData={rowsData}
                            refetchRowsForApp={refetch}
                        />
                    </Container>
                </Box>
            </TabPanel>
        </TabPanels>
    );
};

const PlannerBoard = ({
    // dataCollection,
    // dataCollectionId,
    // appModel,
    // userGroup,
    rowsData,
    refetchRowsForApp,
}: {
    dataCollection: any;
    dataCollectionId?: string;
    appModel: string;
    userGroup: any;
    rowsData: any;
    refetchRowsForApp: any;
}) => {
    // const {
    //     data: rowsData,
    //     // refetch,
    //     // isFetching: rowsAreFetching,
    //     // isLoading: rowsAreLoading,
    // } = useGetRowsQuery({
    //     dataCollectionId: dataCollectionId || '',
    //     limit: 0,
    //     skip: 0,
    //     sort: 1,
    //     sortBy: 'createdAt',
    //     filters: JSON.stringify(dataCollection.filters),
    // });

    const bucketNames = ['Initiation Todos', 'Engineering and Design', 'Ops', 'Job Closeout'];

    const [updateRow] = useUpdateRowMutation();

    const BucketGridItem = ({ bucketName }: { bucketName: string }) => {
        return (
            <GridItem rowSpan={1} colSpan={1} mx={'10px'}>
                <Center>
                    <Text mb={'20px'}>{bucketName}</Text>
                </Center>

                {rowsData?.map((row: any) => {
                    if (row.values['bucket'] === undefined || row.values['bucket'] !== bucketName) return null;
                    if (row.values['status'] === 'Completed') return null;

                    return (
                        <Card key={row._id} mb={'10px'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}>
                            <CardHeader>
                                <Checkbox
                                    fontSize={'14px'}
                                    isChecked={row.values['status'] === 'Completed'}
                                    onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                        console.log(event.target.checked);
                                        if (event.target.checked) {
                                            await updateRow({ ...row, values: { ...row.values, status: 'Completed' } });
                                        } else {
                                            await updateRow({ ...row, values: { ...row.values, status: 'In progress' } });
                                        }
                                        refetchRowsForApp();
                                    }}
                                >
                                    {row.values['todo']}
                                </Checkbox>
                            </CardHeader>
                        </Card>
                    );
                })}
                {rowsData?.find((item: any) => {
                    return item.values['status'] === 'Completed' && item.values['bucket'] === bucketName;
                }) !== undefined ? (
                    <Box mt={'20px'}>
                        <Box flex="1" textAlign="left" mb={'10px'}>
                            <Text fontSize={'16px'}>Completed</Text>
                        </Box>
                        <Box>
                            {rowsData?.map((row: any) => {
                                if (row.values['bucket'] === undefined || row.values['bucket'] !== bucketName) return null;
                                if (row.values['status'] !== 'Completed') return null;

                                return (
                                    <Card key={row._id} mb={'10px'} boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}>
                                        <CardHeader>
                                            <Checkbox
                                                fontSize={'14px'}
                                                isChecked={row.values['status'] === 'Completed'}
                                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                                    console.log(event.target.checked);
                                                    if (event.target.checked) {
                                                        await updateRow({ ...row, values: { ...row.values, status: 'Completed' } });
                                                    } else {
                                                        await updateRow({ ...row, values: { ...row.values, status: 'In progress' } });
                                                    }
                                                    refetchRowsForApp();
                                                }}
                                            >
                                                {row.values['todo']}
                                            </Checkbox>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </Box>
                    </Box>
                ) : null}
            </GridItem>
        );
    };

    return (
        <>
            <Grid templateRows={'repeat(1, 1fr)'} templateColumns={'repeat(4, 1fr)'}>
                {bucketNames.map((bucketName: string) => {
                    return <BucketGridItem key={bucketName} bucketName={bucketName} />;
                })}
            </Grid>
        </>
    );
};

const OneDataCollection = ({
    dataCollection,
    dataCollectionId,
    appModel,
    userGroup,
    rowsData,
    refetchRowsForApp,
}: {
    dataCollection: any;
    dataCollectionId?: string;
    appModel: string;
    userGroup: any;
    rowsData: any;
    refetchRowsForApp: any;
}) => {
    // const {
    //     data: rowsData,
    //     // refetch,
    //     // isFetching: rowsAreFetching,
    //     // isLoading: rowsAreLoading,
    // } = useGetRowsQuery({
    //     dataCollectionId: dataCollectionId || '',
    //     limit: 0,
    //     skip: 0,
    //     sort: 1,
    //     sortBy: 'createdAt',
    //     filters: JSON.stringify(dataCollection.filters),
    // });

    const [dataCollectionPermissions, setDataCollectionPermissions] = useState(null);

    useEffect(() => {
        const dcPermissions = userGroup.permissions.dataCollections.find((item: any) => {
            return item.dataCollection === dataCollection.appModel;
        });

        setDataCollectionPermissions(dcPermissions.permissions);
    }, [rowsData, userGroup]);
    return (
        <DataCollection
            showDoneRows={true}
            rowsProp={rowsData}
            hideEmptyRows={true}
            dcId={dataCollectionId}
            appModel={appModel}
            dataCollectionPermissions={dataCollectionPermissions}
            refetchRowsForApp={refetchRowsForApp}
        />
    );
};

const CalendarPanel = ({
    rowsData,
}: {
    dataCollection: any;
    dataCollectionId?: string;
    appModel: string;
    userGroup: any;
    rowsData: any;
    refetchRowsForApp: any;
}) => {
    useEffect(() => {
        setTimeout(function () {
            window.dispatchEvent(new Event('resize'));
        }, 1000);
    }, [rowsData]);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (rowsData !== undefined) {
            setEvents(
                rowsData.map((row: any) => {
                    return { title: row.values['todo'], start: row.values['start_date'], end: row.values['due_date'] };
                })
            );
        }
    }, [rowsData]);
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            // dateClick={(e) => handleDateClick(e)}
            events={events}
            eventContent={renderEventContent}
            headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay', // user can switch between the two
            }}
        />
    );
};

export default ViewListForRow;
