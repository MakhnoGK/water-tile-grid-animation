class ApiClient {
    private static _apiUrl = 'https://picsum.photos/v2';

    private static _credentials = {
        accessKey: '6rTySuniwlPhbO--XZmwo7yAtNVTu76nkNucsHJa0Kg',
        secretKey: '6sd_VSin-NgHD98aQZ7k4JIi_XZQCL8zk82RwacHCOY'
    };

    public static async get(url: string) {
        return await fetch(`${ApiClient._apiUrl}${url}`, {
            method: 'GET',
            headers: {
                Authorization: `Client-ID ${ApiClient._credentials.accessKey}`
            }
        });
    }
}

export default ApiClient;

