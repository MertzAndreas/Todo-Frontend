import { Project } from '@/app/Dashboard/[projectId]/page';

export const handleTransferTodo = (
    todoId: number,
    taskListId: number,
    setProject: React.Dispatch<React.SetStateAction<Project | null>>,
) => {
    setProject((prevProject) => {
        if (!prevProject) return null;

        const currentList = prevProject.taskLists.find((list) =>
            list.tasks.some((task) => task.taskId === todoId),
        );

        const targetList = prevProject.taskLists.find((list) => list.taskListId === taskListId);
        if (!currentList || !targetList) throw new Error('BIG ERROR');

        const taskToTransfer = currentList.tasks.find((task) => task.taskId === todoId);
        const updatedCurrentList = {
            ...currentList,
            tasks: currentList.tasks.filter((task) => task.taskId !== todoId),
        };

        const updatedTargetList = {
            ...targetList,
            tasks: [...targetList.tasks, taskToTransfer],
        };

        return {
            ...prevProject,
            taskLists: prevProject.taskLists.map((list) => {
                if (list.taskListId === currentList.taskListId) {
                    return updatedCurrentList;
                }
                if (list.taskListId === targetList.taskListId) {
                    return updatedTargetList;
                }
                return list;
            }),
        };
    });
};
