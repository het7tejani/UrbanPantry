const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
    // Try to parse the response as JSON, but fall back to text if it fails
    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (err) {
        data = text; // The response was not JSON
    }

    if (!response.ok) {
        // If the parsed data is an object with a message, use it.
        // Otherwise, use the raw text response as the error message.
        const message = (data && data.message) ? data.message : text;
        throw new Error(message || 'Something went wrong');
    }
    
    return data;
};

const getAuthHeader = (token, contentType = 'application/json') => {
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (contentType) {
        headers['Content-Type'] = contentType;
    }
    return headers;
}

// Product APIs
export const fetchProducts = async (category = '', featured = false, limit = 0, sort = '', filters = {}) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    if (limit > 0) params.append('limit', limit);
    if (sort) params.append('sort', sort);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.rating) params.append('rating', filters.rating);

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    return handleResponse(response);
};

export const fetchProductById = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    return handleResponse(response);
};

export const searchProducts = async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.rating) params.append('rating', filters.rating);
    
    const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
    return handleResponse(response);
};

export const createProduct = async (productData, token) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(productData),
    });
    return handleResponse(response);
};

export const updateProduct = async (productId, productData, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(productData),
    });
    return handleResponse(response);
};

export const deleteProduct = async (productId, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
    });
    return handleResponse(response);
};

// Review APIs
export const fetchReviewsForProduct = async (productId) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
    return handleResponse(response);
};

export const createReview = async (productId, reviewData, token) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
};

// Category API
export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
};

// Testimonial API
export const fetchTestimonials = async () => {
    const response = await fetch(`${API_BASE_URL}/testimonials`);
    return handleResponse(response);
};

export const createTestimonial = async (testimonialData, token) => {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(testimonialData),
    });
    return handleResponse(response);
};

export const updateTestimonial = async (testimonialId, testimonialData, token) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(testimonialData),
    });
    return handleResponse(response);
};

export const deleteTestimonial = async (testimonialId, token) => {
    const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
    });
    return handleResponse(response);
};

// Look APIs
export const fetchLooks = async () => {
    const response = await fetch(`${API_BASE_URL}/looks`);
    return handleResponse(response);
};

export const fetchLookById = async (lookId) => {
    const response = await fetch(`${API_BASE_URL}/looks/${lookId}`);
    return handleResponse(response);
};

export const createLook = async (lookData, token) => {
    const response = await fetch(`${API_BASE_URL}/looks`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify(lookData),
    });
    return handleResponse(response);
};

export const updateLook = async (lookId, lookData, token) => {
    const response = await fetch(`${API_BASE_URL}/looks/${lookId}`, {
        method: 'PUT',
        headers: getAuthHeader(token),
        body: JSON.stringify(lookData),
    });
    return handleResponse(response);
};

export const deleteLook = async (lookId, token) => {
    const response = await fetch(`${API_BASE_URL}/looks/${lookId}`, {
        method: 'DELETE',
        headers: getAuthHeader(token),
    });
    return handleResponse(response);
};


// Auth APIs
export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

// Chatbot API
export const askChatbot = async (message, history) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, history }),
    });
    return handleResponse(response);
};

// Wishlist APIs
export const fetchWishlist = async (token) => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: getAuthHeader(token, null), // No content-type for GET
    });
    return handleResponse(response);
};

export const addToWishlist = async (productId, token) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify({ productId }),
    });
    return handleResponse(response);
};

export const removeFromWishlist = async (productId, token) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
        method: 'POST',
        headers: getAuthHeader(token),
        body: JSON.stringify({ productId }),
    });
    return handleResponse(response);
};