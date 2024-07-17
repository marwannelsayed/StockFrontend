import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Center, Button, VStack } from '@chakra-ui/react';
import { fetchBoughtStocks } from '../Service/stockService';
import { Link } from 'react-router-dom';

const BoughtStocks = ({ onLogout }) => {
    const [stocksBought, setStocksBought] = useState([]);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const fetchedStocks = await fetchBoughtStocks();
                setStocksBought(fetchedStocks);
            } catch (error) {
                console.error('Error fetching bought stocks:', error);
            }
        };

        fetchStocks();
    }, []);

    return (
        <Box>
            <Link to="/">
                <Button variant='outline' bg="white" mb={6} mt={6} ml={6}>Back</Button>
            </Link>
            <Center p={4}>
                <Box backgroundColor="white" p={8} width="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                    <VStack spacing={4} width="100%">
                        <Heading as="h1" size="xl" mb={6}>Stocks Bought</Heading>
                        <TableContainer>
                            <Table variant="simple" size="md">
                                <Thead>
                                    <Tr>
                                        <Th>Symbol</Th>
                                        <Th>Price</Th>
                                        <Th>Quantity</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {stocksBought.map((stock, index) => (
                                        <Tr key={index}>
                                            <Td>{stock.stockSymbol}</Td>
                                            <Td>{stock.price}</Td>
                                            <Td>{stock.quantity}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Button colorScheme="red" onClick={onLogout}>Logout</Button>
                    </VStack>
                </Box>
            </Center>
        </Box>
    );
};

export default BoughtStocks;
