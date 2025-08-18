import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSkeletonListing } from '@/lib/services/newListingsService';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }
    const listing = await getSkeletonListing(user.netId);
    return NextResponse.json({ listing });
  } catch (error) {
    let message = 'Unknown error occurred when retrieving the skeleton listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}