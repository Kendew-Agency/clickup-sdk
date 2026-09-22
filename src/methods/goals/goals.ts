import { Base } from "../base";
import type {
  CreateGoalParams,
  CreateGoalResponse,
  CreateKeyResultParams,
  DeleteKeyResultParams,
  EditKeyResultParams,
  GetGoalResponse,
  GetGoalsResponse,
  UpdateGoalParams,
  UpdateGoalResponse,
} from "./types";

export class Goals extends Base {
  /**
   * Get all goals in a workspace
   *
   * @description returns goals in a specific workspace (team)
   * @param team_id as the id of the workspace to fetch goals for
   * @returns A list of goals in the workspace
   * @see https://developer.clickup.com/reference/getgoals
   */
  public async getGoals(team_id: number) {
    return this.request<GetGoalsResponse>(`/team/${team_id}/goal`, {
      method: "GET",
    });
  }

  /**
   * Get a single goal
   *
   * @description returns details of a specific goal including its targets
   * @param goal_id as the id of the goal to fetch
   * @returns Goal details with targets
   * @see https://developer.clickup.com/reference/getgoal
   */
  public async getGoal(goal_id: string) {
    return this.request<GetGoalResponse>(`/goal/${goal_id}`, {
      method: "GET",
    });
  }

  /**
   * Create a new goal in a workspace
   *
   * @description creates a new goal in the specified workspace
   * @param team_id as the id of the workspace to create the goal in
   * @param params goal creation parameters
   * @returns Created goal details
   * @see https://developer.clickup.com/reference/creategoal
   */
  public async createGoal(team_id: number, params: CreateGoalParams) {
    return this.request<CreateGoalResponse>(`/team/${team_id}/goal`, {
      method: "POST",
      body: {
        name: params.name,
        due_date: params.due_date,
        description: params.description,
        multiple_owners: params.multiple_owners,
        owners: params.owners,
        color: params.color,
      },
    });
  }

  /**
   * Update a goal
   *
   * @description updates properties of an existing goal
   * @param goal_id as the id of the goal to update
   * @param params goal update parameters
   * @returns Updated goal details
   * @see https://developer.clickup.com/reference/updategoal
   */
  public async updateGoal(goal_id: string, params: UpdateGoalParams) {
    return this.request<UpdateGoalResponse>(`/goal/${goal_id}`, {
      method: "PUT",
      body: {
        name: params.name,
        due_date: params.due_date,
        description: params.description,
        rem_owners: params.rem_owners,
        add_owners: params.add_owners,
        color: params.color,
      },
    });
  }

  /**
   * Delete a goal
   *
   * @description deletes a goal from the workspace
   * @param goal_id as the id of the goal to delete
   * @see https://developer.clickup.com/reference/deletegoal
   */
  public async deleteKeyResult(params: DeleteKeyResultParams) {
    return this.request<void>(`/key_result/${params.key_result_id}`, {
      method: "DELETE",
    });
  }

  /**
   * Create Key Result
   *
   * @description adds a key result (target) to a goal
   * @param goal_id as the id of the goal
   * @param params key result creation parameters
   * @see https://developer.clickup.com/reference/createkeyresult
   */
  public async createKeyResult(goal_id: string, params: CreateKeyResultParams) {
    return this.request<void>(`/goal/${goal_id}/key_result`, {
      method: "POST",
      body: {
        name: params.name,
        owners: params.owners,
        type: params.type,
        steps_start: params.steps_start,
        steps_end: params.steps_end,
        unit: params.unit,
        task_ids: params.task_ids,
        list_ids: params.list_ids,
      },
    });
  }

  /**
   * Edit Key Result
   *
   * @description updates an existing key result
   * @param key_result_id as the id of the key result
   * @param params key result update parameters
   * @see https://developer.clickup.com/reference/editkeyresult
   */
  public async editKeyResult(
    key_result_id: string,
    params: EditKeyResultParams,
  ) {
    return this.request<void>(`/key_result/${key_result_id}`, {
      method: "PUT",
      body: {
        name: params.name,
        owners: params.owners,
        type: params.type,
        steps_start: params.steps_start,
        steps_end: params.steps_end,
        unit: params.unit,
        task_ids: params.task_ids,
        list_ids: params.list_ids,
        steps_current: params.steps_current,
        note: params.note,
      },
    });
  }
}
