import {
    Box,
    Button,
    Flex,
    // ChakraProvider,
    Input,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cellBorderColor } from './DataCollection';
// import { useGetDataCollectionViewsByRowIdQuery, useGetUserGroupsQuery } from '../../app/services/api';
// import View from '../dataCollectionViews/View';
// import { emptyPermissions } from '../workspaces/UserGroups';

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
    isCustomLink?: boolean;
    bgColor?: string;
    textColor?: string;
    fontWeight?: string;
    position?: string;
    isDisabled?: boolean;
    inputType?: string;
    prefix?: any;
}

const TextInput = ({
    id,
    columnName,
    value = '',
    type = 'tableCell',
    onChange,
    allowed = false,
    isTextarea = false,
    isCustomLink = false,
    bgColor = 'white',
    textColor = 'black',
    fontWeight = 'normal',
    // position = 'left',
    isDisabled = false,
    inputType = 'text',
    prefix = null,
}: ITextInputProps) => {
    const [active, setActive] = useState<boolean>(false);
    // const [val, setVal] = useState<string>('');
    const [displayVal, setDisplayVal] = useState('');
    const navigate = useNavigate();

    const fontSize = '13px';

    useEffect(() => {
        // console.log(value);
        setDisplayVal(value === null ? '' : value);

        // if (inputType === 'number') {
        //     let number = Number(value);
        //     let numberToString = number.toLocaleString();
        //     setDisplayVal(numberToString);
        // }
        // }
    }, [value]);

    const onTextChange = (v: string) => {
        // onChange(columnName, value);
        setDisplayVal(v);
    };

    const handleBlur = (v: string) => {
        if (v === '') {
            if (value !== null && value !== '') {
                onChange(columnName, v);
            }
        } else {
            onChange(columnName, v);
        }
        setDisplayVal(v);
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
                    // bgColor={'blue'}
                    // p={val ? '0px' : type === 'tableCell' ? '14px' : '0px'}
                    onClick={() => {
                        if (!isCustomLink) {
                            setActive(!active);
                        }
                    }}
                    // px={type === 'tableCell' ? '20px' : '0px'}
                    // p={'2px'}
                    overflow={'hidden'}
                >
                    {!isCustomLink ? (
                        <Button
                            variant={'unstyled'}
                            border={type === 'tableCell' ? 'none' : `1px solid ${cellBorderColor}`}
                            borderRadius={'none'}
                            fontSize={fontSize}
                            fontWeight={fontWeight}
                            padding={0}
                            bgColor={bgColor}
                            color={textColor}
                            pl={'12px'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            w={'100%'}
                            h={'29px'}
                            textAlign={'left'}
                            cursor={allowed ? 'text' : 'default'}
                            size={'xs'}
                            isDisabled={isDisabled}
                            onFocus={() => {
                                setActive(true);
                            }}
                        >
                            {/* {`${prefix && value !== '' ? prefix : ''}` + `${position === 'center' ? <Center>{displayVal}</Center> : displayVal}`} */}
                            <Flex fontSize={'9px'}>
                                <Box>
                                    <Text fontSize={fontSize}>{`${prefix && value !== '' ? prefix : ''}`}</Text>
                                </Box>
                                <Box>
                                    <Text fontSize={fontSize}>{displayVal}</Text>
                                </Box>
                            </Flex>
                        </Button>
                    ) : (
                        // <ProjectManagerApp val={val} type={type} rowId={id} />
                        <Button
                            variant={'unstyled'}
                            border={type === 'tableCell' ? 'none' : `1px solid ${cellBorderColor}`}
                            borderRadius={'none'}
                            fontSize={fontSize}
                            fontWeight={fontWeight}
                            padding={0}
                            bgColor={bgColor}
                            color={textColor}
                            // pl={type === 'tableCell' ? '0px' : '12px'}
                            pl={'12px'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            w={'100%'}
                            h={'29px'}
                            textAlign={'left'}
                            cursor={'pointer'}
                            size={'xs'}
                            onClick={() => {
                                navigate(`/workspaces/${localStorage.getItem('workspaceId')}/viewRow/${id}`);
                            }}
                            isDisabled={isDisabled}
                        >
                            <Flex fontSize={'9px'}>
                                <Box>
                                    <Text fontSize={fontSize}>{`${prefix && value !== '' ? prefix : ''}`}</Text>
                                </Box>
                                <Box>
                                    <Text fontSize={fontSize}>{displayVal}</Text>
                                </Box>
                            </Flex>
                        </Button>
                    )}
                </Box>
            ) : (
                <Box pos={'relative'}>
                    {isTextarea ? (
                        <Textarea
                            fontSize={fontSize}
                            value={displayVal}
                            position={'absolute'}
                            zIndex={1000000}
                            onBlur={() => setActive(!active)}
                            bgColor={'white'}
                            color={textColor}
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
                        <>
                            {inputType === 'text' ? (
                                <Input
                                    fontSize={fontSize}
                                    fontWeight={'normal'}
                                    value={displayVal}
                                    // position={'absolute'}
                                    zIndex={1000000}
                                    onBlur={() => setActive(!active)}
                                    bgColor={'white'}
                                    color={active ? 'black' : textColor}
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
                            ) : (
                                <Input
                                    fontSize={fontSize}
                                    fontWeight={'normal'}
                                    value={displayVal}
                                    type={'number'}
                                    placeholder={'0'}
                                    // position={'absolute'}
                                    zIndex={1000000}
                                    onBlur={() => setActive(!active)}
                                    bgColor={'white'}
                                    color={active ? 'black' : textColor}
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
                        </>
                    )}
                </Box>
            )}
        </>
    );
};

// const ProjectManagerApp = ({ rowId, val, type }: { rowId: string; val: string; type: string }) => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     // const { data: dataCollectionViews } = useGetDataCollectionViewsByRowIdQuery(rowId);
//     // const { data: userGroups, refetch: refetchUserGroups } = useGetUserGroupsQuery(null);
//     // const [userGroup, setUserGroup] = useState({ name: '', workspace: '', permissions: emptyPermissions });

//     // useEffect(() => {
//     //     if (userGroups !== undefined) {
//     //         const ug = userGroups?.find((item: any) => {
//     //             return item.users.includes(localStorage.getItem('userId'));
//     //         });

//     //         setUserGroup(ug);
//     //     } else {
//     //         refetchUserGroups();
//     //     }
//     // }, [userGroups]);
//     return (
//         <div>
//             <Button
//                 variant={'unstyled'}
//                 border={type === 'tableCell' ? 'none' : '1px solid #edf2f7'}
//                 borderRadius={'none'}
//                 fontSize={'12px'}
//                 fontWeight={'normal'}
//                 padding={0}
//                 // pl={type === 'tableCell' ? '0px' : '12px'}
//                 pl={'12px'}
//                 overflow={'hidden'}
//                 textOverflow={'ellipsis'}
//                 w={'100%'}
//                 h={'29px'}
//                 textAlign={'left'}
//                 cursor={'pointer'}
//                 size={'xs'}
//                 onClick={onOpen}
//             >
//                 {val}
//             </Button>
//             <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={'sm'}>
//                 <DrawerOverlay />
//                 <DrawerContent>
//                     <DrawerCloseButton />
//                     <DrawerHeader>{val}</DrawerHeader>

//                     <DrawerBody>
//                         {dataCollectionViews !== undefined
//                             ? dataCollectionViews.map((dcView: any) => {
//                                   return <View key={dcView.name} dataCollectionView={dcView} userGroup={userGroup} refetchUserGroup={refetchUserGroups} />;
//                               })
//                             : null}
//                         {rowId}
//                     </DrawerBody>

//                     <DrawerFooter>
//                         <Button variant="outline" mr={3} onClick={onClose}>
//                             Cancel
//                         </Button>
//                         <Button colorScheme="blue">Save</Button>
//                     </DrawerFooter>
//                 </DrawerContent>
//             </Drawer>
//         </div>
//     );
// };

export default TextInput;
