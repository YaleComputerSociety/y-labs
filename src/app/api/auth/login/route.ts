import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(): Promise<NextResponse> {
  await connectToDatabase();

  const BASE_URL = process.env.BASE_URL as string;
  if (!BASE_URL) {
    console.error("please define the BASE_URL environment variable");
    return NextResponse.redirect(`${BASE_URL}/login-error`);
  }
  return NextResponse.redirect(`https://secure.its.yale.edu/cas/login?service=${BASE_URL}/api/auth/redirect`);
}