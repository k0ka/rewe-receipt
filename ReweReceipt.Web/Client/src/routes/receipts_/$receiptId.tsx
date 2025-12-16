import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/receipts_/$receiptId')({
    component: Component,
})

function Component() {
    const { receiptId } = Route.useParams();

    return (
        <div className="p-2">
            <h3>Receipt {receiptId}</h3>
            <div className="flex w-full max-w-md flex-col gap-6">
                
            </div>
        </div>
    )
}