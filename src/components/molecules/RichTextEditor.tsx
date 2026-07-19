'use client'

import { type MouseEvent, type ReactNode } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { Bold, Italic, List, ListOrdered, Minus } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (html: string, text: string) => void
  placeholder?: string
  maxLength?: number
}

interface MenuTool {
  label: string
  icon: ReactNode
  action: () => void
  isActive: boolean
  shortcut?: string
}

function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const tools: MenuTool[] = [
    {
      label: 'Bold',
      icon: <Bold size={13} />,
      action: () => {
        editor.chain().focus().toggleBold().run()
      },
      isActive: editor.isActive('bold'),
      shortcut: '⌘B',
    },
    {
      label: 'Italic',
      icon: <Italic size={13} />,
      action: () => {
        editor.chain().focus().toggleItalic().run()
      },
      isActive: editor.isActive('italic'),
      shortcut: '⌘I',
    },
    {
      label: 'Bullet list',
      icon: <List size={13} />,
      action: () => {
        editor.chain().focus().toggleBulletList().run()
      },
      isActive: editor.isActive('bulletList'),
    },
    {
      label: 'Numbered list',
      icon: <ListOrdered size={13} />,
      action: () => {
        editor.chain().focus().toggleOrderedList().run()
      },
      isActive: editor.isActive('orderedList'),
    },
    {
      label: 'Divider',
      icon: <Minus size={13} />,
      action: () => {
        editor.chain().focus().setHorizontalRule().run()
      },
      isActive: false,
    },
  ]

  const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>, isActive: boolean) => {
    if (!isActive) {
      event.currentTarget.style.background = 'var(--color-subtle)'
    }
  }

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>, isActive: boolean) => {
    if (!isActive) {
      event.currentTarget.style.background = 'transparent'
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '2px',
        padding: '8px 10px',
        borderBottom: '1px solid var(--color-border-default)',
      }}
    >
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={tool.action}
          title={tool.label + (tool.shortcut ? ' ' + tool.shortcut : '')}
          aria-label={tool.label}
          aria-pressed={tool.isActive}
          onMouseEnter={(event) => handleMouseEnter(event, tool.isActive)}
          onMouseLeave={(event) => handleMouseLeave(event, tool.isActive)}
          style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            background: tool.isActive ? 'var(--color-brand-subtle)' : 'transparent',
            color: tool.isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
            transition: 'background 0.1s, color 0.1s',
          }}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  )
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Share something with the community...',
  maxLength = 500,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML(), currentEditor.getText())
    },
    editorProps: {
      attributes: {
        'aria-label': 'Post content editor',
        'aria-multiline': 'true',
        role: 'textbox',
      },
    },
  })

  const charCount = editor?.storage.characterCount.characters() ?? 0
  const percentage = Math.round((charCount / maxLength) * 100)
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  return (
    <div>
      <MenuBar editor={editor} />
      <style>{`
        .ProseMirror {
          outline: none;
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-text-default);
          padding: 12px 14px;
          min-height: 80px;
          font-family: var(--font-sans);
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--color-text-muted);
          pointer-events: none;
          float: left;
          height: 0;
        }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 20px;
          margin: 6px 0;
        }
        .ProseMirror li {
          margin: 2px 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid var(--color-border-default);
          margin: 10px 0;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
      `}</style>
      <EditorContent editor={editor} />
      {charCount > 0 && (
        <div
          style={{
            padding: '4px 14px 8px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: isAtLimit
                ? 'var(--color-status-error)'
                : isNearLimit
                  ? 'var(--color-status-warning)'
                  : 'var(--color-text-muted)',
            }}
          >
            {charCount}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
}
