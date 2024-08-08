import { CreateProjectFormValues } from '@/app/Dashboard/Create/createProjectFormSchema';
import { BASE_URL } from '@/utils/globals';

const createProjectRequest = async (
    data: CreateProjectFormValues,
    getToken: () => Promise<string>,
) => {
    const res = await fetch(`${BASE_URL}/api/Project`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + (await getToken()),
        },
        body: JSON.stringify(data),
    });

    return res.json();
};

export default createProjectRequest;
