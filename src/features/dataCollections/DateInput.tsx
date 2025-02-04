import { Box, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface IProps {
    value: string;
    columnName: string;
    onChange: any;
    allowed?: boolean;
    border?: string | null;
    fontWeight?: string;
}

const DateInput = ({ value, columnName, onChange, allowed = false, border = null, fontWeight = 'normal' }: IProps) => {
    // const [updateCell] = useUpdateCellMutation();
    const [inputValue, setInputValue] = useState<string>('');

    const fontSize = '13px';

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
        <Box px={'20px'} pt={'4px'} border={border ? border : 'none'} h={'28px'}>
            {/* <Box>{value !== '' || value === undefined ? '#1a202c' : 'lightgray'}</Box> */}
            {/* <Box>{value !== '' || value === undefined ? 'Nothing' : value}</Box> */}
            <Input
                value={inputValue}
                fontWeight={fontWeight}
                type="datetime-local"
                size={'sm'}
                variant={'unstyled'}
                onChange={handleInputChange}
                // onBlur={handleUpdateRowOnBlur}
                isReadOnly={!allowed}
                cursor={allowed ? 'text' : 'default'}
                textOverflow={'ellipsis'}
                fontSize={fontSize}
                color={inputValue !== '' || inputValue === undefined ? '#1a202c' : 'lightgray'}
                // placeholder="2000-01-01T12:00"
            />
        </Box>
    );
};

export default DateInput;
