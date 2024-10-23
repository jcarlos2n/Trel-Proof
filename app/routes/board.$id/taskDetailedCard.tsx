import { useRef, useState } from "react";
import { CancelIcon, SaveIcon, TrashIcon } from "../../components/icons";
import { Form, useSubmit } from "@remix-run/react";

interface TaskDetailedCardProps {
    task: {
        title: string;
        content: string | null | undefined;
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

export function TaskDetailedCard({ task, onClose }: TaskDetailedCardProps) {
    console.log(task)
    const [title, setTitle] = useState(task.title);
    const [content, setContent] = useState(task.content);
    const [priority, setPriority] = useState(task.priority);
    const [subTasks, setSubTasks] = useState<SubTask[]>(task.subTasks || []);

    const [isAddingSubTask, setIsAddingSubTask] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
    const [newSubTaskContent, setNewSubTaskContent] = useState("");
    let listRef = useRef<HTMLUListElement>(null);
    function scrollList() {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        } else {
            console.error("listRef is not set");
        }
    }

    let titleRef = useRef<HTMLInputElement>(null);
    let contentRef = useRef<HTMLInputElement>(null);
    let priorityRef = useRef<HTMLInputElement>(null);
    let buttonRef = useRef<HTMLButtonElement>(null);
    let submit = useSubmit();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/2">
                <h2 className="text-xl font-semibold">Task Details</h2>
                <div className="my-2">
                    <label className="block">Title</label>
                    <input
                        type="text"
                        className="border rounded w-full p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="my-2">
                    <label className="block">Description</label>
                    <textarea
                        className="border rounded w-full p-2"
                        value={content ?? ""}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="my-2">
                    <label className="block">Priority</label>
                    <input
                        type="number"
                        className="border rounded w-full p-2"
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                    />
                </div>

                <div className="my-2">
                    <h3 className="text-lg">Subtasks</h3>
                    {subTasks.map((subTask: any, index: number) => (
                        <div key={subTask.id} className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="border rounded p-1"
                                value={subTask.title}
                                onChange={(e) =>
                                    setSubTasks(
                                        subTasks.map((s: any, i: number) =>
                                            i === index ? { ...s, title: e.target.value } : s
                                        )
                                    )
                                }
                            />
                            <button onClick={() => setSubTasks(subTasks.filter((_: any, i: number) => i !== index))}>
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                    {!isAddingSubTask ? (
                        <button
                            onClick={() => setIsAddingSubTask(true)}
                            className="mt-2 text-blue-500"
                        >
                            Añadir subtarea
                        </button>
                    ) : (
                        <Form
                            method="post"
                            className="flex flex-col gap-2.5 p-2 pt-1"
                            onSubmit={(event) => {
                                event.preventDefault();

                                let formData = new FormData(event.currentTarget);
                                console.log(formData)
                                // let id = crypto.randomUUID();
                                // formData.set("id", id);
                                submit(formData, {
                                    method: "post",
                                    // fetcherKey: `card:${id}`,
                                    navigate: false,
                                    unstable_flushSync: true,
                                });
                                if (titleRef.current) titleRef.current.value = "";
                                if (contentRef.current) contentRef.current.value = "";
                                if (priorityRef.current) priorityRef.current.value = "0";

                                scrollList()
                                onClose();
                            }}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) {
                                onClose();
                            }
                        }}
                        >
                            <div className="mt-2">
                                <input type="hidden" name="intent" value="createSubTask" />
                                <input type="hidden" name="taskId" value={task.id} />
                                <input
                                    required
                                    type="text"
                                    placeholder="Subtask Title"
                                    className="border rounded w-full p-2"
                                    name="subTaskTitle"
                                    ref={titleRef}
                                />
                                <input
                                    required
                                    placeholder="Subtask Content"
                                    className="border rounded w-full p-2 mt-2"
                                    name="subTaskContent"
                                    ref={contentRef}
                                />
                                <button
                                    ref={buttonRef}
                                    type="submit"
                                    // onClick={() => setIsAddingSubTask(false)}
                                    className="mt-2 px-4 py-2 rounded"
                                >
                                    <SaveIcon />
                                </button>
                                <button
                                    onClick={() => setIsAddingSubTask(false)}
                                    className="mt-2 px-4 py-2 rounded"
                                >
                                    <CancelIcon />
                                </button>
                            </div>
                        </Form>

                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="text-gray-500">Cancel</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
