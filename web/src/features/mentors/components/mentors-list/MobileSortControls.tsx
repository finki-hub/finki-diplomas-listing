import type { SortControlsProps } from './types';

import SortIcon from './SortIcon';

const MobileSortControls = (props: SortControlsProps) => (
  <div class="mb-4 space-y-2 sm:hidden">
    <div class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      Сортирање
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        class={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
          props.sortField === 'totalDiplomas'
            ? 'border-primary/40 bg-primary/10 text-foreground'
            : 'border-border bg-background text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => {
          props.onSort('totalDiplomas');
        }}
        type="button"
      >
        По број
        <SortIcon
          currentDirection={props.sortDirection}
          currentField={props.sortField}
          field="totalDiplomas"
        />
      </button>
      <button
        class={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm transition-colors ${
          props.sortField === 'mentor'
            ? 'border-primary/40 bg-primary/10 text-foreground'
            : 'border-border bg-background text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => {
          props.onSort('mentor');
        }}
        type="button"
      >
        По ментор
        <SortIcon
          currentDirection={props.sortDirection}
          currentField={props.sortField}
          field="mentor"
        />
      </button>
    </div>
  </div>
);

export default MobileSortControls;
