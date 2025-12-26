import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import type {ReceiptBrief} from "@/api/schemas";
import {RouterButton} from "@/components/ui/router-button.tsx";

interface Props {
    receipt: ReceiptBrief
}

export default function ReceiptItem({receipt}: Props) {
    return (
        <Item variant="outline">
            <ItemContent>
                <ItemTitle>€{receipt.total} on {receipt.date}</ItemTitle>
                <ItemDescription>{receipt.market.street}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <RouterButton
                    to="/receipts/$receiptId"
                    params={{'receiptId': receipt.id}}
                    variant="outline"
                    size="sm"
                >
                    Open
                </RouterButton>
            </ItemActions>
        </Item>
    )
}