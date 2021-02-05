import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  public userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        sport: ['', Validators.required],
        languages: this.formBuilder.array([]),
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator(
          'password',
          'passwordConfirmation'
        ),
      }
    );
  }

  public onSubmit(): void {
    const formValue = this.userForm.value;
    const newUser = new User(
      formValue['firstName'],
      formValue['lastName'],
      formValue['email'],
      formValue['password'],
      formValue['sport'],
      formValue['languages'] ? formValue['languages'] : []
    );
    this.userService.addUser(newUser);
    this.router.navigate(['/users']);
  }

  public getLanguages(): FormArray {
    return this.userForm.get('languages') as FormArray;
  }

  public onAddLanguage(): void {
    const newLanguageControl = this.formBuilder.control(
      '',
      Validators.required
    );
    this.getLanguages().push(newLanguageControl);
  }

  private passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }
      confirmPasswordControl.setErrors(
        passwordControl.value !== confirmPasswordControl.value
          ? { passwordMismatch: true }
          : null
      );
    };
  }
}
