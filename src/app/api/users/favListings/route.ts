import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { addFavListings, deleteFavListings } from '@/lib/services/userService';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }
    if (!body.data.favListings) {
        throw new Error('No favListings provided');
    }

    const newUser = await addFavListings(user.netId, Array.isArray(body.data.favListings) ? body.data.favListings : [body.data.favListings]);
    return NextResponse.json({ newUser });
  } catch (error) {
    let message = 'Unknown error occurred when adding a favorite listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }
    if (!body.data.favListings) {
        throw new Error('No favListings provided');
    }

    const newUser = await deleteFavListings(user.netId, Array.isArray(body.data.favListings) ? body.data.favListings : [body.data.favListings]);
    return NextResponse.json({ newUser });
  } catch (error) {
    let message = 'Unknown error occurred when adding a favorite listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}