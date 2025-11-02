import { useState, useEffect, useCallback } from 'react';
import { Craftsman } from '../types';
import { craftsmen as initialCraftsmen } from '../data/craftsmen';

// This is the form data, which can include File objects for new uploads
// It also includes existing URLs for editing.
export type CraftsmanFormData = Omit<Craftsman, 'id' | 'rating' | 'reviews'> & {
  avatarFile?: File;
  headerFile?: File;
  portfolioFiles?: File[];
};

export const useCraftsmen = () => {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCraftsmen = useCallback(async () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Create a copy to avoid modifying the original data from the import
      setCraftsmen(JSON.parse(JSON.stringify(initialCraftsmen)));
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchCraftsmen();
  }, [fetchCraftsmen]);

  const addCraftsman = async (formData: CraftsmanFormData) => {
    const newCraftsman: Craftsman = {
      id: crypto.randomUUID(),
      name: formData.name,
      craft: formData.craft,
      governorate: formData.governorate,
      bio: formData.bio,
      phone: formData.phone.replace(/\D/g, ''),
      avatar_url: formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : '',
      header_image_url: formData.headerFile ? URL.createObjectURL(formData.headerFile) : '',
      portfolio: formData.portfolioFiles ? formData.portfolioFiles.map(f => URL.createObjectURL(f)) : [],
      rating: 0,
      reviews: 0,
    };
    setCraftsmen(prev => [newCraftsman, ...prev]);
  };
  
  const updateCraftsman = async (id: string, formData: CraftsmanFormData) => {
    setCraftsmen(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          name: formData.name,
          craft: formData.craft,
          governorate: formData.governorate,
          bio: formData.bio,
          phone: formData.phone.replace(/\D/g, ''),
          avatar_url: formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : formData.avatar_url,
          header_image_url: formData.headerFile ? URL.createObjectURL(formData.headerFile) : formData.header_image_url,
          portfolio: [
            ...formData.portfolio, // Existing URLs from form state
            ...(formData.portfolioFiles ? formData.portfolioFiles.map(f => URL.createObjectURL(f)) : []) // New blob URLs
          ]
        };
      }
      return c;
    }));
  };

  const deleteCraftsman = async (id: string) => {
    setCraftsmen(prev => prev.filter(c => c.id !== id));
  };
  
  const rateCraftsman = async (id: string, newRating: number) => {
    setCraftsmen(prev => prev.map(c => {
      if (c.id === id) {
        const totalRating = c.rating * c.reviews;
        const newReviews = c.reviews + 1;
        const newAverageRating = (totalRating + newRating) / newReviews;
        // FIX: The result of toFixed(1) is a string. It must be converted back to a number to match the Craftsman type.
        return { ...c, rating: parseFloat(newAverageRating.toFixed(1)), reviews: newReviews };
      }
      return c;
    }));
  };

  return { craftsmen, loading, fetchCraftsmen, addCraftsman, updateCraftsman, deleteCraftsman, rateCraftsman };
};