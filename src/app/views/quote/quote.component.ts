import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent implements OnInit {
  quoteForm: FormGroup;
  projectTypes = [
    { value: 'road', label: 'Road Works' },
    { value: 'building', label: 'Building Construction' },
    { value: 'bridge', label: 'Bridge Construction' },
    { value: 'water', label: 'Water Works' },
    { value: 'electrical', label: 'Electrical Works' },
    { value: 'mechanical', label: 'Mechanical Works' },
    { value: 'other', label: 'Other' }
  ];
  budgetRanges = [
    { value: '5000000-10000000', label: 'KES 5,000,000 - KES 10,000,000' },
    { value: '10000000-20000000', label: 'KES 10,000,000 - KES 20,000,000' },
    { value: '20000000-50000000', label: 'KES 20,000,000 - KES 50,000,000' },
    { value: '50000000-100000000', label: 'KES 50,000,000 - KES 100,000,000' },
    { value: '100000000+', label: 'Above KES 100,000,000' }
  ];
  uploadedFiles: File[] = [];
  formSubmitted = false;
  formSuccess = false;
  isRecaptchaVerified = false;

  constructor(private fb: FormBuilder) {
    this.quoteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      projectType: ['', Validators.required],
      projectScope: ['', Validators.required],
      budgetRange: ['', Validators.required],
      message: [''],
      files: ['']
    });
  }

  ngOnInit(): void {
  }

  onFileUpload(event: any): void {
    const files = event.target.files;
    if (files.length > 0) {
      this.uploadedFiles = Array.from(files);
    }
  }

  onSubmit(): void {
    this.isRecaptchaVerified = (window as any).grecaptcha && (window as any).grecaptcha.getResponse().length > 0;

    if (!this.isRecaptchaVerified) {
      this.formSubmitted = true;
      return;
    }

    this.formSubmitted = true;

    if (this.quoteForm.valid) {
      // Here you would typically send the form data to your backend
      console.log('Quote form submitted:', this.quoteForm.value);
      console.log('Uploaded files:', this.uploadedFiles);

      // Simulate API call
      setTimeout(() => {
        this.formSuccess = true;
        this.quoteForm.reset();
        this.uploadedFiles = [];
        this.formSubmitted = false;
        this.isRecaptchaVerified = false;
        if ((window as any).grecaptcha) {
          (window as any).grecaptcha.reset();
        }
      }, 2000);
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  get name() { return this.quoteForm.get('name'); }
  get email() { return this.quoteForm.get('email'); }
  get phone() { return this.quoteForm.get('phone'); }
  get projectType() { return this.quoteForm.get('projectType'); }
  get projectScope() { return this.quoteForm.get('projectScope'); }
  get budgetRange() { return this.quoteForm.get('budgetRange'); }
}
