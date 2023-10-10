import { Box, Container, Stack, Text } from "@chakra-ui/react";
import Nav from "./Nav";
import { useColorModeValue } from "@chakra-ui/react";

interface IProps {
    title?: string;
    description?: string;
}

const PageHeading = ({ description }: IProps) => {
    return (
        <>
            <Nav logo={"Collabtime"} firstname={"Omar"} lastname={"Gastelum"} />
            <Box
                pos={"absolute"}
                pt={"15px"}
                bg={useColorModeValue("gray.50", "gray.800")}
            >
                <Stack
                    spacing={4}
                    as={Container}
                    maxW={"3xl"}
                    textAlign={"center"}
                >
                    {/* <Heading
                        fontSize={{ base: "2xl", sm: "4xl" }}
                        fontWeight={"bold"}
                    >
                        {title}
                    </Heading> */}
                    <Text
                        color={"gray.600"}
                        fontSize={{ base: "sm", sm: "lg" }}
                    >
                        {description}
                    </Text>
                </Stack>
            </Box>
        </>
    );
};

export default PageHeading;
