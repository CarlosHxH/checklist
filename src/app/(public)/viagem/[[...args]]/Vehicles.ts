"use server"

import { prisma } from "@/prisma"

export async function getVehicles() {
  try {
    const data = await prisma.vehicle.findMany();
    if (!data) throw new Error('Erro!');
    return data;
  } catch (error) {
    throw error;
  }
}