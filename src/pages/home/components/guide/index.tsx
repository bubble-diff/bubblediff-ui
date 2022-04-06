import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownGuide from "./guide.md";
import remarkGfm from "remark-gfm";
import remarkGemoji from "remark-gemoji";
import rehypeRaw from "rehype-raw";
import SyntaxHighlighter from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Guide = () => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(MarkdownGuide)
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(text);
      });
  }, []);

  return (
    <div
      style={{
        boxSizing: "border-box",
        minWidth: "200px",
        maxWidth: "980px",
        margin: "0 auto",
        padding: "45px",
      }}
      className="markdown-body"
    >
      <ReactMarkdown
        children={markdown}
        remarkPlugins={[remarkGfm, remarkGemoji]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={github}
                language={match[1]}
                PreTag="div"
                showLineNumbers
                showInlineLineNumbers
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default Guide;
