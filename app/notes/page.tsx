import { keepPreviousData, useQuery } from '@tanstack/react-query'
import NoteList from '../../components/NoteList/NoteList'
import css from '../page.module.css'
import { fetchNotes, type NoteResponse } from '../../lib/api'
import {useState } from 'react'
import Modal from '../../components/Modal/Modal'
import SearchBox from '../../components/SearchBox/SearchBox'
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '../../components/Pagination/Pagination'
import NoteForm from '../../components/NoteForm/NoteForm'
import NoteClient from './Notes.client'


const Notes = () => {
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    

    const { data } = useQuery<NoteResponse>({
        queryKey: ["task", page, searchValue],
        queryFn: () => fetchNotes(page, searchValue),
        placeholderData: keepPreviousData
        
    });
    const totalPages = data?.totalPages ?? 0;
    
    const handleClick = () => {
        setIsModalOpen(true)
    }

    const handleCLose = () => {
        setIsModalOpen(false)
    }

    const handleChange = useDebouncedCallback((val: string) => {
        setSearchValue(val)
        setPage(1);
    }, 1000)

        return (<div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox searchValue={searchValue} onChange={handleChange} />
                {totalPages > 1 && <Pagination onChange={setPage} totalPages={totalPages} currentPage={page} />}
                <button className={css.button} onClick={handleClick}>Create note +</button>
                {isModalOpen && (
                    <Modal onRequestClose={handleCLose}>
                        <NoteForm onClose={handleCLose} />
                    </Modal>
                )}
            </header>
            <NoteList notes={data?.notes ?? []} />
            <NoteClient />
        </div>
        )
    
}
export default Notes