import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

interface DecodedToken {
  netid: string;
  userType: string;
  userConfirmed: boolean;
  iat: number;
  exp: number;
}

function isValidDecodedToken(decoded: any): decoded is DecodedToken {
  return (
    typeof decoded === 'object' &&
    typeof decoded.netid === 'string' &&
    typeof decoded.userType === 'string' &&
    typeof decoded.userConfirmed === 'boolean' &&
    typeof decoded.iat === 'number' &&
    typeof decoded.exp === 'number'
  );
}

export const isAuthenticated = async (req: NextRequest) => {
  let user = {
    netId: '',
    userType: '',
    userConfirmed: false,
  };

  try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token');
  
      if(!token?.value) {
        return { authResult: false, user };
      }
  
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return { authResult: false, user };
      }
  
      const decoded = jwt.verify(token.value, JWT_SECRET);
  
      if (!isValidDecodedToken(decoded)) {
        return { authResult: false, user };
      }

      user = {
        netId: decoded.netid,
        userType: decoded.userType,
        userConfirmed: decoded.userConfirmed,
      };
  } catch (error) {
    console.error('Token validation failed');
  }

  return { authResult: true, user };
}