import {createFileRoute} from '@tanstack/react-router'
import {RouterButton} from "@/components/ui/router-button.tsx";
import {useGetApiV1Article} from "@/api/endpoints/article.ts";
import ArticleItem from "@/components/ArticleItem.tsx";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {useState} from "react";
import {Input} from "@/components/ui/input.tsx";

const ARTICLES_PER_PAGE = 50;

interface Search {
    offset?: number
    query?: string
}

export const Route = createFileRoute('/articles/')({
    component: Component,
    validateSearch: (search: Record<string, unknown>): Search => {
        return {
            offset: search.offset ? Number(search.offset) : undefined,
            query: search.query as string,
        }
    },
})

function Component() {
    const {offset, query} = Route.useSearch();
    const {data, isSuccess} = useGetApiV1Article({offset: offset, query: query});
    const [filter, setFilter] = useState(query ?? '');

    if (!isSuccess) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-2">
            <h3>Articles</h3>
            <div className="flex w-full max-w-md flex-col gap-6">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="article-query">
                            Filter by
                        </FieldLabel>
                        <Input
                            id="article-query"
                            required
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <RouterButton to="/articles" search={{query: filter}}>
                            Filter
                        </RouterButton>
                    </Field>
                </FieldGroup>
            </div>
            <div className="flex w-full max-w-md flex-col gap-6">
                {data.data.map(article => (
                    <ArticleItem article={article} key={article.id}/>
                ))}
            </div>
            {data.data.length >= ARTICLES_PER_PAGE && (
                <div>
                    <RouterButton to="/articles" search={{offset: (offset ?? 0) + ARTICLES_PER_PAGE}}>
                        Next page
                    </RouterButton>
                </div>
            ) }
        </div>
    )
}