import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
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
    Input,
    SimpleGrid,
    Spacer,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";

import {
    Table,
    Header,
    HeaderRow,
    Body,
    Row,
    HeaderCell,
    Cell,
} from "@table-library/react-table-library/table";
import {
    useSort,
    HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { useTheme } from "@table-library/react-table-library/theme";

import { IconContext, IconType } from "react-icons";
import { BsFiletypeDoc, BsPersonWorkspace, BsPlusCircle } from "react-icons/bs";
import {
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineMessage,
} from "react-icons/ai";
import { BiTable } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";

import AddForm from "./AddForm";
import SideBarLayout from "../../components/Layouts/SideBarLayout";
import { TCell, TColumn, TDataCollection, TRow, TTableData } from "../../types";

/**
 * This is dummy data that simulates what will be brought in with RTK
 * @constant {IDataCollection} dataCollection
 */
const dataCollection: TDataCollection = {
    _id: "1",
    name: "Data Collection 1",
    workspace: "1",
    form: {
        active: false,
        type: "",
        emails: [],
    },
    columns: ["1", "2", "3", "4"],
    rows: ["1", "2", "3"],
};

/**
 * This is dummy data that simulates what will be brought in with RTK
 * @constant {IColumn} columnsData
 */
const columnsData: TColumn[] = [
    {
        _id: "1",
        dataCollectionId: "1",
        name: "assigned_to",
        type: "Person",
        permanent: true,
        people: [],
        includeInForm: true,
        includeInExport: true,
    },
    {
        _id: "2",
        dataCollectionId: "1",
        name: "priority",
        type: "Label",
        permanent: true,
        labels: [
            { title: "Low", color: "blue" },
            { title: "High", color: "orange" },
        ],
        includeInForm: true,
        includeInExport: true,
    },
    {
        _id: "3",
        dataCollectionId: "1",
        name: "status",
        type: "Label",
        permanent: true,
        labels: [
            { title: "In-Progress", color: "green" },
            { title: "Complete", color: "yellow" },
        ],
        includeInForm: true,
        includeInExport: true,
    },
];

const rowsData: TRow[] = [
    {
        _id: "1",
        dataCollectionId: "1",
        cells: ["1", "2", "3"],
    },
    {
        _id: "2",
        dataCollectionId: "1",
        cells: ["4", "5", "6"],
    },
    {
        _id: "3",
        dataCollectionId: "1",
        cells: ["7", "8", "9"],
    },
];

const cellsData: TCell[] = [
    {
        _id: "1",
        rowId: "1",
        name: "assigned_to",
        type: "Person",
        people: ["1"],
        value: "Omar Gastelum",
    },
    {
        _id: "2",
        rowId: "1",
        name: "priority",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Low",
    },
    {
        _id: "3",
        rowId: "1",
        name: "status",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Complete",
    },
    {
        _id: "4",
        rowId: "2",
        name: "assigned_to",
        type: "Person",
        people: ["1"],
        value: "Carlos Torres",
    },
    {
        _id: "5",
        rowId: "2",
        name: "priority",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "High",
    },
    {
        _id: "6",
        rowId: "2",
        name: "status",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Sent",
    },
    {
        _id: "7",
        rowId: "3",
        name: "assigned_to",
        type: "Person",
        people: ["1"],
        value: "Rick Ruiz",
    },
    {
        _id: "8",
        rowId: "3",
        name: "priority",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Med",
    },
    {
        _id: "9",
        rowId: "3",
        name: "status",
        type: "Label",
        labels: [{ title: "String", color: "String" }],
        value: "Waiting",
    },
];

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
        path: "/workspaces/1/dataCollections",
    },
    { name: "Tasks", icon: FaTasks, path: "/workspaces/1/taskLists" },
    { name: "Documents", icon: BsFiletypeDoc, path: "/workspaces/1/documents" },
    {
        name: "Message Board",
        icon: AiOutlineMessage,
        path: "/workspaces/1/messageBoard",
    },
];

const ViewOne = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [data, setData] = useState<TTableData>([]);
    const [cells, setCells] = useState<TCell[]>(cellsData);
    const [columns, setColumns] = useState<TColumn[]>(columnsData);
    const [columnName, setColumnName] = useState<string>("");
    const [checkedItems, setCheckedItems] = useState<boolean[]>(
        new Array(rowsData.length).fill(false)
    );
    const [numberChecked, setNumberChecked] = useState<number>(0);
    const [showRowForm, setShowRowForm] = useState<boolean>(false);

    /**
     * React Table customized theme
     * @constant theme
     */
    const theme = useTheme({
        Table: `
            grid-template-columns: 20px repeat(${columns.length - 1}, 1fr) 1fr;
        `,
        Cell: `&:nth-of-type(1) {
            width: 60px
          }`,
        HeaderRow: `
            .th {
                color: rgb(123, 128, 154);
                padding: 12px 16px 12px 26px;
                border-bottom: 0.0625rem solid rgb(240, 242, 245);
                font-size: 12px;
            }
          `,
        BaseCell: `
            color: rgb(123, 128, 154);
            padding: 10px 16px;
            border-bottom: 0.0625rem solid rgb(240, 242, 245);
            font-size: 14px;

          `,
    });

    /**
     * This converts data so that the react table can read it before the component
     * loads.
     */
    useEffect(() => {
        convertData();
    }, []);

    /**
     * This function converts rows and its cells to a format required by react table
     * This function also sorts the data
     * TTableData is set to any since the data is dynamic
     */
    const convertData = () => {
        const convertedArray: TTableData = [];
        const cellsCopy: TCell[] = cells;

        for (const row of rowsData) {
            let id = row._id;
            const filteredRows: TCell[] = cellsCopy.filter((cell) => {
                return cell.rowId === id;
            });

            let newRow: TTableData = { id: id };
            for (const filteredRow of filteredRows) {
                newRow[filteredRow.name as keyof typeof newRow] =
                    filteredRow.value;
            }
            convertedArray.push(newRow);
        }
        const sortedData: TTableData = convertedArray.sort((a: any, b: any) => {
            console.log(a["priority"]);
            return a["priority"].localeCompare(b["priority"]);
        });
        setData(sortedData);
    };

    /**
     * Creates a new column
     * This should be replaced by RTK
     */
    const handleAddColumn = () => {
        const newColumn: TColumn = {
            dataCollectionId: "1",
            name: columnName,
            type: "Person",
            permanent: false,
            people: [],
            includeInForm: true,
            includeInExport: true,
        };

        // Set column name to a database friendly underscore naming
        newColumn.name = newColumn.name.toLowerCase().split(" ").join("_");

        const columnsCopy: TColumn[] = columns;
        columnsCopy.push(newColumn);

        setColumns(columnsCopy);
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

    /**
     * Updates table data when input changes
     * @param {string} value
     * @param {TTableData} item
     * @param {string} name
     */
    const handleUpdate = (value: string, item: TTableData, name: string) => {
        console.log(value);
        console.log(item);

        const dataCopy: TTableData[] = data;

        const changedData: TTableData[] = dataCopy.map(
            (dataItem: TTableData) => {
                if (dataItem.id === item.id) {
                    return { ...dataItem, [name]: value };
                } else {
                    return dataItem;
                }
            }
        );

        setData(changedData);
    };

    /**
     *
     * @param {string} value
     * @param {TTableData} item
     * @param {string} name
     */
    const updateCells = (value: string, item: any, name: string) => {
        const rowId = item.id;

        const newCells: TCell[] = cells.map((cell: TCell) => {
            // If the row and column name match, set the updated cell,
            // update it in data base and return the new cell
            // else return the cell as it is
            if (cell.rowId === rowId && cell.name === name) {
                let newCell: TCell = { ...cell, value: value };
                // Update database cell here *********************************
                return newCell;
            } else {
                return cell;
            }
        });

        setCells(newCells);
    };

    /**
     * This function will be replaced by RTK
     * @param value
     * @param name
     */
    const handleAddCell = (value: string, name: string) => {
        console.log(value);
        console.log(name);
    };

    /**
     * This function tracks the selected row checkboxes
     * @param checked
     * @param index
     */
    const handleRowCheckboxChange = (checked: boolean, index: number) => {
        const checkedItemsCopy: boolean[] = checkedItems;
        checkedItemsCopy[index] = !checkedItemsCopy[index];
        setCheckedItems(checkedItemsCopy);

        let numberCheckedCopy: number = numberChecked;
        if (checked) {
            setNumberChecked(numberCheckedCopy + 1);
        } else {
            setNumberChecked(numberCheckedCopy - 1);
        }
    };

    /**
     * This function will set data array items to null if the checkbox has been
     * checked at that index. Those rows will then be filtered and data will set
     * with new filtered array
     */
    const deleteItems = () => {
        let dataCopy: TTableData = data;
        for (const index in checkedItems) {
            let checkedItem = checkedItems[index];
            if (checkedItem) {
                dataCopy[index] = null;
            }
        }

        const newRows = dataCopy.filter((item: any) => {
            return item !== null;
        });

        setData(newRows);
        setCheckedItems(new Array(data.length).fill(false));
        setNumberChecked(0);
    };

    const updateDataCollection = (dataCollection: TDataCollection) => {
        console.log("Data Collection updated");
        console.log(dataCollection);
        // Make call to update the data collection *************************************
    };

    /**
     * Sorts data and is used for React Table sort
     * @param action
     * @param state
     */
    function onSortChange(action: any, state: any) {
        const params = {
            sort: {
                sortKey: state.sortKey,
                reverse: state.reverse,
                action: action,
            },
        };

        const sortedData = data.sort((a: any, b: any) => {
            return a[params.sort.sortKey].localeCompare(b[params.sort.sortKey]);
        });

        setData(sortedData);
    }

    /**
     * React table sort settings
     */
    const sort = useSort(
        { nodes: data },
        {
            onChange: onSortChange,
            state: {
                sortKey: "priority",
                reverse: false,
            },
        },
        {
            sortFns: {},
            sortIcon: {
                iconDefault: null,
                iconUp: null,
                iconDown: null,
            },
        }
    );

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
                            <Card>
                                <CardHeader>
                                    <Flex>
                                        <Box>
                                            <Heading
                                                size={"sm"}
                                                mt={"5px"}
                                                mb={"4px"}
                                            >
                                                Data Collection 1
                                            </Heading>
                                            <Text
                                                fontSize={"md"}
                                                color={"rgb(123, 128, 154)"}
                                            >
                                                This is a description for this
                                                data collection.
                                            </Text>
                                        </Box>
                                        <Spacer />
                                        {/* <PrimaryButton
                                            onClick={onOpen}
                                            float={"right"}
                                        >
                                            ADD FORM
                                        </PrimaryButton> */}
                                        <AddForm
                                            updateDataCollection={
                                                updateDataCollection
                                            }
                                            dataCollection={dataCollection}
                                        />
                                    </Flex>
                                </CardHeader>
                                <CardBody>
                                    <Button
                                        onClick={onOpen}
                                        variant={"unstyled"}
                                        float={"right"}
                                    >
                                        <BsPlusCircle />
                                    </Button>
                                    {/**
                                     * TABLE ********************************************************************************
                                     */}
                                    <Table
                                        data={{ nodes: data }}
                                        sort={sort}
                                        layout={{
                                            isDiv: true,
                                            horizontalScroll: true,
                                        }}
                                        theme={theme}
                                    >
                                        {(tableList: any) => (
                                            <>
                                                <Header>
                                                    <HeaderRow>
                                                        <HeaderCell
                                                            resize
                                                        ></HeaderCell>
                                                        {columns.map(
                                                            (column: any) => {
                                                                return (
                                                                    <HeaderCellSort
                                                                        key={
                                                                            column.name
                                                                        }
                                                                        resize
                                                                        sortKey={
                                                                            column.name
                                                                        }
                                                                    >
                                                                        {(
                                                                            column.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase() +
                                                                            column.name.slice(
                                                                                1
                                                                            )
                                                                        )
                                                                            .split(
                                                                                "_"
                                                                            )
                                                                            .join(
                                                                                " "
                                                                            )}
                                                                    </HeaderCellSort>
                                                                );
                                                            }
                                                        )}
                                                    </HeaderRow>
                                                </Header>

                                                <Body>
                                                    {tableList.map(
                                                        (
                                                            item: any,
                                                            index: number
                                                        ) => {
                                                            return (
                                                                <Row
                                                                    key={index}
                                                                    item={item}
                                                                >
                                                                    <Cell>
                                                                        <Checkbox
                                                                            isChecked={
                                                                                checkedItems[
                                                                                    index
                                                                                ]
                                                                            }
                                                                            mt={
                                                                                "5px"
                                                                            }
                                                                            onChange={(
                                                                                event: React.ChangeEvent<HTMLInputElement>
                                                                            ) =>
                                                                                handleRowCheckboxChange(
                                                                                    event
                                                                                        .target
                                                                                        .checked,
                                                                                    index
                                                                                )
                                                                            }
                                                                        />
                                                                    </Cell>
                                                                    {columns.map(
                                                                        (
                                                                            cell: any,
                                                                            index: number
                                                                        ) => {
                                                                            return (
                                                                                <Cell
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    <Input
                                                                                        size={
                                                                                            "xs"
                                                                                        }
                                                                                        border={
                                                                                            "none"
                                                                                        }
                                                                                        m={
                                                                                            "1px"
                                                                                        }
                                                                                        w={
                                                                                            "95%"
                                                                                        }
                                                                                        fontSize={
                                                                                            "14px"
                                                                                        }
                                                                                        focusBorderColor="blue"
                                                                                        value={
                                                                                            item[
                                                                                                cell
                                                                                                    .name
                                                                                            ]
                                                                                        }
                                                                                        onChange={(
                                                                                            event: React.ChangeEvent<HTMLInputElement>
                                                                                        ) =>
                                                                                            handleUpdate(
                                                                                                event
                                                                                                    .target
                                                                                                    .value,
                                                                                                item,
                                                                                                cell.name
                                                                                            )
                                                                                        }
                                                                                        onBlur={(
                                                                                            event: React.ChangeEvent<HTMLInputElement>
                                                                                        ) =>
                                                                                            updateCells(
                                                                                                event
                                                                                                    .target
                                                                                                    .value,
                                                                                                item,
                                                                                                cell.name
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </Cell>
                                                                            );
                                                                        }
                                                                    )}
                                                                    {/* <Cell></Cell> */}
                                                                </Row>
                                                            );
                                                        }
                                                    )}
                                                    {showRowForm ? (
                                                        <>
                                                            <Row
                                                                item={{
                                                                    id: "",
                                                                    nodes: undefined,
                                                                }}
                                                            >
                                                                <Cell></Cell>
                                                                {columns.map(
                                                                    (
                                                                        cell: any,
                                                                        index: number
                                                                    ) => {
                                                                        return (
                                                                            <Cell
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <Input
                                                                                    size={
                                                                                        "xs"
                                                                                    }
                                                                                    m={
                                                                                        "1px"
                                                                                    }
                                                                                    w={
                                                                                        "95%"
                                                                                    }
                                                                                    onChange={(
                                                                                        event: React.ChangeEvent<HTMLInputElement>
                                                                                    ) =>
                                                                                        handleAddCell(
                                                                                            event
                                                                                                .target
                                                                                                .value,
                                                                                            cell.name
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Cell>
                                                                        );
                                                                    }
                                                                )}
                                                            </Row>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                setShowRowForm(
                                                                    true
                                                                )
                                                            }
                                                            size={"xs"}
                                                            margin={"10px"}
                                                            marginLeft={"14px"}
                                                            bg={"none"}
                                                            color={
                                                                "rgb(123, 128, 154)"
                                                            }
                                                            p={"0"}
                                                            w={"100px"}
                                                        >
                                                            + Add Row
                                                        </Button>
                                                    )}
                                                </Body>
                                            </>
                                        )}
                                    </Table>
                                    {showRowForm ? (
                                        <>
                                            <IconContext.Provider
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
                                                    onClick={() =>
                                                        setShowRowForm(false)
                                                    }
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
                                            </IconContext.Provider>
                                        </>
                                    ) : null}
                                </CardBody>
                            </Card>
                            {numberChecked > 0 ? (
                                <Card position={"relative"}>
                                    <Card
                                        position={"fixed"}
                                        bottom={30}
                                        left={{ base: 30, lg: 300 }}
                                        w={{ sm: "300px", md: "500px" }}
                                    >
                                        <CardBody>
                                            <Flex>
                                                <Text mt={"10px"}>
                                                    You've selected{" "}
                                                    {numberChecked}{" "}
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
                                </Card>
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
