import React, { useState, useEffect } from 'react';
import { 
    ChakraProvider, Box, VStack, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, Center, 
    Button, Input, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, 
    AlertDialogOverlay, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, 
    useDisclosure, Text, Flex, Avatar 
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { startConnection, stopConnection, fetchInitialStocks, fetchBoughtStocks, subscribeToStock, buyStock } from './Service/stockService';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BoughtStocks from './pages/BoughtStocks';

function MainApp() {
    const [isOpen, setIsOpen] = useState(false);
    const [stockUpdates, setStockUpdates] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [stockSymbol, setStockSymbol] = useState('');
    const [stocksBought, setStocksBought] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [selectedStockPrice, setSelectedStockPrice] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [quantityError, setQuantityError] = useState('');
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const cancelRef = React.useRef();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        try {
            await subscribeToStock(stockSymbol);
            console.log('Successfully subscribed to stock:', stockSymbol);
            setIsOpen(false);
        } catch (error) {
            console.error('Error subscribing to stock:', error);
        }
    };

    const handleBuyStock = async () => {
        const value = Number(quantity);
        if (value < 1 || value > 1000) {
            setQuantityError('Quantity must be between 1 and 1000.');
        } else {
            setQuantityError('');
            try {
                const boughtStock = await buyStock(selectedStock.stockSymbol, quantity, selectedStockPrice);
                console.log('Successfully bought stock:', selectedStock.stockSymbol);
                // Use the actual structure of the bought stock data
                const newStock = {
                    stockSymbol: selectedStock.stockSymbol,
                    price: selectedStockPrice,
                    quantity: quantity
                };
                setStocksBought([...stocksBought, newStock]);
                onModalClose();
            } catch (error) {
                console.error('Error buying stock:', error);
            }
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const initializeConnection = async () => {
                const initialStocks = await fetchInitialStocks();
                setStockUpdates(initialStocks);

                await startConnection((updatedStock) => {
                    setStockUpdates((prevStockUpdates) => {
                        const updatedStocks = [...prevStockUpdates];
                        const index = updatedStocks.findIndex(stock => stock.stockSymbol === updatedStock.stockSymbol);
                        if (index !== -1) {
                            updatedStocks[index] = updatedStock;
                        } else {
                            updatedStocks.push(updatedStock);
                        }
                        return updatedStocks;
                    });
                });

                // Fetch bought stocks when logged in
                const fetchedStocks = await fetchBoughtStocks();
                setStocksBought(fetchedStocks);
            };
            initializeConnection();

            return () => {
                stopConnection();
            };
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (selectedStock) {
            setSelectedStockPrice(selectedStock.price);
        }
    }, [selectedStock]);

    useEffect(() => {
        if (stocksBought.length > 0) {
            setLoading(false);
        }
    }, [stocksBought]);

    const handleLogin = (username) => {
        setUsername(username);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
    };

    const openBuyModal = (stock) => {
        setSelectedStock(stock);
        onModalOpen();
    };

    return (
        <Box backgroundColor="purple.100" height="100vh">
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={
                    !isLoggedIn ? (
                        <Login handleLogin={handleLogin} />
                    ) : (
                        <>
                        <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding={6} bg="purple.500" color="white">
                            <Text fontSize="30px" fontWeight="bold">Stockatko</Text>
                            <Box display="flex" alignItems="center">
                                <Avatar backgroundColor="white" name={username} size="sm" marginRight={4} />
                                <Text marginRight={4}>Hello {username}!</Text>
                                <Button colorScheme="red" onClick={handleLogout}>Logout</Button>
                            </Box>
                        </Flex>
                        <Center p={4}>
                            <Flex direction="row" justify="space-between" alignItems="flex-start" gap={8}>
                                <Box backgroundColor="white" p={8} width="600px" borderWidth={1} borderRadius={8} boxShadow="lg">
                                    <VStack spacing={4} width="100%">
                                        <Heading as="h1" size="xl" mb={6}>Stock Updates</Heading>
                                        <TableContainer>
                                            <Table variant="simple" size="md">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Stock Symbol</Th>
                                                        <Th>Price ($)</Th>
                                                        <Th>Action</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {stockUpdates.map((stockUpdate, index) => (
                                                        <Tr key={index}>
                                                            <Td>{stockUpdate.stockSymbol}</Td>
                                                            <Td>{stockUpdate.price}</Td>
                                                            <Td>
                                                                <Button variant="outline" colorScheme="blue" onClick={() => openBuyModal(stockUpdate)}>
                                                                    Buy
                                                                </Button>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                        <Button colorScheme="purple" onClick={() => setIsOpen(true)}>Subscribe to Stock</Button>
                                    </VStack>
                                </Box>
                                <Box backgroundColor="white" p={8} width="400px" borderWidth={1} borderRadius={8} boxShadow="lg" flexGrow={1}>
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
                                                {!loading && stocksBought.map((stock, index) => (
                                                    <Tr key={index}>
                                                        <Td>{stock.stockSymbol}</Td>
                                                        <Td>{stock.price}</Td>
                                                        <Td>{stock.quantity}</Td>
                                                    </Tr>
                                                ))}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </VStack>
                                </Box>
                            </Flex>
                        </Center>
                        </>
                    )
                } />
                <Route path="/bought-stocks" element={<BoughtStocks onLogout={handleLogout} />} />
            </Routes>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Subscribe to Stock
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Enter the stock symbol you want to subscribe to
                            <Input value={stockSymbol} onChange={(e) => setStockSymbol(e.target.value)} />
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" onClick={handleSubscribe} ml={3}>
                                Subscribe
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Buy Stock</ModalHeader>
                    <ModalBody>
                        <Text>Stock Symbol: {selectedStock?.stockSymbol}</Text>
                        <Text>Price: {selectedStockPrice}</Text>
                        <Input
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setQuantity(value);
                            }}
                            type="number"
                            min={1}
                            max={1000}
                        />
                        {quantityError && (
                            <Text color="red.500" mt={2}>{quantityError}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onModalClose}>Cancel</Button>
                        <Button colorScheme="blue" onClick={handleBuyStock} ml={3}>
                            Confirm Purchase
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

function App() {
    return (
        <ChakraProvider>
            <Router>
                <MainApp />
            </Router>
        </ChakraProvider>
    );
}

export default App;
