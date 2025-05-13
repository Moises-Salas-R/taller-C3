import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseConfigService {

  private supabase: SupabaseClient;
  private bucketName = 'multimedia'; // Asegúrate que coincida con tu bucket en Supabase

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Subir imagen a Supabase
  async subirImagen(file: Blob, fileName: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(fileName, file, { upsert: true });

    if (error) {
      throw new Error(`Error al subir imagen: ${error.message}`);
    }

    const { publicUrl } = this.supabase
      .storage
      .from(this.bucketName)
      .getPublicUrl(fileName).data;

    return publicUrl;
  }
}
