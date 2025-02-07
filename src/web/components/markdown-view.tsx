import { Blockquote, Box, Flex, Heading } from "@radix-ui/themes";
import { CheckBox, Link } from "@src/web/components";
import { globalState$ } from "@src/web/state";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  duotoneLight,
  oneDark,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

export default function MarkdownView({ content }: { content: string }) {
  const colorMode = globalState$.colorMode.get();

  return (
    <Markdown
      // biome-ignore lint/correctness/noChildrenProp: <explanation>
      children={content}
      className="text-sm w-full h-full px-25 py-20 rounded-md overflow-y-scroll line-height-[2]"
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={colorMode === "light" ? duotoneLight : oneDark}
              PreTag="div"
              customStyle={{
                fontSize: 13,
                marginTop: 10,
                padding: 11,
                borderRadius: 5,
                fontFamily: "Recursive",
              }}
              showLineNumbers
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
            <Blockquote
              color={colorMode === "dark" ? "gray" : "iris"}
              size="4"
              className="mt-3 mb-3"
            >
              {props.children}
            </Blockquote>
          );
        },
        li(props) {
          return props.role === "checkbox" ? (
            <CheckBox children={props.children} />
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
          return <Box className="py-1" />;
        },
      }}
    />
  );
}
