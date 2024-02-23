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
} from '../../app/services/api';

import { Box, Container, Flex, Heading, SimpleGrid, Spacer, Text } from '@chakra-ui/react';
import SideBarLayout from '../../components/Layouts/SideBarLayout';

import LinkItems from '../../utils/linkItems';
import Edit from './Edit';
import Create from './Create';
import { useEffect, useState } from 'react';
import PrimaryCard from '../../components/PrimaryCard';
import TagsModal from '../tags/TagsModal';
import { TDataCollection, TTag } from '../../types';
import { Link } from 'react-router-dom';
import Delete from './Delete';
import Templates from './Templates';

const View = () => {
    // const [data, setData] = useState<TDataCollection[]>(dataCollections);
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data } = useGetDataCollectionsQuery(null);
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');
    const [createDataCollection] = useCreateDataCollecionMutation();
    const [updateDataCollection] = useUpdateDataCollectionMutation();
    const [deleteDataCollection] = useDeleteDataCollectionMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

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
        <SideBarLayout linkItems={LinkItems}>
            <Box>
                <Flex
                    minH={'100vh'}
                    // justify={"center"}
                    bg={'#eff2f5'}
                >
                    <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                        <SimpleGrid
                            spacing={6}
                            // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                            columns={{ base: 1, sm: 2 }}
                            pb={'50px'}
                        >
                            <Flex>
                                <Box>
                                    <Heading size={'sm'} mb={'12px'} color={'rgb(52, 71, 103)'}>
                                        {!workspaceIsFetching ? (
                                            <>
                                                <Link to={`/workspaces/${localStorage.getItem('workspaceId')}`}>
                                                    <Text display={'inline'} textDecor={'underline'}>{`${workspace?.name}`}</Text>
                                                </Link>{' '}
                                                <Text display={'inline'}>{' / Data Collections'}</Text>
                                            </>
                                        ) : null}
                                    </Heading>
                                    <Text color={'rgb(123, 128, 154)'} fontSize={'md'} fontWeight={300}>
                                        Create data collection tables to visualize and manage your data.
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex>
                                <Spacer />
                                <Box pb={'20px'} mr={'10px'}>
                                    <Templates />
                                </Box>
                                <Box pb={'20px'}>
                                    <Create addNewDataCollection={createDataCollection} />
                                </Box>
                            </Flex>
                        </SimpleGrid>

                        <SimpleGrid
                            spacing={4}
                            // templateColumns="repeat(3, minmax(300px, 1fr))"
                            columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
                        >
                            {data?.map((dataCollection, index) => {
                                return (
                                    <Box key={index}>
                                        <PrimaryCard
                                            index={index}
                                            data={dataCollection}
                                            redirectUrl={`/workspaces/${workspace?._id}/dataCollections/${dataCollection._id}`}
                                            localStorageId="dataCollectionId"
                                            divider={(permissions || 0) > 1}
                                            editButton={
                                                (permissions || 0) > 1 ? (
                                                    <Edit dataCollection={dataCollection} updateDataCollection={updateDataCollection} />
                                                ) : null
                                            }
                                            deleteButton={
                                                (permissions || 0) > 1 ? (
                                                    <Delete dataCollection={dataCollection} deleteDataCollection={deleteDataCollection} />
                                                ) : null
                                            }
                                            tagButton={
                                                (permissions || 0) > 1 ? (
                                                    <TagsModal
                                                        tagType={'dataCollection'}
                                                        data={dataCollection}
                                                        tags={dataCollection.tags}
                                                        update={updateDataCollection}
                                                        workspaceId={workspace?._id || ''}
                                                    />
                                                ) : null
                                            }
                                            handleCloseTagButtonClick={handleCloseTagButtonClick}
                                        />
                                    </Box>
                                );
                            })}
                        </SimpleGrid>
                    </Container>
                </Flex>
            </Box>
        </SideBarLayout>
        // </Layout>
    );
};

export default View;
