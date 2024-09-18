import { Box, MenuButton, Text, useDisclosure } from '@chakra-ui/react';
import DisplayList from './DisplayList';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import { LiaBell } from 'react-icons/lia';

const View = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box mt={'10px'}>
            <MenuButton bg={'#0f172a'} onClick={onOpen}>
                {/* <BellIcon boxSize={5} color={'white'} /> */}
                <Text color={'white'} fontSize={'20px'}>
                    <LiaBell />
                </Text>
            </MenuButton>
            <PrimaryDrawer title="Notifications" isOpen={isOpen} onClose={onClose} size="lg">
                <DisplayList />
            </PrimaryDrawer>
        </Box>
    );
};

export default View;
