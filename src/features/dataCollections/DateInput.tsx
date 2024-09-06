import { Box, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface IProps {
    value: string;
    columnName: string;
    onChange: any;
    allowed?: boolean;
    border?: string | null;
}

const DateInput = ({ value, columnName, onChange, allowed = false, border = null }: IProps) => {
    // const [updateCell] = useUpdateCellMutation();
    const [inputValue, setInputValue] = useState<string>(value);

    useEffect(() => {
        if (value !== 'Invalid Date') {
            const newValue = value?.slice(0, 16);
            setInputValue(newValue || '');
        } else {
            setInputValue('');
        }
    }, [value]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onChange(columnName, event.target.value);
    };

    // const handleUpdateRowOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    //     // updateCell({ ...cell, value: event.target.value });
    // };

    return (
        <Box px={'20px'} pt={'5px'} border={border ? border : 'none'}>
            {/* <Box>{value !== '' || value === undefined ? '#1a202c' : 'lightgray'}</Box> */}
            {/* <Box>{value !== '' || value === undefined ? 'Nothing' : value}</Box> */}
            <Input
                value={inputValue}
                type="datetime-local"
                size={'sm'}
                variant={'unstyled'}
                onChange={handleInputChange}
                // onBlur={handleUpdateRowOnBlur}
                isReadOnly={!allowed}
                cursor={allowed ? 'text' : 'default'}
                textOverflow={'ellipsis'}
                fontSize={'12px'}
                color={inputValue !== '' || inputValue === undefined ? '#1a202c' : 'lightgray'}
                placeholder="2000-01-01T12:00"
            />
        </Box>
    );
};

export default DateInput;
