import { useState } from 'react';
import { supabase } from '../supabase/client';

export interface UploadResult {
  url: string | null;
  error: string | null;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = 'cartas'): Promise<UploadResult> => {
    try {
      setUploading(true);

      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          url: null,
          error: 'Arquivo muito grande. Máximo 5MB',
        };
      }

      // Validar tipo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return {
          url: null,
          error: 'Apenas imagens (JPEG, PNG, WebP) são permitidas',
        };
      }

      // Gerar nome único
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload
      const { data, error } = await supabase.storage
        .from('anuncios-fotos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Erro no upload:', error);
        return {
          url: null,
          error: `Erro ao fazer upload: ${error.message}`,
        };
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('anuncios-fotos')
        .getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        error: null,
      };
    } catch (error) {
      console.error('Erro inesperado:', error);
      return {
        url: null,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading,
  };
};
