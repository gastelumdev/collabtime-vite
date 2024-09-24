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
import Templates from './Templates';
import CreateDataCollectionView from '../dataCollectionViews/Create';
import View from '../dataCollectionViews/View';

const ViewList = ({ allowed = false }: { allowed?: boolean }) => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data } = useGetDataCollectionsQuery(null);
    const { data: dataCollectionViews } = useGetDataCollectionViewsQuery(null);
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
        console.log(workspace);
        console.log(data);
        permissions;
        getPermissions();

        setDataCollections(data);
    }, [user, workspace, data]);

    useEffect(() => {
        console.log(dataCollectionViews);
    }, [dataCollectionViews]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

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
                            <Tabs>
                                <TabList>
                                    <Tab>Data Collections</Tab>
                                    <Tab>Dashboard</Tab>
                                </TabList>

                                <TabPanels>
                                    <TabPanel>
                                        <Box mt={3}>
                                            {allowed ? (
                                                <Flex h={'50px'} mb={'10px'}>
                                                    <Box>
                                                        <Text fontSize={'20px'}>Data Collections</Text>
                                                    </Box>
                                                    <Spacer />
                                                    <Box pb={'20px'} mr={'10px'}>
                                                        <Templates />
                                                    </Box>
                                                    <Box>
                                                        <Create addNewDataCollection={createDataCollection} />
                                                    </Box>
                                                </Flex>
                                            ) : null}
                                            {dataCollections && dataCollections.length > 0 ? (
                                                <TableContainer>
                                                    <Table size="sm">
                                                        <Thead>
                                                            <Tr>
                                                                {allowed ? <Th></Th> : null}
                                                                <Th color={'#666666'} fontWeight={'semibold'}>
                                                                    Name
                                                                </Th>
                                                                {/* <Th>Description</Th> */}

                                                                <Th color={'#666666'} fontWeight={'semibold'}>
                                                                    Tags
                                                                </Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {data?.map((dataCollection: any, index: number) => {
                                                                return (
                                                                    <Tr key={index}>
                                                                        {allowed ? (
                                                                            <Td w={'120px'} p={0}>
                                                                                <Edit
                                                                                    dataCollection={dataCollection}
                                                                                    updateDataCollection={updateDataCollection}
                                                                                />
                                                                                <Delete
                                                                                    dataCollection={dataCollection}
                                                                                    deleteDataCollection={deleteDataCollection}
                                                                                />
                                                                                <TagsModal
                                                                                    tagType={'dataCollection'}
                                                                                    data={dataCollection}
                                                                                    tags={dataCollection.tags}
                                                                                    update={updateDataCollection}
                                                                                    workspaceId={workspace?._id || ''}
                                                                                />
                                                                            </Td>
                                                                        ) : null}
                                                                        <Td>
                                                                            <Link to={`/workspaces/${workspace?._id}/dataCollections/${dataCollection._id}`}>
                                                                                <Text fontSize={'13px'} color={'#666666'}>
                                                                                    {dataCollection.name}
                                                                                </Text>
                                                                            </Link>
                                                                        </Td>
                                                                        {/* <Td>
                                                        <Text fontSize={'13px'}>{dataCollection.description}</Text>
                                                    </Td> */}

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
                                                                                        {allowed ? (
                                                                                            <TagCloseButton
                                                                                                onClick={() => handleCloseTagButtonClick(dataCollection, tag)}
                                                                                                zIndex={1000}
                                                                                            />
                                                                                        ) : null}
                                                                                    </Tag>
                                                                                );
                                                                            })}
                                                                        </Td>
                                                                    </Tr>
                                                                );
                                                            })}
                                                        </Tbody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Box mt={'30px'}>
                                                    <Center>
                                                        <Text>Create a Data Collection to get started.</Text>
                                                    </Center>
                                                </Box>
                                            )}
                                        </Box>
                                    </TabPanel>
                                    <TabPanel>
                                        <Box mt={3}>
                                            <Flex mb={'10px'}>
                                                {/* <Box>
                                                    <Text fontSize={'20px'}>Views</Text>
                                                </Box> */}
                                                <Spacer />
                                                {allowed ? (
                                                    <Box>
                                                        <CreateDataCollectionView dataCollections={data!} />
                                                    </Box>
                                                ) : null}
                                            </Flex>
                                            {dataCollectionViews?.length < 1 ? (
                                                <Center>
                                                    <Text>Click the add button to create your first view.</Text>
                                                </Center>
                                            ) : null}
                                        </Box>
                                        <Box>
                                            {dataCollectionViews?.map((dcView: any) => {
                                                console.log(dcView);
                                                // return <DataCollection showDoneRows={true}  />>;
                                                return <View dataCollectionView={dcView} />;
                                            })}
                                        </Box>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Container>
                    </Flex>
                </Box>
            </CardBody>
        </Card>
    );
};

export default ViewList;
