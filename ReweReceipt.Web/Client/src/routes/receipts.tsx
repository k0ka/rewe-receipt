import {createFileRoute} from '@tanstack/react-router'
import ReceiptItem from "@/components/ReceiptItem.tsx";
import {useGetApiV1Receipt} from "@/api/endpoints/receipt.ts";

export const Route = createFileRoute('/receipts')({
    component: Component,
})

function Component() {
    const {data, isSuccess} = useGetApiV1Receipt();

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
        </div>
    )
}