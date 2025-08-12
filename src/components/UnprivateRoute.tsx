import { useContext } from 'react';
import UserContext from '@/context/UserContext';
import { useRouter } from 'next/navigation';

interface UnprivateRouteProps {
  Component: React.FunctionComponent;
}

const UnprivateRoute = ({ Component } : UnprivateRouteProps) => {
 
  const { user } = useContext(UserContext);
  const router = useRouter();

  if (user) {
    router.push('/');
  }

  return user ? <></> : <Component />;
};

export default UnprivateRoute;