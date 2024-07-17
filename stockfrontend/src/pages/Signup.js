import React, { useState } from 'react';
import { Box, Flex, FormControl, FormLabel, Input, Button, Text, Heading } from '@chakra-ui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupMessage, setSignupMessage] = useState('');
    const [isSignupSuccessful, setIsSignupSuccessful] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setSignupMessage('Passwords do not match');
            setIsSignupSuccessful(false);
            return;
        }

        try {
            await axios.post('http://localhost:5191/Auth/signup', {
                username,
                password
            });

            setSignupMessage('Signed up successfully');
            setIsSignupSuccessful(true);
            navigate('/');
        } catch (error) {
            console.error('Error signing up', error);
            setSignupMessage('Make sure the username is unique');
            setIsSignupSuccessful(false);
        }
    };

    return (
        <Flex width="full" align="center" justifyContent="center" height="100vh">
            <Box backgroundColor="white" p={8} width="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading size="xl">Signup</Heading>
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
                        <FormControl mt={4}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </FormControl>
                        <Button width="full" mt={4} type="submit" colorScheme="teal">
                            Signup
                        </Button>
                    </form>
                    {signupMessage && <Text mt={4} color={isSignupSuccessful ? "green.500" : "red.500"}>{signupMessage}</Text>}
                    <Text mt={4}>
                    Already have an account? <Link to="/" style={{ color: 'teal' }}>Log in here</Link>
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
}

export default Signup;