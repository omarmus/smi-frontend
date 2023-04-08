export interface Department {
  id: number
  name: string
  type: string
  group: string
  total?: number
}

export interface DepartmentOption {
  value: number;
  label: string;
  church: string;
  type: string;
  group?: string;
}
