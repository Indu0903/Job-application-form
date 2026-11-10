import { Component, ElementRef, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-resume-upload',
  imports: [],
  templateUrl: './resume-upload.html',
  styleUrl: './resume-upload.css',
})
export class ResumeUpload {
  readonly fileInputRef = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  uploadSuccess = signal<boolean>(false);

  // Output event to notify parent components
  resumeUploaded = output<File>();

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        this.errorMessage.set('Only PDF files are supported.');
        this.selectedFile.set(null);
        input.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage.set('File size exceeds the 10 MB limit.');
        this.selectedFile.set(null);
        input.value = '';
        return;
      }
      this.errorMessage.set(null);
      this.selectedFile.set(file);
      this.uploadSuccess.set(false);
    }
  }

  onRemoveFile(input?: HTMLInputElement) {
    const target = input ?? this.fileInputRef()?.nativeElement;
    if (target) {
      target.value = '';
    }
    this.selectedFile.set(null);
    this.errorMessage.set(null);
    this.uploadSuccess.set(false);
  }

  onUploadWithAi() {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('Please select a PDF resume first.');
      return;
    }
    this.isUploading.set(true);
    this.errorMessage.set(null);

    // Simulated parsing delay (can be connected to backend / API)
    setTimeout(() => {
      this.isUploading.set(false);
      this.uploadSuccess.set(true);
      this.resumeUploaded.emit(file);
    }, 1500);
  }
}
