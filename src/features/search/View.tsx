import { useRef } from 'react';
import { Box, MenuButton, Text, useDisclosure } from '@chakra-ui/react';
// import { FaSearch } from 'react-icons/fa';
// import { IconContext } from 'react-icons';
import PrimaryDrawer from '../../components/PrimaryDrawer';
import SearchContent from './SearchContent';
import { LiaSearchSolid } from 'react-icons/lia';

const Search = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = useRef<any>();
    return (
        <Box pt={'10px'} pr={'2px'}>
            <MenuButton bg={'#0f172a'} onClick={onOpen}>
                {/* <IconContext.Provider
                    value={{
                        size: '15px',
                        color: 'white',
                    }}
                >
                    <FaSearch />
                </IconContext.Provider> */}
                <Text color={'white'} fontSize={'20px'}>
                    <LiaSearchSolid />
                </Text>
            </MenuButton>
            <PrimaryDrawer title="Search" isOpen={isOpen} onClose={onClose} size="Full" initialFocusRef={firstField}>
                <SearchContent onClose={onClose} firstField={firstField} />
            </PrimaryDrawer>
        </Box>
    );
};

export default Search;
