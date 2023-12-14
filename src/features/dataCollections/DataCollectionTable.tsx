import React, { useEffect, useState } from "react";
import {
    useDeleteColumnMutation,
    useCreateRowMutation,
    useDeleteRowMutation,
    useUpdateCellMutation,
    useUpdateRowMutation,
    useRowCallUpdateMutation,
    useCreateColumnMutation,
    useDeleteTagMutation,
    useTagExistsMutation,
    useGetDataCollectionQuery,
    useGetOneWorkspaceQuery,
    useUpdateWorkspaceMutation,
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
} from "@chakra-ui/react";
import Select from "react-select";

import { AiOutlineCheck, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

import { cellColorStyles, createRowColorStyles } from "./select.styles";
import NoteModal from "./NoteModal";
import RenameColumn from "./RenameColumn";
import EditRow from "./EditRow";
import { TCell, TColumn, TRow, TTag } from "../../types";
import CreateColumn from "./CreateColumn";
import { io } from "socket.io-client";
import { GoTag } from "react-icons/go";
import TagsModal from "../tags/TagsModal";
import { useParams } from "react-router-dom";

interface IProps {
    columns: TColumn[];
    rows: TRow[];
    rowsLoading?: boolean;
    rowsFetching?: boolean;
    dataCollectionId: string;
    permissions?: number;
    type?: string;
}

const DataCollectionTable = ({
    columns,
    rows,
    rowsLoading,
    rowsFetching,
    dataCollectionId,
    permissions = 2,
    type = "table",
}: IProps) => {
    const cancelRef = React.useRef<any>(null);
    const { id } = useParams();

    const { data: dataCollection } = useGetDataCollectionQuery(dataCollectionId || "");
    const { data: workspace } = useGetOneWorkspaceQuery(id || "");

    const [createColumn] = useCreateColumnMutation();
    const [deleteColumn] = useDeleteColumnMutation();
    const [createRow, { isLoading: creatingRow }] = useCreateRowMutation();
    const [updateRow] = useUpdateRowMutation();
    const [deleteRow, { isLoading: deletingRows }] = useDeleteRowMutation();
    const [updateCell] = useUpdateCellMutation();
    const [rowCallUpdate] = useRowCallUpdateMutation();
    const [updateWorkspace] = useUpdateWorkspaceMutation();

    const [deleteTag] = useDeleteTagMutation();
    const [tagExists] = useTagExistsMutation();

    const [row, setRow] = useState<any>({});
    const [labelStyles, setLabelStyles] = useState<any>({});
    const [labelValue, setLabelValue] = useState<any>({});
    const [numberChecked, setNumberChecked] = useState<number>(0);
    const [showRowForm, setShowRowForm] = useState<boolean>(false);

    const [editMode, setEditMode] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [tempValue, setTempValue] = useState("");
    const [initialValue, setInitialValue] = useState("");

    const [deleteRows, setDeleteRows] = useState<TRow[]>([]);
    const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);

    const [firstInputFocus, setFirstInputFocus] = useState(true);

    const [headerMenuIsOpen, setHeaderMenuIsOpen] = useState(
        new Array(columns?.length).fill(null).map(() => {
            return false;
        })
    );

    const [showTagsColumn, setShowTagsColumn] = useState<boolean>(false);
    const [tagsColumnWidth, setTagsColumnWidth] = useState<string>("");

    /**
     * This converts data so that the react table can read it before the component
     * loads.
     */
    useEffect(() => {
        setDefaultRow();
    }, []);

    useEffect(() => {
        for (const column of columns || []) {
            if (column.type === "label") {
                setLabelStyles({ ...labelStyles, [column.name]: "" });
            }
        }
        console.log(columns);
        console.log();
    }, []);

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

    useEffect(() => {
        let max = 0;
        let maxTags = 0;
        for (const row of rows) {
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

    const setDefaultRow = () => {
        let temp: TRow = { dataCollection: dataCollectionId, notesList: [], cells: [], tags: [] };
        for (const column of columns || []) {
            temp = { ...temp, [column.name]: "" };
        }

        setRow(temp);
    };

    const handleLabelChange = (selectedValue: any, columnName: string) => {
        setLabelValue({ ...labelValue, [columnName]: selectedValue.value });
        console.log(selectedValue);
        let rowCopy = row;
        setRow({ ...rowCopy, [columnName]: selectedValue.value });
        setFirstInputFocus(false);
    };

    const handleColumnHover = (index: number) => {
        const headerMenuIsOpenCopy = headerMenuIsOpen;
        headerMenuIsOpenCopy[index] = true;
        setHeaderMenuIsOpen(headerMenuIsOpenCopy);
    };

    const handleDeleteColumn = (column: TColumn) => {
        console.log(column);
        deleteColumn(column);
        // setData(rows || []);
    };

    const handleAddRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRow({ ...row, [event.target.name]: event.target.value });
    };

    const handleUpdateRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
        setTempValue(event.target.value);
    };

    const handleUpdateRowOnFocus = (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
        setInitialValue(event.target.value);
        const em: string[] = [];
        em.push(cell._id);
        setEditMode(em as any);
        setTempValue(event.target.value);
        setIsFocused(true);
    };

    const handleUpdateRowOnBlur = async (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
        console.log("******ON BLUR", event.target.value);
        let newCell = cell;
        newCell = { ...newCell, value: event.target.value };
        if (initialValue != event.target.value) await updateCell(newCell);

        let tempEditMode = editMode;
        tempEditMode.pop();
        setEditMode(tempEditMode);
        setIsFocused(false);
    };

    const handleSaveRowClick = async () => {
        await createRow(row);
        setShowRowForm(false);
        setDefaultRow();
    };

    const onDeleteRowCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
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
    };

    const deleteItems = async () => {
        for (const row of deleteRows) {
            deleteRow(row);
        }

        setShowDeleteBox(false);
        setDeleteRows([]);
    };

    const handleAddRowOnKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            await createRow(row);
            setFirstInputFocus(true);
            setDefaultRow();
        }
    };

    const handleLabelSelectChange = async (newValue: any, cell: TCell) => {
        let newCell = cell;
        newCell = { ...newCell, value: newValue.value };
        await updateCell(newCell);
    };

    const handleCloseTagButtonClick = async (row: TRow, tag: TTag) => {
        const { tags } = row;
        console.log(tags);

        const filteredTags = tags.filter((item) => {
            return tag.name !== item.name;
        });

        const addNewRow = { ...row, tags: filteredTags };
        console.log(addNewRow);
        const updatedRowRes: any = await updateRow(addNewRow);
        const updatedRow = updatedRowRes.data;
        console.log(updatedRow);

        let workspaceTags;

        if (workspace) {
            workspaceTags = workspace.workspaceTags;
        }

        const thisTagExistsRes: any = await tagExists(tag);
        console.log(thisTagExistsRes);

        if (!thisTagExistsRes.data.tagExists) {
            const filteredWorkspaceTags = workspaceTags?.filter((item: TTag) => {
                return item.name !== tag.name;
            });
            const newUpdatedWorkspace: any = { ...workspace, workspaceTags: filteredWorkspaceTags };

            await updateWorkspace(newUpdatedWorkspace);
            await deleteTag(tag);
        }
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
                                <Button ref={cancelRef} onClick={deleteColumnModalOnClose}>
                                    Cancel
                                </Button>
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
                <Box h={"20px"}>
                    {rowsLoading || deletingRows || creatingRow || rowsFetching ? (
                        <Progress size="xs" isIndeterminate />
                    ) : null}
                </Box>
            ) : null}
            <TableContainer pb={type === "table" ? "300px" : "0"}>
                <Table size="sm" style={{ tableLayout: "fixed" }}>
                    <Thead>
                        {/* ******** COLUMNS ******** */}
                        {/* ************************* */}
                        <Tr>
                            {(permissions || 0) > 1 ? (
                                <>
                                    <Th w={"100px"} px={"14px"}>
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
                                console.log(tagsColumnWidth);
                                let width = "200px";

                                if (column.type === "people") width = "145px";
                                if (column.type === "priority" || column.type === "status" || column.type === "label")
                                    width = "170px";
                                console.log(column.type, width);
                                return (
                                    <Th key={index} width={width}>
                                        {(permissions || 0) > 1 ? (
                                            <Menu>
                                                <MenuButton onClick={() => handleColumnHover(index)}>
                                                    <Text as={"b"}>
                                                        {column.name.split("_").join(" ").toUpperCase()}
                                                    </Text>
                                                </MenuButton>
                                                <MenuList>
                                                    <RenameColumn column={column} />
                                                    <DeleteColumnAlert column={column} />
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
                                    <CreateColumn columns={columns} createColumn={createColumn} />
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
                            return (
                                <Tr key={index}>
                                    {(permissions || 0) > 1 ? (
                                        <>
                                            <Td>
                                                <Flex>
                                                    <Checkbox
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            onDeleteRowCheckboxChange(event, row)
                                                        }
                                                    />
                                                    <EditRow cells={row.cells} />
                                                    <NoteModal
                                                        row={row}
                                                        updateRow={updateRow}
                                                        rowCallUpdate={rowCallUpdate}
                                                    />
                                                </Flex>
                                            </Td>
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
                                    {row.cells.map((cell: TCell, index: number) => {
                                        let bgColor: string = "";
                                        for (const label of cell.labels || []) {
                                            if (cell.value == label.title) {
                                                bgColor = label.color;
                                            }
                                        }
                                        const options = cell.labels?.map((item) => {
                                            return {
                                                value: item.title,
                                                label: item.title,
                                                color: item.color,
                                            };
                                        });
                                        const peopleOptions = cell.people?.map((item) => {
                                            return {
                                                value: item._id,
                                                label: `${item.firstname} ${item.lastname}`,
                                                color: "#ffffff",
                                            };
                                        });
                                        return (
                                            <Td key={index} px={cell.type == "label" ? "1px" : "10px"} py={"0"} m={"0"}>
                                                <Tooltip
                                                    label={cell.value}
                                                    openDelay={500}
                                                    isDisabled={isFocused}
                                                    placement={"top"}
                                                >
                                                    {cell.type === "label" ||
                                                    cell.type === "priority" ||
                                                    cell.type === "status" ? (
                                                        <Box>
                                                            <Select
                                                                options={options}
                                                                styles={cellColorStyles({
                                                                    bgColor,
                                                                    padding: "10px",
                                                                    border: "none",
                                                                })}
                                                                defaultValue={{
                                                                    value: cell.value,
                                                                    label: cell.value == "" ? "Select..." : cell.value,
                                                                }}
                                                                onChange={(newValue) =>
                                                                    handleLabelSelectChange(newValue, cell)
                                                                }
                                                                isDisabled={
                                                                    rowsLoading ||
                                                                    rowsFetching ||
                                                                    !((permissions || 0) > 1)
                                                                }
                                                            />
                                                        </Box>
                                                    ) : cell.type === "people" ? (
                                                        <Box>
                                                            {rowsLoading ||
                                                            rowsFetching ||
                                                            !((permissions || 0) > 1) ? (
                                                                <Text cursor={"default"}>{cell.value}</Text>
                                                            ) : (
                                                                <Box>
                                                                    <Select
                                                                        options={peopleOptions}
                                                                        styles={cellColorStyles({
                                                                            bgColor: "#ffffff",
                                                                            padding: "7px",
                                                                            border: "none",
                                                                        })}
                                                                        defaultValue={{
                                                                            value: cell.value,
                                                                            label:
                                                                                cell.value == ""
                                                                                    ? "Select..."
                                                                                    : cell.value,
                                                                        }}
                                                                        onChange={(newValue) =>
                                                                            handleLabelSelectChange(newValue, cell)
                                                                        }
                                                                        // isDisabled={
                                                                        //     rowsLoading || rowsFetching || !((permissions || 0) > 1)
                                                                        // }
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    ) : cell.type === "date" ? (
                                                        <input
                                                            type="datetime-local"
                                                            defaultValue={cell.value.slice(0, 16)}
                                                            name={cell.name}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                console.log(event);
                                                                handleUpdateRowInputChange(event);
                                                            }}
                                                            onFocus={(
                                                                event: React.FocusEvent<HTMLInputElement, Element>
                                                            ) => handleUpdateRowOnFocus(event, cell)}
                                                            onBlur={(
                                                                event: React.FocusEvent<HTMLInputElement, Element>
                                                            ) => handleUpdateRowOnBlur(event, cell)}
                                                            disabled={
                                                                rowsLoading || rowsFetching || !((permissions || 0) > 1)
                                                            }
                                                        />
                                                    ) : (
                                                        <Input
                                                            value={
                                                                editMode.includes(cell?._id) ? tempValue : cell.value
                                                            }
                                                            size={"sm"}
                                                            variant={"unstyled"}
                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                handleUpdateRowInputChange(event)
                                                            }
                                                            onFocus={(
                                                                event: React.FocusEvent<HTMLInputElement, Element>
                                                            ) => handleUpdateRowOnFocus(event, cell)}
                                                            onBlur={(
                                                                event: React.FocusEvent<HTMLInputElement, Element>
                                                            ) => handleUpdateRowOnBlur(event, cell)}
                                                            isDisabled={
                                                                rowsLoading ||
                                                                deletingRows ||
                                                                creatingRow ||
                                                                rowsFetching
                                                            }
                                                            isReadOnly={!((permissions || 0) > 1)}
                                                            cursor={(permissions || 0) > 1 ? "text" : "default"}
                                                            textOverflow={"ellipsis"}
                                                        />
                                                    )}
                                                </Tooltip>
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
                                                onClick={() => setShowRowForm(false)}
                                                size={"xs"}
                                                variant={"unstyled"}
                                                aria-label=""
                                                icon={<AiOutlineClose size={"15px"} />}
                                            ></IconButton>
                                        </Box>
                                    </Box>
                                </Td>
                                {columns?.map((column: TColumn, index: number) => {
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
                                    console.log("PEOPLE OPTIONS", peopleOptions);
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
                                                <Box w={rows?.length || 0 > 0 ? "unset" : "150px"}>
                                                    <Select
                                                        // name={column.name}
                                                        options={options}
                                                        onChange={(selectedOption) =>
                                                            handleLabelChange(selectedOption, column.name)
                                                        }
                                                        styles={createRowColorStyles()}
                                                    />
                                                </Box>
                                            ) : column.type == "people" ? (
                                                <Box w={rows?.length || 0 > 0 ? "unset" : "150px"}>
                                                    <Select
                                                        // name={column.name}
                                                        options={peopleOptions}
                                                        onChange={(selectedOption) =>
                                                            handleLabelChange(selectedOption, column.name)
                                                        }
                                                        styles={createRowColorStyles()}
                                                    />
                                                </Box>
                                            ) : column.type == "date" ? (
                                                <Box w={rows?.length || 0 > 0 ? "unset" : "200px"}>
                                                    <input
                                                        type="datetime-local"
                                                        name={column.name}
                                                        onChange={handleAddRowInputChange}
                                                        style={{
                                                            border: "1px solid #cccccc",
                                                            padding: "9px",
                                                            borderRadius: "4px",
                                                            color: "#828282",
                                                        }}
                                                    />
                                                </Box>
                                            ) : (
                                                <Box w={rows?.length || 0 > 0 ? "unset" : "150px"}>
                                                    <Input
                                                        name={column.name}
                                                        onChange={handleAddRowInputChange}
                                                        placeholder="Enter text"
                                                        value={row[column.name]}
                                                        size={"md"}
                                                        autoFocus={index == 0}
                                                        ref={(el) => {
                                                            if (index == 0 && firstInputFocus) {
                                                                el?.focus();
                                                                el?.scrollIntoView();
                                                            } else {
                                                                setFirstInputFocus(false);
                                                            }
                                                        }}
                                                        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                                            handleAddRowOnKeyUp(event)
                                                        }
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
