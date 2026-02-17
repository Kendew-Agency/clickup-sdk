import { Base } from "../base";
import type {
  CreateGoalParams,
  CreateGoalResponse,
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
  public async deleteGoal(goal_id: string) {
    return this.request<void>(`/goal/${goal_id}`, {
      method: "DELETE",
    });
  }
}
