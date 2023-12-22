import { useEffect, useRef, useState } from "react";
import {
    useAcknowledgeRowMutation,
    useGetDataCollectionQuery,
    useGetDataCollectionsQuery,
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
    useToast,
} from "@chakra-ui/react";

import LinkItems from "../../utils/linkItems";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import DataCollection from "./DataCollection";
import { useParams, useSearchParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

const ViewOne = () => {
    const { id, dataCollectionId } = useParams();
    const [queryParameters] = useSearchParams();
    const { onClose, onOpen, isOpen } = useDisclosure();
    const toast = useToast();
    const finalRef = useRef<any>(null);

    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || "");
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(
        localStorage.getItem("workspaceId") || ""
    );
    const { data: dataCollections } = useGetDataCollectionsQuery(null);

    const [updateDataCollection] = useUpdateDataCollectionMutation();

    const [acknowledgeRow] = useAcknowledgeRowMutation();

    const [isTemplate, setIsTemplate] = useState<boolean>(false);
    const [templateNameValue, setTemplateNameValue] = useState<string>("");

    const [existingTemplateNames, setExistingTemplateNames] = useState<string[]>([]);
    const [templateExists, setTemplateExists] = useState<boolean>(false);

    useEffect(() => {
        localStorage.setItem("workspaceId", id || "");
        localStorage.setItem("dataCollectionId", dataCollectionId || "");

        const dataCollectionCopy: any = dataCollection;

        if (dataCollectionCopy?.asTemplate !== undefined && dataCollectionCopy?.asTemplate?.active == true) {
            setIsTemplate(true);
        }
    }, [dataCollection]);

    useEffect(() => {
        const templateNames = [];
        for (const dataCollection of dataCollections || []) {
            if (dataCollection.asTemplate !== undefined && dataCollection.asTemplate.active) {
                templateNames.push(dataCollection.asTemplate.name.toLowerCase());
            }
        }
        setExistingTemplateNames(templateNames);
    }, [dataCollections]);

    useEffect(() => {
        const acknowledgedRowId = queryParameters.get("acknowledgedRow");
        if (acknowledgedRowId !== undefined) {
            acknowledgeRow(acknowledgedRowId || "");
        }
    }, []);

    const handleAddAsTemplateClick = () => {
        if (templateNameValue === "") return;
        const dataCollectionCopy: any = dataCollection;
        updateDataCollection({ ...dataCollectionCopy, asTemplate: { active: true, name: templateNameValue } });
        onClose();

        toast({
            title: `Your template has been created.`,
            description: `Click "NEW COLLECTION" in the Data Collections page and select "${templateNameValue}" in the template dropdown to use this template.`,
            status: "info",
            duration: 9000,
            isClosable: true,
        });
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
                <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} size={"2xl"}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create template</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text mb={"30px"}>
                                Creating a template will allow you to create a data collection with the same columns.
                                After naming and creating it, go to create a new data collection and your new template
                                will be available under the template options.
                            </Text>
                            <Text mb={"5px"}>Template Name</Text>
                            <Input
                                value={templateNameValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    if (existingTemplateNames.includes(event.target.value.toLowerCase())) {
                                        setTemplateExists(true);
                                    } else {
                                        setTemplateExists(false);
                                    }
                                    setTemplateNameValue(event.target.value);
                                }}
                            />
                            <Box h={"15px"}>
                                {templateExists ? (
                                    <Text color={"red"}>A template with that name already exists.</Text>
                                ) : null}
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <PrimaryButton onClick={handleAddAsTemplateClick} isDisabled={templateExists}>
                                CREATE
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </SideBarLayout>
        </>
        // </Layout>
    );
};

export default ViewOne;
