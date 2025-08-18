import { NextResponse } from 'next/server';
import { parseString } from 'xml2js';
import jwt from 'jsonwebtoken';

import { validateUser, createUser } from '@/lib/services/userService';
import { fetchYalie } from '@/lib/services/yaliesService';
import connectToDatabase from '@/lib/utils/mongodb';

export async function GET(request: Request): Promise<NextResponse> {
  await connectToDatabase();

  const BASE_URL = process.env.BASE_URL as string;
  if (!BASE_URL) {
    throw new Error("Please define the BASE_URL environment variable");
  }
  const JWT_SECRET = process.env.JWT_SECRET as string;
  if (!JWT_SECRET) {
    throw new Error("Please define the JWT_SECRET environment variable");
  }
  const YALIES_API_KEY = process.env.YALIES_API_KEY as string;
  if (!YALIES_API_KEY) {
    throw new Error("Please define the YALIES_API_KEY environment variable");
  }

  const { searchParams } = new URL(request.url);
  const ticket = searchParams.get('ticket');

  if (ticket) {
    const ticketQuery = `https://secure.its.yale.edu/cas/serviceValidate?ticket=${ticket}&service=${process.env.BASE_URL}/api/auth/redirect`;
    const response = await fetch(ticketQuery);
    const xml = await response.text();

    const result: any = await new Promise((resolve, reject) => {
      parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    try {
      if (result['cas:serviceResponse']['cas:authenticationFailure']) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
      }
      const success = result['cas:serviceResponse']['cas:authenticationSuccess'];

      if (!success) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
      }

      const netid = success[0]['cas:user'][0];

      let user = await validateUser(netid);
      if (!user) {
        user = await fetchYalie(netid);

        if (!user) {
          user = await createUser({
            netid: netid,
            fname: "NA",
            lname: "NA",
            email: "NA",
          })
        }
      }

      const token = jwt.sign({ netid, userType: user.userType, userConfirmed: user.userConfirmed }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const redirectPath = '/';

      const response = NextResponse.redirect(`${process.env.BASE_URL}${redirectPath}`);
      response.cookies.set('token', token, {
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
      });

      return response;
    } catch (e) {
      return NextResponse.json({ error: 'Authentication failed' + e }, { status: 401 });
    }
  } else {
    return NextResponse.redirect(
      `https://secure.its.yale.edu/cas/login?service=${BASE_URL}/api/auth/redirect`,
    )
  }
}