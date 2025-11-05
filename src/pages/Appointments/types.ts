import { type AppointmentProjection } from '@/types';

export interface Resource {
  resourceId: number;
  resourceName: string;
  imageUrl?: string;
}

export interface CalendarViewProps {
  appointments: AppointmentProjection[];
  resources: Resource[];
  onAppointmentAction: (appointment: AppointmentProjection) => Promise<void>;
}

export interface HeaderControlsProps {
  currentDate: Date;
  selectedBranch: number | null;
  branches: Array<{ branchId: number | null; branchName: string }>;
  onDateChange: (date: Date) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onBranchChange: (branchId: number) => void;
}

export interface ResourceHeaderProps {
  resources: Resource[];
}

export const CALENDAR_CONFIG = {
  PIXELS_PER_MINUTE: 2,
  START_HOUR: 8,
  END_HOUR: 22,
  COLORS: [
    "#5ea2ebff", "#5bbe72ff", "#e4606dff", "#17a2b8",
    "#ecc54fff", "#6f42c1", "#cc6a32ff", "#f1ad4cff",
    "#FFB3C1", "#76bbadff"
  ]
} as const;