import {
    Box,
    Button,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
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
} from "@chakra-ui/react";

import "./styles.css";
import SideBarLayout from "../../components/Layouts/SideBarLayout";
import LinkItems from "../../utils/linkItems";
import { IconContext } from "react-icons";
import { FaRegFileAlt, FaRegFileExcel } from "react-icons/fa";
import {
    useDeleteTagMutation,
    useGetDocumentsQuery,
    useGetOneWorkspaceQuery,
    useTagExistsMutation,
    useUpdateDocumentMutation,
    useUpdateWorkspaceMutation,
} from "../../app/services/api";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaRegImage } from "react-icons/fa";
import UpdateModal from "./UpdateModal";
import { TDocument, TTag } from "../../types";
import TagsModal from "../tags/TagsModal";
import { Link } from "react-router-dom";
import UploadModal from "./UploadModal";
import DocDrawer from "./DocDrawer";
import DeleteFileAlert from "./DeleteFileAlert";
import UpdateFileModal from "./UpdateFileModal";

const View = () => {
    const { data: documents } = useGetDocumentsQuery(null);
    const { data: workspace, isFetching } = useGetOneWorkspaceQuery(localStorage.getItem("workspaceId") || "");

    const [updateDocument] = useUpdateDocumentMutation();

    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const getIcon = (type: string) => {
        if (type === "jpg" || type === "png" || type === "jpeg") return <FaRegImage color={"rgb(123, 128, 154)"} />;
        if (type === "xlsx") return <FaRegFileExcel color={"rgb(123, 128, 154)"} />;
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
        <SideBarLayout linkItems={LinkItems}>
            <Box>
                {/* <Flex
                    minH={"100vh"}
                    // justify={"center"}
                    bg={"#eff2f5"}
                > */}
                <Container maxW={"full"} mt={{ base: 4, sm: 0 }}>
                    <Box mb={{ base: "15px" }}>
                        <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                            <>
                                {!isFetching ? (
                                    <>
                                        <Link to={`/workspaces/${localStorage.getItem("workspaceId")}`}>
                                            <Text
                                                display={"inline"}
                                                textDecor={"underline"}
                                            >{`${workspace?.name}`}</Text>
                                        </Link>

                                        <Text display={"inline"}>{" / Documents"}</Text>
                                    </>
                                ) : null}
                            </>
                        </Heading>
                        <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                            Upload files or create them with a Rich-Text editor.
                        </Text>
                    </Box>

                    <Flex>
                        <Spacer />
                        <Card w={"150px"}>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    bgColor={"white"}
                                    color={"rgb(123, 128, 154)"}
                                    rightIcon={<ChevronDownIcon />}
                                >
                                    Actions
                                </MenuButton>
                                <MenuList>
                                    <UploadModal documents={documents || []} />
                                    <DocDrawer />
                                </MenuList>
                            </Menu>
                        </Card>
                    </Flex>
                    <Card mt={"10px"}>
                        <CardBody>
                            {documents?.length || 0 > 0 ? (
                                <TableContainer>
                                    <Table size={"sm"} style={{ tableLayout: "fixed" }}>
                                        <Thead>
                                            <Tr>
                                                <Th width={"300px"}>Filename</Th>
                                                <Th width={"180px"}>Uploaded by</Th>
                                                <Th width={"180px"}>Size</Th>
                                                <Th width={"100px"}>Actions</Th>
                                                <Th>Tags</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {documents?.map((document, index) => {
                                                return (
                                                    <Tr key={index}>
                                                        <Td>
                                                            <Flex>
                                                                <Box pt={"0px"} mr={"6px"}>
                                                                    <IconContext.Provider value={{ color: "#7b809a" }}>
                                                                        {getIcon(document.ext || "")}
                                                                    </IconContext.Provider>
                                                                </Box>
                                                                {document.type === "upload" ? (
                                                                    <Text
                                                                        color={"rgb(123, 128, 154)"}
                                                                        textOverflow={"ellipsis"}
                                                                        overflow={"hidden"}
                                                                    >
                                                                        <a href={document.url} target="_blank">
                                                                            {document.filename}
                                                                        </a>
                                                                    </Text>
                                                                ) : (
                                                                    <UpdateModal document={document} />
                                                                )}
                                                            </Flex>
                                                        </Td>
                                                        <Td>
                                                            <Text
                                                                color={"rgb(123, 128, 154)"}
                                                                fontSize={"14px"}
                                                            >{`${document.createdBy.firstname} ${document.createdBy.lastname}`}</Text>
                                                        </Td>
                                                        <Td>
                                                            <Text color={"rgb(123, 128, 154)"} fontSize={"14px"}>
                                                                {document.file ? document.file.size : ""}
                                                            </Text>
                                                        </Td>
                                                        <Td>
                                                            <Flex>
                                                                <UpdateFileModal document={document} />
                                                                <DeleteFileAlert document={document} />
                                                            </Flex>
                                                        </Td>

                                                        <Td>
                                                            <Box overflow={"revert"}>
                                                                <Flex>
                                                                    <TagsModal
                                                                        tagType={"document"}
                                                                        data={document}
                                                                        tags={document.tags}
                                                                        update={updateDocument}
                                                                        workspaceId={document?.workspace || ""}
                                                                    />
                                                                    {document.tags !== undefined
                                                                        ? document.tags.map(
                                                                              (tag: TTag, index: number) => {
                                                                                  return (
                                                                                      <>
                                                                                          <WrapItem key={index}>
                                                                                              <Tag
                                                                                                  size={"sm"}
                                                                                                  variant="subtle"
                                                                                                  colorScheme="blue"
                                                                                                  mr={"5px"}
                                                                                                  zIndex={1000}
                                                                                              >
                                                                                                  <TagLabel pb={"2px"}>
                                                                                                      {tag.name}
                                                                                                  </TagLabel>
                                                                                                  <TagCloseButton
                                                                                                      onClick={() =>
                                                                                                          handleCloseTagButtonClick(
                                                                                                              document,
                                                                                                              tag
                                                                                                          )
                                                                                                      }
                                                                                                      zIndex={1000}
                                                                                                  />
                                                                                              </Tag>
                                                                                          </WrapItem>
                                                                                      </>
                                                                                  );
                                                                              }
                                                                          )
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
                                <Text color={"rgb(123, 128, 154)"}>You currently have no uploads.</Text>
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
