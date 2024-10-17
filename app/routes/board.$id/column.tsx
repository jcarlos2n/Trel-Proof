import { useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AddIcon, CancelIcon, SaveIcon } from "~/components/icons";
import { NewCard } from "./newCard";

interface Task {
  id: string;
  title: string;
  order: number;
  content?: string;
  priority: number;
  subTask: []
}

interface Props {
  key: number;
  name: string;
  columnId: string;
  tasks: Task[];
}

export function Column({ key, name, columnId, tasks }: Props) {
  let submit = useSubmit();
  let [acceptDrop, setAcceptDrop] = useState(false);
  let [columnName, setColumnName] = useState(name);
  let [edit, setEdit] = useState(false);
  let listRef = useRef<HTMLUListElement>(null);

  function scrollList() {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    } else {
      console.error("listRef is not set");
    }
  }

  return (
    <div
      className={
        "flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100 " +
        (acceptDrop ? `outline outline-2 outline-brand-red` : ``)
      }
      onDragOver={(event) => {
        if (
          (tasks.length === 0 || !tasks) &&
          event.dataTransfer.types.includes("application/remix-card")
        ) {
          event.preventDefault();
          setAcceptDrop(true);
        }
      }}
      onDragLeave={() => {
        setAcceptDrop(false);
      }}
      onDrop={(event) => {
        let transfer = JSON.parse(
          event.dataTransfer.getData("application/remix-card"),
        );
        if (!transfer.id) {
          throw new Error("Missing transfer.id");
        }

        if (!transfer.title) {
          throw new Error("Missing transfer.title");
        }

        let mutation = {
          order: 1,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        };

        submit(
          { ...mutation, intent: "moveTask" },
          {
            method: "post",
            navigate: false,
            fetcherKey: `card:${transfer.id}`,
          },
        );

        setAcceptDrop(false);
      }}
    >
      <div className="p-2">
        {edit ? (
          <div>
            <label htmlFor="updateColumnName" className="sr-only">
              Edit column name
            </label>
            <input
              type="text"
              id="updateColumnName"
              name="name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
            />
            <div className="flex flex-row justify-between">
              <button
                onClick={() => {
                  setEdit(false);
                  submit(
                    { name: columnName, intent: "updateColumn", columnId },
                    { method: "post", navigate: false }
                  );
                }}
                className="block mt-2 bg-blue-500 py-1 px-4 rounded-lg"
              >
                <SaveIcon />
              </button>
              <button
                onClick={() => {
                  setEdit(false);
                }}
                className="block mt-2 bg-blue-500 py-1 px-4 rounded-lg"
              >
                <CancelIcon />
              </button>
            </div>

          </div>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
            aria-label={`Edit column "${name}" name`}
          >
            {name}
          </button>
        )}
        <input type="hidden" name="intent" value="updateColumn" />
        <input type="hidden" name="columnId" value={columnId} />
      </div>

    
      {edit ? (
        <NewCard
          columnId={columnId}
          nextOrder={(!tasks || tasks.length === 0) ? 1 : tasks[tasks.length - 1].order + 1}
          onAddCard={() => scrollList()}
          onComplete={() => setEdit(false)}
        />
      ) : (
        <div className="p-2 pt-1">
          <button
            type="button"
            onClick={() => {
              flushSync(() => {
                setEdit(true);
              });
              scrollList();
            }}
            className="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
          >
            <AddIcon />
          </button>
        </div>
      )}
    </div>
  );
}