import { Base } from "../base";
import type {
  AddDependencyParams,
  AddTaskLinkParams,
  CreateTaskParams,
  CreateTaskResponse,
  DeleteDependencyParams,
  DeleteTaskLinkParams,
  GetTaskParams,
  GetTaskResponse,
  GetTasksParams,
  GetTasksResponse,
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
        page: params?.page,
        order_by: params?.order_by,
        reverse: params?.reverse,
        subtasks: params?.subtasks,
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
        custom_fields: params?.custom_fields,
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
        name: params.name,
        description: params.description,
        status: params.status,
        priority: params.priority,
        due_date: params.due_date,
        due_date_time: params.due_date_time,
        parent: params.parent,
        time_estimate: params.time_estimate,
        start_date: params.start_date,
        start_date_time: params.start_date_time,
        assignees: params.assignees,
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
