import { supabase } from './supabaseClient';

const BUCKET_NAME = 'craftsmen-images';

export const deleteAllStorageFiles = async (): Promise<{ success: boolean, error?: Error }> => {
  try {
    const allPaths: string[] = [];

    // 1. List files in avatars
    const { data: avatarFiles, error: avatarError } = await supabase.storage.from(BUCKET_NAME).list('avatars');
    if (avatarError) throw avatarError;
    if (avatarFiles) {
      allPaths.push(...avatarFiles.map(file => `avatars/${file.name}`));
    }

    // 2. List files in headers
    const { data: headerFiles, error: headerError } = await supabase.storage.from(BUCKET_NAME).list('headers');
    if (headerError) throw headerError;
    if (headerFiles) {
      allPaths.push(...headerFiles.map(file => `headers/${file.name}`));
    }

    // 3. List folders in portfolios and then files inside them
    const { data: portfolioFolders, error: portfolioFolderError } = await supabase.storage.from(BUCKET_NAME).list('portfolios', {
        limit: 1000 // Increase limit to fetch more folders if needed
    });
    if (portfolioFolderError) throw portfolioFolderError;

    if (portfolioFolders) {
        for (const folder of portfolioFolders) {
            // Folders are returned with id: null. We only want to process folders.
            if (folder.id === null) {
                const { data: portfolioFiles, error: portfolioFilesError } = await supabase.storage.from(BUCKET_NAME).list(`portfolios/${folder.name}`);
                if (portfolioFilesError) {
                    console.warn(`Could not list files in ${folder.name}:`, portfolioFilesError);
                    continue;
                }

                if (portfolioFiles) {
                    allPaths.push(...portfolioFiles.map(file => `portfolios/${folder.name}/${file.name}`));
                }
            }
        }
    }
    
    if (allPaths.length === 0) {
        return { success: true }; // Nothing to delete
    }

    // Supabase remove can handle up to 1000 files at a time.
    const chunkSize = 500;
    for (let i = 0; i < allPaths.length; i += chunkSize) {
        const chunk = allPaths.slice(i, i + chunkSize);
        const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove(chunk);
        if (removeError) {
          console.error('Error removing files chunk:', removeError);
          throw removeError;
        }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete all storage files:', error);
    return { success: false, error: error as Error };
  }
};
