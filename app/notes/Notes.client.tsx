
'use client';

import css from '../page.module.css';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes, type NoteResponse } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';


type Props = {
  initialPage: number;
  initialSearchValue: string;
};

export default function NotesClient({ initialPage, initialSearchValue }: Props) {
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
 
  const { data } = useQuery<NoteResponse>({
    queryKey: ['task', page, searchValue],
    queryFn: () => fetchNotes(page, searchValue),
    placeholderData: keepPreviousData,
      refetchOnMount: false,
    
  });

  const totalPages = data?.totalPages ?? 0;

  
  const handleChange = useDebouncedCallback((val: string) => {
    setSearchValue(val);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchValue={searchValue} onChange={handleChange} />

        {totalPages > 1 && (
          <Pagination onChange={setPage} totalPages={totalPages} currentPage={page} />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal onRequestClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </header>

      <NoteList notes={data?.notes ?? []} />
    </div>
  );
}
