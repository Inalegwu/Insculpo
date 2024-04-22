import { Box, Checkbox, Flex, Heading, Text } from "@radix-ui/themes";
import { Link } from "@src/web/components";
import { globalState$ } from "@src/web/state";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  nord,
  solarizedlight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

export default function MarkdownView({ content }: { content: string }) {
  const colorMode = globalState$.colorMode.get();

  return (
    <Markdown
      children={content}
      className="bg-slate-50 text-sm w-full h-full border-1 border-solid border-gray-400/50 px-15 py-15 rounded-md overflow-y-scroll dark:bg-slate-700 dark:border-gray-500/30"
      remarkPlugins={[
        [remarkGfm, { singleTilde: false }],
        [remarkToc, { heading: "Contents", ordered: true }],
      ]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={colorMode === "light" ? solarizedlight : nord}
              PreTag="div"
              customStyle={{
                fontSize: 13,
                marginTop: 10,
                padding: 11,
                borderRadius: 5,
              }}
              language={match[1]}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a(props) {
          return <Link {...props} />;
        },
        h1(props) {
          return <Heading size="8">{props.children}</Heading>;
        },
        h2(props) {
          return <Heading size="7">{props.children}</Heading>;
        },
        h3(props) {
          return <Heading size="6">{props.children}</Heading>;
        },
        h4(props) {
          return <Heading size="5">{props.children}</Heading>;
        },
        h5(props) {
          return <Heading size="4">{props.children}</Heading>;
        },
        h6(props) {
          return <Heading size="3">{props.children}</Heading>;
        },
        blockquote(props) {
          return (
            <Flex
              align="center"
              justify="start"
              gap="3"
              className="px-5 py-5 mt-3 mb-4 font-medium max-h-lg bg-slate-400/10 rounded-xl text-wrap"
            >
              <Flex className="h-[18vh] border-1 border-solid border-indigo-500/30 border-opacity-[0.4] rounded-full" />
              <Text
                className="text-indigo-600 dark:text-gray-200 w-full"
                size="2"
              >
                {props.children}
              </Text>
            </Flex>
          );
        },
        li(props) {
          return props.role === "checkbox" ? (
            <Flex align="center" gap="1">
              <Checkbox defaultChecked={false} />
              {props.children}
            </Flex>
          ) : (
            <li>{props.children}</li>
          );
        },
        del(props) {
          return (
            <del className="line-through italic font-light text-gray-400/60">
              {props.children}
            </del>
          );
        },
        ul(props) {
          return (
            <Flex direction="column">
              <ul>{props.children}</ul>
            </Flex>
          );
        },
        br() {
          return <Box className="px-1 py-1" />;
        },
      }}
    />
  );
}
