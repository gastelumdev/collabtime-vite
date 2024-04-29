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
        // get the iso time string formatted for usage in an input['type="datetime-local"']
        var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
        var localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
        var localISOTimeWithoutSeconds = localISOTime.slice(0, 16);

        console.log(localISOTimeWithoutSeconds);

        if (value !== 'Invalid Date') {
            const newValue = value?.slice(0, 16);
            setInputValue(newValue || localISOTimeWithoutSeconds);
        } else {
            setInputValue(localISOTimeWithoutSeconds);
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
                color={value !== '' ? '#1a202c' : 'lightgray'}
                placeholder="2000-01-01T12:00"
            />
        </Box>
    );
};

export default DateInput;
