var baseUrl = "https://localhost:7173/api/auth/login"
let response = async (loginDetails) => {
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


// let completeUrl =    () => {
//     return `${baseUrl}`
// }

let emailCheck = async (email) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
