'use client';
import { prisma } from '@/lib/prisma';
import { useState, useEffect } from 'react';
import { WebSocket } from 'ws';

async function keys(){
	const [users, vehicles, vehicleKeys] = await prisma.$transaction([
		prisma.user.findMany({
			include: {
				vehiclekey: true,
			},
		}),
		prisma.vehicle.findMany(),
		prisma.vehicleKey.findMany({
			include: {
				user: true,
				vehicle: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		}),
	]);
	return [users, vehicles, vehicleKeys]
}

export default function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any>(keys);

  useEffect(() => {
    // Apenas execute no cliente
    if (typeof window === 'undefined') return;

    const ws = new WebSocket('/');

    ws.onopen = () => {
      console.log('Conectado ao WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as any);
        setMessages((prev:any) => [...prev, message]);
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };

    ws.onclose = () => {
      console.log('Desconectado do WebSocket');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close(1000);
    };
  }, []);

  const sendMessage = (message: any[]) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, isConnected, messages, sendMessage };
}