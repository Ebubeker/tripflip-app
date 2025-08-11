import axios from 'axios';

interface RecommendationParams {
  destination_city: string,
  destination_country: string,
  budget: number,
  dates_start: Date,
  dates_end: Date,
  current_city: string,
  current_country: string,
  travel_style: string,
  travel_interests: string,
  passengers?: {
    adults: number,
    children: number,
    infants: number,
  },
  class?: string,
}

export const fetchRecommendations = async (params: RecommendationParams): Promise<any> => { 
  console.log("params", params)
  const options = {
    method: 'POST',
    url: 'https://travelio-nju8.onrender.com/user-details',
    data: params,
  };

  try{
    const response = await axios.request(options);

    return response
  }catch (error) {
    console.log("Error fetching recommendations:", error);
  }

}

export const fetchFlights = async (params: RecommendationParams): Promise<any> => {
  const options = {
    method: 'POST',
    url: 'https://travelio-nju8.onrender.com/flights',
    data: params,
  };

  try{
    const response = await axios.request(options);

    return response
  }catch (error) {
    console.log("Error fetching flights:", error);
  }
}

export const fetchStays = async (params: RecommendationParams): Promise<any> => {
  const options = {
    method: 'POST',
    url: 'https://travelio-nju8.onrender.com/stays',
    data: params,
  };

  try{
    const response = await axios.request(options);

    return response
  }catch (error) {
    console.log("Error fetching stays:", error);
  }
}