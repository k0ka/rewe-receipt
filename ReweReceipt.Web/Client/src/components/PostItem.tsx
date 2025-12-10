import {useDeleteApiV1PostId, useGetApiV1Post} from "@/api/endpoints/post.ts";
import {Item, ItemActions, ItemContent, ItemDescription, ItemTitle} from "@/components/ui/item.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Post} from "@/api/schemas";
import {Spinner} from "@/components/ui/spinner.tsx";

interface Props {
    post: Post
}

export default function PostItem({post}: Props) {
    const {refetch} = useGetApiV1Post();
    const {mutateAsync, isPending} = useDeleteApiV1PostId();

    const onDelete = async (id: string) => {
        await mutateAsync({id});
        await refetch();
    }

    return (
        <Item variant="outline">
            <ItemContent>
                <ItemTitle>{post.title}</ItemTitle>
                <ItemDescription>{post.content}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button variant="destructive" disabled={isPending} onClick={() => onDelete(post.id)}>
                    {isPending && <Spinner />}
                    Delete
                </Button>
            </ItemActions>
        </Item>
    )
}