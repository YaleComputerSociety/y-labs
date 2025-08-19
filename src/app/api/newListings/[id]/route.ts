import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { readListing, updateListing, deleteListing } from '@/lib/services/newListingsService';
import { IncorrectPermissionsError } from '@/lib/utils/errors';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const { id } = await params;
    const listing = await readListing(id);
    return NextResponse.json({ listing });
  } catch (error) {
    let message = 'Unknown error occurred when reading the listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const { id } = await params;
    const listing = await updateListing(id, user.netId, body.data);
    return NextResponse.json({ listing });
  } catch (error) {
    let message = 'Unknown error occurred when updating the listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    if (error instanceof IncorrectPermissionsError) {
      return NextResponse.json({ error: message, incorrectPermissions: true }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const { id } = await params;
    const currentListing = await readListing(id);
    if (user.netId !== currentListing.ownerId) {
      throw new IncorrectPermissionsError(`User with id ${user.netId} does not have permission to delete listing with id ${id}`);
    }

    const deletedListing = await deleteListing(id);
    return NextResponse.json({ deletedListing });
  } catch (error) {
    let message = 'Unknown error occurred when deleting the listing';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    if (error instanceof IncorrectPermissionsError) {
      return NextResponse.json({ error: message, incorrectPermissions: true }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 400 });
  }
}