import { useEffect, useState } from 'react';
import { TColumn, TRow } from '../../../../types';
import {
    useGetBillOfMaterialsPartsQuery,
    useGetBillOfMaterialsViewQuery,
    useGetPartsColumnsQuery,
    useGetPartsQuery,
    useUpdateBillOfMaterialsPartValuesMutation,
} from '../../../../app/services/api';
import {
    Box,
    Container,
    Flex,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import View from '../../../dataCollectionViews/View';
import PrimaryButton from '../../../../components/Buttons/PrimaryButton';

const BillOfMaterials = ({ project, userGroup, refetchUserGroups }: { project: TRow; handleChange?: any; userGroup: any; refetchUserGroups: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Bill of Materials
    const { data: billOfMaterialsView } = useGetBillOfMaterialsViewQuery(null);
    const { data: bomParts, refetch: refetchBomParts } = useGetBillOfMaterialsPartsQuery(project._id);
    const [updateBillOfMaterialsPartValues] = useUpdateBillOfMaterialsPartValuesMutation();

    // Parts
    const { data: parts } = useGetPartsQuery(null);
    const { data: partsColumns } = useGetPartsColumnsQuery(null);

    const [view, setView] = useState<any>(null);
    const [partsState, setPartsState] = useState<any>(null);
    const [bomPartsState, setBomPartsState] = useState<any>(null);

    useEffect(() => {
        if (billOfMaterialsView) {
            setView(billOfMaterialsView);
        }
    }, [billOfMaterialsView]);

    useEffect(() => {
        setBomPartsState(bomParts);
    }, [bomParts]);

    useEffect(() => {
        if (parts !== undefined) {
            const newParts = parts.map((part: TRow) => {
                if (bomPartsState) {
                    const matchingBomPart = bomPartsState.find((item: any) => {
                        return item.values['Part No'] === part.values['Part No'];
                    });

                    if (matchingBomPart !== undefined) {
                        return { ...part, values: { ...part.values, qty: matchingBomPart.values.qty } };
                    }
                }
                return { ...part, values: { ...part.values, qty: '' } };
            });

            setPartsState(newParts);
        }
    }, [parts, bomPartsState]);

    const handleOnClose = () => {
        refetchBomParts();
        onClose();
    };

    const execute = (callType: string, part: TRow) => {
        if (callType === 'refetchBom') {
            const newBomParts = bomPartsState.filter((item: TRow) => {
                return item._id !== part._id;
            });
            setBomPartsState(newBomParts);
            refetchBomParts();
        }
    };
    return (
        <>
            <Flex mb={'10px'}>
                <Spacer />
                <Box>
                    <PrimaryButton size="sm" onClick={onOpen}>
                        Add Parts
                    </PrimaryButton>
                </Box>
            </Flex>
            <Box>
                {view && bomParts && bomParts?.length > 0 ? (
                    <View
                        dataCollectionView={view}
                        active={true}
                        userGroup={userGroup}
                        refetchUserGroup={refetchUserGroups}
                        showCreateRowProp={false}
                        rowsProp={bomPartsState}
                        execute={execute}
                    />
                ) : null}
            </Box>
            <Modal isOpen={isOpen} onClose={handleOnClose} size={'full'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Parts</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <Container maxW={'container.xl'}>
                                <TableContainer maxW={'container.xl'}>
                                    <Table variant="simple" size={'sm'}>
                                        <Thead>
                                            <Tr>
                                                <Th maxW={'80px'}>Units</Th>
                                                {partsColumns?.map((column: TColumn) => {
                                                    if (column.isEmpty) return null;
                                                    return <Th key={column._id}>{column.name.split('_').join(' ')}</Th>;
                                                })}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {partsState
                                                ? partsState?.map((part: TRow) => {
                                                      if (part.isEmpty) return null;
                                                      return (
                                                          <Tr key={part._id}>
                                                              <Td>
                                                                  <Input
                                                                      type={'number'}
                                                                      value={part.values['qty']}
                                                                      placeholder="0"
                                                                      color={part.values['qty'] === '0' ? 'gray.400' : 'black'}
                                                                      size={'xs'}
                                                                      maxW={'80px'}
                                                                      border={'1px solid lightgray'}
                                                                      onFocus={(event: React.FocusEvent<HTMLInputElement, Element>) => {
                                                                          if (event.target.value === '0') {
                                                                              event.target.value = '';
                                                                          }
                                                                      }}
                                                                      onBlur={async (event: React.FocusEvent<HTMLInputElement, Element>) => {
                                                                          if (event.target.value !== '') {
                                                                              await updateBillOfMaterialsPartValues({
                                                                                  values: {
                                                                                      ...part.values,
                                                                                      qty: event.target.value,
                                                                                  },
                                                                                  refs: {
                                                                                      ...part.refs,
                                                                                  },
                                                                              });
                                                                          } else {
                                                                          }
                                                                      }}
                                                                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                          if (event.target.value !== '0') {
                                                                              const newParts = partsState.map((item: TRow) => {
                                                                                  if (item._id === part._id) {
                                                                                      return {
                                                                                          ...item,
                                                                                          values: {
                                                                                              ...item.values,
                                                                                              qty: event.target.value,
                                                                                              project_id: project._id,
                                                                                          },
                                                                                      };
                                                                                  }
                                                                                  return item;
                                                                              });

                                                                              setPartsState(newParts);
                                                                          }
                                                                      }}
                                                                  />
                                                              </Td>
                                                              {partsColumns?.map((column: TColumn) => {
                                                                  if (column.isEmpty) return null;
                                                                  let value = part.values[column.name];
                                                                  let prefix = '';

                                                                  if (column.type === 'reference') {
                                                                      value = part.refs[column.name][0].values[column.dataCollectionRefLabel];
                                                                  }

                                                                  if (column.type === 'number') {
                                                                      prefix = column.prefix as string;
                                                                  }
                                                                  return <Td key={column._id}>{`${prefix} ${value}`}</Td>;
                                                              })}
                                                          </Tr>
                                                      );
                                                  })
                                                : null}
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </Container>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default BillOfMaterials;
