import { Component, computed, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-application-form',
  imports: [ReactiveFormsModule],
  templateUrl: './application-form.html',
  styleUrl: './application-form.css',
})
export class ApplicationForm {
  // --- Multi-Select Skills Setup ---
  availableSkills = signal<string[]>([
    'Angular',
    'TypeScript',
    'JavaScript (ES6+)',
    'HTML5 & CSS3',
    'Tailwind CSS',
    'RxJS',
    'React',
    'Next.js',
    'Vue.js',
    'Node.js',
    'Express.js',
    'Python',
    'FastAPI',
    'Django',
    'Java',
    'Spring Boot',
    'C# / .NET',
    'SQL / PostgreSQL / MySQL',
    'MongoDB',
    'RESTful APIs',
    'GraphQL',
    'Git & GitHub',
    'Docker',
    'Kubernetes',
    'AWS Cloud',
    'Microsoft Azure',
    'Google Cloud (GCP)',
    'CI/CD Pipelines',
    'Unit Testing (Vitest/Jest)',
    'Agile / Scrum',
  ]);

  selectedSkills = signal<string[]>([]);
  skillSearchQuery = signal<string>('');
  isSkillsDropdownOpen = signal<boolean>(false);
  customSkillInput = signal<string>('');

  filteredSkills = computed(() => {
    const q = this.skillSearchQuery().toLowerCase().trim();
    if (!q) return this.availableSkills();
    return this.availableSkills().filter((s) => s.toLowerCase().includes(q));
  });

  // --- Helper to Create Work Experience Item ---
  createWorkExperienceGroup() {
    return new FormGroup({
      jobTitle: new FormControl('', Validators.required),
      companyName: new FormControl('', Validators.required),
      employmentType: new FormControl('', Validators.required),
      location: new FormControl(''),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl(''),
      isCurrentRole: new FormControl(false),
      responsibilities: new FormControl(''),
    });
  }

  // --- Helper to Create Education Item ---
  createEducationGroup() {
    return new FormGroup({
      highestDegree: new FormControl('', Validators.required),
      fieldOfStudy: new FormControl('', Validators.required),
      university: new FormControl('', Validators.required),
      graduationYear: new FormControl<number | null>(null, Validators.required),
      gradeOrGpa: new FormControl(''),
    });
  }

  // --- Reactive Form Structure ---
  applicationForm = new FormGroup({
    // 1. Target Job Details
    jobTitle: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    jobType: new FormControl('', Validators.required),
    jobUrl: new FormControl(''),
    jobDescription: new FormControl(''),

    // 2. Personal Information
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    pinCode: new FormControl(''),

    // 3. Professional Profiles
    linkedinUrl: new FormControl('', Validators.required),
    githubUrl: new FormControl(''),
    portfolioUrl: new FormControl(''),
    otherUrl: new FormControl(''),

    // 4. Experience & Availability
    totalExperience: new FormControl('', Validators.required),
    employmentStatus: new FormControl('', Validators.required),
    noticePeriod: new FormControl('', Validators.required),
    earliestStartDate: new FormControl(''),
    currency: new FormControl(''),
    currentCtc: new FormControl(''),
    expectedCtc: new FormControl('', Validators.required),

    // 5. Work Experience (Dynamic FormArray with "Add More")
    workExperienceList: new FormArray<FormGroup>([this.createWorkExperienceGroup()]),

    // 6. Education History (Dynamic FormArray with "Add More")
    educationList: new FormArray<FormGroup>([this.createEducationGroup()]),

    // 7. Skills & Certifications
    skills: new FormControl<string[]>([], [Validators.required, (control) => {
      return (control.value && control.value.length > 0) ? null : { required: true };
    }]),
    certifications: new FormControl(''),

    // 8. Work Authorization & Preferences
    workAuthorization: new FormControl('', Validators.required),
    visaSponsorship: new FormControl('', Validators.required),
    workPreference: new FormControl(''),
    willingToRelocate: new FormControl(''),

    // 9. Cover Letter & Extra Info
    coverLetter: new FormControl(''),
    heardFrom: new FormControl(''),

    // 10. Consent
    termsAccepted: new FormControl(false, Validators.requiredTrue),
  });

  // --- Getters for FormArrays ---
  get workExperienceList(): FormArray<FormGroup> {
    return this.applicationForm.get('workExperienceList') as FormArray<FormGroup>;
  }

  get educationList(): FormArray<FormGroup> {
    return this.applicationForm.get('educationList') as FormArray<FormGroup>;
  }

  // --- Dynamic Work Experience Actions ---
  addWorkExperience() {
    this.workExperienceList.push(this.createWorkExperienceGroup());
  }

  removeWorkExperience(index: number) {
    if (this.workExperienceList.length > 1) {
      this.workExperienceList.removeAt(index);
    }
  }

  // --- Dynamic Education Actions ---
  addEducation() {
    this.educationList.push(this.createEducationGroup());
  }

  removeEducation(index: number) {
    if (this.educationList.length > 1) {
      this.educationList.removeAt(index);
    }
  }

  // --- Multi-Select Skills Actions ---
  toggleSkillsDropdown() {
    this.isSkillsDropdownOpen.update((v) => !v);
  }

  closeSkillsDropdown() {
    this.isSkillsDropdownOpen.set(false);
  }

  isSkillSelected(skill: string): boolean {
    return this.selectedSkills().includes(skill);
  }

  toggleSkill(skill: string) {
    const current = this.selectedSkills();
    let updated: string[];
    if (current.includes(skill)) {
      updated = current.filter((s) => s !== skill);
    } else {
      updated = [...current, skill];
    }
    this.selectedSkills.set(updated);
    this.applicationForm.get('skills')?.setValue(updated);
    this.applicationForm.get('skills')?.markAsTouched();
  }

  selectAllSkills() {
    const all = [...this.availableSkills()];
    this.selectedSkills.set(all);
    this.applicationForm.get('skills')?.setValue(all);
    this.applicationForm.get('skills')?.markAsTouched();
  }

  clearAllSkills() {
    this.selectedSkills.set([]);
    this.applicationForm.get('skills')?.setValue([]);
    this.applicationForm.get('skills')?.markAsTouched();
  }

  removeSkill(skill: string) {
    const updated = this.selectedSkills().filter((s) => s !== skill);
    this.selectedSkills.set(updated);
    this.applicationForm.get('skills')?.setValue(updated);
    this.applicationForm.get('skills')?.markAsTouched();
  }

  addCustomSkill() {
    const skill = this.customSkillInput().trim();
    if (skill) {
      if (!this.availableSkills().includes(skill)) {
        this.availableSkills.update((list) => [...list, skill]);
      }
      if (!this.selectedSkills().includes(skill)) {
        this.toggleSkill(skill);
      }
      this.customSkillInput.set('');
    }
  }

  onSkillSearchChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.skillSearchQuery.set(val);
  }

  onCustomSkillInputChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customSkillInput.set(val);
  }

  // --- Submission & Reset ---
  onSubmit() {
    if (this.applicationForm.valid) {
      console.log('Application Submitted:', this.applicationForm.value);
      alert('Application submitted successfully!');
    } else {
      this.applicationForm.markAllAsTouched();
      alert('Please fill in all required fields marked with an asterisk (*).');
    }
  }

  onReset() {
    this.applicationForm.reset({
      currency: '',
      employmentStatus: '',
      workPreference: '',
      willingToRelocate: '',
      heardFrom: '',
      termsAccepted: false,
    });
    this.selectedSkills.set([]);
    this.applicationForm.get('skills')?.setValue([]);
  }
}
