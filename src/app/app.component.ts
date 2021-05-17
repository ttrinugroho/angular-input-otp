import { Component, VERSION, ViewChild } from '@angular/core';
import { Config } from './components/input-otp/input-otp.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('inputOtp', { static: false }) inputOtp: any;
  name = 'Angular ' + VERSION.full;
  showComponent = true;
  otp: string = null;

  config: Config = {
    length: 5,
    allowNumbersOnly: true,
    placeholder: '0',
    disableAutoFocus: true,
    isPasswordInput: true
  };

  onConfigChange() {
    this.showComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showComponent = true;
    }, 10);
  }

  onOtpChange(value) {
    this.otp = value;
  }

  onError(): void {
    this.inputOtp.setError();
  }
}
