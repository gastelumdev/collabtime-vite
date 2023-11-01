import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Flex,
    Heading,
    Text,
} from "@chakra-ui/react";
import { AiOutlineLike } from "react-icons/ai";
import Divider from "../Divider/Divider";

interface IProps {
    index: number;
    data: any;
    divider: boolean;
    editButton?: any;
    deleteButton?: any;
}

const PrimaryCard = ({
    index,
    data,
    divider = true,
    editButton,
    deleteButton,
}: IProps) => {
    return (
        <Card
            key={index}
            variant="outline"
            boxShadow="rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
            mb={{ base: 6 }}
            h={"250px"}
        >
            <CardHeader h={"60px"} as={"a"} href={`/workspaces/${data._id}`}>
                <Flex>
                    <Flex
                        flex="1"
                        gap="4"
                        alignItems="center"
                        flexWrap="wrap"
                        position={"relative"}
                        bottom={10}
                    >
                        <Box
                            bgImage={
                                "radial-gradient(circle at center top, rgb(73, 163, 241), rgb(26, 115, 232))"
                                // "radial-gradient(circle at center top, rgb(66, 66, 74), black)"
                                // "radial-gradient(circle at right top, #F26989, #EB1E4E)"
                                // "radial-gradient(circle at right top, #FF5BA7 , #D32C7A)"
                            }
                            padding={"20px"}
                            borderRadius={"lg"}
                        >
                            <AiOutlineLike
                                style={{
                                    marginRight: "4px",
                                    fontSize: "20px",
                                    color: "white",
                                }}
                            />
                        </Box>

                        <Box pt={7}>
                            <Heading size="sm" color={"#575757"}>
                                {data.name}
                            </Heading>
                        </Box>
                    </Flex>
                </Flex>
            </CardHeader>
            <CardBody py={0} as={"a"} href={`/workspaces/${data._id}`}>
                <Center>
                    <Text color={"rgb(123, 128, 154)"} fontSize={"md"}>
                        {data.description}
                    </Text>
                </Center>
            </CardBody>
            {divider ? (
                <Divider
                    gradient="radial-gradient(#eceef1 40%, white 60%)"
                    marginBottom="2px"
                />
            ) : null}

            <CardFooter p={"5px"}>
                {editButton}
                {deleteButton}
            </CardFooter>
        </Card>
    );
};

export default PrimaryCard;
