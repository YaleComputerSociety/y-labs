import Button from "@mui/material/Button";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const HomeButton = () => {
    const pathname = usePathname();

    const handleClick = (event: React.MouseEvent) => {
        if (pathname === '/') {
            event.preventDefault();
            window.location.reload();
        }
    };

    return(
        <Link href="/" passHref>
            <Button
                component="a"
                onClick={handleClick}
                disableRipple={true}
            >
                <img src="/assets/logos/paperclip.png" alt="ylabs-logo" className="mr-2" style={{width: '31.65px', height: '27px'}} />
                <img src="/assets/logos/ylabs-blue.png" alt="ylabs-logo" style={{width: '65.17px', height: '27px'}} />
            </Button>
        </Link>
    );
};

export default HomeButton;