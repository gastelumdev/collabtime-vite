import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    HStack,
    Heading,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import { AiOutlineLike } from "react-icons/ai";
import Divider from "../Divider/Divider";
import { TTag } from "../../types";

interface IProps {
    index: number;
    data: any;
    divider: boolean;
    editButton?: any;
    deleteButton?: any;
    tagButton?: any;
    handleCloseTagButtonClick?: any;
    redirectUrl: string;
    localStorageId: string;
}

const PrimaryCard = ({
    index,
    data,
    divider = true,
    editButton,
    deleteButton,
    tagButton,
    handleCloseTagButtonClick,
    redirectUrl,
    localStorageId,
}: IProps) => {
    return (
        <Card
            key={index}
            variant="outline"
            boxShadow="rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
            mb={{ base: 6 }}
            h={"250px"}
        >
            <CardHeader
                pr={"0"}
                h={"60px"}
                as={"a"}
                href={redirectUrl}
                onClick={() => localStorage.setItem(localStorageId, data._id)}
            >
                <HStack
                    flex="1"
                    gap="2"
                    alignItems="center"
                    flexWrap="wrap"
                    position={"relative"}
                    bottom={10}
                    left={"2px"}
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
                                marginRight: "2px",
                                fontSize: "20px",
                                color: "white",
                            }}
                        />
                    </Box>

                    <Box pt={7}>
                        <Heading size="xs" color={"#575757"}>
                            {data.name}
                        </Heading>
                    </Box>
                </HStack>
            </CardHeader>
            <CardBody py={0} as={"a"} href={redirectUrl} onClick={() => localStorage.setItem(localStorageId, data._id)}>
                <Box position={"relative"}>
                    <Center>
                        <Text color={"rgb(123, 128, 154)"} fontSize={"sm"}>
                            {data.description}
                        </Text>
                    </Center>
                </Box>
            </CardBody>
            <Box px={"20px"} py={"10px"}>
                <Wrap spacing={1} key={index}>
                    {data.tags.map((tag: TTag, index: number) => {
                        return (
                            <WrapItem key={index}>
                                <Tag size={"sm"} variant="subtle" colorScheme="blue" mr={"5px"} zIndex={1000}>
                                    <TagLabel pb={"2px"}>{tag.name}</TagLabel>
                                    <TagCloseButton
                                        onClick={() => handleCloseTagButtonClick(data, tag)}
                                        zIndex={1000}
                                    />
                                </Tag>
                            </WrapItem>
                        );
                    })}
                </Wrap>
            </Box>
            {divider ? (
                <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="2px" marginTop="0" />
            ) : null}

            <CardFooter p={"5px"}>
                {editButton}
                {deleteButton}
                {tagButton}
            </CardFooter>
        </Card>
    );
};

export default PrimaryCard;
