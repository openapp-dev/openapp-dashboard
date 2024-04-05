import { useEffect, useState } from "react";
import { DocumentIcon } from "@heroicons/react/24/outline";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface TemplateMarkdownProps {
  url: string;
}

interface State {
  data: string;
  error: boolean;
}

export default function TemplateMarkdown({ url }: TemplateMarkdownProps) {
  const [state, setState] = useState<State>({
    data: "",
    error: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const data = await response.text();
        setState({ data, error: false });
      } catch (error) {
        setState({ data: "", error: true });
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {state.error ? (
        <div className="w-full flex flex-col justify-center items-center">
          <DocumentIcon className="w-10 mt-10 mb-4 text-gray-500" />
          <span className="text-gray-500 font-medium mb-10">
            No corresponding information
          </span>
        </div>
      ) : (
        <Markdown
          className="prose prose-zinc text-black max-w-none
          prose-li:pl-0 prose-li:mt-0 prose-li:mb-0
          prose-img:mt-0 prose-img:mb-1 prose-a:text-blue-800
          prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-3
          prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
          prose-hr:m-6
          prose-img:max-w-full prose-img:inline-flex"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          urlTransform={function (currentUrl, _key, _node) {
            if (currentUrl.startsWith("http") || url.startsWith("mailto:")) {
              return currentUrl;
            }
            const basePath = url.split("/").slice(0, -1).join("/");
            return basePath + currentUrl;
          }}
        >
          {state.data}
        </Markdown>
      )}
    </>
  );
}
