import Button from "@mui/material/Button";
import Link from 'next/link';

const AboutButton = () => {
    return(
        <Button 
            color="inherit"
            component={Link}
            href="/about"
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
    );
};

export default AboutButton;