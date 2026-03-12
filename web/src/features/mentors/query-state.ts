import type {
  InitialMentorsPageState,
  SortDirection,
  SortField,
} from './types';

const defaultMentorsPageState: InitialMentorsPageState = {
  expandedMentor: null,
  search: '',
  sortDirection: 'desc',
  sortField: 'totalDiplomas',
  statusFilter: '',
  yearFilter: '',
};

export const getInitialMentorsPageState = (): InitialMentorsPageState => {
  if (typeof window === 'undefined') {
    return defaultMentorsPageState;
  }

  const params = new URLSearchParams(window.location.search);

  const sortField = params.get('sort');
  const sortDirection = params.get('dir');

  const nextSortField: SortField =
    sortField === 'mentor' || sortField === 'totalDiplomas'
      ? sortField
      : defaultMentorsPageState.sortField;

  const defaultDirectionForField: SortDirection =
    nextSortField === 'totalDiplomas' ? 'desc' : 'asc';

  const nextSortDirection: SortDirection =
    sortDirection === 'asc' || sortDirection === 'desc'
      ? sortDirection
      : defaultDirectionForField;

  const expandedMentor = params.get('mentor')?.trim();
  const search = params.get('q')?.trim();
  const statusFilter = params.get('status')?.trim();
  const yearFilter = params.get('year')?.trim();

  return {
    expandedMentor:
      expandedMentor && expandedMentor.length > 0 ? expandedMentor : null,
    search: search ?? '',
    sortDirection: nextSortDirection,
    sortField: nextSortField,
    statusFilter: statusFilter ?? '',
    yearFilter: yearFilter ?? '',
  };
};

export const syncMentorsSearchParams = (options: {
  expandedMentor: null | string;
  search: string;
  sortDirection: SortDirection;
  sortField: SortField;
  statusFilter: string;
  yearFilter: string;
}) => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams();
  const trimmedSearch = options.search.trim();
  const defaultSortDirection =
    options.sortField === 'totalDiplomas' ? 'desc' : 'asc';

  if (trimmedSearch.length > 0) {
    params.set('q', trimmedSearch);
  }

  if (options.statusFilter.length > 0) {
    params.set('status', options.statusFilter);
  }

  if (options.yearFilter.length > 0) {
    params.set('year', options.yearFilter);
  }

  if (options.sortField !== 'totalDiplomas') {
    params.set('sort', options.sortField);
  }

  if (options.sortDirection !== defaultSortDirection) {
    params.set('dir', options.sortDirection);
  }

  if (options.expandedMentor) {
    params.set('mentor', options.expandedMentor);
  }

  const nextSearch = params.toString();
  const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`;

  window.history.replaceState({}, '', nextUrl);
};
