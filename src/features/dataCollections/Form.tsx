import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateRowMutation, useGetColumnsQuery } from "../../app/services/api";
import { TColumn, TDocument, TRow } from "../../types";
import { Box, Card, CardBody, Container, Flex, Input, Spacer, Text } from "@chakra-ui/react";
import Select from "react-select";
import { createRowColorStyles } from "./select.styles";
import UploadMenu from "./UploadMenu";
import LinksMenu from "./LinksMenu";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

const Form = () => {
    const { dataCollectionId } = useParams();
    const { data: columns } = useGetColumnsQuery(dataCollectionId || "");
    const [createRow] = useCreateRowMutation();
    // const [updateRow] = useUpdateRowMutation();

    const [row, setRow] = useState<any>({ dataCollection: dataCollectionId, docs: [] });

    /**
     * This converts data so that the react table can read it before the component
     * loads.
     */
    useEffect(() => {
        setDefaultRow();
    }, []);

    /**
     * Set a row to a default state
     */
    const setDefaultRow = () => {
        let temp: TRow = {
            dataCollection: dataCollectionId || "",
            notesList: [],
            cells: [],
            tags: [],
            docs: [],
            links: [],
        };
        for (const column of columns || []) {
            temp = { ...temp, [column.name]: "" };
        }

        setRow(temp);
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
        // setFirstInputFocus(false);
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
        // setShowRowForm(false);
        setDefaultRow();
        setRow({ dataCollection: dataCollectionId, docs: [], links: [] });
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
    //         // setFirstInputFocus(true);
    //         setDefaultRow();
    //     }
    // };

    const handleAddLinkClick = (link: string) => {
        const linksCopy: any = row.links;
        setRow({ ...row, links: [...linksCopy, link] });
        // setFirstInputFocus(false);
    };

    /**
     * UPDATE AND CREATE ROW SECTION
     *
     * This function is used to update the row with existing docs picked in UploadMenu.tsx
     * @param name This is the cell or column name that serves as the key in the row
     * @param docs This is the documents array that holds the created docs
     */
    const handleAddExistingDoc = (name: string, docs: TDocument[]) => {
        const rowDocs = row.docs || [];
        setRow({ ...row, [name]: rowDocs.concat(docs) });
    };
    return (
        <>
            <Container>
                <Card mt={"60px"}>
                    <CardBody>
                        {columns?.map((column: TColumn, index: number) => {
                            const options: any = column.labels?.map((item) => {
                                return {
                                    value: item.title,
                                    label: item.title,
                                    color: item.color,
                                };
                            });
                            const peopleOptions: any = column.people?.map((item) => {
                                return {
                                    value: item._id,
                                    label: `${item.firstname} ${item.lastname}`,
                                    color: "#ffffff",
                                };
                            });

                            if (!column.includeInForm) return null;

                            return (
                                <Box mb={"20px"} key={index}>
                                    <Flex>
                                        <Text mb={"6px"}>
                                            {(column.name[0].toUpperCase() + column.name.slice(1)).split("_").join(" ")}
                                        </Text>
                                    </Flex>

                                    {column.type === "label" ||
                                    column.type === "priority" ||
                                    column.type === "status" ? (
                                        <Box w={"100%"}>
                                            <Select
                                                options={options}
                                                styles={createRowColorStyles()}
                                                onChange={(selectedOption) =>
                                                    handleLabelChange(selectedOption, column.name)
                                                }
                                            />
                                        </Box>
                                    ) : column.type === "people" ? (
                                        <Select
                                            options={peopleOptions}
                                            styles={createRowColorStyles()}
                                            onChange={(selectedOption) =>
                                                handleLabelChange(selectedOption, column.name)
                                            }
                                        />
                                    ) : column.type === "date" ? (
                                        <input
                                            type="datetime-local"
                                            name={column.name}
                                            onChange={handleAddRowInputChange}
                                            defaultValue={""}
                                            style={{
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "5px",
                                                width: "100%",
                                                padding: "6px",
                                            }}
                                        />
                                    ) : column.type === "number" ? (
                                        <input
                                            type="number"
                                            defaultValue={""}
                                            name={column.name}
                                            onChange={handleAddRowInputChange}
                                            style={{
                                                outline: "none",
                                                paddingLeft: "15px",
                                                paddingTop: "6px",
                                                paddingBottom: "6px",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: "5px",
                                                width: "100%",
                                            }}
                                        />
                                    ) : column.type === "upload" ? (
                                        <Box>
                                            <Text>
                                                <UploadMenu
                                                    preparedRow={row}
                                                    addToCell={false}
                                                    handleDocsChange={handleDocsChange}
                                                    handleAddExistingDoc={handleAddExistingDoc}
                                                    create={false}
                                                    columnName={column.name}
                                                    topPadding="7px"
                                                    border={true}
                                                />
                                            </Text>
                                        </Box>
                                    ) : column.type === "link" ? (
                                        <Box>
                                            <Text>
                                                <LinksMenu
                                                    cell={null}
                                                    handleAddLinkClick={handleAddLinkClick}
                                                    topPadding="7px"
                                                    border={true}
                                                />
                                            </Text>
                                        </Box>
                                    ) : (
                                        <Input
                                            name={column.name}
                                            onChange={handleAddRowInputChange}
                                            placeholder="Enter text"
                                            value={row[column.name]}
                                            size={"md"}
                                            w={"100%"}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                        <Flex>
                            <Spacer />
                            <PrimaryButton onClick={handleSaveRowClick}>SAVE</PrimaryButton>
                        </Flex>
                    </CardBody>
                </Card>
            </Container>
        </>
    );
};

export default Form;
