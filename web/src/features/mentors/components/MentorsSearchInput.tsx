type MentorsSearchInputProps = {
  onInput: (value: string) => void;
  value: string;
};

const MentorsSearchInput = (props: MentorsSearchInputProps) => (
  <div>
    <input
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onInput={(event: InputEvent & { currentTarget: HTMLInputElement }) => {
        props.onInput(event.currentTarget.value);
      }}
      placeholder="Пребарувај по ментор, наслов, или студент..."
      type="text"
      value={props.value}
    />
  </div>
);

export default MentorsSearchInput;
