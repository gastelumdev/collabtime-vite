import { Box, Input, Text, Tooltip } from '@chakra-ui/react';
import { TCell, TRow } from '../../types';
import { memo, useEffect, useState } from 'react';
import { useUpdateCellMutation, useUpdateRowMutation } from '../../app/services/api';

interface IProps {
    row: TRow;
    columnName: string;
    editMode?: any;
    value?: string;
    permissions: any;
    rowIndex: number;
    updateRows: any;
}

interface ITextInputProps {
    id: any;
    columnName: string;
    value: string;
    onChange: any;
}

const TextInput = ({ id, columnName, value, onChange }: ITextInputProps) => {
    console.log(id, columnName);
    console.info(id, columnName);
    const [active, setActive] = useState<boolean>(true);
    const [val, setVal] = useState<string>(value);

    useEffect(() => {
        setVal(value);
    }, [value]);

    const onTextChange = (value: string) => {
        setVal(value);
    };

    const handleBlur = (value: string) => {
        onChange(id, columnName, value);
    };
    return (
        <>
            {!active ? (
                <Text>{val}</Text>
            ) : (
                <Box>
                    <Input
                        p={'3px'}
                        px={'14px'}
                        textOverflow={'ellipsis'}
                        fontSize={'12px'}
                        variant={'unstyled'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onTextChange(event.target.value)}
                        onBlur={(event: React.FocusEvent<HTMLInputElement, Element>) => handleBlur(event.target.value)}
                        value={val}
                    />
                </Box>
            )}
        </>
    );
};

export default memo(TextInput);
