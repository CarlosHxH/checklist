import { jwtVerify, SignJWT } from 'jose';

export interface CustomJWT {
	user?: {
		id: string;
		username: string;
		name?: string;
		role?: string;
		email?: string;
	};
	customClaims?: {
		permissions?: string[];
		metadata?: Record<string, any>;
	};
	iat?: number;
	exp?: number;
}

export const env = {
	get AUTH_SECRET() {
		if (!process.env.AUTH_SECRET) {
			throw new Error('AUTH_SECRET environment variable is not set');
		}
		return process.env.AUTH_SECRET;
	},
};

// Convert string secret to Uint8Array for jose
const getSecretKey = () => {
	return new TextEncoder().encode(env.AUTH_SECRET);
};

// Decode and verify JWT token
export async function decoded(token: string): Promise<CustomJWT> {
	try {
		const { payload } = await jwtVerify(token, getSecretKey());
		return payload as CustomJWT;
	} catch (error) {
		throw new Error('Invalid token');
	}
}

// Create and sign new JWT token
export async function encoded(payload: CustomJWT): Promise<string> {
	return await new SignJWT(payload as any)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('1d')
		.sign(getSecretKey());
}