import NoteDetail from "./noteDetail"

export default  function Page({ params }) {
  return <NoteDetail noteId={params.id} />
}