"use client"
import React, {useState} from 'react';
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";

const ReactQueryProvider = ({children} : React.PropsWithChildren) => {
    const [queryClient, setQueryClient] = useState(() => new QueryClient)
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;