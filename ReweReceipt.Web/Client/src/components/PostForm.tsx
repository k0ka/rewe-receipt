import {Field, FieldGroup, FieldLabel} from "./ui/field";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useGetApiV1Post, usePostApiV1Post} from "@/api/endpoints/post.ts";
import {Spinner} from "@/components/ui/spinner.tsx";


export default function PostForm() {
    const {refetch} = useGetApiV1Post();
    const {mutateAsync, isPending} = usePostApiV1Post();
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleSubmit = async () => {
        await mutateAsync({params: {title, content}});
        setTitle('');
        setContent('');
        await refetch();
    }

    const handleCancel = () => {
        setTitle('');
        setContent('');
    }

    return (
        <div className="w-full max-w-md">
            <h3 className="my-2">Create new</h3>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="post-title">
                        Title
                    </FieldLabel>
                    <Input
                        id="post-title"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="post-content">
                        Content
                    </FieldLabel>
                    <Textarea
                        id="post-content"
                        required
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                </Field>
                <Field>
                    <Button type="submit" onClick={handleSubmit} disabled={isPending}>
                        {isPending && <Spinner />}
                        Submit
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isPending}>Cancel</Button>
                </Field>
            </FieldGroup>
        </div>
    )
}