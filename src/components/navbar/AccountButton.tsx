import Button from "@mui/material/Button";
import Link from 'next/link';

const AccountButton = () => {
    return(
        <Link href="/account" passHref>
            <Button 
                color="inherit"
                component="a"
                sx={{
                    textTransform: 'none',
                    color: '#000000',
                    fontFamily: 'Inter',
                    fontWeight: 450,
                    fontSize: '14px'
                }}
                disableRipple
            >
                My Labs
            </Button>
        </Link>
    );
};

export default AccountButton;