import React, { ReactNode, useState } from 'react';
import useHubConnection from '@/hooks/signalR/useSignalR';
import {
    Input,
    StackDivider,
    VStack,
    Spinner,
    Alert,
    AlertIcon,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { HubUrls } from '@/utils/globals';
import debounce from 'lodash/debounce';
import { PhoneIcon, SearchIcon } from '@chakra-ui/icons';

type InputSearchProps<T> = {
    url: HubUrls;
    hubMethod: string;
    render: (results: T[]) => ReactNode;
    ms?: number;
    placeholder?: string;
};

const InputSearch = <T,>({
    url,
    hubMethod,
    render,
    ms = 300,
    placeholder,
}: InputSearchProps<T>) => {
    const [searchResults, setSearchResults] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { invokeMethod } = useHubConnection(url);

    const search = debounce(async (searchTerm: string) => {
        if (searchTerm === '') {
            setSearchResults([]);
            return;
        }
        if (searchTerm.length < 3) return;
        setLoading(true);
        setError(null);
        try {
            const result: T[] = await invokeMethod(hubMethod, [searchTerm]);
            console.log('search result', result);
            setSearchResults(result);
        } catch (error) {
            setError('Search message failed');
            console.error('Search message failed', error);
        } finally {
            setLoading(false);
        }
    }, ms);

    return (
        <VStack gap={2}>
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon width={'50%'} height={'auto'} />
                </InputLeftElement>
                <Input
                    type="text"
                    onChange={(e) => search(e.target.value)}
                    placeholder={placeholder}
                />
            </InputGroup>
            <StackDivider borderColor="gray.200" />
            {loading && <Spinner />}
            {error && (
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <React.Fragment>{render(searchResults)}</React.Fragment>
        </VStack>
    );
};

export default InputSearch;
