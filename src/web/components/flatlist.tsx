import { ScrollArea } from "@radix-ui/themes";

type RenderItemInfo<T> = {
  item: T;
  index: number;
};

type Props<T> = {
  data: T[];
  renderItem: (info: RenderItemInfo<T>) => React.JSX.Element;
  className?: string;
};

export default function FlatList<T extends Record<string, unknown>>({
  data,
  renderItem,
  className,
}: Props<T>) {
  return (
    <ScrollArea
      size="1"
      className={className}
      type="scroll"
      scrollbars="vertical"
    >
      {data.map((v, idx) => renderItem({ item: v, index: idx }))}
    </ScrollArea>
  );
}
