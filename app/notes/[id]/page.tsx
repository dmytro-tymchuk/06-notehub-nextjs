import { fetchNoteById } from "@/lib/api";
import css from '../../NoteDetails.module.css'
import NoteDetailsClient from "./NoteDetails.client";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
interface DetailsProps{
    params: Promise<{id: string}>
}

const Details = async ({ params }: DetailsProps) => {
    const {id} = await params
    const note = await fetchNoteById(id)
    
    const queryClient = new QueryClient()
    await queryClient.prefetchQuery({
        queryKey: ['task', id],
        queryFn: () => fetchNoteById(id)
    })
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NoteDetailsClient />
        </HydrationBoundary>
    )
}

export default Details