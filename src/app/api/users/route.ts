import { NextResponse, NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { updateUser, confirmUser, unconfirmUser } from '@/lib/services/userService';
import connectToDatabase from '@/lib/utils/mongodb';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const JWT_SECRET = process.env.JWT_SECRET as string;
    if (!JWT_SECRET) {
      throw new Error("Please define the JWT_SECRET environment variable");
    }

    const body = await req.json();
    const { authResult, user } = await isAuthenticated(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });
    }

    if(body.data.userConfirmed !== undefined) {
        if(body.data.userConfirmed) {
            await confirmUser(user.netId);
        } else {
            await unconfirmUser(user.netId);
        }
    }

    const newUser = await updateUser(user.netId, body.data);
    const response =  NextResponse.json({ newUser });

    if (body.force_sign) {
      const token = jwt.sign({ netid: user.netId, userType: newUser.userType, userConfirmed: newUser.userConfirmed }, JWT_SECRET, {
        expiresIn: '7d',
      });

      response.cookies.set('token', token, {
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      });

      console.log('Forcing sign');
    }
    
    return response;
  } catch (error) {
    let message = 'Unknown error occurred when updating the user';

    if (error instanceof Error) {
      message = error.message;
    }

    console.error(message);

    return NextResponse.json({ error: message }, { status: 400 });
  }
}