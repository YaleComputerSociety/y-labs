/*
import { NextResponse, NextRequest } from 'next/server';
import { confirmUser } from '@/lib/services/userService';
import { IncorrectPermissionsError } from '@/lib/utils/errors';
import connectToDatabase from '@/lib/utils/mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const user = await confirmUser(id);
    return NextResponse.json({ user });
  } catch (error) {
    let message = 'Unknown error occurred when confirming user';

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
*/