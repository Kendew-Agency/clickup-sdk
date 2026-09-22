import { Base } from "../base";
import type {
  AddDependencyParams,
  AddTaskLinkParams,
  CreateTaskFromTemplateParams,
  CreateTaskFromTemplateResponse,
  CreateTaskParams,
  CreateTaskResponse,
  DeleteDependencyParams,
  DeleteTaskLinkParams,
  GetBulkTasksTimeInStatusParams,
  GetBulkTasksTimeInStatusResponse,
  GetFilteredTeamTasksParams,
  GetFilteredTeamTasksResponse,
  GetTaskParams,
  GetTaskResponse,
  GetTasksParams,
  GetTasksResponse,
  GetTaskTimeInStatusParams,
  GetTaskTimeInStatusResponse,
  MergeTasksParams,
  UpdateTaskParams,
  UpdateTaskResponse,
} from "./types";

export class Tasks extends Base {
  /**
   * Get all tasks in a list
   *
   * @description returns tasks in a specific list (limited to 100 per page)
   * @param list_id as the id of the list to fetch tasks for
   * @param params optional parameters for filtering and pagination
   * @returns A list of tasks in the list
   * @see https://developer.clickup.com/reference/gettasks
   */
  public async getTasks(list_id: string, params?: GetTasksParams) {
    return this.request<GetTasksResponse>(`/list/${list_id}/task`, {
      method: "GET",
      query: {
        archived: params?.archived,
        include_markdown_description: 
          params?.include_markdown_description,
        page: params?.page,
        order_by: params?.order_by,
        reverse: params?.reverse,
        subtasks: params?.subtasks,
        statuses: params?.statuses,
        include_closed: params?.include_closed,
        include_timl: params?.include_timl,
        assignees: params?.assignees,
        tags: params?.tags,
        due_date_gt: params?.due_date_gt,
        due_date_lt: params?.due_date_lt,
        date_created_gt: params?.date_created_gt,
        date_created_lt: params?.date_created_lt,
        date_updated_gt: params?.date_updated_gt,
        date_updated_lt: params?.date_updated_lt,
        date_done_gt: params
?.date_done_gt,
        date_done_lt: params?.date_done_lt,
        custom_fields: params?.custom_fields,
        custom_field: params?.custom_field,
        custom_items: params?.custom_items,
      },
    });
  }

  /**
   * Get a single task
   *
   * @description returns details of a specific task
   * @param task_id as the id of the task to fetch
   * @param params optional parameters for custom task IDs
   * @returns Task details
   * @see https://developer.clickup.com/reference/gettask
   */
  public async getTask(task_id: string, params?: GetTaskParams) {
    return this.request<GetTaskResponse>(`/task/${task_id}`, {
      method: "GET",
      query: {
        custom_task_ids: params?.custom_task_ids,
        team_id: params?.team_id,
        include_subtasks: params?.include_subtasks,
        include_markdown_description: params?.include_markdown_description,
      custom_fields: params?.custom_fields,
      },
    });
  }

  /**
   * Create a new task in a list
   *
   * @description creates a new task in the specified list
   * @param list_id as the id of the list to create the task in
   * @param params task creation parameters
   * @returns Created task details
   * @see https://developer.clickup.com/reference/createtask
   */
  public async createTask(list_id: string, params: CreateTaskParams) {
    return this.request<CreateTaskResponse>(`/list/${list_id}/task`, {
      method: "POST",
      body: params,
    });
  }

  /**
   * Update a task
   *
   * @description updates properties of an existing task
   * @param task_id as the id of the task to update
   * @param params task update parameters
   * @returns Updated task details
   * @see https://developer.clickup.com/reference/updatetask
   */
  public async updateTask(task_id: string, params: UpdateTaskParams) {
    return this.request<UpdateTaskResponse>(`/task/${task_id}`, {
      method: "PUT",
      body: {
        custom_item_id: params.custom_item_id,
        name: params.name,
        description: params.description,
        markdown_content: params.markdown_content,
        status: params.status,
        priority: params.priority,
        due_date: params.due_date,
        due_date_time: params.due_date_time,
        parent: params.parent,
        time_estimate: params.time_estimate,
        start_date: params.start_date,
        start_date_time: params.start_date_time,
        points: params.points,
        assignees: params.assignees,
        group_assignees: params.group_assignees,
        watchers: params.watchers,
        archived: params.archived,
      },
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    });
  }

  /**
   * Delete a task
   *
   * @description deletes a task from the workspace
   * @param task_id as the id of the task to delete
   * @param params optional parameters for custom task IDs
   * @see https://developer.clickup.com/reference/deletetask
   */
  public async deleteTask(task_id: string, params?: GetTaskParams) {
    return this.request<void>(`/task/${task_id}`, {
      method: "DELETE",
      query: {
        custom_task_ids: params?.custom_task_ids,
        team_id: params?.team_id,
      },
    });
  }

/**
 * Get Filtered Team Tasks
 * @description returns tasks filtered by various criteria within a team
 * @param team_id as the id of the team to filter tasks for
 * @param params filtering parameters
 * @returns Filtered tasks
 * @see https://developer.clickup.com/reference/getfilteredteammtasks
 */
  public async getFilteredTeamTasks(team_id: string, params?: GetFilteredTeamTasksParams
) {
  return this.request<GetFilteredTeamTasksResponse>(`/team/${team_id}/task`, {
    method: "GET",
    query: {
 page: params?.page,
  order_by: params?.order_by,
  reverse: params?.reverse,
  subtasks: params?.subtasks,
  space_ids: params?.space_ids,
  project_ids: params?.project_ids,
  list_ids: params?.list_ids,
  statuses: params?.statuses,
  include_closed: params?.include_closed,
  assignees: params?.assignees,
  tags: params?.tags,
  due_date_gt: params?.due_date_gt,
  due_date_lt: params?.due_date_lt,
  date_created_gt: params?.date_created_gt,
  date_created_lt: params?.date_created_lt,
  date_updated_gt: params?.date_updated_gt,
  date_updated_lt: params?.date_updated_lt,
  date_done_gt: params?.date_done_gt,
  date_done_lt: params?.date_done_lt,
  custom_fields: params?.custom_fields,
  parent: params?.parent,
  include_markdown_description: params?.include_markdown_description,
  custom_items: params?.custom_items,
    },
  });
}

/**
 * Merge Tasks
 *
 * @description merges one or more source tasks into a target task
 * @param task_id as the id of the target task
 * @param params source task ids to merge into the target task
 * @returns Nothing when the tasks are merged successfully
 * @see https://developer.clickup.com/reference/mergetasks
 */
public async mergeTasks(
  task_id: string,
  params: MergeTasksParams
) {
  return this.request<void>(
    `/task/${task_id}/merge`,
    {
      method: "POST",
      body: {
        source_task_ids: params.source_task_ids,
      },
    }
  );
}

/**
 * Get Task's Time in Status
 *
 * @description returns how long a task has spent in each status
 * @param task_id as the id of the task
 * @param params optional parameters for custom task IDs
 * @returns Time spent in the current and previous statuses
 * @see https://developer.clickup.com/reference/gettaskstimeinstatus
 */
public async getTaskTimeInStatus(
  task_id: string,
  params?: GetTaskTimeInStatusParams
) {
  return this.request<GetTaskTimeInStatusResponse>(
    `/task/${task_id}/time_in_status`,
    {
      method: "GET",
      query: {
        custom_task_ids: params?.custom_task_ids,
        team_id: params?.team_id,
      },
    }
  );
}
/**
 * Get Bulk Tasks' Time in Status
 *
 * @description returns how long multiple tasks have spent in each status
 * @param params task ids and optional custom task id parameters
 * @returns Time in status information keyed by task id
 * @see https://developer.clickup.com/reference/getbulktaskstimeinstatus
 */
public async getBulkTasksTimeInStatus(
  params: GetBulkTasksTimeInStatusParams
) {
  return this.request<GetBulkTasksTimeInStatusResponse>(
    "/task/bulk_time_in_status/task_ids",
    {
      method: "GET",
      query: {
        task_ids: params.task_ids,
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    }
  );
}

/**
 * Create Task From Template
 *
 * @description creates a new task from an existing task template
 * @param list_id as the id of the list to create the task in
 * @param template_id as the id of the task template
 * @param params task creation parameters
 * @returns Created task template response
 * @see https://developer.clickup.com/reference/createtaskfromtemplate
 */
public async createTaskFromTemplate(
  list_id: string,
  template_id: string,
  params: CreateTaskFromTemplateParams
) {
  return this.request<CreateTaskFromTemplateResponse>(
    `/list/${list_id}/taskTemplate/${template_id}`,
    {
      method: "POST",
      body: {
        name: params.name,
      },
    }
  );
}


  /**
   * Add a dependency between tasks
   *
   * @description sets a task as waiting on or blocking another task
   * @param task_id as the id of the task to add dependency to
   * @param params dependency parameters (depends_on or dependency_of)
   * @see https://developer.clickup.com/reference/adddependency
   */
  public async addDependency(task_id: string, params: AddDependencyParams) {
    return this.request<void>(`/task/${task_id}/dependency`, {
      method: "POST",
      body: {
        depends_on: params.depends_on,
        dependency_of: params.dependency_of,
      },
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    });
  }

  /**
   * Delete a dependency between tasks
   *
   * @description removes the dependency relationship between two tasks
   * @param task_id as the id of the task to remove dependency from
   * @param params dependency parameters (depends_on or dependency_of)
   * @see https://developer.clickup.com/reference/deletedependency
   */
  public async deleteDependency(
    task_id: string,
    params: DeleteDependencyParams,
  ) {
    return this.request<void>(`/task/${task_id}/dependency`, {
      method: "DELETE",
      query: {
        depends_on: params.depends_on,
        dependency_of: params.dependency_of,
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    });
  }

  /**
   * Add a link between two tasks
   *
   * @description links two tasks together (task links feature)
   * @param task_id as the id of the task to add link to
   * @param params link parameters with the task to link to
   * @see https://developer.clickup.com/reference/addtasklink
   */
  public async addTaskLink(task_id: string, params: AddTaskLinkParams) {
    return this.request<void>(`/task/${task_id}/link/${params.links_to}`, {
      method: "POST",
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    });
  }

  /**
   * Delete a link between two tasks
   *
   * @description removes the link between two tasks
   * @param task_id as the id of the task to remove link from
   * @param params link parameters with the task to unlink
   * @see https://developer.clickup.com/reference/deletetasklink
   */
  public async deleteTaskLink(task_id: string, params: DeleteTaskLinkParams) {
    return this.request<void>(`/task/${task_id}/link/${params.links_to}`, {
      method: "DELETE",
      query: {
        custom_task_ids: params.custom_task_ids,
        team_id: params.team_id,
      },
    });
  }
}
