import { Input } from "@chakra-ui/react";
import { TCell } from "../../types";
import { useEffect, useState } from "react";
import { useUpdateCellMutation } from "../../app/services/api";

interface IProps {
    cell: TCell;
    editMode?: any;
    value?: string;
    permissions: any;
}

const TextInput = ({ cell, value = "", permissions }: IProps) => {
    const [updateCell] = useUpdateCellMutation();
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleUpdateRowOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        updateCell({ ...cell, value: event.target.value });
    };

    return (
        <Input
            value={inputValue}
            size={"sm"}
            variant={"unstyled"}
            onChange={handleInputChange}
            onBlur={handleUpdateRowOnBlur}
            isReadOnly={!((permissions || 0) > 1)}
            cursor={(permissions || 0) > 1 ? "text" : "default"}
            textOverflow={"ellipsis"}
        />
    );
};

export default TextInput;
