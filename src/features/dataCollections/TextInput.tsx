import { Input } from "@chakra-ui/react";
import { TCell } from "../../types";
import { useState } from "react";

interface IProps {
    cell: TCell;
    editMode?: any;
    tempValue?: string;
    rowsLoading?: boolean | undefined;
    deletingRows?: boolean | undefined;
    creatingRow?: boolean | undefined;
    rowsFetching?: boolean | undefined;
    permissions: any;
    handleUpdateRowInputChange: any;
    handleUpdateRowOnFocus: any;
    handleUpdateRowOnBlur: any;
}

const TextInput = ({
    cell,
    permissions,
    handleUpdateRowInputChange,
    handleUpdateRowOnFocus,
    handleUpdateRowOnBlur,
}: IProps) => {
    const [inputValue, setInputValue] = useState<string>(cell.value);
    return (
        <Input
            value={inputValue}
            size={"sm"}
            variant={"unstyled"}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleUpdateRowInputChange(event);
                setInputValue(event.target.value);
            }}
            onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) => handleUpdateRowOnFocus(event, cell)}
            onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) => handleUpdateRowOnBlur(event, cell)}
            // isDisabled={rowsLoading || deletingRows || creatingRow || rowsFetching}
            isReadOnly={!((permissions || 0) > 1)}
            cursor={(permissions || 0) > 1 ? "text" : "default"}
            textOverflow={"ellipsis"}
        />
    );
};

export default TextInput;
