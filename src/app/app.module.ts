import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { KeysPipe } from './pipes/keys.pipe';
import { NumberOnlyDirective } from './directive/number-only.directive';
import { InputOtpComponent } from './components/input-otp/input-otp.component';

@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, FormsModule],
  declarations: [
    AppComponent,
    InputOtpComponent,
    NumberOnlyDirective,
    KeysPipe,
    HelloComponent
  ],
  bootstrap: [AppComponent],
  providers: [KeysPipe]
})
export class AppModule {}
