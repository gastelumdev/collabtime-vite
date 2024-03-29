import { Box } from '@chakra-ui/react';
import { useGetDocumentsQuery } from '../../app/services/api';

import { TCell } from '../../types';
import { useEffect, useState } from 'react';

interface IProps {
    cell?: TCell | null;
    // preparedRow?: IPreparedRow;
    // addToCell?: boolean;
    handleDocsChange?: any;
    handleAddExistingDoc?: any;
    // handleAddExistingDocToCell?: any;
    // create?: boolean;
    columnName?: string;
    // docs?: TDocument[];
    // topPadding?: string;
    border?: boolean;
}

const UploadMenu = ({
    cell = null,
}: // preparedRow = {
//     docs: [],
// },
// addToCell = false,
// handleAddExistingDocToCell,
// create = true,
// docs = [],
// topPadding = '0px',
IProps) => {
    // const { onClose, isOpen } = useDisclosure();

    const { data: documents } = useGetDocumentsQuery(null);
    // const [updateCell] = useUpdateCellMutation();

    // const [setFilteredDocs] = useState<TDocument[]>([]);
    const [docs, setDocs] = useState<any[]>([]);

    useEffect(() => {
        // if (preparedRow.docs == "") preparedRow.docs = [];
        cell === null ? setDocs([]) : setDocs(cell?.docs as any[]);
    }, [cell]);

    // Filters out the docs are already part of the row
    useEffect(() => {
        filter();
    }, [documents, docs]);

    const filter = () => {
        const docIds: any[] = [];
        let filtered;
        if (cell === null) {
            for (const doc of docs || []) {
                docIds.push(doc._id);
            }

            filtered = documents?.filter((item) => {
                return !docIds?.includes(item._id);
            });
        } else {
            for (const doc of docs || []) {
                docIds.push(doc._id);
            }

            filtered = documents?.filter((item) => {
                return !docIds?.includes(item._id);
            });
        }

        filtered;
        // setFilteredDocs(filtered || []);
    };

    // const filterDocsInRow = (document: TDocument) => {
    //     const ds = filteredDocs.filter((item: TDocument) => {
    //         return item._id !== document._id;
    //     });

    //     setFilteredDocs(ds);
    // };

    // const getIcon = (type: string) => {
    //     if (type === 'jpg' || type === 'png' || type === 'jpeg') return <FaRegImage color={'rgb(123, 128, 154)'} />;
    //     if (type === 'xlsx') return <FaRegFileExcel color={'rgb(123, 128, 154)'} />;
    //     return <FaRegFileAlt />;
    // };

    return (
        <>
            <Box></Box>
            {/* <Button as={IconButton} aria-label="Options" icon={<PlusSquareIcon />} onClick={onClose} variant="unstyled" w={'10px'} h={'10px'} />
            <Menu closeOnSelect={false} placement={'left-start'}>
                <MenuList w={'400px'}>
                    <MenuGroup title={(docs?.length || 0) > 0 ? 'Selected files' : ''}>
                        <Box overflowY={docs?.length > 8 ? 'scroll' : 'auto'} h={docs?.length > 8 ? '200px' : 'auto'}>
                            {docs?.map((doc: any, index: number) => {
                                return (
                                    <Box key={index} pl={'5px'}>
                                        <a href={doc.url} target="_blank">
                                            <MenuItem>
                                                <Flex overflow={'hidden'}>
                                                    <Box pt={'2px'} mr={'8px'}>
                                                        <IconContext.Provider value={{ color: '#7b809a' }}>{getIcon(doc.ext || '')}</IconContext.Provider>
                                                    </Box>
                                                    <Text>{doc.filename}</Text>
                                                </Flex>
                                            </MenuItem>
                                        </a>
                                    </Box>
                                );
                            })}
                        </Box>
                    </MenuGroup>
                    {docs?.length || 0 > 0 ? <MenuDivider mt={'10px'} mb={'20px'} /> : null}
                    <MenuGroup title={'Upload or Create a document'}>
                        <Box pl={'5px'}>
                            <UploadModal
                                documents={documents || []}
                                cell={cell as any}
                                addToCell={cell !== null}
                                create={cell !== null}
                                handleDocsChange={handleDocsChange}
                                columnName={columnName}
                            />
                        </Box>
                        <Box pl={'5px'}>
                            <DocDrawer
                                documents={documents || []}
                                cell={cell as any}
                                addToCell={cell !== null}
                                create={cell !== null}
                                handleDocsChange={handleDocsChange}
                                columnName={columnName}
                            />
                        </Box>
                    </MenuGroup>
                    {filteredDocs.length || 0 > 0 ? <MenuDivider mt={'10px'} mb={'20px'} /> : null}
                    <MenuGroup title={filteredDocs.length || 0 > 0 ? 'Or select an existing file' : ''}>
                        <Box pl={'5px'} overflowY={filteredDocs.length > 8 ? 'scroll' : 'auto'} h={filteredDocs.length > 8 ? '200px' : 'auto'}>
                            {filteredDocs?.map((document, index) => {
                                return (
                                    <Box key={index}>
                                        <MenuItem
                                            onClick={() => {
                                                if (cell === null) {
                                                    handleAddExistingDoc(columnName, document);
                                                } else {
                                                    // handleAddExistingDocToCell(cell, document);
                                                    updateCell({ ...cell, docs: [...docs, document] });
                                                }

                                                setDocs([...docs, document]);
                                                // filterDocsInRow(document);
                                            }}
                                        >
                                            <Flex overflow={'hidden'}>
                                                <Box pt={'2px'} mr={'8px'}>
                                                    <IconContext.Provider value={{ color: '#7b809a' }}>{getIcon(document.ext || '')}</IconContext.Provider>
                                                </Box>
                                                <Text>{document.filename}</Text>
                                            </Flex>
                                        </MenuItem>
                                    </Box>
                                );
                            })}
                            
                        </Box>
                    </MenuGroup>
                </MenuList>
                <MenuButton>
                    <Box pt={topPadding} ml={"6px"} overflow={"hidden"}>
                        <Text overflow={"hidden"} textOverflow={"ellipsis"}>
                            {docs?.length > 0 ? `${docs?.length} ${docs?.length > 1 ? "docs" : "doc"}` : "No files"}
                        </Text>
                    </Box>
                </MenuButton> 
            </Menu> */}
        </>
    );
};

export default UploadMenu;
