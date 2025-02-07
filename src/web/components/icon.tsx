import { icons } from "lucide-react";
import { memo } from "react";

type Props = {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  className?: string;
};

const Icon = memo(({ name, className, color, size }: Props) => {
  const LucideIcon = icons[name];

  return <LucideIcon className={className} color={color} size={size} />;
});

export default Icon;
