import {createFileRoute} from '@tanstack/react-router'
import {useGetApiV1Post} from "@/api/endpoints/post.ts";
import PostItem from "@/components/PostItem.tsx";
import PostForm from "@/components/PostForm.tsx";

export const Route = createFileRoute('/posts')({
    component: PostsComponent,
})

function PostsComponent() {
    const {data, isSuccess} = useGetApiV1Post();

    if (!isSuccess) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-2">
            <h3>Posts</h3>
            <div className="flex w-full max-w-md flex-col gap-6">
                {data.data.map(post => (
                    <PostItem post={post} key={post.id}/>
                ))}
            </div>
            <PostForm />
        </div>
    )
}