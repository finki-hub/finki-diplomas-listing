import type { Diploma, MentorSummary } from '@/types';

export type FilteredMentorSummary = MentorSummary & {
  filteredDiplomas: Diploma[];
};

export type InitialMentorsPageState = {
  expandedMentor: null | string;
  search: string;
  sortDirection: SortDirection;
  sortField: SortField;
  statusFilter: string;
  yearFilter: string;
};

export type SortDirection = 'asc' | 'desc';

export type SortField = 'mentor' | 'totalDiplomas';
