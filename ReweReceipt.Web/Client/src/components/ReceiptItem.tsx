import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import type {ReceiptBrief} from "@/api/schemas";
import {Button} from "@/components/ui/button.tsx";

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
                <Button variant="outline" size="sm">
                    Open
                </Button>
            </ItemActions>
        </Item>
    )
}