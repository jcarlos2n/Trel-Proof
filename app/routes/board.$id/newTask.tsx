import { Form, useSubmit } from "@remix-run/react";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { CancelIcon, SaveIcon } from "~/components/icons";
import { MenuBar } from "~/components/tiptap";

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
    }),
]

export function NewTask({
    boardId,
    columnId,
    nextOrder,
    onComplete,
    onAddCard,
}: {
    boardId: number;
    columnId: string;
    nextOrder: number;
    onComplete: () => void;
    onAddCard: () => void;
}) {
    let titleRef = useRef<HTMLInputElement>(null);
    let contentRef = useRef<HTMLInputElement>(null);
    let priorityRef = useRef<HTMLInputElement>(null);
    let buttonRef = useRef<HTMLButtonElement>(null);
    let submit = useSubmit();
    const task = {
        id: 1,
        title: 'Simulated Task',
        content: 'Inserta la descripción aqui.',
        priority: 'High',
    };
    const [content, setContent] = useState(task.content);

    return (
        <Form
            method="post"
            className="flex flex-col gap-2.5 p-2 pt-1"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(event) => {
                event.preventDefault();

                let formData = new FormData(event.currentTarget);
                let id = crypto.randomUUID();
                formData.set("id", id);

                submit(formData, {
                    method: "post",
                    fetcherKey: `card:${id}`,
                    navigate: false,
                    unstable_flushSync: true,
                });
                if (titleRef.current) titleRef.current.value = "";
                if (contentRef.current) contentRef.current.value = "";
                if (priorityRef.current) priorityRef.current.value = "0";

                onAddCard();
                onComplete();
            }}
        >
            <input type="hidden" name="intent" value="createTask" />
            <input type="hidden" name="columnId" value={columnId} />
            <input type="hidden" name="boardId" value={boardId} />
            <input type="hidden" name="order" value={nextOrder} />

            <label className="text-slate-600 text-sm">Titulo</label>
            <input
                autoFocus
                required
                ref={titleRef}
                name="title"
                placeholder="Introduce el titulo"
                className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 text-slate-600 bg-white"
            />

            <label className="text-slate-600 text-sm">Descripción</label>
            <div
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) =>
                    e.stopPropagation()}
                autoFocus
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                className="text-slate-600 border p-2 rounded-md shadow-sm bg-white relative"                >
                <input type="hidden" ref={contentRef} name="content" value={content} />
                <EditorProvider 
                slotBefore={<MenuBar />} extensions={extensions} content={content}></EditorProvider>
            </div>

            <label className="text-slate-600 text-sm">Prioridad</label>
            <input
                type="number"
                required
                ref={priorityRef}
                name="priority"
                defaultValue={0}
                className="outline-none border-slate-300 rounded-lg w-full py-1 px-2 placeholder:text-sm placeholder:text-slate-500 text-slate-600 bg-white"
                step="1"
                min="0"
                max="20"
            />

            <div className="flex justify-between">
                <button ref={buttonRef}>
                    <SaveIcon />
                </button>
                <button type="button" onClick={onComplete}>
                    <CancelIcon />
                </button>
            </div>
        </Form>
    );
}