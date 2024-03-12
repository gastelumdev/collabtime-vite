import { Box, Container, Stack, Text } from '@chakra-ui/react';

interface IProps {
    title?: string;
    description?: string;
}

const PageHeading = ({ description }: IProps) => {
    return (
        <>
            <Box pos={'absolute'} pt={'15px'} bg={'#f6f8fa'}>
                <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                    {/* <Heading
                        fontSize={{ base: "2xl", sm: "4xl" }}
                        fontWeight={"bold"}
                    >
                        {title}
                    </Heading> */}
                    <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
                        {description}
                    </Text>
                </Stack>
            </Box>
        </>
    );
};

export default PageHeading;
