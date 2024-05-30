import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_HOST = import.meta.env.VITE_API_HOST;
const BASE_URL = `https://${API_HOST}/v1/`;

const headers = {
    "X-Front-App-Name": "Telegram View React"
};

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            headers
        });
    }

    private handleResponse<T>(response: AxiosResponse<T>): T {
        return response.data;
    }

    private handleError(error: unknown): undefined {
        console.error('API call error:', error);
        return undefined;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T | undefined> {
        try {
            const response = await this.axiosInstance.get<T>(url, config);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    public async post<T>(url: string, data: object): Promise<T | undefined> {
        try {
            const response = await this.axiosInstance.post<T>(url, data);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }
}

const apiService = new ApiService();
export default apiService;
