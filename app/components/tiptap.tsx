import './styles.scss'
import { useCurrentEditor } from '@tiptap/react'

export const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="TiptapEditor button-group flex justify-between">
      <button
        type="button"
        onMouseDown={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={`${editor.isActive('bold') ? 'bg-gray-500 text-white' : 'bg-gray-200 text-slate-600'
          } p-1 rounded-md transition duration-200 disabled:bg-gray-100`}

      >
        Bold
      </button>
      <button
        type="button"
        onMouseDown={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={`${editor.isActive('italic') ? 'bg-gray-500 text-white' : 'bg-gray-200 text-slate-600'
          } p-1 rounded-md transition duration-200 disabled:bg-gray-100`}
      >
        Italic
      </button>
      <button
        type="button"
        onMouseDown={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={`${editor.isActive('strike') ? 'bg-gray-500 text-white' : 'bg-gray-200 text-slate-600'
          } p-1 rounded-md transition duration-200 disabled:bg-gray-100`}
      >
        Strike
      </button>
      <button
        type="button"
        onMouseDown={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
        className={`p-1 rounded-md transition duration-200 ${editor.can().chain().focus().undo().run() ? 'bg-gray-200' : 'bg-gray-200 text-slate-600'} disabled:bg-gray-100`}
      >
        Undo
      </button>
      <button
        type="button"
        onMouseDown={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
        className={`p-1 rounded-md transition duration-200 ${editor.can().chain().focus().redo().run() ? 'bg-gray-200' : 'bg-gray-200 text-slate-600'} disabled:bg-gray-100`}
      >
        Redo
      </button>
    </div>
  )
}