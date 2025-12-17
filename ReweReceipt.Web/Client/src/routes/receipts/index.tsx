import {createFileRoute} from '@tanstack/react-router'
import ReceiptItem from "@/components/ReceiptItem.tsx";
import {useGetApiV1Receipt} from "@/api/endpoints/receipt.ts";
import {RouterButton} from "@/components/ui/router-button.tsx";

const RECEIPTS_PER_PAGE = 50;

interface Search {
    offset: number
}

export const Route = createFileRoute('/receipts/')({
    component: Component,
    validateSearch: (search: Record<string, unknown>): Search => {
        return {
            offset: Number(search.offset ?? 0),
        }
    },
})

function Component() {
    const {offset} = Route.useSearch();
    const {data, isSuccess} = useGetApiV1Receipt({offset: offset});

    if (!isSuccess) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-2">
            <h3>Receipts</h3>
            <div className="flex w-full max-w-md flex-col gap-6">
                {data.data.map(receipt => (
                    <ReceiptItem receipt={receipt} key={receipt.id}/>
                ))}
            </div>
            {data.data.length >= RECEIPTS_PER_PAGE && (
                <div>
                    <RouterButton to="/receipts" search={{offset: offset + RECEIPTS_PER_PAGE}}>
                        Next page
                    </RouterButton>
                </div>
            ) }
        </div>
    )
}