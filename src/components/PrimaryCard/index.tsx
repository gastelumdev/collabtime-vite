import { Box, Card, CardBody, CardFooter, CardHeader, Center, Tag, TagCloseButton, TagLabel, Text, Wrap, WrapItem } from '@chakra-ui/react';
// import { AiOutlineLike } from "react-icons/ai";
// import Divider from '../Divider/Divider';
import { TTag } from '../../types';
import { useState } from 'react';
import Divider from '../Divider/Divider';

interface IProps {
    index: number;
    data: any;
    divider?: boolean;
    editButton?: any;
    deleteButton?: any;
    tagButton?: any;
    handleCloseTagButtonClick?: any;
    redirectUrl: string;
    localStorageId: string;
    allowed?: boolean;
}

const PrimaryCard = ({
    index,
    data,
    divider = false,
    editButton,
    deleteButton,
    tagButton,
    handleCloseTagButtonClick,
    redirectUrl,
    localStorageId,
    allowed = false,
}: IProps) => {
    const [showToolbar, setShowToolbar] = useState(false);
    return (
        <Card
            key={index}
            variant="outline"
            boxShadow="rgba(0, 0, 0, 0.1) 0rem 0.25rem 0.375rem -0.0625rem, rgba(0, 0, 0, 0.06) 0rem 0.125rem 0.25rem -0.0625rem"
            mb={{ base: 2 }}
            h={'250px'}
            onMouseEnter={() => setShowToolbar(true)}
            onMouseLeave={() => setShowToolbar(false)}
        >
            <CardHeader
                // pr={"0"}
                h={'60px'}
                as={'a'}
                href={redirectUrl}
                onClick={() => localStorage.setItem(localStorageId, data._id)}
            >
                {/* <HStack
                    flex="1"
                    gap="2"
                    alignItems="center"
                    flexWrap="wrap"
                    position={"relative"}
                    bottom={10}
                    left={"2px"}
                > */}
                {/* <Box
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
                    </Box> */}

                <Box>
                    <Center>
                        <Text fontWeight={'normal'} fontSize={'15px'} fontFamily={'sans-serif'} color={'#666666'}>
                            {data.name}
                        </Text>
                    </Center>
                </Box>
                {/* </HStack> */}
            </CardHeader>
            <CardBody py={0} pt={'10px'} as={'a'} href={redirectUrl} onClick={() => localStorage.setItem(localStorageId, data._id)}>
                <Box position={'relative'}>
                    <Center>
                        <Text color={'rgb(123, 128, 154)'} fontSize={'sm'}>
                            {data.description}
                        </Text>
                    </Center>
                </Box>
            </CardBody>
            <Box px={'20px'} py={'10px'}>
                <Wrap spacing={1} key={index}>
                    {data.tags.map((tag: TTag, index: number) => {
                        return (
                            <WrapItem key={index}>
                                <Tag size={'sm'} variant="subtle" colorScheme="blue" mr={'5px'} zIndex={1000}>
                                    <TagLabel pb={'2px'}>{tag.name}</TagLabel>
                                    {allowed ? <TagCloseButton onClick={() => handleCloseTagButtonClick(data, tag)} zIndex={1000} /> : null}
                                </Tag>
                            </WrapItem>
                        );
                    })}
                </Wrap>
            </Box>
            {divider ? <Divider gradient="radial-gradient(#eceef1 40%, white 60%)" marginBottom="2px" marginTop="0" /> : null}
            <Box h={'60px'}>
                {showToolbar ? (
                    <CardFooter p={'5px'}>
                        {editButton}
                        {deleteButton}
                        {tagButton}
                    </CardFooter>
                ) : null}
            </Box>
        </Card>
    );
};

export default PrimaryCard;
