import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { KeysPipe } from '../../pipes/keys.pipe';

export interface Config {
  // inputStyles?: {[key: string]: any};
  // containerStyles?: {[key: string]: any};
  allowKeyCodes?: number[];
  length: number;
  allowNumbersOnly?: boolean;
  // inputClass?: string;
  // containerClass?: string;
  isPasswordInput?: boolean;
  disableAutoFocus?: boolean;
  placeholder?: string;
}


@Component({
  selector: 'app-input-otp',
  templateUrl: './input-otp.component.html',
  styleUrls: ['./input-otp.component.scss'],
})

export class InputOtpComponent implements OnInit, AfterViewInit {
  @Input() config: Config = { length: 4 };
  @Output() inputChange = new EventEmitter<string>();

  otpForm: FormGroup;
  componentKey =
    Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
  inputType: string;
  isError = false;

  constructor(private keysPipe: KeysPipe) {
    this.otpForm = new FormGroup({});
    this.inputType = 'text';
  }

  ngOnInit(): void {
    for (let index = 0; index < this.config.length; index++) {
      this.otpForm.addControl(
        this.getControlName(index),
        new FormControl(null, [Validators.required])
      );
    }
    this.inputType = this.getInputType();
  }

  ngAfterViewInit(): void {
    if (!this.config.disableAutoFocus) {
      const containerItem = document.getElementById(`c_${this.componentKey}`);
      if (containerItem) {
        containerItem.addEventListener('paste', (evt) => this.handlePaste(evt));
        const ele: any = containerItem.getElementsByClassName('otp-input')[0];
        if (ele && ele.focus) {
          ele.focus();
        }
      }
    }
  }

  private getControlName(idx: number): string {
    return `ctrl_${idx}`;
  }

  onKeyDown(event: KeyboardEvent): boolean {
    const isSpace = this.ifKeyCode(event, 'Space');
    return isSpace ? false : true;
  }

  onKeyUp(event: KeyboardEvent, inputIdx: number): void {
    const nextInputId = `otp_${inputIdx + 1}_${this.componentKey}`;
    const prevInputId = `otp_${inputIdx - 1}_${this.componentKey}`;
    if (this.ifKeyCode(event, 'ArrowRight')) {
      this.focusTo(nextInputId);
      return;
    }
    if (this.ifKeyCode(event, 'ArrowLeft')) {
      this.focusTo(prevInputId);
      return;
    }

    const isBackspace = this.ifKeyCode(event, 'Backspace');
    const isValue = event.target as HTMLInputElement;

    if (isBackspace && !isValue.value) {
      this.focusTo(prevInputId);
      this.rebuildValue();
      return;
    }
    if (!isValue.value) {
      return;
    }
    if (this.ifValidEntry(event)) {
      this.focusTo(nextInputId);
    }
    this.rebuildValue();
  }

  focusTo(inputId: string): void {
    const eleInput = document.getElementById(inputId) as HTMLInputElement;
    if (eleInput) {
      eleInput.focus();
      eleInput.setSelectionRange(0, 1);
    }
  }

  ifValidEntry(event: KeyboardEvent): boolean {
    const inp = event.key;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return (
      isMobile ||
      /[a-zA-Z0-9-_]/.test(inp) ||
      (this.config.allowKeyCodes &&
        this.config.allowKeyCodes.includes(event.keyCode)) ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    );
  }

  rebuildValue(): void {
    let val = '';
    this.keysPipe.transform(this.otpForm.controls).forEach((k) => {
      if (this.otpForm.controls[k].value) {
        val += this.otpForm.controls[k].value;
      }
    });
    this.inputChange.emit(val);
  }

  ifKeyCode(event: KeyboardEvent, targetCode: string): boolean {
    const key = event.code;
    // tslint:disable-next-line: triple-equals
    return key == targetCode ? true : false;
  }

  getInputType(): string {
    return this.config.isPasswordInput
      ? 'password'
      : this.config.allowNumbersOnly
      ? 'tel'
      : 'text';
  }

  // method to set component value
  setValue(value: any): void {
    if (this.config.allowNumbersOnly && isNaN(value)) {
      return;
    }

    this.otpForm.reset();

    if (!value) {
      this.rebuildValue();
      return;
    }

    value = value.toString().replace(/\s/g, ''); // remove whitespace

    const source = from(value);
    let idx = 0;
    source.subscribe((data) => {
      if (this.otpForm.get(this.getControlName(idx))) {
        this.otpForm.get(this.getControlName(idx))?.setValue(data);
      }
      idx = idx + 1;
    });

    if (!this.config.disableAutoFocus) {
      const indexOfElementToFocus =
        value.length < this.config.length
          ? value.length
          : this.config.length - 1;
      const containerItem = document.getElementById(
        `otp_${indexOfElementToFocus}_${this.componentKey}`
      ) as HTMLInputElement;

      if (containerItem) {
        containerItem.focus();
      }

    }
    this.rebuildValue();
  }

  handlePaste(e: ClipboardEvent): void {
    // Get pasted data via clipboard API
    const clipboardData = e.clipboardData;
    let pastedData;
    if (clipboardData) {
      pastedData = clipboardData.getData('Text');
    }
    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();
    if (!pastedData) {
      return;
    }
    this.setValue(pastedData);
  }

  setError(): void{
    this.otpForm.reset();
    this.isError = true;
    setTimeout(() => {
      this.isError = false;
      this.focusTo(`otp_0_${this.componentKey}`);
    }, 1000);
  }
}
