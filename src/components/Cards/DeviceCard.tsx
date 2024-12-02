import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export interface ISensorData {
    name: string;
    type: string;
    value: number | string;
    threshold_name: string | null;
}

const DeviceCard = ({ data, bgColor, fontColor, Icon }: { data: ISensorData; bgColor: string; fontColor: string; Icon: IconType }) => {
    return (
        <Box maxW={{ base: 'full', md: '260px' }} w={'full'} borderWidth="1px" borderRadius="lg" overflow="hidden">
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
            {data.threshold_name ? (
                <Box bgColor={bgColor} color={fontColor} p={3}>
                    <Center>
                        <Text fontSize={'12px'} fontWeight={'semibold'}>
                            Threshold Name
                        </Text>
                    </Center>
                    <Center mt={'3px'}>
                        <Text fontSize={'14px'}>{data.threshold_name}</Text>
                    </Center>
                </Box>
            ) : null}
        </Box>
    );
};

export default DeviceCard;
