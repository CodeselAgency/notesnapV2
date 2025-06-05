interface ContentFormatterProps {
  content: string;
}

export function ContentFormatter({ content }: ContentFormatterProps) {
  const formatMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4">
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-lg font-semibold text-gray-800 mb-3 mt-6"
          >
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-semibold text-gray-900 mb-2">
            {line.slice(2, -2)}
          </p>
        );
      }
      if (line.startsWith("• ")) {
        return (
          <li key={index} className="text-gray-700 mb-2 ml-4 list-disc">
            {line.substring(2)}
          </li>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="text-gray-700 mb-2 ml-4 list-decimal">
            {line.substring(line.indexOf(".") + 1)}
          </li>
        );
      }
      if (line === "---") {
        return (
          <div key={index} className="my-6 border-t border-gray-200"></div>
        );
      }
      if (line.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-gray-700 mb-3 leading-relaxed ">
          {line}
        </p>
      );
    });
  };

  return <div>{formatMessageContent(content)}</div>;
}
