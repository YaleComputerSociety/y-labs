"use client"

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserContext from '@/context/UserContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  unknownBlocked?: boolean;
  knownBlocked?: boolean;
}

const PrivateRoute = ({ children, unknownBlocked, knownBlocked } : PrivateRouteProps) => {
  const { user, isLoading, isAuthenticated } = useContext(UserContext);
  const router = useRouter();
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    // Don't redirect while checking authentication
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Handle user type-based routing
    if (user) {
      if (unknownBlocked && user.userType === "unknown") {
        router.push('/unknown');
        return;
      }
      if (knownBlocked && user.userType !== "unknown") {
        router.push("/");
        return;
      }
    }

    setAllowRender(true);
  }, [isLoading, isAuthenticated, user, unknownBlocked, knownBlocked, router]);

  if (isLoading || !isAuthenticated || !allowRender) {
    return null;
  }

  // If all checks pass, render the component
  return <>{children}</>;
};

export default PrivateRoute;