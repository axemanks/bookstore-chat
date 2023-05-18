import React from 'react'
import Link from 'next/link'

// This will display only "Links" in markdown format
// MDlite is suitable for links, but would not use for code blocks

const MarkdownLite = ({ text }: { text: string }) => {
  // link regex - https://regex101.com
  // checks for- \[ and \] 
  const linkRegex = /\[(.+?)\]\((.+?)\)/g
  const parts = []

  let lastIndex = 0
  // hold match result
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    // descructure match
    const [fullMatch, linkText, linkUrl] = match
    const matchStart = match.index
    const matchEnd = matchStart + fullMatch.length

    // create link from next js
    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart))
    }
    // add link to text
    parts.push(
      <Link
        target='_blank'
        rel='noopener noreferrer'
        className='break-words underline underline-offset-2 text-blue-600'
        key={linkUrl}
        href={linkUrl}>
        {linkText}
      </Link>
    )

    lastIndex = matchEnd
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return (
    <>
      {/* Render the parts */}
      {parts.map((part, i) => (
        <React.Fragment key={i}>{part}</React.Fragment>
      ))}
    </>
  )
}

export default MarkdownLite