'use client';
import useAuthContext from '@/providers/AuthProvider';
import { ComponentType, useEffect } from 'react';

const ProtectedComponent = <P extends object>(Component: ComponentType<P>): React.FC<P> => {
    return function WithAuth(props: P) {
        const { isAuthenticated } = useAuthContext();

        useEffect(() => {}, [isAuthenticated]);

        if (isAuthenticated === null || isAuthenticated === false) {
            return <></>;
        } else if (isAuthenticated === true) {
            return <Component {...props} />;
        }
    };
};

export default ProtectedComponent;
