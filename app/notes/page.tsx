import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import css from '../page.module.css';

type PageProps = {
  searchParams?: { page?: string; searchValue?: string };
};

export default async function Notes({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp?.page ?? 1);
  const searchValue = sp?.searchValue ?? '';


  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['task', page, searchValue],
    queryFn: () => fetchNotes(page, searchValue),
  });

  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NotesClient initialPage={page} initialSearchValue={searchValue} />
        </HydrationBoundary>
      </header>
    </div>
  );
}
