import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseConfigService } from '../../core/services/firebase-config.service';
import { SupabaseConfigService } from '../../core/services/supabase-config.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage {
  registroForm: FormGroup;
  imagePreview: string | null = null;
  imageFile: Blob | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseConfigService,
    private supabaseService: SupabaseConfigService
  ) {
    this.registroForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  async seleccionarImagen() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt, // Puede ser Camera o Photos
      });

      this.imagePreview = `data:image/jpeg;base64,${image.base64String}`;
      this.imageFile = this.base64ToBlob(image.base64String!, 'image/jpeg');
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
    }
  }

  base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  async guardarRegistro() {
    if (!this.registroForm.valid || !this.imageFile) {
      alert('Todos los campos son requeridos');
      return;
    }

    this.loading = true;
    try {
      const fileName = `imagen_${Date.now()}.jpg`;
      const imageUrl = await this.supabaseService.subirImagen(this.imageFile, fileName);

      const nuevoRegistro = {
        descripcion: this.registroForm.value.descripcion,
        fechaCreacion: new Date().toISOString(),
        imagenUrl: imageUrl
      };

      await this.firebaseService.addRegistro(nuevoRegistro);
      alert('Registro guardado con éxito');
      this.registroForm.reset();
      this.imagePreview = null;
      this.imageFile = null;
    } catch (error) {
      console.error('Error al guardar registro:', error);
      alert('Error al guardar. Intenta nuevamente.');
    } finally {
      this.loading = false;
    }
  }
}