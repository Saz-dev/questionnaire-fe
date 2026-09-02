import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function MarkdownAnswer({ text }: { text: string }) {
  return (
    <div
      className="max-w-none font-serif text-[15.5px] leading-[1.75] text-[var(--text)]
        [&_p]:mb-3 [&_p:last-child]:mb-0
        [&_strong]:font-semibold
        [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5
        [&_li]:mb-1
        [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-semibold
        [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold
        [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-sm [&_h3]:font-semibold
        [&_code]:rounded-xs [&_code]:bg-[var(--surface-2)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]
        [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-[var(--border)] [&_pre]:bg-[var(--surface-2)] [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-normal
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--text-muted)]
        [&_a]:text-[var(--accent-strong)] [&_a]:underline [&_a]:underline-offset-2
        [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
        [&_th]:border [&_th]:border-[var(--border)] [&_th]:bg-[var(--surface-2)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left
        [&_td]:border [&_td]:border-[var(--border)] [&_td]:px-2 [&_td]:py-1"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  )
}
