import { Box, Button, Input, Textarea } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';

// interface IProps {
//     row: TRow;
//     columnName: string;
//     editMode?: any;
//     value?: string;
//     permissions: any;
//     rowIndex: number;
//     updateRows: any;
// }

interface ITextInputProps {
    id?: any;
    columnName: string;
    value: string;
    type?: string;
    onChange: any;
    allowed?: boolean;
    isTextarea?: boolean;
}

const TextInput = ({ columnName, value, type = 'tableCell', onChange, allowed = false, isTextarea = true }: ITextInputProps) => {
    const [active, setActive] = useState<boolean>(false);
    const [val, setVal] = useState<string>(value);

    useEffect(() => {
        setVal(value);
    }, [value]);

    const onTextChange = (value: string) => {
        console.log(value);
        // onChange(columnName, value);
        setVal(value);
    };

    const handleBlur = (value: string) => {
        onChange(columnName, value);
    };

    // useEffect(() => {
    //     return () => {
    //         onChange(id, columnName, val);
    //     };
    // }, []);
    return (
        <>
            {!active || !allowed ? (
                <Box
                    w={'100%'}
                    p={val ? '0px' : type === 'tableCell' ? '14px' : '0px'}
                    onClick={() => setActive(!active)}
                    px={type === 'tableCell' ? '20px' : '0px'}
                    overflow={'hidden'}
                >
                    <Button
                        variant={'unstyled'}
                        border={type === 'tableCell' ? 'none' : '1px solid #edf2f7'}
                        fontSize={'12px'}
                        fontWeight={'normal'}
                        padding={0}
                        pl={type === 'tableCell' ? '0px' : '12px'}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        w={'100%'}
                        h={'29px'}
                        textAlign={'left'}
                        cursor={'text'}
                    >
                        {val}
                    </Button>
                </Box>
            ) : (
                <Box pos={'relative'}>
                    {isTextarea ? (
                        <Textarea
                            fontSize={'12px'}
                            value={val}
                            position={'absolute'}
                            zIndex={1000000}
                            onBlur={() => setActive(!active)}
                            bgColor={'white'}
                            autoFocus={true}
                            onFocus={(event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
                                // event.target.select();
                                let v = event.target.value;
                                event.target.value = '';
                                event.target.value = v;
                            }}
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onTextChange(event.target.value)}
                            onBlurCapture={(event: React.FocusEvent<HTMLTextAreaElement, Element>) => handleBlur(event.target.value)}
                        />
                    ) : (
                        <Input
                            fontSize={'12px'}
                            value={val}
                            // position={'absolute'}
                            zIndex={1000000}
                            onBlur={() => setActive(!active)}
                            bgColor={'white'}
                            size={'sm'}
                            autoFocus={true}
                            onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) => {
                                // event.target.select();
                                let v = event.target.value;
                                event.target.value = '';
                                event.target.value = v;
                            }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => onTextChange(event.target.value)}
                            onBlurCapture={(event: React.FocusEvent<HTMLInputElement, Element>) => handleBlur(event.target.value)}
                        />
                    )}
                </Box>
            )}
        </>
    );
};

export default memo(TextInput);
