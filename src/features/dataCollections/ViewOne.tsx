import React, { useEffect, useState } from "react";
import {
    useGetColumnsQuery,
    useCreateColumnMutation,
    // useUpdateColumnMutation,
    useDeleteColumnMutation,
    useGetRowsQuery,
    useCreateRowMutation,
    useDeleteRowMutation,
    useUpdateCellMutation,
    useGetDataCollectionQuery,
    useGetUserQuery,
} from "../../app/services/api";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Center,
    Checkbox,
    Container,
    Flex,
    HStack,
    Heading,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Progress,
    SimpleGrid,
    Spacer,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import Select, { StylesConfig } from "react-select";

import { IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace, BsPlusCircle } from "react-icons/bs";
import { AiOutlineCheck, AiOutlineClose, AiOutlineMessage, AiOutlinePlus } from "react-icons/ai";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { TCell, TColumn, TLabel, TRow } from "../../types";
import { useParams } from "react-router-dom";
import Divider from "../../components/Divider/Divider";

import getTextColor from "../../utils/helpers";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import PrimaryDrawer from "../../components/PrimaryDrawer";

interface LinkItemProps {
    name: string;
    icon: IconType;
    path: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: "Workspaces", icon: BsPersonWorkspace, path: "/workspaces" },
    {
        name: "Data Collections",
        icon: BiTable,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/dataCollections`,
    },
    {
        name: "Tasks",
        icon: FaTasks,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/taskLists`,
    },
    {
        name: "Documents",
        icon: BsFiletypeDoc,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/documents`,
    },
    {
        name: "Message Board",
        icon: AiOutlineMessage,
        path: `/workspaces/${localStorage.getItem("workspaceId")}/messageBoard`,
    },
];

const ViewOne = () => {
    const { dataCollectionId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");

    const { data: dataCollection } = useGetDataCollectionQuery(null);

    const { data: columns } = useGetColumnsQuery(null);
    const [createColumn] = useCreateColumnMutation();
    const [deleteColumn] = useDeleteColumnMutation();
    const {
        data: rows,
        isLoading: rowsLoading,
        isFetching: rowsFetching,
        isSuccess: rowsSuccess,
    } = useGetRowsQuery(null);
    const [createRow, { isLoading: creatingRow }] = useCreateRowMutation();
    const [deleteRow, { isLoading: deletingRows }] = useDeleteRowMutation();
    const [updateCell] = useUpdateCellMutation();
    const [headerMenuIsOpen, setHeaderMenuIsOpen] = useState(
        new Array(columns?.length).fill(null).map(() => {
            console.log("column");
            return false;
        })
    );

    const [row, setRow] = useState<any>({});
    const [data, setData] = useState<TRow[]>(rows || []);
    // const [cells, setCells] = useState<TCell[]>(cellsData);
    const [columnName, setColumnName] = useState<string>("");
    const [columnType, setColumnType] = useState<string>("");
    const [showLabelForm, setShowLabelForm] = useState(false);
    const [labelOptions, setLabelOptions] = useState<TLabel>({
        title: "",
        color: "",
    });
    const [labels, setLabels] = useState<TLabel[]>([
        { title: "Label 1", color: "#005796" },
        { title: "Label 2", color: "#4FAD00" },
        { title: "Label 3", color: "#ffa507" },
    ]);
    const [labelStyles, setLabelStyles] = useState<any>({});
    const [labelValue, setLabelValue] = useState<any>({});
    const [numberChecked, setNumberChecked] = useState<number>(0);
    const [showRowForm, setShowRowForm] = useState<boolean>(false);

    const [editMode, setEditMode] = useState<string[]>([]);
    const [tempValue, setTempValue] = useState("");
    const [initialValue, setInitialValue] = useState("");

    const [deleteRowIds, setDeleteRowIds] = useState<string[]>([]);
    const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);

    const [firstInputFocus, setFirstInputFocus] = useState(true);

    const [permissions, setPermissions] = useState<number>();

    useEffect(() => {
        getPermissions();
    }, [user]);

    const getPermissions = () => {
        for (const workspace of user?.workspaces || []) {
            if (workspace.id == localStorage.getItem("workspaceId")) {
                setPermissions(workspace.permissions);
            }
        }
    };

    useEffect(() => {
        localStorage.setItem("dataCollectionId", dataCollectionId || "");
        console.log(rows);
        setData(rows as TRow[]);
        console.log(data);
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
    }, []);

    const setDefaultRow = () => {
        let temp = {};
        for (const column of columns || []) {
            temp = { ...temp, [column.name]: "" };
        }
        setRow(temp);
    };

    /**
     * This function converts rows and its cells to a format required by react table
     * This function also sorts the data
     * TTableData is set to any since the data is dynamic
     */
    // const convertData = () => {
    //     let cellsArray = [];
    //     for (const row of rows || []) {
    //         for (const c of row.cells) {
    //             cellsArray.push(c);
    //         }
    //     }
    //     setCells(cellsArray);
    //     console.log(cells);
    // };

    /**
     * Creates a new column
     * This should be replaced by RTK
     */
    const handleAddColumn = () => {
        const newColumn: TColumn = {
            dataCollectionId: localStorage.getItem("dataCollectionId") || "",
            name: columnName,
            type: columnType,
            permanent: false,
            labels: labels,
            people: [],
            includeInForm: true,
            includeInExport: true,
        };

        // Set column name to a database friendly underscore naming
        newColumn.name = newColumn.name.toLowerCase().split(" ").join("_");

        createColumn(newColumn);
        onClose();
    };

    /**
     * Sets the column name when input changes in create column drawer
     * @param event
     */
    const handleColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setColumnName(value);
    };

    const handleDeleteColumn = (column: TColumn) => {
        deleteColumn(column?._id as any);
        setData(rows || []);
        console.log("DATA********", data);
    };

    const handleSelectType = (selectedOption: any) => {
        setColumnType(selectedOption.value);

        if (selectedOption.value === "label") {
            setShowLabelForm(true);
        } else {
            setShowLabelForm(false);
        }
    };

    const handleLabelOptionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabelOptions({
            ...labelOptions,
            [event.target.name]: event.target.value,
        });
    };

    const removeLabel = (label: TLabel) => {
        const newLabels = labels.filter((item: TLabel) => {
            return label.title !== item.title;
        });

        setLabels(newLabels);
    };

    const addLabel = () => {
        //  labelsCopy = labels;
        const labelsCopy = [...labels, labelOptions];
        setLabels(labelsCopy);
        setLabelOptions({ title: "", color: "" });
    };

    const handleLabelChange = (selectedValue: any, columnName: string) => {
        setLabelValue({ ...labelValue, [columnName]: selectedValue.value });
        let rowCopy = row;
        setRow({ ...rowCopy, [columnName]: selectedValue.value });
    };

    const handleAddRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRow({ ...row, [event.target.name]: event.target.value });
    };

    const handleUpdateRowInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempValue(event.target.value);
    };

    const handleUpdateRowOnFocus = (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
        setInitialValue(event.target.value);
        const em: string[] = [];
        em.push(cell._id);
        setEditMode(em as any);
        setTempValue(event.target.value);
    };

    const handleUpdateRowOnBlur = async (event: React.FocusEvent<HTMLInputElement, Element>, cell: any) => {
        let newCell = cell;
        newCell = { ...newCell, value: event.target.value };
        if (initialValue != event.target.value) await updateCell(newCell);

        let tempEditMode = editMode;
        tempEditMode.pop();
        setEditMode(tempEditMode);
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
        console.log("NEW CELL", newCell);
        await updateCell(newCell);
    };

    const closeDrawer = () => {
        onClose();
        setShowLabelForm(false);
        setLabelOptions({
            title: "",
            color: "",
        });
    };

    return (
        <>
            <SideBarLayout linkItems={LinkItems}>
                <Box>
                    <Flex
                        minH={"100vh"}
                        // justify={"center"}
                        bg={"#eff2f5"}
                    >
                        <Container maxW={"8xl"} mt={{ base: 4, sm: 0 }}>
                            <SimpleGrid
                                spacing={6}
                                // templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                                columns={{ base: 1, sm: 2 }}
                                pb={"30px"}
                            >
                                <Flex>
                                    <Box>
                                        <Heading size={"sm"} mb={"12px"} color={"rgb(52, 71, 103)"}>
                                            Data Collections
                                        </Heading>
                                        <Text color={"rgb(123, 128, 154)"} fontSize={"md"} fontWeight={300}>
                                            Create data collection tables to visualize and manage your data.
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex>
                                    <Spacer />
                                    <Box pb={"20px"}>{/* <Create addNewWorkspace={addNewWorkspace} /> */}</Box>
                                </Flex>
                            </SimpleGrid>
                            <Card mb={"60px"}>
                                <CardHeader>
                                    <Flex>
                                        <Box>
                                            <Heading size={"sm"} mt={"5px"} mb={"4px"}>
                                                {dataCollection?.name}
                                            </Heading>
                                            <Text fontSize={"md"} color={"rgb(123, 128, 154)"}>
                                                {dataCollection?.description}
                                            </Text>
                                        </Box>
                                        <Spacer />
                                        {/* <PrimaryButton
                                            onClick={onOpen}
                                            float={"right"}
                                        >
                                            ADD FORM
                                        </PrimaryButton> */}
                                        {/* <AddForm
                                            updateDataCollection={
                                                updateDataCollection
                                            }
                                            dataCollection={dataCollection}
                                        /> */}
                                    </Flex>
                                    <Box h={"20px"}>
                                        {rowsLoading || deletingRows || creatingRow || rowsFetching ? (
                                            <Progress size="xs" isIndeterminate />
                                        ) : null}
                                    </Box>
                                </CardHeader>
                                <CardBody>
                                    <TableContainer pb={"300px"}>
                                        <Table size="sm">
                                            <Thead>
                                                <Tr>
                                                    {(permissions || 0) > 1 ? <Th w={"60px"}></Th> : null}
                                                    {columns?.map((column: TColumn, index: number) => {
                                                        return (
                                                            <Th key={index}>
                                                                {(permissions || 0) > 1 ? (
                                                                    <Menu>
                                                                        <MenuButton
                                                                            onClick={() => handleColumnHover(index)}
                                                                        >
                                                                            <Text as={"b"}>
                                                                                {column.name
                                                                                    .split("_")
                                                                                    .join(" ")
                                                                                    .toUpperCase()}
                                                                            </Text>
                                                                        </MenuButton>
                                                                        <MenuList>
                                                                            <MenuItem
                                                                                onClick={() =>
                                                                                    handleDeleteColumn(column)
                                                                                }
                                                                            >
                                                                                Delete Column
                                                                            </MenuItem>
                                                                        </MenuList>
                                                                    </Menu>
                                                                ) : (
                                                                    column.name
                                                                )}
                                                            </Th>
                                                        );
                                                    })}
                                                    {(permissions || 0) > 1 ? (
                                                        <Th>
                                                            <Button
                                                                onClick={onOpen}
                                                                variant={"unstyled"}
                                                                float={"right"}
                                                            >
                                                                <BsPlusCircle />
                                                            </Button>
                                                        </Th>
                                                    ) : null}
                                                </Tr>
                                            </Thead>

                                            <Tbody>
                                                {showRowForm || rows?.length || 0 > 0 ? null : (
                                                    <Tr>
                                                        <Td colSpan={(columns?.length || 0) + 2}>
                                                            <Center m={6}>
                                                                <Text color={"rgb(123, 128, 154)"}>
                                                                    This data collection is empty.
                                                                </Text>
                                                            </Center>
                                                        </Td>
                                                    </Tr>
                                                )}
                                                {rows?.map((row: any, index: number) => {
                                                    console.log("ROW", row);
                                                    return (
                                                        <Tr key={index}>
                                                            {(permissions || 0) > 1 ? (
                                                                <Td>
                                                                    <Checkbox
                                                                        onChange={(
                                                                            event: React.ChangeEvent<HTMLInputElement>
                                                                        ) => onDeleteRowCheckboxChange(event, row)}
                                                                    />
                                                                </Td>
                                                            ) : null}
                                                            {row.cells.map((cell: TCell, index: number) => {
                                                                console.log(cell.value);
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
                                                                const colorStyles: any = {
                                                                    control: (styles: any, { data }: any) => {
                                                                        console.log(data);
                                                                        return {
                                                                            ...styles,
                                                                            border: "none",
                                                                            padding: "none",
                                                                            margin: "0",
                                                                            outline: "none",
                                                                            boxShadow: "none",
                                                                        };
                                                                    },
                                                                    input: (styles: any) => {
                                                                        return {
                                                                            ...styles,
                                                                            outline: "none",
                                                                            margin: "0",
                                                                        };
                                                                    },
                                                                    option: (styles: any, { data }: any) => {
                                                                        console.log(data.color);
                                                                        return {
                                                                            ...styles,
                                                                            backgroundColor: data.color,
                                                                            color: getTextColor(data.color),
                                                                        };
                                                                    },
                                                                    valueContainer: (styles: any) => {
                                                                        return {
                                                                            ...styles,
                                                                            padding: "0",
                                                                            margin: "0",
                                                                            width: "120px",
                                                                        };
                                                                    },
                                                                    indicatorsContainer: (styles: any) => {
                                                                        return {
                                                                            ...styles,
                                                                            display: "none",
                                                                        };
                                                                    },
                                                                    singleValue: (styles: any) => {
                                                                        return {
                                                                            ...styles,
                                                                            backgroundColor: bgColor,
                                                                            color: getTextColor(bgColor),
                                                                            padding: "10px",
                                                                            margin: "0",
                                                                        };
                                                                    },
                                                                    menu: (styles: any) => {
                                                                        return {
                                                                            ...styles,
                                                                            margin: "0",
                                                                            borderRadius: "0",
                                                                            border: "none",
                                                                            padding: "0",
                                                                        };
                                                                    },
                                                                    menuList: (styles: any) => {
                                                                        return {
                                                                            ...styles,
                                                                            padding: "0",
                                                                        };
                                                                    },
                                                                };
                                                                return (
                                                                    <Td
                                                                        key={index}
                                                                        // p={
                                                                        //     cell.type == "label" ? "0" : "inherit"
                                                                        // }
                                                                        // pr={"5px"}
                                                                        px={cell.type == "label" ? "1px" : "10px"}
                                                                        py={"0"}
                                                                        m={"0"}
                                                                    >
                                                                        {cell.type === "label" ? (
                                                                            <Select
                                                                                options={options}
                                                                                styles={colorStyles}
                                                                                defaultValue={{
                                                                                    value: cell.value,
                                                                                    label:
                                                                                        cell.value == ""
                                                                                            ? "Select..."
                                                                                            : cell.value,
                                                                                }}
                                                                                onChange={(newValue) =>
                                                                                    handleLabelSelectChange(
                                                                                        newValue,
                                                                                        cell
                                                                                    )
                                                                                }
                                                                                isDisabled={
                                                                                    rowsLoading ||
                                                                                    rowsFetching ||
                                                                                    !((permissions || 0) > 1)
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <Input
                                                                                value={
                                                                                    editMode.includes(cell?._id)
                                                                                        ? tempValue
                                                                                        : cell.value
                                                                                }
                                                                                size={"sm"}
                                                                                w={"120px"}
                                                                                variant={"unstyled"}
                                                                                onChange={(
                                                                                    event: React.ChangeEvent<HTMLInputElement>
                                                                                ) => handleUpdateRowInputChange(event)}
                                                                                onFocus={(
                                                                                    event: React.FocusEvent<
                                                                                        HTMLInputElement,
                                                                                        Element
                                                                                    >
                                                                                ) =>
                                                                                    handleUpdateRowOnFocus(event, cell)
                                                                                }
                                                                                onBlur={(
                                                                                    event: React.FocusEvent<
                                                                                        HTMLInputElement,
                                                                                        Element
                                                                                    >
                                                                                ) => handleUpdateRowOnBlur(event, cell)}
                                                                                isDisabled={
                                                                                    rowsLoading ||
                                                                                    deletingRows ||
                                                                                    creatingRow ||
                                                                                    rowsFetching
                                                                                }
                                                                                isReadOnly={!((permissions || 0) > 1)}
                                                                            />
                                                                        )}
                                                                    </Td>
                                                                );
                                                            })}
                                                        </Tr>
                                                    );
                                                })}
                                                {/* <Tr>
                                                    <Td>inches</Td>
                                                    <Td>millimetres (mm)</Td>
                                                    <Td>25.4</Td>
                                                </Tr>
                                                <Tr>
                                                    <Td>feet</Td>
                                                    <Td>centimetres (cm)</Td>
                                                    <Td>30.48</Td>
                                                </Tr> */}

                                                {showRowForm ? (
                                                    <Tr>
                                                        <Td borderBottom={"none"} pl={"2px"}>
                                                            <Box position={"relative"}>
                                                                <Box
                                                                    position={"absolute"}
                                                                    bottom={"-12px"}
                                                                    right={"-14px"}
                                                                >
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
                                                            const colorStyles: StylesConfig = {
                                                                control: (styles: any, { data }: any) => {
                                                                    console.log(data);
                                                                    return {
                                                                        ...styles,
                                                                        paddingTop: "0",
                                                                    };
                                                                },
                                                                option: (styles: any, { data }: any) => {
                                                                    console.log(data.color);
                                                                    return {
                                                                        ...styles,
                                                                        backgroundColor: data.color,
                                                                        color: getTextColor(data.color),
                                                                    };
                                                                },
                                                                singleValue: (styles: any, { data }: any) => {
                                                                    return {
                                                                        ...styles,
                                                                        backgroundColor: data.color,
                                                                        color: getTextColor(data.color),
                                                                        padding: "7px",
                                                                    };
                                                                },
                                                                indicatorsContainer: (styles: any) => {
                                                                    return { ...styles, padding: "0" };
                                                                },
                                                                dropdownIndicator: (styles: any) => {
                                                                    return { ...styles, padding: "4px" };
                                                                },
                                                            };
                                                            return (
                                                                <Td
                                                                    key={index}
                                                                    p={column.type == "label" ? "0" : "inherit"}
                                                                    pr={"5px"}
                                                                    borderBottom={"none"}
                                                                    overflow={"visible"}
                                                                >
                                                                    {column.type == "label" ? (
                                                                        <Box>
                                                                            <Select
                                                                                // name={column.name}
                                                                                options={options}
                                                                                onChange={(selectedOption) =>
                                                                                    handleLabelChange(
                                                                                        selectedOption,
                                                                                        column.name
                                                                                    )
                                                                                }
                                                                                styles={colorStyles}
                                                                            />
                                                                        </Box>
                                                                    ) : (
                                                                        <Box>
                                                                            <Input
                                                                                name={column.name}
                                                                                onChange={handleAddRowInputChange}
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
                                                                                onKeyUp={(
                                                                                    event: React.KeyboardEvent<HTMLInputElement>
                                                                                ) => handleAddRowOnKeyUp(event)}
                                                                            />
                                                                        </Box>
                                                                    )}
                                                                </Td>
                                                            );
                                                        })}
                                                    </Tr>
                                                ) : (
                                                    <Tr>
                                                        <Td
                                                            p={"0"}
                                                            display={(permissions || 0) > 1 ? "contents" : "none"}
                                                        >
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
                                </CardBody>
                            </Card>
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
                                                        You've selected {deleteRowIds.length}{" "}
                                                        {numberChecked === 1 ? "item" : "items"}. Click to delete them.
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
                            {/* </SimpleGrid> */}
                        </Container>
                    </Flex>
                </Box>
            </SideBarLayout>
            <PrimaryDrawer isOpen={isOpen} onClose={closeDrawer} title={"Create a new column"}>
                <Stack spacing="24px">
                    <Box>
                        <Text mb={"5px"}>Name</Text>
                        <Input
                            // ref={firstField}
                            id="columnName"
                            name="columnName"
                            placeholder="Please enter column name"
                            onChange={handleColumnNameChange}
                        />
                    </Box>
                    <Box>
                        <Text mb={"5px"}>Type</Text>
                        <Select
                            id="columnType"
                            name="columnType"
                            placeholder="Please select column type"
                            onChange={(selectedOption: any) => handleSelectType(selectedOption)}
                            options={[
                                { value: "text", label: "Text" },
                                { value: "label", label: "Label" },
                            ]}
                            styles={
                                {
                                    control: (styles: any) => {
                                        return { ...styles, borderColor: "#e2e8f0" };
                                    },
                                } as any
                            }
                        />
                    </Box>
                    {showLabelForm ? (
                        <>
                            <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="0"
                                marginTop="0"
                            />
                            <Box>
                                <Text mb={"5px"}>Label name</Text>
                                <Input
                                    // ref={firstField}
                                    id="labelName"
                                    name="title"
                                    value={labelOptions.title}
                                    placeholder="Please enter label name"
                                    onChange={handleLabelOptionsChange}
                                />
                            </Box>
                            <Box>
                                <Text mb={"5px"}>Select label color</Text>
                                <input
                                    type={"color"}
                                    // ref={firstField}
                                    id="labelColor"
                                    name="color"
                                    onChange={handleLabelOptionsChange}
                                />
                            </Box>
                            <PrimaryButton onClick={addLabel}>Add label</PrimaryButton>
                            <Divider
                                gradient="radial-gradient(#eceef1 40%, white 60%)"
                                marginBottom="0"
                                marginTop="0"
                            />
                            <Box>
                                {labels.map((label: TLabel, index: number) => {
                                    console.log(label);
                                    return (
                                        <Box key={index} bg={label.color} p={"5px"} m={"5px"}>
                                            <HStack>
                                                <AiOutlineClose
                                                    color={getTextColor(label.color)}
                                                    onClick={() => removeLabel(label)}
                                                />
                                                <Text color={getTextColor(label.color)}>{label.title}</Text>
                                            </HStack>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    ) : null}
                </Stack>
                <Flex mt={"20px"}>
                    <Spacer />
                    <PrimaryButton onClick={handleAddColumn}>SAVE</PrimaryButton>
                </Flex>
            </PrimaryDrawer>
        </>
        // </Layout>
    );
};

export default ViewOne;
