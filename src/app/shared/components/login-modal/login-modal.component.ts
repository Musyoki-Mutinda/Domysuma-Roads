import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { AdminTokenService } from '../../../auth/admin-token.service';
import { Router } from '@angular/router';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<void>();

  // USER LOGIN
  email = '';
  password = '';

  // REGISTER
  isRegisterMode = false;
  registerFullName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';

  // ADMIN LOGIN
  showAdminButton = false;
  isAdminMode = false;
  adminEmail = '';
  adminPassword = '';

  loading = false;
  errorMsg = '';
  isOpen = false;

  // Secret tap counter for mobile
  private tapCount = 0;
  private tapTimeout: any;

  private modalSubscription!: Subscription;
  private keyListener!: (event: KeyboardEvent) => void;

  constructor(
    private auth: AuthService,
    private adminAuth: AdminAuthService,
    private tokenService: AdminTokenService,
    private router: Router,
    private loginModalService: LoginModalService
  ) {}

  ngOnInit() {
    this.modalSubscription = this.loginModalService.isOpen$.subscribe(open => {
      this.isOpen = open;
    });

    this.keyListener = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'A') {
        this.showAdminButton = true;
      }
    };

    window.addEventListener('keydown', this.keyListener);
  }

  ngOnDestroy() {
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
    window.removeEventListener('keydown', this.keyListener);

    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }
  }

  onSecretTap() {
    this.tapCount++;

    if (this.tapTimeout) {
      clearTimeout(this.tapTimeout);
    }

    if (this.tapCount >= 5) {
      this.showAdminButton = true;
      this.tapCount = 0;
      return;
    }

    this.tapTimeout = setTimeout(() => {
      this.tapCount = 0;
    }, 4000);
  }

  closeModal() {
    this.loginModalService.close();
    this.close.emit();
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMsg = '';
  }

  enableAdminMode() {
    this.isAdminMode = true;
    this.errorMsg = '';
  }

  disableAdminMode() {
    this.isAdminMode = false;
    this.errorMsg = '';
  }

  // ---------------- ADMIN LOGIN ----------------
  adminLogin() {
    if (!this.adminEmail || !this.adminPassword) {
      this.errorMsg = 'Please enter both admin email and password.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.adminAuth.login({
      email: this.adminEmail,
      password: this.adminPassword
    }).subscribe({
      next: (response: any) => {
        // Save tokens to localStorage before redirecting
        this.tokenService.setAccessToken(response.token);
        this.tokenService.setRefreshToken(response.refreshToken);

        this.closeModal();
        window.location.href = environment.adminUrl + '/dashboard';
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMsg = 'Admin login failed. Please try again.';
        console.error('Admin login error:', err);
      }
    });
  }

  // ---------------- USER LOGIN ----------------
  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter both email and password.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const role = this.auth.getRole();
        this.closeModal();

        if (role === 'ADMIN') {
          window.location.href = environment.adminUrl;
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMsg =
          (err as any).status === 401
            ? 'Invalid email or password.'
            : 'Login failed.';
      }
    });
  }

  // ---------------- REGISTER ----------------
  register() {
    if (!this.registerFullName || !this.registerEmail || !this.registerPassword || !this.registerConfirmPassword) {
      this.errorMsg = 'Please fill in all fields.';
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    const nameParts = this.registerFullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    this.loading = true;
    this.errorMsg = '';

    this.auth.register({
      firstName,
      lastName,
      email: this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.registerFullName = '';
        this.registerEmail = '';
        this.registerPassword = '';
        this.registerConfirmPassword = '';
        this.isRegisterMode = false;
        this.errorMsg = 'Registration successful! Please login with your credentials.';
      },
      error: (err: unknown) => {
        this.loading = false;
        this.errorMsg =
          (err as any).status === 409
            ? 'Email already in use.'
            : 'Registration failed.';
      }
    });
  }

  googleLogin() {
    window.location.href = `${environment.apiBaseUrl}/oauth2/authorization/google`;
  }
}