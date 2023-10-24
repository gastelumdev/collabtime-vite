import {
    Box,
    Card,
    Heading,
    List,
    ListIcon,
    ListItem,
    Text,
} from "@chakra-ui/react";
import { IconType } from "react-icons";

interface IProps {
    bgImage?: string;
    icon?: IconType;
}

const SecondaryCard = ({
    bgImage = "linear-gradient(195deg, #FF548A, #EC1559)",
    icon,
}: IProps) => {
    return (
        <Card border={"none"} boxShadow={"lg"}>
            <Box px={"10px"}>
                <Box
                    color={"white"}
                    h={"100px"}
                    bgImage={bgImage}
                    borderRadius={"lg"}
                    padding={6}
                    position={"relative"}
                    bottom={"24px"}
                    boxShadow={"lg"}
                >
                    <Heading size={"sm"}>
                        <List>
                            <ListItem>
                                <ListIcon
                                    as={icon}
                                    boxSize={7}
                                />
                                Message Board
                            </ListItem>
                        </List>
                    </Heading>
                </Box>
            </Box>
            <Box h={"100px"} p={"24px"}>
                <Text color={"rgb(150 156 189)"}>Message your team.</Text>
            </Box>
        </Card>
    );
};

export default SecondaryCard;
