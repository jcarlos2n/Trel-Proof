
import { useRef, useState } from "react";
import { AddIcon, CancelIcon, SaveIcon, TrashIcon } from "../../components/icons";
import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { MenuBar } from "~/components/tiptap";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import StarterKit from "@tiptap/starter-kit";
import { EditorProvider } from "@tiptap/react";

interface TaskDetailedCardProps {
    task: {
        title: string;
        content: string;
        id: string;
        columnId: string;
        priority: number;
        order: number;
        nextOrder: number;
        previousOrder: number;
        subTasks: [];
    };
    onClose: () => void;
}
interface SubTask {
    id: string;
    title: string;
    content?: string;
}

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
    }),
]

export function TaskDetailedCard({ task, onClose }: TaskDetailedCardProps) {

    let deleteFetcher = useFetcher();
    const [title, setTitle] = useState(task.title);
    const [content, setContent] = useState(task.content);
    const [priority, setPriority] = useState(task.priority);
    const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks || []);
    console.log("content -> ", content)
    const [isAddingSubTask, setIsAddingSubTask] = useState(false);
    let listRef = useRef<HTMLUListElement>(null);

    function scrollList() {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }

    let titleRef = useRef<HTMLInputElement>(null);
    let contentRef = useRef<HTMLInputElement>(null);
    let priorityRef = useRef<HTMLInputElement>(null);
    let buttonRef = useRef<HTMLButtonElement>(null);
    let submit = useSubmit();

    return (
        <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white p-4 rounded-lg w-1/2">
                <Form method="post"
                    className="flex flex-col gap-2.5 p-2 pt-1"
                    onSubmit={(event) => {
                        event.preventDefault();

                        let formData = new FormData(event.currentTarget);

                        submit(formData, {
                            method: "post",
                            fetcherKey: `card:${task.id}`,
                            navigate: false,
                            unstable_flushSync: true,
                        });

                    }}>
                    <input type="hidden" name="intent" value="moveTask" />
                    <input type="hidden" name="taskId" value={task.id} />
                    <input type="hidden" name="columnId" value={task.columnId} />
                    <div className="flex justify-end space-x-2">
                        <button
                            ref={buttonRef}
                            className="px-4 py-2 rounded hover:bg-blue-200"
                        >
                            <SaveIcon />
                        </button>
                        <button onClick={onClose} className="hover:bg-red-200 px-4 py-2 rounded"><CancelIcon /></button>
                    </div>
                    <div className="my-2">
                        <label className="block text-black">Titulo</label>
                        <input
                            type="text"
                            className="border rounded w-full p-2 text-black bg-white"
                            value={title}
                            name="title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="my-2 text-black">
                        <label className="block">Descripción</label>
                        <div onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}>
                            <input
                                type="hidden"
                                ref={contentRef}
                                name="content"
                                value={content}
                            />
                            <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content}></EditorProvider>
                        </div>
                    </div>
                    <div className="my-2">
                        <label className="text-black block">Prioridad</label>
                        <input
                            type="number"
                            name="priority"
                            className="border rounded w-full p-2 text-black bg-white"
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                        />
                    </div>
                </Form>

                <div className="my-2">
                    {subTasks.length > 0 && (
                        <h3 className="text-black text-lg">Tareas:</h3>
                    )}
                    {subTasks.map((subTask: any, index: number) => (
                        <div key={subTask.id} className="space-y-2">
                            <div className="flex items-center space-x-2 border">
                                <input
                                    type="text"
                                    className="border rounded p-1 w-full text-black bg-white"
                                    value={subTask.title}
                                    readOnly
                                />
                                <deleteFetcher.Form method="post">
                                    <input type="hidden" name="intent" value="deleteSubTask" />
                                    <input type="hidden" name="subTaskId" value={subTask.id} />
                                    <button
                                        aria-label="Delete card"
                                        className="px-2 py-2 rounded hover:bg-red-200"
                                        type="submit"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setSubTasks(subTasks.filter((_, i) => i !== index));
                                            deleteFetcher.submit(event.currentTarget.closest("form"));
                                        }}
                                    >
                                        <TrashIcon />
                                    </button>
                                </deleteFetcher.Form>
                            </div>
                        </div>
                    ))}

                    {!isAddingSubTask ? (
                        <button
                            onClick={() => setIsAddingSubTask(true)}
                            className="mt-2 hover:bg-green-100 px-4 py-2 rounded"
                        >
                            <AddIcon />
                        </button>
                    ) : (
                        <Form
                            method="post"
                            className="flex flex-col gap-2.5 p-2 pt-1"
                            onSubmit={(event) => {
                                event.preventDefault();
                                const formData = new FormData(event.currentTarget);
                                submit(formData, {
                                    method: "post",
                                    navigate: false,
                                    unstable_flushSync: true,
                                });
                                scrollList();
                                setIsAddingSubTask(false);
                            }}
                        >
                            <input type="hidden" name="intent" value="createSubTask" />
                            <input type="hidden" name="taskId" value={task.id} />
                            <input
                                required
                                type="text"
                                placeholder="tarea"
                                className="text-black border rounded w-full p-2 bg-white"
                                name="subTaskTitle"
                            />
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="px-2 py-2 rounded hover:bg-blue-200"
                                >
                                    <SaveIcon />
                                </button>
                                <button
                                    onClick={() => setIsAddingSubTask(false)}
                                    className="px-2 py-2 rounded hover:bg-blue-200"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
}


