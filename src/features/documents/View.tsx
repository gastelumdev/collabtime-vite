import {
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    Spacer,
    Table,
    TableContainer,
    Tag,
    TagCloseButton,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    WrapItem,
} from '@chakra-ui/react';

import './styles.css';
import SideBarLayout from '../../components/Layouts/SideBarLayout';
import linkItems from '../../utils/linkItems';
import { IconContext } from 'react-icons';
import { FaRegFileAlt, FaRegFileExcel } from 'react-icons/fa';
import {
    useDeleteTagMutation,
    useGetDocumentsQuery,
    useGetOneWorkspaceQuery,
    useGetUserGroupsQuery,
    useGetUserQuery,
    useTagExistsMutation,
    useUpdateDocumentMutation,
    useUpdateWorkspaceMutation,
} from '../../app/services/api';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaRegImage } from 'react-icons/fa';
import UpdateModal from './UpdateModal';
import { TDocument, TTag } from '../../types';
import TagsModal from '../tags/TagsModal';
import { Link } from 'react-router-dom';
import UploadModal from './UploadModal';
import DocDrawer from './DocDrawer';
import DeleteFileAlert from './DeleteFileAlert';
import UpdateFileModal from './UpdateFileModal';
import { useEffect, useState } from 'react';
import { bgColor } from '../../utils/colors';
import '../../App.css';
import { emptyPermissions } from '../workspaces/UserGroups';

const View = () => {
    const { data: user } = useGetUserQuery(localStorage.getItem('userId') || '');
    const { data: documents } = useGetDocumentsQuery(null);
    const { data: workspace, isFetching } = useGetOneWorkspaceQuery(localStorage.getItem('workspaceId') || '');

    const [updateDocument] = useUpdateDocumentMutation();

    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [_permissions, setPermissions] = useState<number>();

    const { data: userGroups, refetch } = useGetUserGroupsQuery(null);
    const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });

    useEffect(() => {
        if (userGroups !== undefined) {
            const ug = userGroups?.find((item: any) => {
                return item.users.includes(localStorage.getItem('userId'));
            });
            setUserGroup(ug);
        } else {
            refetch();
        }
    }, [userGroups]);

    useEffect(() => {
        getPermissions();
    }, [user]);

    const [newLinkItems, setNewLinkItems] = useState(linkItems);

    useEffect(() => {
        const newLinkItems = linkItems.map((item) => {
            if (item.name === 'Documents') {
                return { ...item, active: true };
            }
            return { ...item, active: false };
        });

        setNewLinkItems(newLinkItems);
    }, [linkItems]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem('workspaceId')) {
                setPermissions(workspace.permissions);
            }
        }
    };

    const getIcon = (type: string) => {
        if (type === 'jpg' || type === 'png' || type === 'jpeg') return <FaRegImage color={'rgb(123, 128, 154)'} />;
        if (type === 'xlsx') return <FaRegFileExcel color={'rgb(123, 128, 154)'} />;
        return <FaRegFileAlt />;
    };

    const handleCloseTagButtonClick = async (document: TDocument, tag: TTag) => {
        const { tags } = document;

        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        const addNewDocument = { ...document, tags: filteredTags };
        await updateDocument(addNewDocument);

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
        <SideBarLayout linkItems={newLinkItems}>
            <Box mt={'30px'}>
                {/* <Flex
                    minH={"100vh"}
                    // justify={"center"}
                    bg={"#eff2f5"}
                > */}
                <Container maxW={'full'} mt={{ base: 4, sm: 0 }}>
                    <Flex pl={'6px'}>
                        <Box mb={{ base: '15px' }} mt={'4px'}>
                            {/* <Text size={'sm'} mb={'12px'} color={'rgb(52, 71, 103)'}> */}
                            <>
                                {!isFetching ? (
                                    <>
                                        <Link to={`/workspaces/${localStorage.getItem('workspaceId')}`}>
                                            <Text
                                                display={'inline'}
                                                // textDecor={'underline'}
                                                color={bgColor}
                                                fontWeight={'bold'}
                                                fontSize={'20px'}
                                                className="dmsans-600"
                                            >{`${workspace?.name}`}</Text>
                                        </Link>

                                        <Text display={'inline'} color={bgColor} fontSize={'20px'} fontWeight={'bold'} className="dmsans-600">
                                            {' / Documents'}
                                        </Text>
                                    </>
                                ) : null}
                            </>
                            {/* </Text> */}
                        </Box>

                        {userGroup.permissions.docs.create ? (
                            <>
                                <Spacer />
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        bgColor={'#24a2f0'}
                                        color={'white'}
                                        rightIcon={<ChevronDownIcon />}
                                        size={'sm'}
                                        _hover={{ backgroundColor: '#24a2f0' }}
                                    >
                                        Actions
                                    </MenuButton>
                                    <MenuList zIndex={2000}>
                                        <UploadModal documents={documents || []} />
                                        <DocDrawer />
                                    </MenuList>
                                </Menu>
                            </>
                        ) : null}
                    </Flex>
                    <Card mt={'10px'}>
                        <CardBody>
                            {documents?.length || 0 > 0 ? (
                                <>
                                    {userGroup.permissions.docs.view ? (
                                        <TableContainer>
                                            <Table size={'sm'} style={{ tableLayout: 'fixed' }} gridTemplateColumns={'300px 180px 180px 100px 100px'}>
                                                <Thead>
                                                    <Tr>
                                                        <Th width={'300px'} color={'#666666'} fontWeight={'semibold'}>
                                                            Filename
                                                        </Th>
                                                        <Th width={'180px'} color={'#666666'} fontWeight={'semibold'}>
                                                            Uploaded by
                                                        </Th>
                                                        <Th width={'180px'} color={'#666666'} fontWeight={'semibold'}>
                                                            Size
                                                        </Th>
                                                        {userGroup.permissions.docs.update || userGroup.permissions.docs.delete ? (
                                                            <Th width={'100px'} color={'#666666'} fontWeight={'semibold'}>
                                                                Actions
                                                            </Th>
                                                        ) : null}
                                                        <Th color={'#666666'} fontWeight={'semibold'}>
                                                            Tags
                                                        </Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {documents?.map((document, index) => {
                                                        return (
                                                            <Tr key={index}>
                                                                <Td>
                                                                    <Flex>
                                                                        <Box pt={'0px'} mr={'6px'}>
                                                                            <IconContext.Provider value={{ color: '#7b809a' }}>
                                                                                {getIcon(document.ext || '')}
                                                                            </IconContext.Provider>
                                                                        </Box>
                                                                        {document.type === 'upload' ? (
                                                                            <Text
                                                                                color={'#666666'}
                                                                                textOverflow={'ellipsis'}
                                                                                overflow={'hidden'}
                                                                                fontSize={'13px'}
                                                                            >
                                                                                <a href={document.url} target="_blank">
                                                                                    {document.filename}
                                                                                </a>
                                                                            </Text>
                                                                        ) : (
                                                                            <UpdateModal document={document} permissions={userGroup.permissions.docs} />
                                                                        )}
                                                                    </Flex>
                                                                </Td>
                                                                <Td>
                                                                    <Text
                                                                        color={'#666666'}
                                                                        fontSize={'13px'}
                                                                    >{`${document.createdBy.firstname} ${document.createdBy.lastname}`}</Text>
                                                                </Td>
                                                                <Td>
                                                                    <Text color={'#666666'} fontSize={'13px'}>
                                                                        {document.file ? document.file.size : ''}
                                                                    </Text>
                                                                </Td>
                                                                {userGroup.permissions.docs.update || userGroup.permissions.docs.delete ? (
                                                                    <Td>
                                                                        <Flex>
                                                                            {userGroup.permissions.docs.update ? (
                                                                                <UpdateFileModal document={document} documents={documents} />
                                                                            ) : null}
                                                                            {userGroup.permissions.docs.delete ? <DeleteFileAlert document={document} /> : null}
                                                                        </Flex>
                                                                    </Td>
                                                                ) : null}

                                                                <Td>
                                                                    <Box overflow={'revert'}>
                                                                        <Flex>
                                                                            {userGroup.permissions.docs.tag ? (
                                                                                <Box mr={'10px'}>
                                                                                    <TagsModal
                                                                                        tagType={'document'}
                                                                                        data={document}
                                                                                        tags={document.tags}
                                                                                        update={updateDocument}
                                                                                        workspaceId={document?.workspace || ''}
                                                                                    />
                                                                                </Box>
                                                                            ) : null}
                                                                            {document.tags !== undefined
                                                                                ? document.tags.map((tag: TTag, index: number) => {
                                                                                      return (
                                                                                          <WrapItem key={index}>
                                                                                              <Tag
                                                                                                  size={'sm'}
                                                                                                  variant="subtle"
                                                                                                  //   colorScheme="blue"
                                                                                                  bgColor={'#24a2f0'}
                                                                                                  color={'white'}
                                                                                                  mr={'5px'}
                                                                                                  zIndex={1000}
                                                                                              >
                                                                                                  <TagLabel pb={'2px'}>{tag.name}</TagLabel>
                                                                                                  <TagCloseButton
                                                                                                      onClick={() => handleCloseTagButtonClick(document, tag)}
                                                                                                      zIndex={1000}
                                                                                                  />
                                                                                              </Tag>
                                                                                          </WrapItem>
                                                                                      );
                                                                                  })
                                                                                : null}
                                                                        </Flex>
                                                                    </Box>
                                                                </Td>
                                                            </Tr>
                                                        );
                                                    })}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    ) : (
                                        <Text color={'rgb(123, 128, 154)'}>You don't have access to view documents.</Text>
                                    )}
                                </>
                            ) : (
                                <Text color={'rgb(123, 128, 154)'}>You currently have no uploads.</Text>
                            )}
                        </CardBody>
                    </Card>
                </Container>
                {/* </Flex> */}
            </Box>
        </SideBarLayout>
        // </Layout>
    );
};

export default View;
