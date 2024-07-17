import React, { useState } from 'react';
import { Box, Flex, FormControl, FormLabel, Input, Button, Text, Heading } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ handleLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [isLoginSuccessful, setIsLoginSuccessful] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:5191/Auth/login', {
                username,
                password
            });

            const token = response.data.token;
            // Save the token in local storage, or in your state management library
            localStorage.setItem('jwtToken', token);
            setLoginMessage('Logged in successfully');
            setIsLoginSuccessful(true);
            handleLogin(username);
        } catch (error) {
            console.error('Error logging in', error);
            setLoginMessage('check username or password');
            setIsLoginSuccessful(false);
        }
    };

    return (
        <Flex width="full" align="center" justifyContent="center" height="100vh">
            <Box backgroundColor="white" p={8} width="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading size="xl">Login</Heading>
                </Box>
                <Box my={4} textAlign="left">
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <Button width="full" mt={4} type="submit" colorScheme="teal">
                            Login
                        </Button>
                    </form>
                    {loginMessage && <Text mt={4} color={isLoginSuccessful ? "green.500" : "red.500"}>{loginMessage}</Text>}
                    <Text mt={4}>
                    Don't have an account? <Link to="/Signup" style={{ color: 'teal' }}>Sign up here</Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
}

export default Login;
