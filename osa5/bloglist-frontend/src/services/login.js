import axios from 'axios'
const baseUrl = '/api/login'

const login = async ({username, password}) => {
    const requestBody = {
        username: username,
        password: password
    }
    console.log('Request body: ', requestBody)

    try{
        const request = await axios.post(baseUrl, requestBody)
        return request.data
    }
    catch (error) {
        console.log('Error: ', error)
        return null
    }
    
}

export default { login }