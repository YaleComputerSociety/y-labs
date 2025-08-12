import Button from "@mui/material/Button";
import Link from 'next/link';

const AboutButton = () => {
    return(
        <Link href="/about" passHref>
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
                About
            </Button>
        </Link>
    );
};

export default AboutButton;