import { useGetRowsQuery, useUpdateRowMutation } from '../../app/services/api';

import { Box, Card, CardHeader, Center, Checkbox, Container, Flex, Grid, GridItem, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import DataCollection from './DataCollection';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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
            </Tabs>
        </Box>
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

export const OneDataCollection = ({
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
            return item.dataCollection === dataCollection.appModel || item.dataCollection === dataCollection._id;
        });

        console.log(dcPermissions);

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

export default PlannerApp;
