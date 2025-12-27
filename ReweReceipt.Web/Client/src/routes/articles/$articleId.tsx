import {createFileRoute} from '@tanstack/react-router'
import {useGetApiV1ArticleId} from "@/api/endpoints/article.ts";
import ArticleCharts from "@/components/ArticleCharts.tsx";

export const Route = createFileRoute('/articles/$articleId')({
    component: Component,
})

function Component() {
    const {articleId} = Route.useParams();
    const {data, isSuccess} = useGetApiV1ArticleId(articleId);

    if (!isSuccess) {
        return <div>Loading...</div>;
    }

    const name = data.data.productName ? data.data.productName : `Unknown product ${articleId}`;
    return (
        <div className="p-2">
            <h3>Article {name}</h3>
            <div className="flex w-full max-w-md flex-col gap-6">
                {data.data.imageUrl != '' && (
                    <div>
                        <img src={data.data.imageUrl} alt={name} />
                    </div>
                )}
                <div>
                    Brought {data.data.purchases.reduce((cur, next) => cur + Number(next.quantity), 0)} units
                </div>
                <div>
                    Total spent €{data.data.purchases.reduce((cur, next) => cur + Number(next.price) * Number(next.quantity), 0).toFixed(2)}
                </div>
                <div>
                    <ArticleCharts purchases={data.data.purchases} />
                </div>
            </div>
        </div>
    )
}