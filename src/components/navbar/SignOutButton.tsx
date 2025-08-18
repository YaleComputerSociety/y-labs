import Button from "@mui/material/Button";
import { useContext } from "react";

import axios from "@/utils/axios";
import UserContext from "@/context/UserContext";

import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const { checkContext } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = async () => {
    // Save the current path to localStorage
    const currentPath = window.location.pathname;
    
    // Skip saving login page
    if (currentPath !== '/login') {
      // Save the full URL including origin, as that's what the redirect param expects
      const returnUrl = window.location.origin + currentPath;
      localStorage.setItem('logoutReturnPath', returnUrl);
    }

    axios.get('/auth/logout').then(() => {
      checkContext();
      router.push('/login')
    });
  };

  return (
    <Button
      color="inherit"
      sx={{
        textTransform: 'none',
        color: '#3874CB',
        fontFamily: 'Inter',
        fontWeight: 450,
        fontSize: '14px',
        textDecoration: 'underline'
      }}
      onClick={handleLogout}
      disableRipple={true}
    >
      Logout
    </Button>
  );
};

export default SignOutButton;
