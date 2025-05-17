import { prisma } from '@/lib/prisma';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Start transaction
async function reject(id: string) {
	await prisma.$transaction(async (tx) => {
		// Get current transfer
		const currentTransfer = await tx.vehicleKey.findUnique({where: { id }})
		if (!currentTransfer) throw new Error('Transferência não encontrada ');
		if (currentTransfer.status !== 'PENDING') throw new Error('Transferência não está pendente');
		return await tx.vehicleKey.delete({ where: { id } })
	})
}

async function confirm(id: string) {
	return prisma.$transaction(async (tx) => {
		// 1. Decrement amount from the sender.
		const currentTransfer = await tx.vehicleKey.findUnique({
			where: { id }
		});

		if (!currentTransfer) throw new Error("Transferência não encontrada");
		if (currentTransfer.status !== "PENDING")
			throw new Error("Transferência não está pendente");

		const user = await prisma.user.findFirst({
			where: { id: currentTransfer.userId },
		});

		if (user?.role === "DRIVER") {
			const inspection = await prisma.inspection.create({
				data: {
					userId: currentTransfer.userId,
					vehicleId: currentTransfer.vehicleId,
					status: "INICIO",
				}
			});

			if (!inspection) throw new Error("Erro na transferencia");
			const group = await prisma.inspect.create({
				data: {
					userId: currentTransfer.userId,
					vehicleId: currentTransfer.vehicleId,
					startId: inspection.id,
				},
			});
			return group;
		}

		// Update current transfer
		const updated = await tx.vehicleKey.update({
			where: { id },
			data: {
				status: "CONFIRMED",
				updatedAt: new Date(),
			},
			include: {
				user: true,
				vehicle: true,
			},
		});
		return updated;
	});
}

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

	const sendMessage = (data: any, p0?: never[]) => {
		if (socket) { socket.emit('req', data) }
	};
	return { isConnected, messages, sendMessage };
};
