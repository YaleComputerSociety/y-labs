import Button from "@mui/material/Button";
import Link from 'next/link';

const FindLabsButton = () => {
    return(
        <Link href="/" passHref>
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
                Find Labs
            </Button>
        </Link>
    );
};

export default FindLabsButton;