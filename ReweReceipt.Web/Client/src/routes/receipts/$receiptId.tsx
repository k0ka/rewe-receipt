import {createFileRoute} from '@tanstack/react-router'
import {useGetApiV1ReceiptId} from "@/api/endpoints/receipt.ts";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import {RouterButton} from "@/components/ui/router-button.tsx";

export const Route = createFileRoute('/receipts/$receiptId')({
    component: Component,
})

function Component() {
    const {receiptId} = Route.useParams();
    const {data, isSuccess} = useGetApiV1ReceiptId(receiptId);

    if (!isSuccess) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-2">
            <h3>Receipt {receiptId}</h3>
            <div className="flex w-full max-w-md flex-col gap-6">
                <div>€{data.data.total} on {data.data.date}</div>
                <div>{data.data.market.zipCode} {data.data.market.city} {data.data.market.street}</div>
                {data.data.lines.map(line => (
                    <Item variant="outline" key={line.id}>
                        <ItemContent>
                            <ItemTitle>{line.productName}</ItemTitle>
                            <ItemDescription>
                                €{line.price} x {line.quantity} =
                                €{Number(line.price) * Number(line.quantity)}
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <RouterButton
                                to="/articles/$articleId"
                                params={{'articleId': line.id}}
                                variant="outline"
                                size="sm"
                            >
                                Open
                            </RouterButton>
                        </ItemActions>
                    </Item>
                ))}
            </div>
        </div>
    )
}