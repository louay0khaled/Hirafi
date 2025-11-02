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
  // FIX: Changed bucket name. The "Bucket not found" error suggests a mismatch.
  // It's likely the bucket was created as 'craftsmen-images' following earlier examples,
  // without the '1.' prefix.
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
      // Use the full error object for better debugging in the console.
      console.error(`Error uploading file to ${path}:`, error);
      throw error;
    }

    if (data) {
        const { data: publicUrlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path);
      // Remove Supabase's 't' query parameter for a clean, permanent URL
      const url = new URL(publicUrlData.publicUrl);
      url.searchParams.delete('t');
      return url.toString();
    }
    return null;
  };

  const addCraftsman = async (formData: CraftsmanFormData) => {
    try {
      const newCraftsmanId = crypto.randomUUID();
      let avatar_url = '';
      let header_image_url = '';

      if (formData.avatarFile) {
        const fileExt = formData.avatarFile.name.split('.').pop();
        const avatarPath = `public/avatars/${newCraftsmanId}.${fileExt}`;
        avatar_url = await uploadFile(formData.avatarFile, avatarPath) ?? '';
      }

      if (formData.headerFile) {
        const fileExt = formData.headerFile.name.split('.').pop();
        const headerPath = `public/headers/${newCraftsmanId}.${fileExt}`;
        header_image_url = await uploadFile(formData.headerFile, headerPath) ?? '';
      }
      
      const portfolio_urls: string[] = [];
      if (formData.portfolioFiles && formData.portfolioFiles.length > 0) {
        for (const file of formData.portfolioFiles) {
          const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
          const portfolioPath = `public/portfolios/${newCraftsmanId}/${fileName}`;
          const url = await uploadFile(file, portfolioPath);
          if (url) portfolio_urls.push(url);
        }
      }

      const { avatarFile, headerFile, portfolioFiles, ...craftsmanData } = formData;
      
      const { error } = await supabase
        .from('craftsmen')
        .insert([{
          ...craftsmanData,
          id: newCraftsmanId,
          avatar_url,
          header_image_url,
          portfolio: portfolio_urls,
        }]);
      
      if (error) {
        console.error('Error adding craftsman:', error.message);
        throw error;
      }
      
      // **FIX:** Refetch all data to solve the schema cache issue and ensure UI consistency.
      await fetchCraftsmen(); 

    } catch (error) {
      // FIX: Improved error logging to avoid '[object Object]'.
      console.error('An error occurred in addCraftsman:', error instanceof Error ? error.message : error, error);
      throw error;
    }
  };

  const updateCraftsman = async (id: string, formData: CraftsmanFormData) => {
    try {
        let avatar_url = formData.avatar_url;
        let header_image_url = formData.header_image_url;

        if (formData.avatarFile) {
            const fileExt = formData.avatarFile.name.split('.').pop();
            const avatarPath = `public/avatars/${id}.${fileExt}`;
            avatar_url = await uploadFile(formData.avatarFile, avatarPath) ?? avatar_url;
        }

        if (formData.headerFile) {
            const fileExt = formData.headerFile.name.split('.').pop();
            const headerPath = `public/headers/${id}.${fileExt}`;
            header_image_url = await uploadFile(formData.headerFile, headerPath) ?? header_image_url;
        }
        
        let updatedPortfolio = [...formData.portfolio]; 
        if (formData.portfolioFiles && formData.portfolioFiles.length > 0) {
            for (const file of formData.portfolioFiles) {
              const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
              const portfolioPath = `public/portfolios/${id}/${fileName}`;
              const url = await uploadFile(file, portfolioPath);
              if (url) updatedPortfolio.push(url);
            }
        }

        const { avatarFile, headerFile, portfolioFiles, ...craftsmanData } = formData;

        const { error } = await supabase
            .from('craftsmen')
            .update({
                ...craftsmanData,
                avatar_url,
                header_image_url,
                portfolio: updatedPortfolio,
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating craftsman:', error);
            throw error;
        }

        // **FIX:** Refetch all data for robustness.
        await fetchCraftsmen();

    } catch (error) {
        // FIX: Improved error logging to avoid '[object Object]'.
        console.error('An error occurred in updateCraftsman:', error instanceof Error ? error.message : error, error);
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
        // **FIX:** Refetch for consistency.
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