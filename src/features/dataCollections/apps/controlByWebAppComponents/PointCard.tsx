import { Box, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import { TRow } from '../../../../types';

const PointCard = ({ row, values, updateRow }: { row: TRow; values: any; updateRow: any }) => {
    return (
        <Box
            w={{ base: 'full', md: '46%' }}
            border={'1px solid rgba(204, 209, 211, 0.75)'}
            borderRadius={'4px'}
            boxShadow={'1px 1px 7px 1px rgba(223, 228, 233, 0.75)'}
        >
            <Box borderBottom={'1px solid rgba(223, 228, 233, 0.75)'} px={'10px'} py={'8px'}>
                <Flex>
                    <Box pt={'3px'}>
                        <Text fontSize={'18px'}>{values.point_custom_name}</Text>
                    </Box>
                    <Spacer />
                    <Box
                        w={'48%'}
                        maxH={'32px'}
                        py={'5px'}
                        bgColor={values.status === 'On' ? 'green' : 'red'}
                        color={'white'}
                        boxShadow={'inner'}
                        borderRadius={'3px'}
                    >
                        <Center>{values.status}</Center>
                    </Box>
                </Flex>
            </Box>
            {values.type !== 'Digital Input' ? (
                <Box px={'10px'} py={'8px'}>
                    <Flex>
                        <Box
                            w={'48%'}
                            bgColor={'rgba(223, 228, 233, 0.75)'}
                            py={'5px'}
                            onClick={() => {
                                updateRow({ ...row, values: { ...values, status: 'On' } });
                            }}
                            cursor={'pointer'}
                            _hover={{ bgColor: 'rgba(196, 200, 204, 0.75)' }}
                            borderRadius={'3px'}
                        >
                            <Center>{'On'}</Center>
                        </Box>
                        <Spacer />
                        <Box
                            w={'48%'}
                            bgColor={'rgba(223, 228, 233, 0.75)'}
                            py={'5px'}
                            onClick={() => {
                                updateRow({ ...row, values: { ...values, status: 'Off' } });
                            }}
                            cursor={'pointer'}
                            _hover={{ bgColor: 'rgba(196, 200, 204, 0.75)' }}
                            borderRadius={'3px'}
                        >
                            <Center>{'Off'}</Center>
                        </Box>
                    </Flex>
                </Box>
            ) : null}
        </Box>
    );
};

export default PointCard;
