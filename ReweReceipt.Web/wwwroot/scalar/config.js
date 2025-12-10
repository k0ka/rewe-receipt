export default {
    onBeforeRequest: ({ request }) => {
        // Add XSRF header to all requests
        request.headers.set('X-XSRF-TOKEN', getCookieValue('XSRF-TOKEN'));
    }
}

function getCookieValue(name)
{
    const regex = new RegExp(`(^| )${name}=([^;]+)`)
    const match = document.cookie.match(regex)
    if (match) {
        return match[2]
    }
}
