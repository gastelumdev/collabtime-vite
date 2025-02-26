import { Box, Center, Flex, Spacer, Text } from '@chakra-ui/react';
import { TRow } from '../../../../types';
import { IconContext } from 'react-icons';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';
import { IoIosSwitch } from 'react-icons/io';

const PointCard = ({ row, values, updateRow }: { row: TRow; values: any; updateRow: any }) => {
    return (
        <Box
            w={{ base: 'full', md: '49%' }}
            border={'1px solid rgba(204, 209, 211, 0.75)'}
            borderRadius={'4px'}
            // boxShadow={'base'}
            bgColor={'rgb(0, 99, 124)'}
            color={'white'}
        >
            <Box borderBottom={'1px solid rgba(71, 139, 156, 0.75)'} px={'10px'} py={'8px'}>
                <Flex>
                    <Box pt={'3px'}>
                        <Flex>
                            <Box mr={'10px'} pt={'3px'} pl={'2px'}>
                                <IconContext.Provider
                                    value={{
                                        size: '20px',
                                        color: 'white',
                                    }}
                                >
                                    <Text>
                                        {row.values.type === 'Relay Output' ? (
                                            <FaLeftLong />
                                        ) : row.values.type === 'Register' ? (
                                            <IoIosSwitch />
                                        ) : (
                                            <FaRightLong />
                                        )}
                                    </Text>
                                </IconContext.Provider>
                            </Box>

                            <Text fontSize={'18px'} fontWeight={'semibold'}>
                                {values.point_custom_name}
                            </Text>
                        </Flex>
                    </Box>
                    <Spacer />
                    <Box
                        w={'48%'}
                        maxH={'32px'}
                        py={'5px'}
                        bgColor={values.status === 'On' ? 'rgb(0, 180, 75)' : 'rgba(196, 200, 204, 0.75)'}
                        color={'white'}
                        boxShadow={'inner'}
                        borderRadius={'3px'}
                        fontWeight={'bold'}
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
                            bgColor={'rgb(81, 144, 160)'}
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
                            // bgColor={'rgba(223, 228, 233, 0.75)'}
                            bgColor={'rgb(81, 144, 160)'}
                            // border={'1px solid white'}
                            // color={'rgb(0, 90, 112)'}
                            fontWeight={'semibold'}
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
