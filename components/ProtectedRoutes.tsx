import React, { useEffect, ComponentType } from "react";
import useAuthContext from "@/providers/AuthProvider";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const ProtectedRoute = <P extends object>(
  WrappedComponent: ComponentType<P>,
): React.FC<P> => {
  return function WithAuth(props: P) {
    const router = useRouter();
    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
      if (isAuthenticated === false) {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    if (isAuthenticated === null) {
      <Text>Loading</Text>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
