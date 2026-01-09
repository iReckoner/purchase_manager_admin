import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService,ScreenService } from '../../services';



@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  loading = false;
  formData: any = {};
  isverifyOtp = true;
  otpButtonText = 'Send OTP';
  isOtpButtonDisabled = false;
  private countdownInterval: any;
  private readonly OTP_RESEND_TIMEOUT = 30; // 30 seconds
  constructor(private authService: AuthService, private router: Router, private service: ScreenService) { }

  ngOnInit() {
    // Check if there's an existing timer in localStorage
    const otpTimer = localStorage.getItem('otpTimerEnd');
    if (otpTimer) {
      const timeLeft = Math.ceil((Number(otpTimer) - Date.now()) / 1000);
      if (timeLeft > 0) {
        this.startOtpResendTimer(timeLeft);
      }
    }
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSendOTP(e: Event) {
    // e.preventDefault();
    const { email } = this.formData;
    this.loading = true;
    
    if (email !== "anshul.sharma@ascomp.com") {
      notify('Invalid email!', 'error', 2000);
      this.loading = false;
      return;
    }

    this.service.sendOtpToAdmin({ identifier: email }).subscribe(
      (result: any) => {
        notify('OTP sent successfully!', 'success', 3000);
        this.loading = false;
        this.isverifyOtp = false;
        
        // Start the timer after successful OTP send
        this.startOtpResendTimer(this.OTP_RESEND_TIMEOUT);
        
        // Store the timer end time in localStorage
        const otpTimerEnd = Date.now() + (this.OTP_RESEND_TIMEOUT * 1000);
        localStorage.setItem('otpTimerEnd', otpTimerEnd.toString());
      },
      error => {
        this.loading = false;
        notify(error.error.message || 'Failed to send OTP', 'error', 2000);
      }
    );
  }

  startOtpResendTimer(seconds: number) {
    let timeLeft = seconds;
    this.isOtpButtonDisabled = true;
    
    // Clear any existing interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    // Update button text immediately
    this.updateButtonText(timeLeft);
    
    this.countdownInterval = setInterval(() => {
      timeLeft--;
      this.updateButtonText(timeLeft);
      
      if (timeLeft <= 0) {
        this.handleTimerEnd();
      }
    }, 1000);
  }
  
  private updateButtonText(seconds: number) {
    this.otpButtonText = seconds > 0 
      ? `Resend OTP (${seconds}s)` 
      : 'Resend OTP';
  }
  
  private handleTimerEnd() {
    clearInterval(this.countdownInterval);
    this.isOtpButtonDisabled = false;
    this.otpButtonText = 'Resend OTP';
    localStorage.removeItem('otpTimerEnd');
  }

  async onSubmit(e: Event) {
    debugger;
    const { email, password } = this.formData;
    this.loading = true;
    if(email != "anshul.sharma@ascomp.com"){
      notify('Invalid email!', 'error', 2000);
      this.loading = false;
      return;
    }

    this.service.verifyOtp({identifier: email,otp: password}).subscribe(async (result: any) => {
      debugger;
      if(result.message == 'OTP verified successfully'){
        const result = await this.authService.logIn(email, password);
        if (!result.isOk) {
          this.loading = false;
          notify(result.message, 'error', 2000);
        }
      }
    },error => {
      this.loading = false;
      notify(error.error.message, 'error', 2000);
    });





  }

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule
],
  declarations: [ LoginFormComponent ],
  exports: [ LoginFormComponent ]
})
export class LoginFormModule { }
