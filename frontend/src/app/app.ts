import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResumeUpload } from './shared/components/resume-upload/resume-upload';
import { ApplicationForm } from './application-form/application-form';

@Component({
  imports: [RouterOutlet, ResumeUpload, ApplicationForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('job-application-form');
}
