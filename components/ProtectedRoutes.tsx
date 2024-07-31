'use client';
import useAuthContext from '@/providers/AuthProvider';
import { Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';

const ProtectedRoute = <P extends object>(WrappedComponent: ComponentType<P>): React.FC<P> => {
    return function WithAuth(props: P) {
        const router = useRouter();
        const { isAuthenticated } = useAuthContext();

        useEffect(() => {
            if (isAuthenticated === false) {
                router.push('/');
            }
        }, [isAuthenticated, router]);

        if (isAuthenticated === null || isAuthenticated === false) {
            return <></>;
        } else if (isAuthenticated === true) {
            return <WrappedComponent {...props} />;
        }
    };
};

export default ProtectedRoute;
