import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from './userContext';

export const SocketContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export function SocketProvider({ children }) {
    const { token } = useContext(UserContext);
    // useRef to hold the socket instance across renders without causing re-renders
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }

        // instantiate socket connection
        socketRef.current = io(API_URL, {
            auth: { token },
            transports: ['websocket'],
        });

        // listseners
        // on connection event
        socketRef.current.on('connect', () => {
            console.log('Socket connected');
            setConnected(true);
        });

        // on disconnection event
        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        // on connection error event
        socketRef.current.on('connect_error', (error) => {
            console.log('Socket error:', error.message);
        });

        // cleanup on unmount
        return () => {
            socketRef.current?.disconnect();
        };

    }, [token]);

    // events
    function joinDM(otherUserId) {
        socketRef.current?.emit('join_dm', otherUserId);
    }

    function leaveDM(otherUserId) {
        socketRef.current?.emit('leave_dm', otherUserId);
    }

    function sendDM(otherUserId, content) {
        socketRef.current?.emit('send_dm', { otherUserId, content });
    }

    function onDM(callback) {
        socketRef.current?.on('new_dm', callback);
        return () => socketRef.current?.off('new_dm', callback);
    }

    return (
        <SocketContext.Provider
            value={{ connected, joinDM, leaveDM, sendDM, onDM }}
        >
            {children}
        </SocketContext.Provider>
    )
}
