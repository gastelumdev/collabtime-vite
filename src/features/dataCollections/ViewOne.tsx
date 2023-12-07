import { useEffect } from "react";
import { useGetDataCollectionQuery, useGetOneWorkspaceQuery } from "../../app/services/api";
import { Box, Card, CardBody, CardHeader, Container, Flex, Heading, Spacer, Text } from "@chakra-ui/react";

import LinkItems from "../../utils/linkItems";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import DataCollection from "./DataCollection";
import { useParams } from "react-router-dom";

const ViewOne = () => {
    const { id, dataCollectionId } = useParams();

    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || "");
    const { data: workspace, isFetching: workspaceIsFetching } = useGetOneWorkspaceQuery(
        localStorage.getItem("workspaceId") || ""
    );

    useEffect(() => {
        localStorage.setItem("workspaceId", id || "");
        localStorage.setItem("dataCollectionId", dataCollectionId || "");
    });

    return (
        <>
            <SideBarLayout linkItems={LinkItems}>
                <Box>
                    <Flex
                        minH={"100vh"}
                        // justify={"center"}
                        bg={"#eff2f5"}
                    >
                        <Container maxW={"8xl"} mt={{ base: 4, sm: 0 }}>
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
                            <Card mb={"60px"}>
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
            </SideBarLayout>
        </>
        // </Layout>
    );
};

export default ViewOne;
