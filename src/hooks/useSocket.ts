import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState<Boolean>(false);
	const [messages, setMessages] = useState<any[]>([]);

	useEffect(() => {
		const socketIo = io();
		socketIo.on('connect', () => { setIsConnected(true) });
		socketIo.on('disconnect', () => { setIsConnected(false) });
		socketIo.on('res', (data) => { setMessages((prev) => [...prev, data]) });
		setSocket(socketIo);
		return () => { socketIo.disconnect() };
	}, []);

	const sendMessage = (data: any) => {
		if (socket) {
			socket.emit('req', data)
		}
	};
	return { isConnected, messages, sendMessage };
};
