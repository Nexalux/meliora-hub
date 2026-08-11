import { API_URL } from "./config";

export const AUTH_EXPIRED_EVENT = "mh:auth-expired";

/*
|--------------------------------------------------------------------------
| JWT Token
|--------------------------------------------------------------------------
*/

function getToken() {
    return localStorage.getItem("mh_token");
}

/*
|--------------------------------------------------------------------------
| API Client
|--------------------------------------------------------------------------
*/

async function request(endpoint, options = {}) {
    const {
        auth = true,
        baseUrl = API_URL,
        headers: customHeaders,
        ...fetchOptions
    } = options;

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(customHeaders || {}),
    };

    if (auth && token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    let data = null;

    try {
        data = await response.json();
    } catch {
        // Ignore non-JSON responses
    }

    if (!response.ok) {
        const isJwtError =
            typeof data?.code === "string" &&
            data.code.startsWith("jwt_auth_");

        if (
            auth &&
            token &&
            (response.status === 401 || isJwtError)
        ) {
            localStorage.removeItem("mh_token");
            localStorage.removeItem("mh_user");
            globalThis.dispatchEvent(
                new Event(AUTH_EXPIRED_EVENT)
            );
        }

        const error = new Error(
            data?.message || "Something went wrong."
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}

/*
|--------------------------------------------------------------------------
| HTTP Methods
|--------------------------------------------------------------------------
*/

const api = {

    get(endpoint, options = {}) {
        return request(endpoint, options);
    },

    post(endpoint, body = {}, options = {}) {
        return request(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        });
    },

    put(endpoint, body = {}, options = {}) {
        return request(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        });
    },

    delete(endpoint, options = {}) {
        return request(endpoint, {
            ...options,
            method: "DELETE",
        });
    },

};

export default api;
