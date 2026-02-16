import type { User } from "../../types/clickup.types";

// Goal Owner
type GoalOwner = Pick<User, "id" | "username" | "email" | "color">;

// Target types
type Target = {
  id: string;
  name: string;
  type: "number" | "currency" | "boolean" | "percentage" | "automatic";
  date_created: string;
  start: number | null;
  goal: number;
  current: number;
  unit: string | null;
  currency: string | null;
  owners: GoalOwner[];
  last_action: {
    id: string;
    note: string;
    date: string;
  } | null;
};

// Goal structure
type Goal = {
  id: string;
  name: string;
  team_id: string;
  date_created: string;
  start_date: string | null;
  due_date: string | null;
  description: string;
  private: boolean;
  archived: boolean;
  creator: number;
  color: string;
  pretty_id: string;
  multiple_owners: boolean;
  folder_id: string | null;
  members: GoalOwner[];
  owners: GoalOwner[];
  key_results: Target[];
  percent_completed: number;
  history: {
    id: string;
    type: number;
    date: string;
    user: GoalOwner;
    target: string | null;
    before: string | null;
    after: string | null;
  }[];
  pretty_url: string;
};

// Get goals
export type GetGoalsResponse = {
  goals: Goal[];
  folders: {
    id: string;
    name: string;
    team_id: string;
    date_created: string;
    archived: boolean;
    creator: number;
    color: string;
    private: boolean;
    hidden: boolean;
    members: GoalOwner[];
    goals: Goal[];
  }[];
};

// Get goal
export type GetGoalResponse = {
  goal: Goal;
};

// Create goal
export type CreateGoalParams = {
  name: string;
  due_date?: number;
  description?: string;
  multiple_owners?: boolean;
  owners?: number[];
  color?: string;
};

export type CreateGoalResponse = {
  goal: Goal;
};

// Update goal
export type UpdateGoalParams = {
  name?: string;
  due_date?: number;
  description?: string;
  rem_owners?: number[];
  add_owners?: number[];
  color?: string;
};

export type UpdateGoalResponse = {
  goal: Goal;
};
