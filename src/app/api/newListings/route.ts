import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readUser } from '@/lib/services/userService';
import { createListing } from '@/lib/services/newListingsService';
import connectToDatabase from '@/lib/utils/mongodb';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }
    if (!(user.userType === 'admin' || user.userType === 'professor' || user.userType === 'faculty')) {
        throw new Error('User does not have permission to create listings');
    }

    const newUser = await readUser(user.netId);
    const listing = await createListing(body.data, newUser);
    return NextResponse.json({ listing });
  } catch (error) {
    let message = 'Unknown error occurred when creating a new listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}