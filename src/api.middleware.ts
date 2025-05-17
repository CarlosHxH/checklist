import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decoded } from './webToken';

export async function apiAuthMiddleware(request: NextRequest) {
	// Skip middleware for non-API routes

	if (!request.nextUrl.pathname.startsWith('/api/v1')) {
		return NextResponse.next();
	}
	
	const authHeader = request.headers.get('authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decode = await decoded(token);
		
		if(!decode.user) return NextResponse.json(
			{ error: 'Token inválido ou expirado' },
			{ status: 401 }
		);
		
		// Add user info to request headers for use in API routes
		const headers = new Headers(request.headers);
		headers.set('x-user-id', decode.user?.id || "");
		headers.set('x-user-username', decode.user?.username || "");
		headers.set('x-user-role', decode.user?.role || "");
		


		return NextResponse.next({ request: { headers } });
	} catch (error) {
		console.log({ error });
		return NextResponse.json(
			{ error: 'Token inválido ou expirado' },
			{ status: 401 }
		);
	}
}