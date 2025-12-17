import {createFileRoute} from '@tanstack/react-router'
import {useGetApiV1ReceiptId} from "@/api/endpoints/receipt.ts";
import {Item, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";

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
                {data.data.articles.map(article => (
                    <Item variant="outline" key={article.id}>
                        <ItemContent>
                            <ItemTitle>{article.productName != '' ? article.productName : `Nan ${article.nan}`}</ItemTitle>
                            <ItemDescription>
                                €{article.price} x {article.quantity} =
                                €{Number(article.price) * Number(article.quantity)}
                            </ItemDescription>
                        </ItemContent>
                    </Item>
                ))}
            </div>
        </div>
    )
}