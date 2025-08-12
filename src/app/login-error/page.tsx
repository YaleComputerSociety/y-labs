"use client";

import swal from "sweetalert";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

import UnprivateRoute from "@/components/UnprivateRoute";

const LoginError: React.FunctionComponent = () => {
    const [showError, setShowError] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowError(true);
        }, 500);
    });

    useEffect(() => {
        if(showError) {
            swal({
                text: "We were unable to process your login. Please try again or contact support if the issue persists.",
                icon: "warning",
            }).then(() => {
                router.push('/login');
            });
        }
    }, [showError]);
    
    return null;
}

export default function LoginErrorPage() {
    return <UnprivateRoute Component={LoginError} />;
}