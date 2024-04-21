import { Checkbox, Flex, Heading } from "@radix-ui/themes";
import { Link } from "@src/web/components";
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { duotoneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

export default function MarkdownView({ content }: { content: string }) {
  return (
    <Markdown
      children={content}
      className="bg-white text-sm w-full h-full border-1 border-solid border-gray-400/50 px-15 py-15 rounded-md overflow-y-scroll"
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={duotoneLight}
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
              className="px-5 py-5 mt-3 mb-4 font-bold h-[20vh]"
            >
              <Flex className="h-full border-1 border-solid border-indigo-500 border-opacity-[0.4] rounded-md" />
              {props.children}
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
            <Flex className="px-10" direction="column">
              <ul>{props.children}</ul>
            </Flex>
          );
        },
      }}
    />
  );
}
