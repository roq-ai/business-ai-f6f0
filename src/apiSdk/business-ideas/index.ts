import axios from 'axios';
import queryString from 'query-string';
import { BusinessIdeaInterface, BusinessIdeaGetQueryInterface } from 'interfaces/business-idea';
import { GetQueryInterface } from '../../interfaces';

export const getBusinessIdeas = async (query?: BusinessIdeaGetQueryInterface) => {
  const response = await axios.get(`/api/business-ideas${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBusinessIdea = async (businessIdea: BusinessIdeaInterface) => {
  const response = await axios.post('/api/business-ideas', businessIdea);
  return response.data;
};

export const updateBusinessIdeaById = async (id: string, businessIdea: BusinessIdeaInterface) => {
  const response = await axios.put(`/api/business-ideas/${id}`, businessIdea);
  return response.data;
};

export const getBusinessIdeaById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/business-ideas/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBusinessIdeaById = async (id: string) => {
  const response = await axios.delete(`/api/business-ideas/${id}`);
  return response.data;
};
