"use client"

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import UserContext from '@/context/UserContext';

interface PrivateRouteProps {
  Component: React.FunctionComponent;
  unknownBlocked?: boolean;
  knownBlocked?: boolean;
}

const PrivateRoute = ({ Component, unknownBlocked, knownBlocked } : PrivateRouteProps) => {
  const { user, isLoading, isAuthenticated } = useContext(UserContext);
  const router = useRouter();

  // Don't redirect while checking authentication
  if (isLoading) {
    return null;
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

  // If all checks pass, render the component
  return <Component />;
};

export default PrivateRoute;