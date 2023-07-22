import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styleUrls: ['./component1.component.css']
})
export class Component1Component {

  @Input() base64Image: string = '';

  constructor(private http: HttpClient) {}

  uploadImageToApi(base64Image: string): void {
    console.log('uploadImageToApi called with base64Image:', base64Image);

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
    const blob = new Blob(byteArrays, { type: 'image/jpeg' });
    
    const apiUrl = 'https://localhost:44360/upload'; // your api link where you actually wanna post IFormFile.

    const formData = new FormData();
    formData.append('file', blob, 'image.jpg'); // file is api method argument name where the post request land, and it should be exact same e.g. upload(IFormFile file), and here "image.jpg" is the  file's name that you're sending with IFormFile, e.g. IFormFile file.Filename.

    this.http.post(apiUrl, formData).subscribe(
      (response) => {
        console.log('Upload response:', response);
      },
      (error) => {
        console.error('Upload failed:', error);
      }
    );
  }

  uploadImageFromInput(): void {
    if (!this.base64Image) {
      console.error('Please enter a valid Base64 image string.');
      return;
    }
    
    this.uploadImageToApi(this.base64Image);
  }
}
