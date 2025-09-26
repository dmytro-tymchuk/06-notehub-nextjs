import {useMutation, useQueryClient } from '@tanstack/react-query'
import type { Note } from '../../types/note'
import css from './NoteList.module.css'
import { deleteNote } from '../../lib/api'

interface NoteListProps{
    notes: Note[]
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();
  
  const handleDelete = (taskId: string) => {
    deleteMutation.mutate(taskId)
  }

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["task"]})
    }
  })

    return (
        <ul className={css.list}>
            {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button className={css.button} onClick={() => handleDelete(note.id)}>Delete</button>
          </div>
        </li>
      ))}
</ul>
    )
}

export default NoteList