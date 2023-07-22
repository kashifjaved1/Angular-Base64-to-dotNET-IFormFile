import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const base64Image = event.target.result.split(',')[1]; 
        resolve(base64Image);
      };
  
      reader.onerror = () => {
        reject(new Error('Failed to read the file as Base64.'));
      };
  
      reader.readAsDataURL(file);
    });
  }

  async uploadImage(): Promise<void> {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    try {
      const base64Image = await this.fileToBase64(this.selectedFile);
      console.log("base64Image: " + base64Image);

      const fileName = this.selectedFile.name;
      const fileExtension = fileName.split('.').pop();

      const byteCharacters = atob(base64Image);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: `image/${fileExtension}` });
      
      const apiUrl = 'https://localhost:44360/upload'; // your api link where you actually wanna post IFormFile.

      const formData = new FormData();
      formData.append('file', blob, fileName); // file is api method argument name where the post request land, and it should be exact same e.g. upload(IFormFile file), and here this "filename" is the file's name that you're sending with IFormFile, e.g. IFormFile file.Filename.
      
      const response = await this.http.post(apiUrl, formData).toPromise();

      console.log('Upload response:', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
}
