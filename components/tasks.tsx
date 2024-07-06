import React from "react";
import {TaskListTask} from "@/app/Dashboard/[projectId]/page";


export const Task = ({task: {Title, Date, SVG, AssignedTo}}  : {task : TaskListTask}) => {
    return (
        <div>
            <p>{Title}</p>
            <p>{Date.toLocaleDateString()}</p>
            <p>{SVG}</p>
            <p>{AssignedTo.map(assignee => assignee.Initials)}</p>
        </div>
    );
}