import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updateUser } from '@/lib/services/userService';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const newUser = await updateUser(user.netId, body.data);
    return NextResponse.json({ newUser });
  } catch (error) {
    let message = 'Unknown error occurred when updating the user';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}