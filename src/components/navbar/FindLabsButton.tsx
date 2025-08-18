import Button from "@mui/material/Button";
import Link from 'next/link';

const FindLabsButton = () => {
    return(
        <Button 
            color="inherit"
            component={Link}
            href='/'
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
    );
};

export default FindLabsButton;