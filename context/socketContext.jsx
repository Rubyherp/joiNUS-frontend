import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from './userContext';

export const SocketContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export function SocketProvider({ children }) {
    const { token } = useContext(UserContext);
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token) {
            return;
        }

        socketRef.current = io(API_URL, {
            auth: { token },
            transports: ['websocket'],
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
            setConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        socketRef.current.on('connect_error', (error) => {
            console.log('Socket error:', error.message);
        });

        return () => {
            socketRef.current?.disconnect();
        };

    }, [token]);

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
