import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export interface ISensorData {
    name: string;
    type: string;
    value: number | string;
}

const DeviceCard = ({ data, bgColor, fontColor, Icon }: { data: ISensorData; bgColor: string; fontColor: string; Icon: IconType }) => {
    return (
        <Box maxW={{ base: 'full', md: '250px' }} w={'full'} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Box bgColor={bgColor} color={fontColor} p={5}>
                <Flex>
                    <Box>
                        <Text fontSize={'36px'}>
                            <Icon />
                        </Text>
                    </Box>
                    <Box pt={'10px'} ml={'10px'}>
                        <Text color={'white'} fontWeight={'semibold'}>
                            {data.type}
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <Box p={5}>
                <Center>{data.name}</Center>
                <Center>
                    <Text fontSize={'40px'}>{data.value}</Text>
                </Center>
            </Box>
        </Box>
    );
};

export default DeviceCard;
