import { Form, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { CancelIcon, SaveIcon } from "~/components/icons";

export function NewTask({
    boardId,
    columnId,
    nextOrder,
    onComplete,
    onAddCard,
}: {
    boardId: number,
    columnId: string;
    nextOrder: number;
    onComplete: () => void;
    onAddCard: () => void;
}) {
    let textAreaRef = useRef<HTMLTextAreaElement>(null);
    let buttonRef = useRef<HTMLButtonElement>(null);
    let submit = useSubmit();

    return (
        <Form
            method="post"
            className="flex flex-col gap-2.5 p-2 pt-1"
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

                if (textAreaRef.current) {
                    textAreaRef.current.value = "";
                } else {
                    console.error("Expected text area ref but it was null or undefined.");
                }
                onAddCard();
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    onComplete();
                }
            }}
        >
            <input type="hidden" name="intent" value="createTask" />
            <input
                type="hidden"
                name="columnId"
                value={columnId}
            />
            <input
                type="hidden"
                name="boardId"
                value={boardId}
            />
            <input
                type="hidden"
                name="order"
                value={nextOrder}
            />

            <textarea
                autoFocus
                required
                ref={textAreaRef}
                name="title"
                placeholder="Enter a title for this card"
                className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();

                        if (!buttonRef.current) {
                            console.error("Expected button ref but it was null or undefined.");
                            return;
                        }
                        buttonRef.current.click();
                    }
                    if (event.key === "Escape") {
                        onComplete();
                    }
                }}
                onChange={(event) => {
                    let el = event.currentTarget;
                    el.style.height = el.scrollHeight + "px";
                }}
            />
            <div className="flex justify-between">
                <button ref={buttonRef}>
                    <SaveIcon />
                </button>
                <button onClick={onComplete}>
                    <CancelIcon />
                </button>
            </div>
        </Form>
    );
}