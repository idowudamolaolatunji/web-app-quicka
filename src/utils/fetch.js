
const BASE_API_URL = import.meta.env.VITE_API_URL


export async function selectCustomer(id, headers, customer) {
    const res = await fetch(`${BASE_API_URL}/orders/customer/${id}`, {
        method: "PATCH", headers,
        body: JSON.stringify({ customer }),
    });
        
    const data = await res.json();
    return data.status;
}