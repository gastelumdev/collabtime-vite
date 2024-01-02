import React, { useEffect, useState } from "react";
import {
    useDeleteColumnMutation,
    useCreateRowMutation,
    useDeleteRowsMutation,
    useUpdateRowMutation,
    useRowCallUpdateMutation,
    useCreateColumnMutation,
    useDeleteTagMutation,
    useTagExistsMutation,
    useGetDataCollectionQuery,
    useGetOneWorkspaceQuery,
    useUpdateWorkspaceMutation,
    useGetRowsQuery,
    useGetColumnsQuery,
    useGetTotalRowsQuery,
} from "../../app/services/api";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Checkbox,
    Flex,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Progress,
    // Progress,
    // Select as CSelect,
    Spacer,
    Table,
    TableContainer,
    Tag,
    TagCloseButton,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    WrapItem,
    useDisclosure,
    MenuGroup,
} from "@chakra-ui/react";
import Select from "react-select";

import { AiOutlineCheck, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

import { createRowColorStyles } from "./select.styles";
import NoteModal from "./NoteModal";
import RenameColumn from "./RenameColumn";
import EditRow from "./EditRow";
import { TCell, TColumn, TDocument, TRow, TTag } from "../../types";
import CreateColumn from "./CreateColumn";
import { io } from "socket.io-client";
import { GoTag } from "react-icons/go";
import TagsModal from "../tags/TagsModal";
import { useParams } from "react-router-dom";
import { FaAngleLeft, FaAngleRight, FaRegBell, FaRegCheckSquare } from "react-icons/fa";
import UploadMenu from "./UploadMenu";
import LinksMenu from "./LinksMenu";

import "./styles.css";
import LabelMenu from "./LabelMenu";
import TextInput from "./TextInput";
import NumberInput from "./NumberInput";
import DateInput from "./DateInput";
import PeopleMenu from "./PeopleMenu";
// import { ConsoleSqlOutlined } from "@ant-design/icons";

interface IProps {
    columns?: TColumn[];
    rows?: TRow[];
    rowsLoading?: boolean;
    rowsFetching?: boolean;
    dataCollectionId: string;
    permissions?: number;
    type?: string;
}

const DataCollectionTable = ({
    // columns,
    // rows,
    // rowsLoading,
    // rowsFetching,
    dataCollectionId,
    permissions = 2,
    type = "table",
}: IProps) => {
    const cancelRef = React.useRef<any>(null);
    const { id } = useParams();

    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || "");
    const { data: workspace } = useGetOneWorkspaceQuery(id || "");
    const { data: columns } = useGetColumnsQuery(dataCollectionId || "");

    const [createColumn] = useCreateColumnMutation();
    const [deleteColumn] = useDeleteColumnMutation();
    const [createRow] = useCreateRowMutation();
    const [updateRow] = useUpdateRowMutation();
    const [deleteMultipleRows] = useDeleteRowsMutation();
    const [rowCallUpdate] = useRowCallUpdateMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [row, setRow] = useState<any>({ dataCollection: dataCollection?._id, docs: [] });
    const [numberChecked, setNumberChecked] = useState<number>(0);
    const [showRowForm, setShowRowForm] = useState<boolean>(false);

    const [deleteRows, setDeleteRows] = useState<TRow[]>([]);
    const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);
    /**
     * Array that keeps track of the what rows are checked
     */
    const [checkboxes, setCheckboxes] = useState<boolean[]>([]);

    const [firstInputFocus, setFirstInputFocus] = useState(true);

    const [limit, setLimit] = useState<number>(20);
    const [skip, setSkip] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>((skip + limit) / limit);

    const [sort, setSort] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string>("createdAt");

    const {
        data: rows,
        isLoading: rowsLoading,
        isFetching: rowsFetching,
        isSuccess: rowsSuccess,
    } = useGetRowsQuery({
        dataCollectionId: dataCollectionId || "",
        limit: limit,
        skip: skip,
        sort: sort,
        sortBy: sortBy,
    });
    const { data: totalRows } = useGetTotalRowsQuery({ dataCollectionId: dataCollectionId || "", limit: limit });

    const [pages, setPages] = useState<number[]>(totalRows || []);

    // MAY NEED TO BE DELETED -- 12/22/23
    // const [headerMenuIsOpen, setHeaderMenuIsOpen] = useState(
    //     new Array(columns?.length).fill(null).map(() => {
    //         return false;
    //     })
    // );

    const [showTagsColumn, setShowTagsColumn] = useState<boolean>(false);
    /**
     * This variable is used to dynamically adjust the width of the tags column
     * depending on the amount of tags.
     */
    const [tagsColumnWidth, setTagsColumnWidth] = useState<string>("");

    useEffect(() => {
        setSort(1);
        setPages(totalRows);
        setSortBy("createdAt");
        setLimit(20);
    }, [totalRows]);

    useEffect(() => {
        localStorage.setItem("dataCollectionId", dataCollectionId || "");
        // setData(rows as TRow[]);
    }, [rowsSuccess, rows]);

    useEffect(() => {}, [columns]);

    /**
     * This converts data so that the react table can read it before the component
     * loads.
     */
    useEffect(() => {
        setDefaultRow();
    }, []);

    useEffect(() => {
        const checkboxesArr = [];
        for (const row of rows || []) {
            row;
            checkboxesArr.push(false);
        }

        setCheckboxes(checkboxesArr);
    }, [rows]);

    /**
     * Sets Label styles
     * MAY BE UNUSED -- 12/21/23
     */
    // useEffect(() => {
    //     for (const column of columns || []) {
    //         if (column.type === "label") {
    //             setLabelStyles({ ...labelStyles, [column.name]: "" });
    //         }
    //     }
    // }, []);

    /**
     * The "update row" is a socket io from the backend that triggers an update request
     * Since the rowCallUpdate function makes a rtk query request that shares a tag with the
     * getRows request, which refetches the rows and updates the interface.
     * This is helpful since when another user makes a change, it updates the interface
     * without having to trigger it in anyway.
     */
    useEffect(() => {
        const socket = io(import.meta.env.VITE_API_URL);
        socket.connect();
        socket.on("update row", () => {
            rowCallUpdate(null);
            // setNotifications(callNotificationsUpdate(priority) as any);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    /**
     * This preemtively estimates the width of the tags column width based on the amount of
     * characters of all the tags and additional pixels.
     */
    useEffect(() => {
        let max = 0;
        let maxTags = 0;
        for (const row of rows || []) {
            let totalTagsWidth = 0;
            for (const tag of row.tags) {
                totalTagsWidth += tag.name.length;
            }

            if (totalTagsWidth > max) max = totalTagsWidth;
            if (row.tags.length > maxTags) maxTags = row.tags.length;
        }

        let letterWidth = max * 10;
        let tagSpace = 40;
        let spacing = 40;

        setTagsColumnWidth((letterWidth + tagSpace + spacing).toString() + "px");
    }, [rows]);

    /**
     * Set a row to a default state
     */
    const setDefaultRow = () => {
        let temp: TRow = { dataCollection: dataCollectionId, notesList: [], cells: [], tags: [], docs: [], links: [] };
        for (const column of columns || []) {
            temp = { ...temp, [column.name]: "" };
        }
        temp.docs = [];

        setRow(temp);
    };

    const handlePageNumberClick = (pageNum: number) => {
        if (pageNum > 0 && pageNum <= pages.length) {
            setPageNumber(pageNum);
            setSkip((pageNum - 1) * limit);
            // setSkip(40);
        }
    };

    /**
     * COLUMN HEADER
     *
     * This function calls the delete column request to the backend
     * @param column Column to be deleted
     */
    const handleDeleteColumn = (column: TColumn) => {
        deleteColumn(column);
        // setData(rows || []);
    };

    /**
     * CREATE ROW SECTION
     *
     * This function handles the input change and sets the the name as a key to the row
     * @param event The input event
     */
    const handleAddRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRow({ ...row, [event.target.name]: event.target.value });
    };

    /**
     * CREATE ROW SECTION
     *
     * Sets any of the select inputs values to the row that is passed in to create it.
     * @param selectedValue This value is recieved from a select input
     * @param columnName This value is the name of the column which acts as an key
     *                   in the row that is sent in a create row request
     */
    const handleLabelChange = (selectedValue: any, columnName: string) => {
        // THIS MAY NEED DELETION -- 12/21/23
        // setLabelValue({ ...labelValue, [columnName]: selectedValue.value });
        let rowCopy = row;
        setRow({ ...rowCopy, [columnName]: selectedValue.value });

        // This removes the first input from asking for focus
        // This is useful since a select input may not be requesting for focus
        setFirstInputFocus(false);

        // This makes it so that if enter is pressed it submits the row
        // setSubmittable(true);
    };

    /**
     * CREATE ROW SECTION
     *
     * This recieves the docs passed in from UploadModal.tsx or DocDrawer.tsx which are first
     * uploaded.
     * @param name This is the cell or column name that serves as the key in the row
     * @param docs This is the documents array that holds the created docs
     */
    const handleDocsChange = (name: string, docs: TDocument[]) => {
        const rowDocs = row.docs || [];
        setRow({ ...row, [name]: rowDocs.concat(docs) });
    };

    /**
     * CREATE ROW SECTION
     *
     * This function makes the create row request and sets create row variables to default
     */
    const handleSaveRowClick = async () => {
        await createRow(row);
        setShowRowForm(false);
        setDefaultRow();
        // setRow({ dataCollection: dataCollection?._id, docs: [], links: [] });
    };

    /**
     * CREATE ROW SECTION
     *
     * This creates the row if enter is pressed when an input is in focus
     * @param event The event that holds the key being pressed
     */
    // const handleAddRowOnEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (event.key == "Enter") {
    //         await createRow(row);
    //         setFirstInputFocus(true);
    //         setDefaultRow();
    //     }
    // };

    useEffect(() => {
        const handleAddRowOnEnter = async (event: KeyboardEvent) => {
            if (event.key == "Enter" && showRowForm) {
                await createRow(row);
                setFirstInputFocus(true);
                setDefaultRow();
                // setColumnsToCreateRow(columns || []);
                // setRow({ dataCollection: dataCollection?._id, docs: [], links: [] });
            }
        };

        document.addEventListener("keyup", handleAddRowOnEnter, true);

        return () => {
            document.removeEventListener("keyup", handleAddRowOnEnter, true);
            // setDefaultRow();
        };
    }, [showRowForm, row]);

    const handleAddLinkClick = (link: string) => {
        const linksCopy: any = row.links;
        setRow({ ...row, links: [...linksCopy, link] });
        setFirstInputFocus(false);
    };

    /**
     * UPDATE ROW SECTION
     *
     * MAY NEED TO BE DELETED -- 12/21/23
     * @param cell The cell that needs to be updated by either UploadModal.tsx or DocDrawer.tsx
     * @param doc The document added to the cell
     */
    // const handleCellDocsChange = (cell: TCell, doc: TDocument) => {
    //     const docs: any = cell.docs;
    //     updateCell({ ...cell, docs: [...docs, doc] });
    // };

    /**
     * CREATE ROW SECTION
     *
     * This function is used to update the row with existing docs picked in UploadMenu.tsx
     * @param name This is the cell or column name that serves as the key in the row
     * @param docs This is the documents array that holds the created docs
     */
    const handleAddExistingDoc = (name: string, doc: TDocument) => {
        const rowDocs = row.docs || [];
        rowDocs.push(doc);
        setRow({ ...row, [name]: rowDocs });
    };

    /**
     * UPDATE ROW SECTION
     *
     * This function helps keep track of what cell is being focused and toggles it to edit mode
     * @param event This serves as the current state of the input and is set as the initial value
     * @param cell This provides the cell id to keep tracked of what is being focused
     */
    // const handleUpdateRowOnFocus = (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
    //     // Holds the initial value of the input so that when on blur, it does not send a request for update
    //     // Since they are the same
    //     setInitialValue(event.target.value);

    //     // This adds a cell id to an array so that.
    //     // The input then checks if it is in edit mode by checking if the cell id in the
    //     // editMode array, if it isn't, it shows the cell value
    //     const em: string[] = [];
    //     em.push(cell._id);
    //     setEditMode(em as any);

    //     // Initiates the temp value with the value in the input that will be displayed when focused
    //     // and flags it with is focused
    //     setTempValue(event.target.value);
    //     // setIsFocused(true);
    // };

    /**
     * UPDATE Row SECTION
     *
     * This function updates a cell when it is a text input.
     * @param event The event that will be checked against the initial value
     * @param cell The cell that will be updated on blur
     */
    // const handleUpdateRowOnBlur = async (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
    //     // If the initial value is the same as the value when the blur happend do nothing
    //     // otherwise update the cell with the new value
    //     let newCell = cell;
    //     newCell = { ...newCell, value: event.target.value };
    //     if (initialValue != event.target.value) await updateCell(newCell);

    //     // Remove this cell id from edit mode so that it displays the cell value
    //     let tempEditMode = editMode;
    //     tempEditMode.pop();
    //     setEditMode(tempEditMode);

    //     // Change the focus status
    //     // setIsFocused(false);
    // };

    /**
     * UPDATE ROW SECTION
     *
     * This function updates the value of the input when its in edit mode.
     * When the input is blured, this value gets updated
     * @param event This provides the current state of the input
     */
    // const handleUpdateRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setTempValue(event.target.value);
    // };

    /**
     * UPDATE ROW SECTION
     *
     * This function is used to update the row with existing docs picked in UploadMenu.tsx
     * @param cell Cell to be updated
     * @param doc Document being added from existing documents
     */
    // const handleAddExistingDocToCell = (cell: TCell, doc: TDocument) => {
    //     const docs: any = cell.docs;
    //     updateCell({ ...cell, docs: [...docs, doc] });
    // };

    /**
     * UPDATE ROW SECTION
     *
     * Takes the selected value and updates the cell
     * @param newValue The new value from the cell
     * @param cell The cell to be updated
     */
    // const handleLabelSelectChange = async (newValue: any, cell: TCell) => {
    //     let newCell = cell;
    //     newCell = { ...newCell, value: newValue.value };
    //     await updateCell(newCell);
    // };

    /**
     * ROW TOOLBAR
     *
     * This function counts the checkboxes and keeps the track of the rows to be deleted
     * If there is anything in the the deleted rows array, it will show the delete rows bar
     * @param event This provides the checked box
     * @param row This is the row that is being checked
     */
    const onDeleteRowCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, row: any, index: number) => {
        const deleteRowsCopy = deleteRows;

        if (event.target.checked) {
            deleteRowsCopy.push(row);
            setNumberChecked(numberChecked + 1);
        } else {
            let index = deleteRowsCopy.indexOf(row);
            deleteRowsCopy.splice(index, 1);
            setNumberChecked(numberChecked - 1);
        }

        setDeleteRows(deleteRowsCopy);

        if (deleteRowsCopy.length > 0) {
            setShowDeleteBox(true);
        } else {
            setShowDeleteBox(false);
        }

        const checkboxesCopy = checkboxes;
        checkboxesCopy[index] = !checkboxes[index];
        setCheckboxes(checkboxesCopy);
    };

    /**
     * ROW TOOLBAR
     *
     * This toggles the reminder on and of for a row
     * This is located in the row toolbar
     * @param row The row is to be updated with the toggle reminder status
     */
    const handleReminderClick = (row: TRow) => {
        updateRow({ ...row, reminder: !row.reminder });
    };

    /**
     * ROW TOOLBAR
     *
     * Updates the row acknowledgement status
     * @param row This is the row where the acknowledgement is being made
     */
    const handleAcknowledgeClick = (row: TRow) => {
        updateRow({ ...row, acknowledged: !row.acknowledged });
    };

    /**
     * ROW TOOLBAR
     *
     * Deletes the rows being tracked by the ckeckmarks and sets defaults to hide the delete bar
     */
    const deleteItems = async () => {
        // for (const row of deleteRows) {
        //     await deleteRow(row);
        // }

        await deleteMultipleRows({ rows: deleteRows, dataCollectionId: dataCollection?._id || "" });

        setShowDeleteBox(false);
        setDeleteRows([]);
        setRow({ dataCollection: dataCollection?._id, docs: [] });
    };

    // MAY NEED TO BE DELETED -- 12/22/23
    // const handleColumnHover = (index: number) => {
    //     const headerMenuIsOpenCopy = headerMenuIsOpen;
    //     headerMenuIsOpenCopy[index] = true;
    //     setHeaderMenuIsOpen(headerMenuIsOpenCopy);
    // };

    /**
     * ROW TOOLBAR
     *
     * Removes the tag from a row and also from the workspace if its the last of its kind
     * @param row Row where tag needs to be removed
     * @param tag Tag that needs to be removed
     */
    const handleCloseTagButtonClick = async (row: TRow, tag: TTag) => {
        const { tags } = row;

        // Filter out the selected tag
        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        // Update the row with the filtered tags
        const addNewRow = { ...row, tags: filteredTags };
        await updateRow(addNewRow);

        // Get all the tags belonging to the workspace
        let workspaceTags;
        if (workspace) {
            workspaceTags = workspace.workspaceTags;
        }

        // Check if the new tag exists in the workspace
        const thisTagExistsRes: any = await tagExists(tag);

        // if it does not exist in any other parts of the workspace, delete it from the workspace
        // and delete it all together
        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags?.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace: any = { ...workspace, workspaceTags: filteredWorkspaceTags };

            await updateWorkspace(newUpdatedWorkspace);
            await deleteTag(tag);
        }
    };

    /**
     * DESCENDING ORDER SORT
     * @param param
     * @returns
     */
    const handleDescendingSortClick = (columnName: string) => {
        setSort(-1);
        setSortBy(columnName);
        setPageNumber(1);
        setSkip(0);
    };

    /**
     * DESCENDING ORDER SORT
     * @param param
     * @returns
     */
    const handleAscendingSortClick = (columnName: string) => {
        setSort(1);
        setSortBy(columnName);
        setPageNumber(1);
        setSkip(0);
    };

    const DeleteColumnAlert = ({ column }: { column: TColumn }) => {
        const {
            isOpen: deleteColumnModalIsOpen,
            onOpen: deleteColumnModalOnOpen,
            onClose: deleteColumnModalOnClose,
        } = useDisclosure();
        return (
            <>
                <MenuItem onClick={deleteColumnModalOnOpen}>Delete Column</MenuItem>
                <AlertDialog
                    isOpen={deleteColumnModalIsOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={deleteColumnModalOnClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Column
                            </AlertDialogHeader>

                            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

                            <AlertDialogFooter>
                                <Button onClick={deleteColumnModalOnClose}>Cancel</Button>
                                <Button
                                    colorScheme="red"
                                    onClick={() => {
                                        handleDeleteColumn(column);
                                        deleteColumnModalOnClose();
                                    }}
                                    ml={3}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
        );
    };
    return (
        <>
            {type === "table" ? (
                <Box h={"20px"}>{rowsLoading || rowsFetching ? <Progress size="xs" isIndeterminate /> : null}</Box>
            ) : null}
            {/* {rows?.map((row, index) => {
                return <Box>{row.cells.map((cell: TCell, index: number) => {
                    return <Text>{cell.value}</Text>
                })}</Box>
            })} */}
            <Flex mb={"20px"}>
                <Spacer />
                <Box>
                    <Flex>
                        {/* <CSelect
                            defaultValue={20}
                            size={"sm"}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                setLimit(Number(event.target.value));
                                setPageNumber(1);
                                setSkip(0);
                            }}
                            mr={"14px"}
                        >
                            <option value={20}>20</option>
                            <option value={40}>40</option>
                            <option value={60}>60</option>
                        </CSelect> */}
                        <Box w={"20px"}>
                            {pageNumber !== 1 ? (
                                <Box
                                    pt={"7px"}
                                    mr={"5px"}
                                    onClick={() => handlePageNumberClick(pageNumber - 1)}
                                    cursor={"pointer"}
                                >
                                    <FaAngleLeft />
                                </Box>
                            ) : null}
                        </Box>
                        <Flex>
                            {pages
                                ? pages.map((page, index) => {
                                      return (
                                          <Box key={index} mx={"3px"}>
                                              <Button
                                                  size={"sm"}
                                                  colorScheme="blue"
                                                  variant={page === pageNumber ? "solid" : "outline"}
                                                  onClick={() => handlePageNumberClick(page)}
                                              >
                                                  {page}
                                              </Button>
                                          </Box>
                                      );
                                  })
                                : null}
                        </Flex>
                        <Box w={"22px"}>
                            {pageNumber !== pages.length ? (
                                <Box
                                    pt={"7px"}
                                    ml={"5px"}
                                    onClick={() => handlePageNumberClick(pageNumber + 1)}
                                    cursor={"pointer"}
                                >
                                    <FaAngleRight />
                                </Box>
                            ) : null}
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <TableContainer pb={type === "table" ? "300px" : "0"}>
                <Table size="sm" style={{ tableLayout: "fixed" }}>
                    <Thead>
                        {/* ******** COLUMNS ******** */}
                        {/* ************************* */}
                        <Tr>
                            {(permissions || 0) > 1 ? (
                                <>
                                    <Th w={"150px"} px={"14px"}>
                                        <Flex>
                                            <Spacer />
                                            <GoTag
                                                fontSize={"16px"}
                                                onClick={() => setShowTagsColumn(!showTagsColumn)}
                                                cursor={"pointer"}
                                            />
                                        </Flex>
                                    </Th>
                                    {showTagsColumn ? <Th w={tagsColumnWidth}>TAGS</Th> : null}
                                </>
                            ) : null}
                            {columns?.map((column: TColumn, index: number) => {
                                let width = "200px";

                                if (column.type === "people") width = "145px";
                                if (column.type === "date") width = "210px";
                                if (column.type === "priority" || column.type === "status" || column.type === "label")
                                    width = "170px";
                                if (column.type === "number") width = "120px";
                                if (column.type === "link" || column.type === "upload") width = "120px";
                                return (
                                    <Th key={index} width={width}>
                                        {(permissions || 0) > 1 ? (
                                            <Menu>
                                                <MenuButton
                                                // onClick={() => handleColumnHover(index)}
                                                >
                                                    <Text as={"b"}>
                                                        {column.name.split("_").join(" ").toUpperCase()}
                                                    </Text>
                                                </MenuButton>
                                                <MenuList>
                                                    <RenameColumn column={column} />
                                                    <DeleteColumnAlert column={column} />
                                                    <MenuGroup title="Sort">
                                                        <MenuItem
                                                            onClick={() => handleDescendingSortClick(column.name)}
                                                        >
                                                            Sort Descending
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleAscendingSortClick(column.name)}>
                                                            Sort Ascending
                                                        </MenuItem>
                                                    </MenuGroup>
                                                </MenuList>
                                            </Menu>
                                        ) : (
                                            column.name.split("_").join(" ").toUpperCase()
                                        )}
                                    </Th>
                                );
                            })}
                            {(permissions || 0) > 1 ? (
                                <Th>
                                    <CreateColumn columns={columns || []} createColumn={createColumn} />
                                </Th>
                            ) : null}
                        </Tr>
                    </Thead>

                    <Tbody>
                        {/* ******** ROWS *********** */}
                        {/* ************************* */}
                        {showRowForm || rows?.length || 0 > 0 ? null : (
                            <Tr>
                                <Td colSpan={(columns?.length || 0) + 2}>
                                    <Center m={6}>
                                        <Text color={"rgb(123, 128, 154)"}>This data collection is empty.</Text>
                                    </Center>
                                </Td>
                            </Tr>
                        )}

                        {rows?.map((row: any, index: number) => {
                            console.log(row);
                            return (
                                <Tr key={index}>
                                    {(permissions || 0) > 1 ? (
                                        <>
                                            {/* ROW TOOLBAR SECTION ***************************** */}
                                            <Td>
                                                <Flex>
                                                    <Checkbox
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            onDeleteRowCheckboxChange(event, row, index)
                                                        }
                                                        isChecked={checkboxes[index]}
                                                    />
                                                    <EditRow cells={row.cells} />
                                                    <NoteModal
                                                        row={row}
                                                        updateRow={updateRow}
                                                        rowCallUpdate={rowCallUpdate}
                                                    />
                                                    <Box
                                                        ml={"10px"}
                                                        pt={"2px"}
                                                        cursor={"pointer"}
                                                        onClick={() => handleReminderClick(row)}
                                                    >
                                                        <FaRegBell color={row.reminder ? "#16b2fc" : "#b8b8b8"} />
                                                    </Box>
                                                    <Tooltip
                                                        openDelay={500}
                                                        label={
                                                            !row.acknowledged ? "Needs acknowledgement" : "Acknowledged"
                                                        }
                                                    >
                                                        <Box
                                                            ml={"10px"}
                                                            pt={"2px"}
                                                            cursor={"pointer"}
                                                            onClick={() => handleAcknowledgeClick(row)}
                                                        >
                                                            <FaRegCheckSquare
                                                                color={!row.acknowledged ? "#ffa507" : "#16b2fc"}
                                                            />
                                                        </Box>
                                                    </Tooltip>
                                                </Flex>
                                            </Td>
                                            {/* TAGS COLLAPSABLE ******************************************* */}
                                            {showTagsColumn ? (
                                                <Td>
                                                    <Box overflow={"revert"}>
                                                        <Flex>
                                                            <TagsModal
                                                                tagType={"row"}
                                                                data={row}
                                                                tags={row.tags}
                                                                update={updateRow}
                                                                workspaceId={dataCollection?.workspace || ""}
                                                            />
                                                            {row.tags !== undefined
                                                                ? row.tags.map((tag: TTag, index: number) => {
                                                                      return (
                                                                          <>
                                                                              <WrapItem key={index}>
                                                                                  <Tag
                                                                                      size={"sm"}
                                                                                      variant="subtle"
                                                                                      colorScheme="blue"
                                                                                      mr={"5px"}
                                                                                      zIndex={1000}
                                                                                  >
                                                                                      <TagLabel pb={"2px"}>
                                                                                          {tag.name}
                                                                                      </TagLabel>
                                                                                      <TagCloseButton
                                                                                          onClick={() =>
                                                                                              handleCloseTagButtonClick(
                                                                                                  row,
                                                                                                  tag
                                                                                              )
                                                                                          }
                                                                                          zIndex={1000}
                                                                                      />
                                                                                  </Tag>
                                                                              </WrapItem>
                                                                          </>
                                                                      );
                                                                  })
                                                                : null}
                                                        </Flex>
                                                    </Box>
                                                </Td>
                                            ) : null}
                                        </>
                                    ) : null}
                                    {/* CELLS *********************** */}
                                    {row.cells.map((cell: TCell, index: number) => {
                                        return (
                                            <Td key={index} px={cell.type == "label" ? "1px" : "10px"} py={"0"} m={"0"}>
                                                {/* <Tooltip
                                                    label={cell.value}
                                                    openDelay={500}
                                                    isDisabled={isFocused}
                                                    placement={"top"}
                                                > */}
                                                {cell.type === "label" ||
                                                cell.type === "priority" ||
                                                cell.type === "status" ? (
                                                    <Box>
                                                        <LabelMenu cell={cell} value={cell.value} />
                                                    </Box>
                                                ) : cell.type === "people" ? (
                                                    <Box>
                                                        {!((permissions || 0) > 1) ? (
                                                            <Text cursor={"default"}>{cell.value}</Text>
                                                        ) : (
                                                            <Box>
                                                                <PeopleMenu cell={cell} value={cell.value} />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                ) : cell.type === "date" ? (
                                                    <DateInput
                                                        cell={cell}
                                                        value={cell.value}
                                                        permissions={permissions}
                                                    />
                                                ) : cell.type === "number" ? (
                                                    <Box>
                                                        <NumberInput
                                                            cell={cell}
                                                            value={cell.value}
                                                            permissions={permissions}
                                                        />
                                                    </Box>
                                                ) : cell.type === "upload" ? (
                                                    <Box>
                                                        <UploadMenu
                                                            cell={cell}
                                                            addToCell={true}
                                                            // handleDocsChange={handleCellDocsChange}
                                                            handleAddExistingDoc={handleAddExistingDoc}
                                                            // handleAddExistingDocToCell={handleAddExistingDocToCell}
                                                            create={false}
                                                            columnName={cell.name}
                                                        />
                                                    </Box>
                                                ) : cell.type === "link" ? (
                                                    <Box>
                                                        <LinksMenu
                                                            cell={cell}
                                                            // handleAddLinkClick={handleAddLinkClick}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box>
                                                        <TextInput
                                                            cell={cell}
                                                            value={cell.value}
                                                            permissions={permissions}
                                                        />
                                                    </Box>
                                                )}
                                                {/* </Tooltip> */}
                                            </Td>
                                        );
                                    })}
                                </Tr>
                            );
                        })}
                        {/* ********** CREATE ROW ********* */}
                        {/* ******************************* */}
                        {showRowForm ? (
                            <Tr>
                                <Td borderBottom={"none"} pl={"2px"}>
                                    <Box position={"relative"}>
                                        <Box position={"absolute"} bottom={"-12px"} right={"-14px"}>
                                            <IconButton
                                                onClick={handleSaveRowClick}
                                                size={"xs"}
                                                variant={"unstyled"}
                                                aria-label=""
                                                icon={<AiOutlineCheck size={"15px"} />}
                                            ></IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    setShowRowForm(false);
                                                    setRow({ dataCollection: dataCollection?._id, docs: [] });
                                                    // document.removeEventListener("keyup", handleAddRowOnEnter);
                                                }}
                                                size={"xs"}
                                                variant={"unstyled"}
                                                aria-label=""
                                                icon={<AiOutlineClose size={"15px"} />}
                                            ></IconButton>
                                        </Box>
                                    </Box>
                                </Td>
                                {showTagsColumn ? <Td></Td> : null}
                                {columns?.map((column: TColumn, index: number) => {
                                    // setDefaultRow();
                                    const options = column.labels?.map((item) => {
                                        return {
                                            value: item.title,
                                            label: item.title,
                                            color: item.color,
                                        };
                                    });
                                    const peopleOptions = column.people?.map((item) => {
                                        return {
                                            value: item._id,
                                            label: `${item.firstname} ${item.lastname}`,
                                            color: "#ffffff",
                                        };
                                    });
                                    return (
                                        <Td
                                            key={index}
                                            p={column.type == "label" ? "0" : "inherit"}
                                            pr={"5px"}
                                            borderBottom={"none"}
                                            overflow={"visible"}
                                        >
                                            {column.type == "label" ||
                                            column.type == "priority" ||
                                            column.type == "status" ? (
                                                <Box>
                                                    <Select
                                                        // name={column.name}
                                                        options={options}
                                                        onChange={(selectedOption) =>
                                                            handleLabelChange(selectedOption, column.name)
                                                        }
                                                        // defaultValue={{ label: "", value: "", color: "white" }}
                                                        styles={createRowColorStyles()}
                                                        defaultInputValue=""
                                                    />
                                                </Box>
                                            ) : column.type == "people" ? (
                                                <Box>
                                                    <Select
                                                        // name={column.name}
                                                        options={peopleOptions}
                                                        onChange={(selectedOption) =>
                                                            handleLabelChange(selectedOption, column.name)
                                                        }
                                                        // defaultValue={
                                                        //     peopleOptions ? peopleOptions[0] : { label: "", value: "" }
                                                        // }
                                                        styles={createRowColorStyles()}
                                                    />
                                                </Box>
                                            ) : column.type == "date" ? (
                                                <Box>
                                                    <input
                                                        type="datetime-local"
                                                        name={column.name}
                                                        onChange={handleAddRowInputChange}
                                                        defaultValue={""}
                                                        style={{
                                                            border: "1px solid #cccccc",
                                                            padding: "9px",
                                                            borderRadius: "4px",
                                                            color: "#828282",
                                                        }}
                                                        // onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                                        //     handleAddRowOnEnter(event)
                                                        // }
                                                    />
                                                </Box>
                                            ) : column.type == "number" ? (
                                                <Box>
                                                    <input
                                                        type="number"
                                                        name={column.name}
                                                        onChange={handleAddRowInputChange}
                                                        defaultValue={""}
                                                        style={{
                                                            width: "114px",
                                                            border: "1px solid #cccccc",
                                                            padding: "11px",
                                                            borderRadius: "4px",
                                                            color: "#828282",
                                                        }}
                                                        autoFocus={index == 0}
                                                        ref={(el) => {
                                                            if (index == 0 && firstInputFocus) {
                                                                el?.focus();
                                                                el?.scrollIntoView();
                                                            } else {
                                                                setFirstInputFocus(false);
                                                            }
                                                        }}
                                                        // onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                                        //     handleAddRowOnEnter(event)
                                                        // }
                                                    />
                                                </Box>
                                            ) : column.type == "upload" ? (
                                                <UploadMenu
                                                    // preparedRow={row}
                                                    handleDocsChange={handleDocsChange}
                                                    handleAddExistingDoc={handleAddExistingDoc}
                                                    create={true}
                                                    columnName={column.name}
                                                />
                                            ) : column.type == "link" ? (
                                                <LinksMenu cell={null} handleAddLinkClick={handleAddLinkClick} />
                                            ) : (
                                                <Box>
                                                    <Input
                                                        name={column.name}
                                                        onChange={handleAddRowInputChange}
                                                        placeholder=""
                                                        value={row[column.name]}
                                                        size={"md"}
                                                        borderColor={"#cccccc"}
                                                        autoFocus={index == 0}
                                                        ref={(el) => {
                                                            if (index == 0 && firstInputFocus) {
                                                                el?.focus();
                                                                el?.scrollIntoView();
                                                            } else {
                                                                setFirstInputFocus(false);
                                                            }
                                                        }}
                                                        // onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                                        //     handleAddRowOnEnter(event)
                                                        // }
                                                    />
                                                </Box>
                                            )}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        ) : (
                            <Tr>
                                <Td p={"0"} display={(permissions || 0) > 1 ? "contents" : "none"}>
                                    <Box position={"relative"}>
                                        <Box position={"absolute"} bottom={"-12"} left={"-26px"}>
                                            <Button
                                                variant={"unstyled"}
                                                onClick={() => {
                                                    setShowRowForm(true);
                                                }}
                                                leftIcon={<AiOutlinePlus />}
                                                w={"140px"}
                                                size={"sm"}
                                                m={"10px"}
                                                color={"rgb(123, 128, 154)"}
                                            >
                                                Add Row
                                            </Button>
                                        </Box>
                                    </Box>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            {showDeleteBox ? (
                <Box position={"relative"}>
                    <Box
                        position={"fixed"}
                        bottom={30}
                        left={{ base: 0, lg: 280 }}
                        w={{
                            sm: "100%",
                            md: "100%",
                            lg: "70%",
                        }}
                        p={"18px"}
                    >
                        <Card variant={"elevated"} borderWidth={"1px"} borderColor={"lightgray"}>
                            <CardBody>
                                <Flex>
                                    <Text mt={"10px"}>
                                        You've selected {deleteRows.length} {numberChecked === 1 ? "item" : "items"}.
                                        Click to delete them.
                                    </Text>
                                    <Spacer />
                                    <Button colorScheme="red" onClick={deleteItems}>
                                        Delete
                                    </Button>
                                </Flex>
                            </CardBody>
                        </Card>
                    </Box>
                </Box>
            ) : null}
        </>
    );
};

export default DataCollectionTable;
