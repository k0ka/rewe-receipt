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
                {data.data.articles.map(article => (
                    <Item variant="outline" key={article.id}>
                        <ItemContent>
                            <ItemTitle>{article.productName != '' ? article.productName : `Unknown product ${article.nan.toString()}`}</ItemTitle>
                            <ItemDescription>
                                €{article.price} x {article.quantity} =
                                €{Number(article.price) * Number(article.quantity)}
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <RouterButton
                                to="/articles/$articleId"
                                params={{'articleId': article.nan.toString()}}
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