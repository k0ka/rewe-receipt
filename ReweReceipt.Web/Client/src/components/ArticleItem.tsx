import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import type {ArticleBrief} from "@/api/schemas";
import {RouterButton} from "@/components/ui/router-button.tsx";

interface Props {
    article: ArticleBrief
}

export default function ArticleItem({article}: Props) {
    return (
        <Item variant="outline">
            <ItemContent>
                <ItemTitle>{article.productName}</ItemTitle>
                <ItemDescription>
                    {article.imageUrl != '' && (
                        <div>
                            <img src={article.imageUrl} alt={article.productName}/>
                        </div>
                    )}
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <RouterButton
                    to="/articles/$articleId"
                    params={{'articleId': article.id}}
                    variant="outline"
                    size="sm"
                >
                    Open
                </RouterButton>
            </ItemActions>
        </Item>
    )
}