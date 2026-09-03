import axios from 'axios';

/**
 * Fetches an Inertia page's props via plain XHR (not the Inertia router),
 * so the current page component never unmounts — used to preload data for
 * an edit modal without navigating away from the list page.
 *
 * `version` must match the current asset version (from `usePage().version`)
 * or the server responds 409 — its normal signal to force a hard reload
 * after a deploy — even though nothing is actually stale here.
 */
export async function fetchInertiaProps<T>(url: string, version: string | null): Promise<T> {
    const { data } = await axios.get(url, {
        headers: {
            'X-Inertia': 'true',
            'X-Inertia-Version': version ?? '',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });

    return data.props as T;
}
