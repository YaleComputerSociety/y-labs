import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(): Promise<NextResponse> {
  await connectToDatabase();

  const BASE_URL = process.env.BASE_URL as string;
  if (!BASE_URL) {
    console.error("please define the BASE_URL environment variable");
    return NextResponse.redirect(`${BASE_URL}/login-error`);
  }
  
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.delete({
    name: 'token',
    secure: true,
    path: '/',
    httpOnly: true,
    sameSite: 'strict'
  });

  return response;
}