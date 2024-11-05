import ListItem from '@tiptap/extension-list-item'
import './styles.css'
import { Color } from '@tiptap/extension-color'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useRef } from 'react'
import TextStyle from '@tiptap/extension-text-style'

export const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="button-group flex justify-between">
      <button
        onMouseDown={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onMouseDown={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        onMouseDown={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        Strike
      </button>
      <button
        onMouseDown={() => editor.chain().focus().undo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        Undo
      </button>
      <button
        onMouseDown={() => editor.chain().focus().redo().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        Redo
      </button>
    </div>
  )
}

// const extensions = [
//   Color.configure({ types: [TextStyle.name, ListItem.name] }),
//   TextStyle,
//   StarterKit.configure({
//     bulletList: { keepMarks: true, keepAttributes: false },
//     orderedList: { keepMarks: true, keepAttributes: false },
//   }),
// ];

// interface TiptapEditorProps {
//   content: string
//   setContent: (content: string) => void
// }

// const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, setContent }) => {
//   let contentRef = useRef<HTMLInputElement>(null);

//   return (
//     <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content}>
//       {/* <div
//         className="editor-content"
//         onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
//       />
//       <input ref={contentRef} type="hidden" name="content" value={content}/> */}
//     </EditorProvider>
//   )
// }

// export default TiptapEditor
