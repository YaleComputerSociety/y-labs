import Button from "@mui/material/Button";
import Link from 'next/link';

const AccountButton = () => {
    return(
        <Button 
            color="inherit"
            component={Link}
            href="/account"
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
    );
};

export default AccountButton;