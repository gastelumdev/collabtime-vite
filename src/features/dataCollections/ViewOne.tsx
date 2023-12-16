import { useEffect, useRef, useState } from "react";
import {
    useGetDataCollectionQuery,
    useGetOneWorkspaceQuery,
    useUpdateDataCollectionMutation,
} from "../../app/services/api";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Container,
    Flex,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useDisclosure,
} from "@chakra-ui/react";

import LinkItems from "../../utils/linkItems";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import DataCollection from "./DataCollection";
import { useParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

const ViewOne = () => {
    const { id, dataCollectionId } = useParams();
    const { onClose, onOpen, isOpen } = useDisclosure();
    const finalRef = useRef<any>(null);

    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || "");
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(
        localStorage.getItem("workspaceId") || ""
    );

    const [updateDataCollection] = useUpdateDataCollectionMutation();

    const [isTemplate, setIsTemplate] = useState<boolean>(false);
    const [templateNameValue, setTemplateNameValue] = useState<string>("");

    useEffect(() => {
        localStorage.setItem("workspaceId", id || "");
        localStorage.setItem("dataCollectionId", dataCollectionId || "");

        if (dataCollection?.asTemplate !== undefined) {
            setIsTemplate(true);
        }
    }, [dataCollection]);

    const handleAddAsTemplateClick = () => {
        const dataCollectionCopy: any = dataCollection;
        updateDataCollection({ ...dataCollectionCopy, asTemplate: { active: true, name: templateNameValue } });
        onClose();
    };

    return (
        <>
            <SideBarLayout linkItems={LinkItems}>
                <Box>
                    <Flex
                        minH={"100vh"}
                        // justify={"center"}
                        bg={"#eff2f5"}
                    >
                        <Container
                            maxW={"full"}
                            // w={"100%"}
                            mt={{ base: 4, sm: 0 }}
                            px={"20px"}
                        >
                            {/* <SimpleGrid
                                spacing={6}
                                // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                                columns={{ base: 1, sm: 2 }}
                                pb={"30px"}
                            >
                                <Flex>
                                    <Box>
                                        <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                            Data Collections
                                        </Heading>
                                        <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                            Create data collection tables to visualize and manage your data.
                                        </Text>
                                    </Box>
                                </Flex>
                            </SimpleGrid> */}
                            <Card mb={"60px"} w={"100%"}>
                                <CardHeader>
                                    <Flex>
                                        <Box>
                                            <Heading size={"sm"} mt={"5px"} mb={"4px"}>
                                                {!workspaceIsFetching
                                                    ? `${workspace?.name} - ${dataCollection?.name}`
                                                    : null}
                                            </Heading>
                                            <Text fontSize={"md"} color={"rgb(123, 128, 154)"}>
                                                {dataCollection?.description}
                                            </Text>
                                        </Box>
                                        <Spacer />
                                        {!isTemplate ? <PrimaryButton onClick={onOpen}>TEMPLATE</PrimaryButton> : null}
                                    </Flex>
                                </CardHeader>
                                <CardBody pt={"0"}>
                                    <DataCollection />
                                </CardBody>
                            </Card>

                            {/* </SimpleGrid> */}
                        </Container>
                    </Flex>
                </Box>
                <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create template</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Input
                                value={templateNameValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                    setTemplateNameValue(event.target.value)
                                }
                            />
                        </ModalBody>

                        <ModalFooter>
                            <PrimaryButton onClick={handleAddAsTemplateClick}>CREATE</PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </SideBarLayout>
        </>
        // </Layout>
    );
};

export default ViewOne;
