import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { Form, useSubmit } from "@remix-run/react";
import { AddIcon, CancelIcon, SaveIcon } from "~/components/icons";

export function NewColumn({
    boardId,
    onAdd,
    editInitially,
}: {
    boardId: number;
    onAdd: () => void;
    editInitially: boolean;
}) {
    let [editing, setEditing] = useState(editInitially);
    let inputRef = useRef<HTMLInputElement>(null);
    let submit = useSubmit();

    return editing ? (
        <Form
            method="post"
            navigate={false}
            className="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-80 border rounded-xl bg-slate-100"
            onSubmit={(event) => {
                event.preventDefault();
                let formData = new FormData(event.currentTarget);
                formData.set("id", crypto.randomUUID());
                submit(formData, {
                    navigate: false,
                    method: "post",
                    unstable_flushSync: true,
                });
                onAdd();
                if (inputRef.current) {
                    inputRef.current.value = "";
                } else {
                    console.error("Missing input ref");
                }
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setEditing(false);
                }
            }}
        >
            <input type="hidden" name="intent" value="createColumn" />
            <input type="hidden" name="boardId" value={boardId} />
            <input
                autoFocus
                required
                ref={inputRef}
                type="text"
                name="name"
                className="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black bg-white"
            />
            <div className="flex justify-between">
                <button type="submit"><SaveIcon /></button>
                <button onClick={() => setEditing(false)}><CancelIcon /></button>
            </div>
        </Form>
    ) : (
        <button
            onClick={() => {
                flushSync(() => {
                    setEditing(true);
                });
                onAdd();
            }}
            aria-label="Add new column"
            className="flex-shrink-0 flex items-center justify-center h-12 w-12 bg-black hover:bg-white bg-opacity-10 hover:bg-opacity-5 rounded-xl"
        >
            <AddIcon/>
        </button>
    );
}