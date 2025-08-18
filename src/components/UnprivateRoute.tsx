import { useContext } from 'react';
import UserContext from '@/context/UserContext';
import { useRouter } from 'next/navigation';

interface UnprivateRouteProps {
  children: React.ReactNode;
}

const UnprivateRoute = ({ children } : UnprivateRouteProps) => {
 
  const { user } = useContext(UserContext);
  const router = useRouter();

  if (user) {
    router.push('/');
  }

  return user ? <></> : <>{children}</>;
};

export default UnprivateRoute;