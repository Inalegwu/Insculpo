import { Flex, HoverCard, Link as RadixLink, Text } from "@radix-ui/themes";
import t from "@src/shared/config";
import moment from "moment";
import type React from "react";

type LinkProps = React.ClassAttributes<HTMLAnchorElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Link({ href, children }: LinkProps) {
  const { data, isLoading } = t.links.fetchLinkData.useQuery({
    url: href!,
  });

  const { mutate: openLink } = t.links.openExternal.useMutation();

  return (
    <HoverCard.Root>
      <HoverCard.Trigger onClick={() => openLink({ link: href! })}>
        <RadixLink underline="always">{children}</RadixLink>
      </HoverCard.Trigger>
      <HoverCard.Content size="1" className="max-w-md">
        <Flex align="center" gap="2">
          <img
            src={data?.image}
            alt={data?.title?.slice(0, 10)}
            className="w-3/6 rounded-tl-md rounded-bl-md"
          />
          <Flex
            direction="column"
            height="100%"
            align="start"
            justify="between"
          >
            <Flex direction="column" align="start" justify="start">
              <Text className="text-[11.5px]" color="iris">
                {data?.site_name}
              </Text>
              <Text className="text-[11px] text-gray-400">
                {data?.description}
              </Text>
            </Flex>
            <Text className="text-[10px] text-gray-400 mt-2">
              {moment(Date.now()).fromNow()}
            </Text>
          </Flex>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
