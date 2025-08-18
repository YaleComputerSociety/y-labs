import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readUser } from '@/lib/services/userService';

export async function GET(req: NextRequest) {
  try {
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const newUser = await readUser(user.netId)
    return NextResponse.json({ favListingsIds: newUser.favListings });
  } catch (error) {
    let message = 'Unknown error occurred when retrieving favorite listings ids';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}