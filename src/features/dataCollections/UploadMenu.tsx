import { PlusSquareIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import UploadModal from "../documents/UploadModal";
import { useGetDocumentsQuery } from "../../app/services/api";
import DocDrawer from "../documents/DocDrawer";
import { TCell, TDocument } from "../../types";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { FaRegFileAlt, FaRegFileExcel, FaRegImage } from "react-icons/fa";

interface IPreparedRow {
    docs: any[];
}

interface IProps {
    cell?: TCell;
    preparedRow?: IPreparedRow;
    addToCell?: boolean;
    handleDocsChange?: any;
    handleAddExistingDoc?: any;
    handleAddExistingDocToCell?: any;
    create?: boolean;
    columnName?: string;
    docs?: TDocument[];
}

const UploadMenu = ({
    cell,
    preparedRow = {
        docs: [],
    },
    addToCell = false,
    handleDocsChange,
    handleAddExistingDoc,
    handleAddExistingDocToCell,
    create = true,
    columnName,
    docs = [],
}: IProps) => {
    const { onClose, isOpen } = useDisclosure();
    const { data: documents } = useGetDocumentsQuery(null);

    const [filteredDocs, setFilteredDocs] = useState<TDocument[]>([]);
    const [row, setRow] = useState<any[]>([]);

    useEffect(() => {
        create ? setRow(preparedRow.docs) : setRow(docs);
    }, [preparedRow, docs]);

    // Filters out the docs are already part of the row
    useEffect(() => {
        filter();
    }, [documents, docs]);

    const filter = () => {
        const docIds: any[] = [];
        let filtered;
        if (create) {
            for (const doc of row || []) {
                docIds.push(doc._id);
            }

            filtered = documents?.filter((item) => {
                return !docIds?.includes(item._id);
            });
        } else {
            for (const doc of docs) {
                docIds.push(doc._id);
            }

            filtered = documents?.filter((item) => {
                return !docIds?.includes(item._id);
            });
        }

        setFilteredDocs(filtered || []);
    };

    const filterDocsInRow = (document: TDocument) => {
        const ds = filteredDocs.filter((item: TDocument) => {
            return item._id !== document._id;
        });

        setFilteredDocs(ds);
    };

    const getIcon = (type: string) => {
        if (type === "jpg" || type === "png" || type === "jpeg") return <FaRegImage color={"rgb(123, 128, 154)"} />;
        if (type === "xlsx") return <FaRegFileExcel color={"rgb(123, 128, 154)"} />;
        return <FaRegFileAlt />;
    };

    return (
        <Flex>
            <Menu closeOnSelect={false} placement={"left-start"}>
                {isOpen ? (
                    <MenuButton as={IconButton} aria-label="Options" icon={<PlusSquareIcon />} variant="ghost" />
                ) : (
                    <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<PlusSquareIcon />}
                        onClick={onClose}
                        variant="ghost"
                    />
                )}
                <MenuList w={"400px"}>
                    <MenuGroup title={(row?.length || 0) > 0 ? "Selected files" : ""}>
                        <Box overflowY={row?.length > 8 ? "scroll" : "auto"} h={row?.length > 8 ? "200px" : "auto"}>
                            {row?.map((doc: any, index: number) => {
                                return (
                                    <Box key={index} pl={"5px"}>
                                        <MenuItem>
                                            <Flex>
                                                <Box pt={"2px"} mr={"8px"}>
                                                    <IconContext.Provider value={{ color: "#7b809a" }}>
                                                        {getIcon(doc.ext || "")}
                                                    </IconContext.Provider>
                                                </Box>
                                                <Text>{doc.filename}</Text>
                                            </Flex>
                                        </MenuItem>
                                    </Box>
                                );
                            })}
                        </Box>
                    </MenuGroup>
                    {row?.length || 0 > 0 ? <MenuDivider mt={"10px"} mb={"20px"} /> : null}
                    <MenuGroup title={"Upload or Create a document"}>
                        <Box pl={"5px"}>
                            <UploadModal
                                documents={documents || []}
                                cell={cell}
                                addToCell={addToCell}
                                create={create}
                                handleDocsChange={handleDocsChange}
                                columnName={columnName}
                            />
                        </Box>
                        <Box pl={"5px"}>
                            <DocDrawer
                                documents={documents || []}
                                cell={cell}
                                addToCell={addToCell}
                                create={create}
                                handleDocsChange={handleDocsChange}
                                columnName={columnName}
                            />
                        </Box>
                    </MenuGroup>
                    {filteredDocs.length || 0 > 0 ? <MenuDivider mt={"10px"} mb={"20px"} /> : null}
                    <MenuGroup title={filteredDocs.length || 0 > 0 ? "Or select an existing file" : ""}>
                        <Box
                            pl={"5px"}
                            overflowY={filteredDocs.length > 8 ? "scroll" : "auto"}
                            h={filteredDocs.length > 8 ? "200px" : "auto"}
                        >
                            {filteredDocs?.map((document, index) => {
                                return (
                                    <Box key={index}>
                                        <MenuItem
                                            onClick={() => {
                                                if (create) {
                                                    handleAddExistingDoc(columnName, document);
                                                } else {
                                                    handleAddExistingDocToCell(cell, document);
                                                }
                                                filterDocsInRow(document);
                                            }}
                                        >
                                            <Flex>
                                                <Box pt={"2px"} mr={"8px"}>
                                                    <IconContext.Provider value={{ color: "#7b809a" }}>
                                                        {getIcon(document.ext || "")}
                                                    </IconContext.Provider>
                                                </Box>
                                                <Text>{document.filename}</Text>
                                            </Flex>
                                        </MenuItem>
                                    </Box>
                                );
                            })}
                            {/* <Flex pr={"15px"} mt={"15px"}>
                            <Spacer />
                            <PrimaryButton size="sm">SAVE</PrimaryButton>
                        </Flex> */}
                        </Box>
                    </MenuGroup>
                </MenuList>
            </Menu>
            <Box pt={"11px"} ml={"6px"} overflow={"hidden"}>
                <Text overflow={"hidden"} textOverflow={"ellipsis"}>
                    {row?.map((doc: any, index: number) => {
                        return <Link to={doc.url || ""} key={index} target="_blank">{`${doc.filename}, `}</Link>;
                    })}
                </Text>
            </Box>
        </Flex>
    );
};

export default UploadMenu;
