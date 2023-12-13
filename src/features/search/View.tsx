import { useRef } from "react";
import { Box, MenuButton, useDisclosure } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import SearchContent from "./SearchContent";

const Search = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = useRef<any>();
    return (
        <Box pt={"10px"}>
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
            <PrimaryDrawer title="Search" isOpen={isOpen} onClose={onClose} size="Full" initialFocusRef={firstField}>
                <SearchContent onClose={onClose} firstField={firstField} />
            </PrimaryDrawer>
        </Box>
    );
};

export default Search;
