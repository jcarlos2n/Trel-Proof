// import { useFetcher } from "@remix-run/react";

// export default function Board({
//     name,
//     id,
//     color,
//   }: {
//     name: string;
//     id: number;
//     color: string;
//   }) {
//     let fetcher = useFetcher();
//     let isDeleting = fetcher.state !== "idle";
//     return isDeleting ? null : (
//       <Link
//         to={`/board/${id}`}
//         className="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
//         style={{ borderColor: color }}
//       >
//         <div className="font-bold">{name}</div>
//         <fetcher.Form method="post">
//           <input type="hidden" name="intent" value={INTENTS.deleteBoard} />
//           <input type="hidden" name="boardId" value={id} />
//           <button
//             aria-label="Delete board"
//             className="absolute top-4 right-4 hover:text-brand-red"
//             type="submit"
//             onClick={(event) => {
//               event.stopPropagation();
//             }}
//           >
//             <Icon name="trash" />
//           </button>
//         </fetcher.Form>
//       </Link>
//     );
//   }