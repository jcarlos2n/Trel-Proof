import { useSubmit } from "@remix-run/react";
import { useState } from "react";
import { useFetcher } from "react-router-dom";
import { MoreIcon, TrashIcon } from "~/components/icons";
import { TaskDetailedCard } from "./taskDetailedCard";

interface TaskProps {
  title: string;
  content: string | null | undefined;
  priority: number;
  id: string;
  columnId: string;
  order: number;
  nextOrder: number;
  previousOrder: number;
  subTasks: []
}

export function Task({
  title,
  content,
  id,
  columnId,
  order,
  nextOrder,
  previousOrder,
  priority,
  subTasks
}: TaskProps) {
  let submit = useSubmit();
  let deleteFetcher = useFetcher();
  let [acceptDrop, setAcceptDrop] = useState<"none" | "top" | "bottom">("none");
  let [isCardOpen, setIsCardOpen] = useState(false);

  const handleOpenCard = () => {
    setIsCardOpen(true);
  };

  const handleCloseCard = () => {
    setIsCardOpen(false);
  };

  return deleteFetcher.state !== "idle" ? null : (
    <li
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("application/remix-card")) {
          event.preventDefault();
          event.stopPropagation();
          let rect = event.currentTarget.getBoundingClientRect();
          let midpoint = (rect.top + rect.bottom) / 2;
          setAcceptDrop(event.clientY <= midpoint ? "top" : "bottom");
        }
      }}
      onDragLeave={() => {
        setAcceptDrop("none");
      }}
      onDrop={(event) => {
        event.stopPropagation();

        let transfer = JSON.parse(
          event.dataTransfer.getData("application/remix-card"),
        );
        if (!transfer.id) {
          throw new Error("Missing cardId");
        }
        if (!transfer.title) {
          throw new Error("Missing title");
        }

        let droppedOrder = acceptDrop === "top" ? previousOrder : nextOrder;
        let moveOrder = (droppedOrder + order) / 2;

        let update = {
          order: moveOrder,
          columnId: columnId,
          id: transfer.id,
          title: transfer.title,
        };

        submit(
          { ...update, intent: "createTask" },
          {
            method: "post",
            navigate: false,
            fetcherKey: `card:${transfer.id}`,
          },
        );

        setAcceptDrop("none");
      }}
      className={
        "border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 " +
        (acceptDrop === "top"
          ? "border-t-brand-red border-b-transparent"
          : acceptDrop === "bottom"
            ? "border-b-brand-red border-t-transparent"
            : "border-t-transparent border-b-transparent")
      }
    >
      <div
        draggable
        className="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative flex items-center justify-between"
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            "application/remix-card",
            JSON.stringify({ id, title })
          );
        }}
      >
        <h3 className="text-black">{title}</h3>
        <div className="bg-white shadow shadow-slate-300 border-slate-300 rounded-lg py-1 px-2 relative flex items-center justify-end space-x-2">
          <button onClick={handleOpenCard}>
            <MoreIcon />
          </button>
          <deleteFetcher.Form method="post">
            <input type="hidden" name="intent" value="deleteTask" />
            <input type="hidden" name="taskId" value={id} />
            <button
              aria-label="Delete card"
              className="hover:text-brand-red"
              type="submit"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <TrashIcon />
            </button>
          </deleteFetcher.Form>
        </div>
      </div>

      {isCardOpen && (
        <TaskDetailedCard
          task={{
            id,
            title,
            content,
            columnId,
            priority,
            order,
            nextOrder,
            previousOrder,
            subTasks,
          }}
          onClose={handleCloseCard}
        />
      )}
    </li>
  );
}
