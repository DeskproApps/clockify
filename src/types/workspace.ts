export interface IWorkspace {
  id: string;
  name: string;
  hourlyRate: Rate;
  costRate: Rate;
  memberships: Membership[];
  workspaceSettings: WorkspaceSettings;
  imageUrl: string;
  featureSubscriptionType: string;
}

export interface Rate {
  amount: number;
  currency: string;
}

export interface Membership {
  userId: string;
  hourlyRate: null;
  costRate: null;
  targetId: string;
  membershipType: string;
  membershipStatus: string;
}

export interface WorkspaceSettings {
  timeRoundingInReports: boolean;
  onlyAdminsSeeBillableRates: boolean;
  onlyAdminsCreateProject: boolean;
  onlyAdminsSeeDashboard: boolean;
  defaultBillableProjects: boolean;
  lockTimeEntries: null;
  lockTimeZone: null;
  round: Round;
  projectFavorites: boolean;
  canSeeTimeSheet: boolean;
  canSeeTracker: boolean;
  projectPickerSpecialFilter: boolean;
  forceProjects: boolean;
  forceTasks: boolean;
  forceTags: boolean;
  forceDescription: boolean;
  onlyAdminsSeeAllTimeEntries: boolean;
  onlyAdminsSeePublicProjectsEntries: boolean;
  trackTimeDownToSecond: boolean;
  projectGroupingLabel: string;
  automaticLock: null;
  onlyAdminsCreateTag: boolean;
  onlyAdminsCreateTask: boolean;
  timeTrackingMode: string;
  multiFactorEnabled: boolean;
  isProjectPublicByDefault: boolean;
}

export interface Round {
  round: string;
  minutes: string;
}
