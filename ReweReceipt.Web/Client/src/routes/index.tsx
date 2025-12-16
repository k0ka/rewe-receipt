import { createFileRoute } from '@tanstack/react-router'
import {useGetApiV1Fetch, usePostApiV1Fetch} from "@/api/endpoints/fetch.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

export const Route = createFileRoute('/')({
    component: Component,
})

function Component() {
    const {data, isSuccess, refetch, isRefetching} = useGetApiV1Fetch();
    const {mutateAsync, isPending} = usePostApiV1Fetch();
    const [cookie, setCookie] = useState('');
    
    useEffect(() => {
        if (!data?.data.isFetching) {
            return;
        }
        
        const timer = setTimeout(() => refetch(), 1000);
        return () => clearTimeout(timer);
    }, [data, refetch])
    
    if (!isSuccess) {
        return <div>Loading...</div>;
    }
    
    const handleFetch = async () => {
        await mutateAsync({params: {cookie}});
        setCookie('');
        
        await refetch();
    }
    
    const isLoading = isRefetching || isPending || data.data.isFetching;
    
    return (
        <div className="p-2">
            <h3>Fetch receipts</h3>
            {data.data.isFetching && (
                <Alert>
                    <Spinner />
                    <AlertTitle>Fetching receipts</AlertTitle>
                </Alert>
            )}
            {data.data.lastError !== null && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{data.data.lastError}</AlertDescription>
                </Alert>
            )}
            <div>
                Fetched receipts: {data.data.receiptsCount}
            </div>
            <div>
                Fetched articles: {data.data.articlesCount}
            </div>
            <div className="w-full max-w-md">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="post-title">
                            RSTP Cookie
                        </FieldLabel>
                        <Textarea
                            id="fetch-cookie"
                            required
                            value={cookie}
                            onChange={e => setCookie(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Button type="submit" onClick={handleFetch} disabled={isLoading}>
                            Fetch
                        </Button>
                    </Field>
                </FieldGroup>
            </div>
        </div>
    )
}