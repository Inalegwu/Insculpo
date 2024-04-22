import { ArrowRight, Spinner } from "@phosphor-icons/react";
import {
  Button,
  Flex,
  HoverCard,
  Link as RadixLink,
  Text,
} from "@radix-ui/themes";
import t from "@src/shared/config";
import { motion } from "framer-motion";
import type React from "react";

type LinkProps = React.ClassAttributes<HTMLAnchorElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function Link({ href, children }: LinkProps) {
  const { data } = t.links.fetchLinkData.useQuery(
    {
      url: href!,
    },
    {
      retry: 2,
    },
  );

  const { mutate: openLink } = t.links.openExternal.useMutation();

  return (
    <HoverCard.Root>
      <HoverCard.Trigger onClick={() => openLink({ link: href! })}>
        <RadixLink underline="always">{children}</RadixLink>
      </HoverCard.Trigger>
      <HoverCard.Content
        size="1"
        className="max-w-md max-h-md dark:bg-slate-700"
      >
        {data && (
          <Flex align="center" gap="2">
            <img
              src={data?.image}
              alt={data?.title?.slice(0, 10)}
              className="w-3/6 rounded-md"
            />
            <Flex
              direction="column"
              height="100%"
              align="start"
              justify="between"
            >
              <Flex direction="column" grow="1" align="start" justify="start">
                <Text className="text-[11.5px]" color="iris">
                  {data?.site_name}
                </Text>
                <Text className="text-[11px] text-gray-400">
                  {data?.description}
                </Text>
              </Flex>
              <Flex
                direction="row"
                grow="1"
                align="center"
                justify="end"
                gap="2"
                className="mt-2"
              >
                <Button
                  onClick={() => openLink({ link: href! })}
                  variant="soft"
                  size="1"
                >
                  <Text size="1">Visit</Text>
                  <ArrowRight size={13} />
                </Button>
              </Flex>
            </Flex>
          </Flex>
        )}
        {!data && (
          <motion.div
            style={{ display: "flex" }}
            animate={{ rotateZ: "360deg" }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.9 }}
            className="text-indigo-500 dark:text-white"
          >
            <Spinner size={20} />
          </motion.div>
        )}
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
