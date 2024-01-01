import React, { useEffect, useState } from "react";
import PrimaryDrawer from "../../components/PrimaryDrawer";
import { Box, Flex, Input, Spacer, Text, useDisclosure } from "@chakra-ui/react";
import Select from "react-select";
import { TCell } from "../../types";
import { FaRegEdit } from "react-icons/fa";
import { cellColorStyles } from "./select.styles";
import { useGetUserQuery, useUpdateCellMutation } from "../../app/services/api";
import { IconContext } from "react-icons";
import UploadMenu from "./UploadMenu";
import LinksMenu from "./LinksMenu";

interface IProps {
    cells: TCell[];
}

const EditRow = ({ cells }: IProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data: user } = useGetUserQuery(localStorage.getItem("userId") || "");
    const [updateCell] = useUpdateCellMutation();

    const [editMode, setEditMode] = useState<string[]>([]);
    const [tempValue, setTempValue] = useState("");
    const [initialValue, setInitialValue] = useState("");

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

    const handleLabelSelectChange = async (newValue: any, cell: TCell) => {
        let newCell = cell;
        newCell = { ...newCell, value: newValue.value };
        updateCell(newCell);
    };

    // const handleAddExistingDocToCell = (cell: TCell, doc: TDocument) => {
    //     const docs: any = cell.docs;
    //     updateCell({ ...cell, docs: [...docs, doc] });
    // };
    return (
        <>
            <Box ml={"12px"} pb={"2px"} onClick={onOpen}>
                <IconContext.Provider value={{ color: "#cccccc", size: "17px" }}>
                    <FaRegEdit />
                </IconContext.Provider>
            </Box>
            <PrimaryDrawer onClose={onClose} isOpen={isOpen} title={"Edit row"}>
                {cells.map((cell: TCell, index: number) => {
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
                        <Box mb={"12px"} key={index}>
                            <Text mb={"3px"}>
                                {(cell.name[0].toUpperCase() + cell.name.slice(1)).split("_").join(" ")}
                            </Text>
                            {cell.type === "label" || cell.type === "priority" || cell.type === "status" ? (
                                <Select
                                    options={options}
                                    styles={cellColorStyles({ bgColor, padding: "7px" })}
                                    defaultValue={{
                                        value: cell.value,
                                        label: cell.value == "" ? "Select..." : cell.value,
                                    }}
                                    onChange={(newValue) => handleLabelSelectChange(newValue, cell)}
                                    // isDisabled={rowsLoading || rowsFetching || !((permissions || 0) > 1)}
                                />
                            ) : cell.type === "people" ? (
                                <Select
                                    options={peopleOptions}
                                    styles={cellColorStyles({
                                        bgColor: "#ffffff",
                                        padding: "7px",
                                        border: "1px solid #e2e8f0",
                                    })}
                                    defaultValue={{
                                        value: cell.value,
                                        label: cell.value == "" ? "Select..." : cell.value,
                                    }}
                                    onChange={(newValue) => handleLabelSelectChange(newValue, cell)}
                                    // isDisabled={rowsLoading || rowsFetching || !((permissions || 0) > 1)}
                                />
                            ) : cell.type === "date" ? (
                                <input
                                    type="datetime-local"
                                    defaultValue={cell.value.slice(0, 16)}
                                    style={{
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "5px",
                                        width: "100%",
                                        padding: "6px",
                                    }}
                                    name={cell.name}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleUpdateRowInputChange(event);
                                    }}
                                    onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                        handleUpdateRowOnFocus(event, cell)
                                    }
                                    onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                        handleUpdateRowOnBlur(event, cell)
                                    }
                                />
                            ) : cell.type === "number" ? (
                                <input
                                    type="number"
                                    defaultValue={cell.value}
                                    name={cell.name}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        handleUpdateRowInputChange(event);
                                    }}
                                    onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                        handleUpdateRowOnFocus(event, cell)
                                    }
                                    onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                        handleUpdateRowOnBlur(event, cell)
                                    }
                                    // disabled={
                                    //     rowsLoading || rowsFetching || !((permissions || 0) > 1)
                                    // }
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
                            ) : cell.type === "upload" ? (
                                <Box>
                                    <Text>
                                        <UploadMenu
                                            cell={cell}
                                            addToCell={true}
                                            // handleDocsChange={handleCellDocsChange}
                                            // handleAddExistingDoc={handleAddExistingDoc}
                                            // handleAddExistingDocToCell={handleAddExistingDocToCell}
                                            // create={false}
                                            columnName={cell.name}
                                            topPadding="7px"
                                            border={true}
                                        />
                                    </Text>
                                </Box>
                            ) : cell.type === "link" ? (
                                <Box>
                                    <Text>
                                        <LinksMenu
                                            cell={cell}
                                            topPadding="7px"
                                            border={true}
                                            // handleAddLinkClick={handleAddLinkClick}
                                        />
                                    </Text>
                                </Box>
                            ) : (
                                <Input
                                    value={editMode.includes(cell?._id) ? tempValue : cell.value}
                                    size={"md"}
                                    w={"100%"}
                                    // variant={"unstyled"}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                        handleUpdateRowInputChange(event)
                                    }
                                    onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                        handleUpdateRowOnFocus(event, cell)
                                    }
                                    onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) =>
                                        handleUpdateRowOnBlur(event, cell)
                                    }
                                    // isDisabled={rowsLoading || deletingRows || creatingRow || rowsFetching}
                                    isReadOnly={!((permissions || 0) > 1)}
                                />
                            )}
                        </Box>
                    );
                })}
                <Flex mt={"10px"} width={"full"}>
                    <Spacer />
                    {/* <PrimaryButton onClick={updateData}>SAVE</PrimaryButton> */}
                </Flex>
            </PrimaryDrawer>
        </>
    );
};

export default EditRow;
