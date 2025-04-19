export default function CodeSnippet({ code }) {
    return (
      <div className="w-2/3 bg-white p-4 rounded-2xl flex flex-col">
        <h4 className="text-xl text-gray-700 mb-2">Código en vivo</h4>
        <div className="h-64 bg-gray-500 text-white p-4 rounded-lg overflow-y-auto flex-1">
          <pre className="whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    )
  }