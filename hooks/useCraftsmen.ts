

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
  const BUCKET_NAME = 'craftsmen-images';

  const fetchCraftsmen = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('craftsmen')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching craftsmen:', error);
    } else if (data) {
      setCraftsmen(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCraftsmen();
  }, [fetchCraftsmen]);

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading file to ${path}:`, JSON.stringify(error, null, 2));
      throw error;
    }

    if (data) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path);
      // By adding a timestamp, we can bust the cache when an image is updated.
      // Supabase storage URLs are immutable, so a new file at the same path might be served from cache.
      return `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
    }
    return null;
  };

  const addCraftsman = async (formData: CraftsmanFormData) => {
    try {
      const newCraftsmanId = crypto.randomUUID();
      let avatar_url = '';
      let header_image_url = '';

      if (formData.avatarFile) {
        const fileExt = formData.avatarFile.name.split('.').pop() || 'jpg';
        const avatarPath = `avatars/${newCraftsmanId}.${fileExt}`;
        avatar_url = await uploadFile(formData.avatarFile, avatarPath) ?? '';
      }

      if (formData.headerFile) {
        const fileExt = formData.headerFile.name.split('.').pop() || 'jpg';
        const headerPath = `headers/${newCraftsmanId}.${fileExt}`;
        header_image_url = await uploadFile(formData.headerFile, headerPath) ?? '';
      }
      
      const portfolio_urls: string[] = [];
      if (formData.portfolioFiles && formData.portfolioFiles.length > 0) {
        for (const file of formData.portfolioFiles) {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const portfolioPath = `portfolios/${newCraftsmanId}/${fileName}`;
          const url = await uploadFile(file, portfolioPath);
          if (url) portfolio_urls.push(url);
        }
      }

      // Normalize phone number before saving
      let normalizedPhone = formData.phone.replace(/\D/g, ''); // Remove all non-digit characters
      if (normalizedPhone.startsWith('0')) {
        normalizedPhone = normalizedPhone.substring(1); // Remove leading zero if present
      }

      // Explicitly construct the object to be inserted to avoid any ambiguity.
      const newCraftsmanData = {
          id: newCraftsmanId,
          name: formData.name,
          craft: formData.craft,
          governorate: formData.governorate,
          bio: formData.bio,
          phone: normalizedPhone,
          avatar_url,
          header_image_url,
          portfolio: portfolio_urls,
      };
      
      const { error } = await supabase
        .from('craftsmen')
        .insert(newCraftsmanData, { returning: 'minimal' });
      
      if (error) {
        console.error('Error adding craftsman:', error.message);
        throw error;
      }
      
      await fetchCraftsmen(); 

    } catch (error: any) {
      const message = error.message || JSON.stringify(error);
      console.error(`An error occurred in addCraftsman: ${message}`, error);
      throw error;
    }
  };

  const updateCraftsman = async (id: string, formData: CraftsmanFormData) => {
    try {
        let avatar_url = formData.avatar_url;
        let header_image_url = formData.header_image_url;

        if (formData.avatarFile) {
            const fileExt = formData.avatarFile.name.split('.').pop() || 'jpg';
            const avatarPath = `avatars/${id}.${fileExt}`;
            avatar_url = await uploadFile(formData.avatarFile, avatarPath) ?? avatar_url;
        }

        if (formData.headerFile) {
            const fileExt = formData.headerFile.name.split('.').pop() || 'jpg';
            const headerPath = `headers/${id}.${fileExt}`;
            header_image_url = await uploadFile(formData.headerFile, headerPath) ?? header_image_url;
        }
        
        let updatedPortfolio = [...formData.portfolio]; 
        if (formData.portfolioFiles && formData.portfolioFiles.length > 0) {
            for (const file of formData.portfolioFiles) {
              const fileExt = file.name.split('.').pop() || 'jpg';
              const fileName = `${crypto.randomUUID()}.${fileExt}`;
              const portfolioPath = `portfolios/${id}/${fileName}`;
              const url = await uploadFile(file, portfolioPath);
              if (url) updatedPortfolio.push(url);
            }
        }

        // Normalize phone number before saving
        let normalizedPhone = formData.phone.replace(/\D/g, ''); // Remove all non-digit characters
        if (normalizedPhone.startsWith('0')) {
          normalizedPhone = normalizedPhone.substring(1); // Remove leading zero if present
        }

        // Explicitly construct the object to be updated.
        const craftsmanUpdateData = {
          name: formData.name,
          craft: formData.craft,
          governorate: formData.governorate,
          bio: formData.bio,
          phone: normalizedPhone,
          avatar_url,
          header_image_url,
          portfolio: updatedPortfolio,
        };

        const { error } = await supabase
            .from('craftsmen')
            .update(craftsmanUpdateData, { returning: 'minimal' })
            .eq('id', id);

        if (error) {
            console.error('Error updating craftsman:', error);
            throw error;
        }

        await fetchCraftsmen();

    } catch (error: any) {
      const message = error.message || JSON.stringify(error);
      console.error(`An error occurred in updateCraftsman: ${message}`, error);
      throw error;
    }
  };

  const deleteCraftsman = async (id: string) => {
    // Note: This does not delete associated storage files.
    const { error } = await supabase
        .from('craftsmen')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting craftsman:', error);
    } else {
        await fetchCraftsmen();
    }
  };

  const rateCraftsman = async (id: string, newRating: number) => {
      const { error } = await supabase.rpc('rate_craftsman', {
          craftsman_id: id,
          new_rating: newRating,
      });

      if (error) {
          console.error('Error rating craftsman:', error);
      } else {
          // RPC updates data, so we must refetch to see the change.
          await fetchCraftsmen();
      }
  };

  return { craftsmen, loading, fetchCraftsmen, addCraftsman, updateCraftsman, deleteCraftsman, rateCraftsman };
};