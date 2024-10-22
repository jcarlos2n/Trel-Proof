import { useState } from "react";

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

export function TaskDetailedCard({ task, onClose }: TaskDetailedCardProps) {
    const [title, setTitle] = useState(task.title);
    const [content, setContent] = useState(task.content);
    const [priority, setPriority] = useState(task.priority);
    const [subTasks, setSubTasks] = useState(task.subTasks || []);

    const [isAddingSubTask, setIsAddingSubTask] = useState(false);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
    const [newSubTaskContent, setNewSubTaskContent] = useState("");


    const handleSave = () => {
        // onSave({
        //   ...task,
        //   title,
        //   content,
        //   priority,
        //   subTasks,
        // });
        onClose();
    };

    const handleAddSubTask = () => {
        const newSubTask = {
            id: crypto.randomUUID(),
            title: newSubTaskTitle,
            content: newSubTaskContent,
        };
        // setSubTasks([...subTasks, newSubTask]);
        setIsAddingSubTask(false); // Ocultar el formulario una vez añadida la subtarea
        setNewSubTaskTitle(""); // Limpiar los campos del formulario
        setNewSubTaskContent("");
    };

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
                        // value={content}
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
                            // onChange={(e) =>
                            //   setSubTasks(
                            //     subTasks.map((s: any, i: number) =>
                            //       i === index ? { ...s, title: e.target.value } : s
                            //     )
                            //   )
                            // }
                            />
                            {/* <button onClick={() => setSubTasks(subTasks.filter((_: any, i: number) => i !== index))}>
                Delete
              </button> */}
                        </div>
                    ))}
                    {!isAddingSubTask ? (
                        <button 
                            onClick={() => setIsAddingSubTask(true)} 
                            className="mt-2 text-blue-500"
                        >
                            Add Subtask
                        </button>
                    ) : (
                        // Formulario de nueva subtarea
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Subtask Title"
                                className="border rounded w-full p-2"
                                value={newSubTaskTitle}
                                onChange={(e) => setNewSubTaskTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Subtask Content"
                                className="border rounded w-full p-2 mt-2"
                                value={newSubTaskContent}
                                onChange={(e) => setNewSubTaskContent(e.target.value)}
                            />
                            <button 
                                onClick={handleAddSubTask} 
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save Subtask
                            </button>
                            <button 
                                onClick={() => setIsAddingSubTask(false)} 
                                className="mt-2 text-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="text-gray-500">Cancel</button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                </div>
            </div>
        </div>
    );
}
