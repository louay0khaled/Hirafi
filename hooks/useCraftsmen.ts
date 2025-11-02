import { useState, useEffect, useCallback } from 'react';
import { Craftsman } from '../types';
import { supabase } from '../lib/supabaseClient';

// Type for form data which can include File objects for new uploads
export type CraftsmanFormData = Omit<Craftsman, 'id' | 'rating' | 'reviews' | 'avatar_url' | 'header_image_url' | 'portfolio'> & {
  avatarFile?: File;
  headerFile?: File;
  portfolioFiles?: File[];
  // These are still needed for existing image URLs during editing
  avatar_url: string;
  header_image_url: string;
  portfolio: string[];
};

export const useCraftsmen = () => {
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCraftsmen = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('craftsmen')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching craftsmen:', error.message);
    } else {
      setCraftsmen(data as Craftsman[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCraftsmen();
  }, [fetchCraftsmen]);

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite file if it exists
    });
    if (error) {
      console.error(`Error uploading file to ${path}:`, error.message);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return publicUrl;
  };

  const addCraftsman = async (formData: CraftsmanFormData) => {
    const craftsmanId = crypto.randomUUID();
    let avatarUrl = '';
    let headerImageUrl = '';
    const portfolioUrls: string[] = [];
  
    if (formData.avatarFile) {
      avatarUrl = await uploadFile(formData.avatarFile, 'craftsmen-images', `public/avatars/${craftsmanId}`) || '';
    }
    if (formData.headerFile) {
      headerImageUrl = await uploadFile(formData.headerFile, 'craftsmen-images', `public/headers/${craftsmanId}`) || '';
    }
    if (formData.portfolioFiles && formData.portfolioFiles.length > 0) {
      for (const file of formData.portfolioFiles) {
        const url = await uploadFile(file, 'craftsmen-images', `public/portfolio/${craftsmanId}/${file.name}`);
        if (url) portfolioUrls.push(url);
      }
    }

    const newCraftsmanData = {
      id: craftsmanId,
      name: formData.name,
      craft: formData.craft,
      governorate: formData.governorate,
      bio: formData.bio,
      phone: formData.phone,
      avatar_url: avatarUrl,
      header_image_url: headerImageUrl,
      portfolio: portfolioUrls,
      rating: 0,
      reviews: 0,
    };
    
    const { data, error } = await supabase.from('craftsmen').insert([newCraftsmanData]).select();
    
    if (error) {
      console.error('Error adding craftsman:', error.message);
    } else if (data) {
      setCraftsmen(prev => [data[0] as Craftsman, ...prev]);
    }
  };

  const updateCraftsman = async (craftsmanId: string, formData: CraftsmanFormData) => {
      let { avatar_url, header_image_url, portfolio } = formData;
  
      if (formData.avatarFile) {
        avatar_url = await uploadFile(formData.avatarFile, 'craftsmen-images', `public/avatars/${craftsmanId}`) || formData.avatar_url;
      }
      if (formData.headerFile) {
        header_image_url = await uploadFile(formData.headerFile, 'craftsmen-images', `public/headers/${craftsmanId}`) || formData.header_image_url;
      }
      
      const newPortfolioUrls: string[] = [];
      if (formData.portfolioFiles && formData.portfolioFiles.length > 0) {
        for (const file of formData.portfolioFiles) {
          const url = await uploadFile(file, 'craftsmen-images', `public/portfolio/${craftsmanId}/${file.name}`);
          if (url) newPortfolioUrls.push(url);
        }
      }

      const updatedData = {
        name: formData.name,
        craft: formData.craft,
        governorate: formData.governorate,
        bio: formData.bio,
        phone: formData.phone,
        avatar_url,
        header_image_url,
        portfolio: [...portfolio, ...newPortfolioUrls] // Combine old and new portfolio images
      };

      const { data, error } = await supabase.from('craftsmen').update(updatedData).eq('id', craftsmanId).select();

      if (error) {
        console.error('Error updating craftsman:', error.message);
      } else if (data) {
        setCraftsmen(prev => prev.map(c => c.id === craftsmanId ? data[0] as Craftsman : c));
      }
  };


  const deleteCraftsman = async (craftsmanId: string) => {
    // Note: Deleting files from storage can be added here if needed
    const { error } = await supabase.from('craftsmen').delete().eq('id', craftsmanId);
    if (error) {
      console.error('Error deleting craftsman:', error.message);
    } else {
      setCraftsmen(prev => prev.filter(c => c.id !== craftsmanId));
    }
  };

  const rateCraftsman = async (craftsmanId: string, newRating: number) => {
    const craftsman = craftsmen.find(c => c.id === craftsmanId);
    if (!craftsman) return;

    const totalRating = craftsman.rating * craftsman.reviews;
    const newReviews = craftsman.reviews + 1;
    const newAverageRating = (totalRating + newRating) / newReviews;

    const { error } = await supabase
      .from('craftsmen')
      .update({ rating: newAverageRating, reviews: newReviews })
      .eq('id', craftsmanId);
      
    if (error) {
      console.error('Error rating craftsman:', error.message);
    } else {
      fetchCraftsmen(); // Re-fetch to get the most accurate data
    }
  };

  return { craftsmen, loading, addCraftsman, updateCraftsman, deleteCraftsman, rateCraftsman };
};