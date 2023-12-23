import { PlusSquareIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { TCell } from "../../types";
import { useEffect, useState } from "react";
import { useUpdateCellMutation } from "../../app/services/api";
import { Link } from "react-router-dom";

interface IProps {
    cell: TCell | null;
    handleAddLinkClick?: any;
}

const LinksMenu = ({ cell, handleAddLinkClick }: IProps) => {
    const [updateCell] = useUpdateCellMutation();
    const [link, setLink] = useState<string>("");
    const [links, setLinks] = useState<string[]>([]);
    const [linkValueError, setLinkValueError] = useState<boolean>(false);

    const handleOnLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLinkValueError(false);
        const { value } = event.target;

        setLink(value);
    };

    useEffect(() => {
        console.log(import.meta.env.VITE_API_URL);
        const linksList = [];

        for (const link of cell?.links || []) {
            console.log(link.split("/")[0]);
            linksList.push(link);
        }

        setLinks(linksList);
    }, [cell]);

    return (
        <>
            <Flex overflow={"hidden"} textOverflow={"ellipsis"}>
                <Menu closeOnSelect={false}>
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<PlusSquareIcon />}
                        variant="ghost"
                    ></MenuButton>
                    <MenuList w={"400px"}>
                        <Box p={"5px"}>
                            <Text ml={"2px"} mb={"3px"}>
                                Enter link
                            </Text>
                            <Flex>
                                <Input w={"385px"} mr={"4px"} onChange={handleOnLinkChange} value={link} />

                                <PrimaryButton
                                    onClick={() => {
                                        if (link.startsWith("https://")) {
                                            if (cell) {
                                                const links: any = cell.links;
                                                updateCell({ ...cell, links: [...links, link] });
                                            } else {
                                                handleAddLinkClick(link);
                                            }

                                            setLinks([...links, link]);
                                            setLink("");
                                        } else {
                                            setLinkValueError(true);
                                        }
                                    }}
                                >
                                    ADD
                                </PrimaryButton>
                            </Flex>
                            <Box>
                                <Box mt={"3px"}>
                                    {linkValueError ? <Text color={"red"}>Link needs to be full url.</Text> : null}
                                </Box>
                            </Box>
                        </Box>
                        <MenuDivider />
                        <MenuGroup title="Links">
                            {links.map((link, index) => {
                                return (
                                    // <Box
                                    //     key={index}
                                    //     onClick={() => {
                                    //         window.location.replace(link);
                                    //     }}
                                    // >
                                    //     <MenuItem>{link}</MenuItem>
                                    // </Box>
                                    <Box>
                                        <MenuItem>
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                                            >
                                                {link}
                                            </a>
                                        </MenuItem>
                                    </Box>
                                );
                            })}
                        </MenuGroup>
                    </MenuList>
                </Menu>
                <Box pt={"11px"}>
                    <Text>{links.length > 0 ? `${links.length} ${links.length > 1 ? "links" : "link"}` : "Empty"}</Text>
                </Box>
            </Flex>
        </>
    );
};

export default LinksMenu;
