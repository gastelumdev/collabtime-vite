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
        create ? console.log("CREATE***********") : console.log("EDIT**************");
        create ? setRow(preparedRow.docs) : setRow(docs);
    }, [preparedRow, docs]);

    // Filters out the docs are already part of the row
    useEffect(() => {
        console.log(row);
        filter();
    }, [documents, docs]);

    const filter = () => {
        console.log("DOCS ********", docs);
        console.log("PREPARED DOCS ***********", preparedRow.docs);
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

            console.log(docIds);

            filtered = documents?.filter((item) => {
                return !docIds?.includes(item._id);
            });
        }

        console.log(filtered);

        setFilteredDocs(filtered || []);
    };

    const filterDocsInRow = (document: TDocument) => {
        const ds = filteredDocs.filter((item: TDocument) => {
            return item._id !== document._id;
        });

        console.log(ds);

        setFilteredDocs(ds);
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
                        <Box overflowY={"scroll"} h={"200px"}>
                            {row?.map((doc: any, index: number) => {
                                return (
                                    <Box key={index} pl={"5px"}>
                                        <MenuItem>{doc.filename}</MenuItem>
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
                        <Box pl={"5px"} overflowY={"scroll"} h={"200px"}>
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
                                            {document.filename}
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
