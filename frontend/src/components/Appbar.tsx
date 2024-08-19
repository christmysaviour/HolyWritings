"use-client";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Appbar = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('sessionToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleSignOut = async () => {
        try {
            const token = localStorage.getItem('sessionToken');
            if (!token) {
                alert('No token found');
                return;
            }
            console.log('Sending signout request with token:', token);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signout`, {}, {
                headers: { Token: `Bearer ${token}` }
            });
            console.log('Signout response:', response.data);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('sessionToken');
            setIsAuthenticated(false); // Update the authentication status
            navigate('/signup');
        } catch (error) {
            console.error('Signout error:', error);
            alert('Error while signing out');
        }
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer font-bold text-xl">
                HolyWritings
            </Link>
            <div>
                <Link to={`/publish`}>
                    <button
                        type="button"
                        className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                        New
                    </button>
                </Link>
                {isAuthenticated ? (
                    <button
                        onClick={handleSignOut}
                        type="button"
                        className="ml-4 text-white bg-black focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Sign Out
                    </button>
                ) : (
                    <Link to="/signup">
                        <button
                            type="button"
                            className="ml-4 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                            Sign Up
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

"use-client";

import { FaBars } from 'react-icons/fa'; 

export const Appbars = ({ onToggle, showMyBlogs }: { onToggle: () => void; showMyBlogs: boolean }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('sessionToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleSignOut = async () => {
        try {
            const token = localStorage.getItem('sessionToken');
            if (!token) {
                alert('No token found');
                return;
            }
            console.log('Sending signout request with token:', token);
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/signout`, {}, {
                headers: { Token: `Bearer ${token}` }
            });
            console.log('Signout response:', response.data);
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('sessionToken');
            setIsAuthenticated(false); // Update the authentication status
            navigate('/signup');
        } catch (error) {
            console.error('Signout error:', error);
            alert('Error while signing out');
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="border-b flex justify-between px-10 py-4 items-center relative">
            <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer font-bold text-xl">
                HolyWritings
            </Link>
            <div className="hidden md:flex items-center">
                <button
                    onClick={onToggle}
                    type="button"
                    className="mr-5 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                    {showMyBlogs ? "All Blogs" : "My Blogs"}
                </button>
                <Link to={`/publish`}>
                    <button
                        type="button"
                        className="mr-3 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                        New
                    </button>
                </Link>
                
                {isAuthenticated ? (
                    <button
                        onClick={handleSignOut}
                        type="button"
                        className="ml-4 text-white bg-black focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                        Sign Out
                    </button>
                ) : (
                    <Link to="/signup">
                        <button
                            type="button"
                            className="ml-4 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                            Sign Up
                        </button>
                    </Link>
                )}
            </div>
            <button
                className="md:hidden focus:outline-none focus:ring-4 focus:ring-black font-medium rounded-full text-sm p-2"
                onClick={toggleMenu}
            >
                <FaBars className="text-xl" />
            </button>
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 right-0 bg-white shadow-lg rounded-lg w-48 z-10">
                    <button
                        onClick={onToggle}
                        type="button"
                        className="block w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2">
                        {showMyBlogs ? "All Blogs" : "My Blogs"}
                    </button>
                    <Link to={`/publish`}>
                        <button
                            type="button"
                            className="block w-full text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2">
                            New
                        </button>
                    </Link>
                    
                    {isAuthenticated ? (
                        <button
                            onClick={handleSignOut}
                            type="button"
                            className="block w-full text-white bg-black focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2">
                            Sign Out
                        </button>
                    ) : (
                        <Link to="/signup">
                            <button
                                type="button"
                                className="block w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center my-2">
                                Sign Up
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};




