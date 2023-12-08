import { Box, MenuButton, useDisclosure } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import SearchContent from "./SearchContent";

const Search = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box pt={"13px"}>
            <MenuButton bg={"#eff2f5"} onClick={onOpen}>
                <IconContext.Provider
                    value={{
                        size: "15px",
                        color: "#7b809a",
                    }}
                >
                    <FaSearch />
                </IconContext.Provider>
            </MenuButton>
            <PrimaryDrawer title="Search" isOpen={isOpen} onClose={onClose} size="Full">
                <SearchContent onClose={onClose} />
            </PrimaryDrawer>
        </Box>
    );
};

export default Search;
