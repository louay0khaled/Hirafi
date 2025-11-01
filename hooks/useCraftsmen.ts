import { useState, useEffect } from 'react';
import { Craftsman } from '../types';
import { craftsmen as initialCraftsmen } from '../data/craftsmen';

const STORAGE_KEY = 'hirafi_craftsmen';

export const useCraftsmen = () => {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>(() => {
    try {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : initialCraftsmen;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return initialCraftsmen;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(craftsmen));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [craftsmen]);

  const addCraftsman = (newCraftsmanData: Omit<Craftsman, 'id' | 'rating' | 'reviews'> & { portfolio?: string[] }) => {
    const newCraftsman: Craftsman = {
      ...newCraftsmanData,
      id: Date.now().toString(),
      rating: 0, 
      reviews: 0,
      portfolio: newCraftsmanData.portfolio || [],
    };
    setCraftsmen(prev => [newCraftsman, ...prev]);
  };

  const updateCraftsman = (updatedCraftsman: Craftsman) => {
    setCraftsmen(prev => 
      prev.map(c => c.id === updatedCraftsman.id ? updatedCraftsman : c)
    );
  };

  const deleteCraftsman = (craftsmanId: string) => {
    setCraftsmen(prev => prev.filter(c => c.id !== craftsmanId));
  };

  const rateCraftsman = (craftsmanId: string, newRating: number) => {
    setCraftsmen(prev => 
      prev.map(c => {
        if (c.id === craftsmanId) {
          const totalRating = c.rating * c.reviews;
          const newReviews = c.reviews + 1;
          const newAverageRating = (totalRating + newRating) / newReviews;
          return { ...c, rating: newAverageRating, reviews: newReviews };
        }
        return c;
      })
    );
  };

  return { craftsmen, addCraftsman, updateCraftsman, deleteCraftsman, rateCraftsman };
};