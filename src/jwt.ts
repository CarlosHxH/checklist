import jwt from 'jsonwebtoken';

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

export const decoded = (token: string) => jwt.verify(token, env.AUTH_SECRET) as CustomJWT;
export const encoded = async (payload: CustomJWT) => await jwt.sign(payload, env.AUTH_SECRET, { expiresIn: '30d' });

export async function GenerateAPIToken(user: any) {
	// Generate API token
	const apiToken = jwt.sign(
		{
			userId: user.id,
			email: user.email,
			role: user.role,
		},
		env.AUTH_SECRET,
		{ expiresIn: '30d' }
	);
	/*
		await mockPrisma.verificationToken.upsert({
			where: { identifier: user.email },
			update: {
				token: apiToken,
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			},
			create: {
				identifier: user.email,
				token: apiToken,
				expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			},
		});*/

	return apiToken;
}