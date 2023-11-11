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
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    FormLabel,
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

import { IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace, BsPlusCircle } from "react-icons/bs";
import {
    AiOutlineCheck,
    AiOutlineClose,
    AiOutlineMessage,
    AiOutlinePlus,
} from "react-icons/ai";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";

import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { TCell, TColumn, TRow } from "../../types";
import { useParams } from "react-router-dom";

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
        path: `/workspaces/${localStorage.getItem(
            "workspaceId"
        )}/dataCollections`,
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
    const [numberChecked, setNumberChecked] = useState<number>(0);
    const [showRowForm, setShowRowForm] = useState<boolean>(false);

    const [editMode, setEditMode] = useState<string[]>([]);
    const [tempValue, setTempValue] = useState("");
    const [initialValue, setInitialValue] = useState("");

    const [deleteRowIds, setDeleteRowIds] = useState<string[]>([]);
    const [showDeleteBox, setShowDeleteBox] = useState<boolean>(false);

    const [firstInputFocus, setFirstInputFocus] = useState(true);

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
            type: "Text",
            permanent: false,
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
    const handleColumnNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = event.target;
        setColumnName(value);
    };

    const handleAddRowInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        console.log(event.target.value);
        setRow({ ...row, [event.target.name]: event.target.value });
    };

    const handleUpdateRowInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        rowItem: TRow,
        cellItem: TCell
    ) => {
        console.log(rowItem);
        console.log(cellItem);
        setTempValue(event.target.value);
    };

    const handleUpdateRowOnFocus = (
        event: React.FocusEvent<HTMLInputElement, Element>,
        cell: any
    ) => {
        setInitialValue(event.target.value);
        const em: string[] = [];
        em.push(cell._id);
        setEditMode(em as any);
        setTempValue(event.target.value);
    };

    const handleUpdateRowOnBlur = async (
        event: React.FocusEvent<HTMLInputElement, Element>,
        cell: any
    ) => {
        let newCell = cell;
        newCell = { ...newCell, value: event.target.value };
        if (initialValue != event.target.value) await updateCell(newCell);

        let tempEditMode = editMode;
        tempEditMode.pop();
        setEditMode(tempEditMode);
    };

    const handleSaveRowClick = async () => {
        console.log(row);
        await createRow(row);
        setShowRowForm(false);
        setDefaultRow();
    };

    const onDeleteRowCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        row: any
    ) => {
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

    const handleAddRowOnKeyUp = async (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key == "Enter") {
            await createRow(row);
            setFirstInputFocus(true);
            setDefaultRow();
        }
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
                                        <Heading
                                            size={"sm"}
                                            mb={"12px"}
                                            color={"rgb(52, 71, 103)"}
                                        >
                                            Data Collections
                                        </Heading>
                                        <Text
                                            color={"rgb(123, 128, 154)"}
                                            fontSize={"md"}
                                            fontWeight={300}
                                        >
                                            Create data collection tables to
                                            visualize and manage your data.
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex>
                                    <Spacer />
                                    <Box pb={"20px"}>
                                        {/* <Create addNewWorkspace={addNewWorkspace} /> */}
                                    </Box>
                                </Flex>
                            </SimpleGrid>
                            <Card mb={"60px"}>
                                <CardHeader>
                                    <Flex>
                                        <Box>
                                            <Heading
                                                size={"sm"}
                                                mt={"5px"}
                                                mb={"4px"}
                                            >
                                                {dataCollection?.name}
                                            </Heading>
                                            <Text
                                                fontSize={"md"}
                                                color={"rgb(123, 128, 154)"}
                                            >
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
                                    {rowsLoading ||
                                    deletingRows ||
                                    creatingRow ||
                                    rowsFetching ? (
                                        <Progress size="xs" isIndeterminate />
                                    ) : null}
                                </CardHeader>
                                <CardBody>
                                    <TableContainer>
                                        <Table size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th w={"5px"}></Th>
                                                    {columns?.map(
                                                        (
                                                            column: TColumn,
                                                            index: number
                                                        ) => {
                                                            return (
                                                                <Th key={index}>
                                                                    <Menu>
                                                                        <MenuButton
                                                                            onClick={() =>
                                                                                handleColumnHover(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            <Text
                                                                                as={
                                                                                    "b"
                                                                                }
                                                                            >
                                                                                {column.name
                                                                                    .split(
                                                                                        "_"
                                                                                    )
                                                                                    .join(
                                                                                        " "
                                                                                    )
                                                                                    .toUpperCase()}
                                                                            </Text>
                                                                        </MenuButton>
                                                                        <MenuList>
                                                                            <MenuItem
                                                                                onClick={() =>
                                                                                    deleteColumn(
                                                                                        column?._id as any
                                                                                    )
                                                                                }
                                                                            >
                                                                                Delete
                                                                                Column
                                                                            </MenuItem>
                                                                        </MenuList>
                                                                    </Menu>
                                                                </Th>
                                                            );
                                                        }
                                                    )}
                                                    <Th>
                                                        <Button
                                                            onClick={onOpen}
                                                            variant={"unstyled"}
                                                            float={"right"}
                                                        >
                                                            <BsPlusCircle />
                                                        </Button>
                                                    </Th>
                                                </Tr>
                                            </Thead>

                                            <Tbody>
                                                {showRowForm ||
                                                rows?.length ||
                                                0 > 0 ? null : (
                                                    <Tr>
                                                        <Td
                                                            colSpan={
                                                                (columns?.length ||
                                                                    0) + 2
                                                            }
                                                        >
                                                            <Center m={6}>
                                                                <Text
                                                                    color={
                                                                        "rgb(123, 128, 154)"
                                                                    }
                                                                >
                                                                    This data
                                                                    collection
                                                                    is empty.
                                                                </Text>
                                                            </Center>
                                                        </Td>
                                                    </Tr>
                                                )}
                                                {data?.map(
                                                    (
                                                        row: any,
                                                        index: number
                                                    ) => {
                                                        return (
                                                            <Tr key={index}>
                                                                <Td>
                                                                    <Checkbox
                                                                        onChange={(
                                                                            event: React.ChangeEvent<HTMLInputElement>
                                                                        ) =>
                                                                            onDeleteRowCheckboxChange(
                                                                                event,
                                                                                row
                                                                            )
                                                                        }
                                                                    />
                                                                </Td>
                                                                {row.cells.map(
                                                                    (
                                                                        cell: TCell,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <Td
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <Input
                                                                                    value={
                                                                                        editMode.includes(
                                                                                            cell?._id
                                                                                        )
                                                                                            ? tempValue
                                                                                            : cell.value
                                                                                    }
                                                                                    size={
                                                                                        "sm"
                                                                                    }
                                                                                    variant={
                                                                                        "unstyled"
                                                                                    }
                                                                                    onChange={(
                                                                                        event: React.ChangeEvent<HTMLInputElement>
                                                                                    ) =>
                                                                                        handleUpdateRowInputChange(
                                                                                            event,
                                                                                            row,
                                                                                            cell
                                                                                        )
                                                                                    }
                                                                                    onFocus={(
                                                                                        event: React.FocusEvent<
                                                                                            HTMLInputElement,
                                                                                            Element
                                                                                        >
                                                                                    ) =>
                                                                                        handleUpdateRowOnFocus(
                                                                                            event,
                                                                                            cell
                                                                                        )
                                                                                    }
                                                                                    onBlur={(
                                                                                        event: React.FocusEvent<
                                                                                            HTMLInputElement,
                                                                                            Element
                                                                                        >
                                                                                    ) =>
                                                                                        handleUpdateRowOnBlur(
                                                                                            event,
                                                                                            cell
                                                                                        )
                                                                                    }
                                                                                    isDisabled={
                                                                                        rowsLoading ||
                                                                                        deletingRows ||
                                                                                        creatingRow ||
                                                                                        rowsFetching
                                                                                    }
                                                                                />
                                                                            </Td>
                                                                        );
                                                                    }
                                                                )}
                                                            </Tr>
                                                        );
                                                    }
                                                )}
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
                                                        <Td
                                                            borderBottom={
                                                                "none"
                                                            }
                                                            pl={"2px"}
                                                        >
                                                            <IconButton
                                                                onClick={
                                                                    handleSaveRowClick
                                                                }
                                                                size={"xs"}
                                                                variant={
                                                                    "unstyled"
                                                                }
                                                                aria-label=""
                                                                icon={
                                                                    <AiOutlineCheck
                                                                        size={
                                                                            "15px"
                                                                        }
                                                                    />
                                                                }
                                                            ></IconButton>
                                                            <IconButton
                                                                onClick={() =>
                                                                    setShowRowForm(
                                                                        false
                                                                    )
                                                                }
                                                                size={"xs"}
                                                                variant={
                                                                    "unstyled"
                                                                }
                                                                aria-label=""
                                                                icon={
                                                                    <AiOutlineClose
                                                                        size={
                                                                            "15px"
                                                                        }
                                                                    />
                                                                }
                                                            ></IconButton>
                                                        </Td>
                                                        {columns?.map(
                                                            (
                                                                column: TColumn,
                                                                index: number
                                                            ) => {
                                                                return (
                                                                    <Td
                                                                        key={
                                                                            index
                                                                        }
                                                                        borderBottom={
                                                                            "none"
                                                                        }
                                                                    >
                                                                        <Box>
                                                                            <Input
                                                                                name={
                                                                                    column.name
                                                                                }
                                                                                onChange={
                                                                                    handleAddRowInputChange
                                                                                }
                                                                                value={
                                                                                    row[
                                                                                        column
                                                                                            .name
                                                                                    ]
                                                                                }
                                                                                size={
                                                                                    "sm"
                                                                                }
                                                                                autoFocus={
                                                                                    index ==
                                                                                    0
                                                                                }
                                                                                ref={(
                                                                                    el
                                                                                ) => {
                                                                                    if (
                                                                                        index ==
                                                                                            0 &&
                                                                                        firstInputFocus
                                                                                    ) {
                                                                                        el?.focus();
                                                                                        el?.scrollIntoView();
                                                                                    } else {
                                                                                        setFirstInputFocus(
                                                                                            false
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                onKeyUp={(
                                                                                    event: React.KeyboardEvent<HTMLInputElement>
                                                                                ) =>
                                                                                    handleAddRowOnKeyUp(
                                                                                        event
                                                                                    )
                                                                                }
                                                                            />
                                                                        </Box>
                                                                    </Td>
                                                                );
                                                            }
                                                        )}
                                                    </Tr>
                                                ) : (
                                                    <Tr>
                                                        <Button
                                                            variant={"unstyled"}
                                                            onClick={() => {
                                                                setShowRowForm(
                                                                    true
                                                                );
                                                            }}
                                                            leftIcon={
                                                                <AiOutlinePlus />
                                                            }
                                                            w={"10px"}
                                                            size={"sm"}
                                                            m={"10px"}
                                                            color={
                                                                "rgb(123, 128, 154)"
                                                            }
                                                        >
                                                            Add Row
                                                        </Button>
                                                    </Tr>
                                                )}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>

                                    {showRowForm ? (
                                        <>
                                            {/* <IconContext.Provider
                                                value={{ size: "18" }}
                                            >
                                                <Button
                                                    size={"xs"}
                                                    variant={"unstyled"}
                                                    fontSize={"14px"}
                                                    fontWeight={"bold"}
                                                    color={"green"}
                                                    p={0}
                                                    bg={"transparent"}
                                                    position={"relative"}
                                                    bottom={"40px"}
                                                    right={"15px"}
                                                    onClick={() => {
                                                        createRow(row);
                                                        setShowRowForm(false);
                                                    }}
                                                >
                                                    <AiOutlineCheckCircle />
                                                </Button>
                                                <Button
                                                    size={"xs"}
                                                    variant={"unstyled"}
                                                    fontSize={"14px"}
                                                    fontWeight={"bold"}
                                                    color={"rgb(233, 30, 99)"}
                                                    p={0}
                                                    bg={"transparent"}
                                                    position={"relative"}
                                                    bottom={"40px"}
                                                    right={"15px"}
                                                    onClick={() =>
                                                        setShowRowForm(false)
                                                    }
                                                >
                                                    <AiOutlineCloseCircle />
                                                </Button>
                                            </IconContext.Provider> */}
                                        </>
                                    ) : null}
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
                                        <Card
                                            variant={"elevated"}
                                            borderWidth={"1px"}
                                            borderColor={"lightgray"}
                                        >
                                            <CardBody>
                                                <Flex>
                                                    <Text mt={"10px"}>
                                                        You've selected{" "}
                                                        {deleteRowIds.length}{" "}
                                                        {numberChecked === 1
                                                            ? "item"
                                                            : "items"}
                                                        . Click to delete them.
                                                    </Text>
                                                    <Spacer />
                                                    <Button
                                                        colorScheme="red"
                                                        onClick={deleteItems}
                                                    >
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
            <Drawer
                isOpen={isOpen}
                placement="right"
                // initialFocusRef={firstField}
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        Add a new column
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing="24px">
                            <Box>
                                <FormLabel htmlFor="columnName">Name</FormLabel>
                                <Input
                                    // ref={firstField}
                                    id="columnName"
                                    name="columnName"
                                    placeholder="Please enter column name"
                                    onChange={handleColumnNameChange}
                                />
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter borderTopWidth="1px">
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleAddColumn}>
                            Submit
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
        // </Layout>
    );
};

export default ViewOne;
