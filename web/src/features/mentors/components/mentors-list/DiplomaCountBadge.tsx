import { Badge } from '@/components/ui/badge';

import type { DiplomaCountBadgeProps } from './types';

const DiplomaCountBadge = (props: DiplomaCountBadgeProps) => (
  <Badge
    style={{ opacity: props.opacity }}
    variant="default"
  >
    {props.hasActiveFilters && props.filteredCount !== props.totalCount
      ? `${props.filteredCount} / ${props.totalCount}`
      : props.totalCount}
  </Badge>
);

export default DiplomaCountBadge;
