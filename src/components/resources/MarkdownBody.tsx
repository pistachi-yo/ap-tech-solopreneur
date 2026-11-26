import Markdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useLocation } from 'react-router'

interface MarkdownBodyProps {
  markdown: string
}

// Raw HTML in the markdown is never rendered (react-markdown skips it).
export function MarkdownBody({ markdown }: MarkdownBodyProps) {
  const location = useLocation()

  const components: Components = {
    h2: ({ children }) => (
      <h2 className="mt-8 mb-3 font-heading text-2xl font-normal text-chestnut-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-2 font-heading text-xl font-normal text-chestnut-900">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 text-body text-chestnut-900">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-4 list-disc space-y-2 pl-6 text-body text-chestnut-900">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 text-body text-chestnut-900">
        {children}
      </ol>
    ),
    a: ({ href, children }) =>
      href && href.startsWith('/') && !href.startsWith('//') ? (
        <Link
          to={href}
          state={location.state}
          className="font-medium text-chestnut-primary underline underline-offset-2"
        >
          {children}
        </Link>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-chestnut-primary underline underline-offset-2"
        >
          {children}
        </a>
      ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-brand-border bg-white">
        <table className="w-full min-w-[32rem] border-collapse text-left text-body-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-brand-border bg-chestnut-tertiary px-3 py-2 font-medium">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-brand-border/50 px-3 py-2 align-top">
        {children}
      </td>
    ),
  }

  return (
    <Markdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
      {markdown}
    </Markdown>
  )
}
