import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readUser, updateUser } from '@/lib/services/userService';
import { readListings } from '@/lib/services/newListingsService';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const newUser = await readUser(user.netId);
    const ownListings = await readListings(newUser.ownListings);
    const favListings = await readListings(newUser.favListings);

    let ownIds: mongoose.Types.ObjectId[] = [];
    for (const listing of ownListings) {
        ownIds.push(listing._id);
    }

    let favIds: mongoose.Types.ObjectId[] = [];
    for (const listing of favListings) {
        favIds.push(listing._id);
    }

    await updateUser(user.netId, { ownListings: ownIds, favListings: favIds });

    return NextResponse.json({ ownListings: ownListings, favListings: favListings });
  } catch (error) {
    let message = 'Unknown error occurred when retrieving the user listings';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}