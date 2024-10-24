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
                if (titleRef.current) titleRef.current.value = "";
                if (contentRef.current) contentRef.current.value = "";
                if (priorityRef.current) priorityRef.current.value = "0";

                onAddCard();
                onComplete();
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    onComplete();
                }
            }}
        >
            <input type="hidden" name="intent" value="createTask" />
            <input type="hidden" name="columnId" value={columnId} />
            <input type="hidden" name="boardId" value={boardId} />
            <input type="hidden" name="order" value={nextOrder} />

            <label className="text-black">Titulo</label>
            <input
                autoFocus
                required
                ref={titleRef}
                name="title"
                placeholder="Introduce el titulo"
                className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14 text-black bg-white"
            />

            <label className="text-black">Descripción</label>
            <input
                required
                ref={contentRef}
                name="content"
                placeholder="Introduce la descripcion de la tarea"
                className="outline-none shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14 text-black bg-white"
            />

            <label className="text-black">Prioridad</label>
            <input
                type="number"
                required
                ref={priorityRef}
                name="priority"
                defaultValue={0}
                className="outline-none border-slate-300 rounded-lg w-full py-1 px-2 placeholder:text-sm placeholder:text-slate-500 text-black bg-white"
                step="1"
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