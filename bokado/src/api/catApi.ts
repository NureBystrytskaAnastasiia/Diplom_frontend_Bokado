export interface CatResponse {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

export const fetchRandomCat = async (): Promise<CatResponse> => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data[0]; 
  } catch (error) {
    console.error('Failed to fetch cat:', error);
    return {
      id: 'fallback',
      url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
      width: 1200,
      height: 800
    };
  }
};