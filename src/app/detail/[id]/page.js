import NoteDetail from "./noteDetail"

export default async function Page({ params }) {

  const { id } = await params;

  return <NoteDetail noteId={id} />;
}
