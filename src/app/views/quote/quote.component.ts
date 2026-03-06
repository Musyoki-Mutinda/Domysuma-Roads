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
    { value: '0-50000', label: 'Below KES 50,000' },
    { value: '50000-200000', label: 'KES 50,000 - KES 200,000' },
    { value: '200000-500000', label: 'KES 200,000 - KES 500,000' },
    { value: '500000-1000000', label: 'KES 500,000 - KES 1,000,000' },
    { value: '1000000+', label: 'Above KES 1,000,000' }
  ];
  uploadedFiles: File[] = [];
  formSubmitted = false;
  formSuccess = false;

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
