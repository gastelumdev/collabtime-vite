import React, { useEffect, useState } from "react";
import {
    useGetColumnsQuery,
    useDeleteColumnMutation,
    useGetRowsQuery,
    useCreateRowMutation,
    useDeleteRowMutation,
    useUpdateCellMutation,
    useGetUserQuery,
    useUpdateRowMutation,
    useRowCallUpdateMutation,
} from "../../app/services/api";
import {
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
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
} from "@chakra-ui/react";
import Select from "react-select";

import { BsPlusCircle } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

import { TCell, TColumn } from "../../types";
import { useParams } from "react-router-dom";

import { cellColorStyles, createRowColorStyles } from "./select.styles";
import NoteModal from "./NoteModal";
import RenameColumn from "./RenameColumn";
import EditRow from "./EditRow";
import { io } from "socket.io-client";

const DataCollection = ({ onOpen }: { onOpen: any }) => {
    const { dataCollectionId } = useParams();

    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");

    const { data: columns } = useGetColumnsQuery(null);
    const [deleteColumn] = useDeleteColumnMutation();
    const {
        data: rows,
        isLoading: rowsLoading,
        isFetching: rowsFetching,
        isSuccess: rowsSuccess,
    } = useGetRowsQuery(null);
    const [createRow, { isLoading: creatingRow }] = useCreateRowMutation();
    const [updateRow] = useUpdateRowMutation();
    const [deleteRow, { isLoading: deletingRows }] = useDeleteRowMutation();
    const [updateCell] = useUpdateCellMutation();
    const [rowCallUpdate] = useRowCallUpdateMutation();
    const [headerMenuIsOpen, setHeaderMenuIsOpen] = useState(
        new Array(columns?.length).fill(null).map(() => {
            return false;
        })
    );

    const [row, setRow] = useState<any>({});
    const [labelStyles, setLabelStyles] = useState<any>({});
    const [labelValue, setLabelValue] = useState<any>({});
    const [numberChecked, setNumberChecked] = useState<number>(0);
    const [showRowForm, setShowRowForm] = useState<boolean>(false);

    const [editMode, setEditMode] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [tempValue, setTempValue] = useState("");
    const [initialValue, setInitialValue] = useState("");

    const [deleteRowIds, setDeleteRowIds] = useState<string[]>([]);
    const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);

    const [firstInputFocus, setFirstInputFocus] = useState(true);

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    useEffect(() => {
        console.log(columns);
    }, [columns]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem("workspaceId")) {
                setPermissions(workspace.permissions);
            }
        }
    };

    useEffect(() => {
        localStorage.setItem("dataCollectionId", dataCollectionId || "");
        // setData(rows as TRow[]);
    }, [rowsSuccess, rows]);

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

    const setDefaultRow = () => {
        let temp = {};
        for (const column of columns || []) {
            temp = { ...temp, [column.name]: "" };
        }
        setRow(temp);
    };

    const handleDeleteColumn = (column: TColumn) => {
        deleteColumn(column?._id as any);
        // setData(rows || []);
    };

    const handleLabelChange = (selectedValue: any, columnName: string) => {
        setLabelValue({ ...labelValue, [columnName]: selectedValue.value });
        console.log(selectedValue);
        let rowCopy = row;
        setRow({ ...rowCopy, [columnName]: selectedValue.value });
        setFirstInputFocus(false);
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
        const deleteRowIdsCopy = deleteRowIds;

        if (event.target.checked) {
            deleteRowIdsCopy.push(row._id);
            setNumberChecked(numberChecked + 1);
        } else {
            let index = deleteRowIdsCopy.indexOf(row._id);
            deleteRowIdsCopy.splice(index, 1);
            setNumberChecked(numberChecked - 1);
        }

        setDeleteRowIds(deleteRowIdsCopy);

        if (deleteRowIdsCopy.length > 0) {
            setShowDeleteBox(true);
        } else {
            setShowDeleteBox(false);
        }
    };

    const deleteItems = async () => {
        for (const rowId of deleteRowIds) {
            deleteRow(rowId);
        }

        setShowDeleteBox(false);
        setDeleteRowIds([]);
    };

    const handleColumnHover = (index: number) => {
        const headerMenuIsOpenCopy = headerMenuIsOpen;
        headerMenuIsOpenCopy[index] = true;
        setHeaderMenuIsOpen(headerMenuIsOpenCopy);
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

    return (
        <>
            <Box h={"20px"}>
                {rowsLoading || deletingRows || creatingRow || rowsFetching ? (
                    <Progress size="xs" isIndeterminate />
                ) : null}
            </Box>
            <TableContainer pb={"300px"}>
                <Table size="sm">
                    <Thead>
                        {/* ******** COLUMNS ******** */}
                        {/* ************************* */}
                        <Tr>
                            {(permissions || 0) > 1 ? (
                                <Th w={"60px"}>
                                    <Text visibility={"hidden"}>Wor</Text>
                                </Th>
                            ) : null}
                            {columns?.map((column: TColumn, index: number) => {
                                return (
                                    <Th key={index}>
                                        {(permissions || 0) > 1 ? (
                                            <Menu>
                                                <MenuButton onClick={() => handleColumnHover(index)}>
                                                    <Text as={"b"}>
                                                        {column.name.split("_").join(" ").toUpperCase()}
                                                    </Text>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => handleDeleteColumn(column)}>
                                                        Delete Column
                                                    </MenuItem>
                                                    <RenameColumn column={column} />
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
                                    <Button onClick={onOpen} variant={"unstyled"} float={"right"}>
                                        <BsPlusCircle />
                                    </Button>
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
                                                {cell.type === "label" ||
                                                cell.type === "priority" ||
                                                cell.type === "status" ? (
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
                                                        onChange={(newValue) => handleLabelSelectChange(newValue, cell)}
                                                        isDisabled={
                                                            rowsLoading || rowsFetching || !((permissions || 0) > 1)
                                                        }
                                                    />
                                                ) : cell.type === "people" ? (
                                                    <Select
                                                        options={peopleOptions}
                                                        styles={cellColorStyles({
                                                            bgColor: "#ffffff",
                                                            padding: "7px",
                                                            border: "none",
                                                        })}
                                                        defaultValue={{
                                                            value: cell.value,
                                                            label: cell.value == "" ? "Select..." : cell.value,
                                                        }}
                                                        onChange={(newValue) => handleLabelSelectChange(newValue, cell)}
                                                        isDisabled={
                                                            rowsLoading || rowsFetching || !((permissions || 0) > 1)
                                                        }
                                                    />
                                                ) : cell.type === "date" ? (
                                                    <input
                                                        type="datetime-local"
                                                        defaultValue={cell.value.slice(0, 16)}
                                                        name={cell.name}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                            console.log(event);
                                                            handleUpdateRowInputChange(event);
                                                        }}
                                                        onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                            handleUpdateRowOnFocus(event, cell)
                                                        }
                                                        onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                                            handleUpdateRowOnBlur(event, cell)
                                                        }
                                                    />
                                                ) : (
                                                    <Tooltip
                                                        label={cell.value}
                                                        openDelay={500}
                                                        isDisabled={isFocused}
                                                        placement={"top"}
                                                    >
                                                        <Input
                                                            value={
                                                                editMode.includes(cell?._id) ? tempValue : cell.value
                                                            }
                                                            size={"sm"}
                                                            w={"180px"}
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
                                                        />
                                                    </Tooltip>
                                                )}
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
                                        <Box position={"absolute"} bottom={"-12"}>
                                            <Button
                                                variant={"unstyled"}
                                                onClick={() => {
                                                    setShowRowForm(true);
                                                }}
                                                leftIcon={<AiOutlinePlus />}
                                                w={"10px"}
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
                                        You've selected {deleteRowIds.length} {numberChecked === 1 ? "item" : "items"}.
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

export default DataCollection;
