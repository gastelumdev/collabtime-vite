import { Box, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { useGetBillOfMaterialsPartsQuery } from '../../../../app/services/api';
import { TRow } from '../../../../types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PurchaseOrders = ({ project, refetchBom }: { project: TRow; refetchBom: boolean }) => {
    const { id } = useParams();
    const { data: bomParts, refetch: refetchBomParts } = useGetBillOfMaterialsPartsQuery(project._id);

    const [purchaseOrders, setPurchaseOrders] = useState<any>({});

    useEffect(() => {
        refetchBomParts();
        if (bomParts) {
            let newPurchaseOrders: any = {};
            for (const bomPart of bomParts) {
                const vendor = bomPart.refs.vendor[0];
                const vendorName = vendor.values.Name;

                if (newPurchaseOrders[vendorName] === undefined) {
                    newPurchaseOrders = { ...newPurchaseOrders, [vendorName]: [bomPart] };
                } else {
                    newPurchaseOrders = { ...newPurchaseOrders, [vendorName]: [...newPurchaseOrders[vendorName], bomPart] };
                }
            }
            setPurchaseOrders(newPurchaseOrders);
        }
    }, [bomParts, refetchBom]);
    return (
        <Box>
            <Heading size={'sm'} mb={'30px'}>
                Purchase Orders
            </Heading>
            <Box w={'400px'}>
                {Object.keys(purchaseOrders).map((po: any) => {
                    return (
                        <Flex>
                            <Text>{po}</Text>
                            <Spacer />
                            <a href={`${import.meta.env.VITE_API_URL}/workspace/${id}/project/${project._id}/purchaseOrder/${po}`} target={'_blank'}>
                                Download
                            </a>
                        </Flex>
                    );
                })}
            </Box>
        </Box>
    );
};

export default PurchaseOrders;
