import { ScrollArea } from "@radix-ui/themes";

export type RenderItemInfo<T> = {
  item: T;
  index: number;
};

export type Props<T> = {
  data: T[];
  renderItem: (info: RenderItemInfo<T>) => React.JSX.Element;
  className?: string;
  scrollbars?: "vertical" | "horizontal" | "both";
  type?: "scroll" | "always" | "auto" | "hover";
  size?: "1" | "2" | "3";
};

export default function FlatList<T extends Record<string, unknown>>({
  data,
  renderItem,
  className,
  scrollbars = "vertical",
  size = "1",
  type = "scroll",
}: Props<T>) {
  return (
    <ScrollArea
      size={size}
      className={className}
      type={type}
      scrollbars={scrollbars}
    >
      {data.map((v, idx) => renderItem({ item: v, index: idx }))}
    </ScrollArea>
  );
}
