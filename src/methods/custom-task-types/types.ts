type CustomTaskType = {
  id: number;
  name: string;
  name_plural: string | null;
  description: string | null;
  avatar: {
    source: string | null;
    value: string | null;
  };
};

export type GetCustomTaskTypesResponse = {
  custom_items: CustomTaskType[];
};
