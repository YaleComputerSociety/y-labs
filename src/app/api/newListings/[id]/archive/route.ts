import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { archiveListing } from '@/lib/services/newListingsService';
import { IncorrectPermissionsError } from '@/lib/utils/errors';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    const { id } = await params;
    const listing = await archiveListing(id, user.netId);
    return NextResponse.json({ listing });
  } catch (error) {
    let message = 'Unknown error occurred when archiving the listing';

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