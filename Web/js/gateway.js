var baseUrl = "https://localhost:7173/api/auth/login"
let response = async (loginDetails) => {
    const resp = await fetch(completeUrl(`${loginDetails.toString()}`), {
        method: "GET",

    });
    console.log('Request sent');
    if(resp.ok)
    {
        const data = await resp.json();
        console.log(`Login successful`, data);
        return data;
    }

    else if(resp.status === 404)
    {
        const errorData = await resp.json();
        console.log('User not found', errorData.message);
        return errorData;
    }
    else if(resp.status === 401)
    {
        console.log('Unauthorized: Incorrect password');
        return await resp.json();
    }
    else
    {
        console.log('Login failed with status:', resp.status);
    }
}


let completeUrl =  (url) => {
    return `${baseUrl}?${url}`
}

let emailCheck = async (email) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
}
