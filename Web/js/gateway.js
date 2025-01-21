export async function response(loginDetails){
    const baseUrl = "https://localhost:7173/api/auth/login"

    const resp = await fetch(baseUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body : JSON.stringify({
            email: loginDetails.email,
            password: loginDetails.password
        }),

    });
    return resp;
}

export async function emailCheck(){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}

export async function registration (registrationDetails) {
    const response = await fetch("https://localhost:7173/api/auth/register", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationDetails),
    });
    if (!response.ok) {
        const error = await response.json();  // Parse the response
        return { status: false, error }
    }

    const data = await response.json();
    return { status: true, data };
}
