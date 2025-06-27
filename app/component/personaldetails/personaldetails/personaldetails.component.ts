import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetailsService } from 'src/app/services/user-details/user-details.service';
import { AddressDetailsService } from 'src/app/services/address-details/address-details.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from 'src/app/services/store/store.service';
import { Country, countries } from 'src/app/models/Country';

@Component({
  selector: 'app-personaldetails',
  templateUrl: './personaldetails.component.html',
  styleUrls: ['./personaldetails.component.scss']
})
export class PersonaldetailsComponent implements OnInit {
  personalDetailsForm!: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  personalDetails: any = {};
  addressForm!: FormGroup;
  addressDetails: any = {};
  submitted: boolean = false;
  userApiSuccess: boolean = false;
  userApiError: string = '';
 
  userApibool: boolean = false;
  addressApibool: boolean = false;
  addressApiSuccess: boolean = false;
  addressApiError: string = '';
  birthApiSuccess: boolean = false;
  birthApiError: string = '';
  age!: number;
  personalid: any
  addressid:any
  countries = countries

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private userDetailsServie: UserDetailsService,
    private addressDetailsService: AddressDetailsService,
  ) { }

  ngOnInit(): void {



    this.userDetailsServie.getUserDetailsByUserId(StoreService.getUserData().userId).subscribe(
      (data) => {
        this.personalid = data.id

        console.log('User details:', data);
        const isoDate = new Date(data.dateOfBirth);
        const yyyy = isoDate.getFullYear();
        let mm: string | number = isoDate.getMonth() + 1;
        let dd: string | number = isoDate.getDate();

        if (mm < 10) {
          mm = '0' + mm;
        }
        if (dd < 10) {
          dd = '0' + dd;
        }

        const formattedDate = `${yyyy}-${mm}-${dd}`;

        this.personalDetailsForm.patchValue({
          fullName: data.fullName,
          dateOfBirth: formattedDate,
          gender: data.gender,
          nationality: data.nationality,
          education: data.education,
          niNumber: data.niNumber
        });
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );

    this.addressDetailsService.getAddressFromUser(StoreService.getUserData().userId).subscribe(
      (data) => {
        this.addressid=data.id
        
        this.addressForm.patchValue({
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          county: data.county,
          postalCode: data.postalCode,
          country: data.country
        });
      },
      (error) => {
        console.error('Error fetching address details:', error);
      }
    );
  


    this.personalDetailsForm = this.formBuilder.group({

      fullName: ['', [Validators.required, Validators.maxLength(70)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],

      education: ['', Validators.required],
      niNumber: ['', Validators.required],

    });
    this.addressForm = this.formBuilder.group({
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      county: [''],
      postalCode: ['', [Validators.required, Validators.pattern(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i)]],
      country: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.personalDetailsForm.valid) {

      const dob = new Date(this.personalDetailsForm.value.dateOfBirth);
      const today = new Date();
      this.age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        this.age--;
      }

      if (this.age < 22) {
        this.birthApiSuccess = true;
        this.birthApiError = "Age is not suitable for Pension";

        return;
      }

      if (this.personalid) {


        this.userDetailsServie.updateUserDetails(this.personalid, this.personalDetailsForm.value).subscribe(
          response => {
            console.log('Personal details submitted successfully:', response);
            this.userApiSuccess = true;
            this.userApiError = 'details updated successfully';

          },
          err => {
            if (err instanceof HttpErrorResponse) {
              this.userApiError = err.error;
              this.userApibool = true;
            }
          }
        );


      }
      else {

        if (StoreService.getUserData()) {
          const formData = {
            ...this.personalDetailsForm.value,
            userId: StoreService.getUserData().userId
          };


          this.userDetailsServie.createUserDetails(formData).subscribe(
            response => {
              console.log('Personal details submitted successfully:', response);
              this.userApiSuccess = true;
              this.userApiError = 'details submitted succesfully';

            },
            err => {
              if (err instanceof HttpErrorResponse) {
                this.userApiError = err.error;
                this.userApibool = true;
              }
            }
          );
        } else {
          console.error('User data or user ID not available.');
        }

      }


    } else {
      
      this.userApibool = true;

      Object.keys(this.personalDetailsForm.controls).forEach(controlName => {
        const control = this.personalDetailsForm.get(controlName);
        if (control && !control.valid) {
          console.error(`Invalid control: ${controlName}`);
          this.userApiError = "Please fill "+ controlName+ " data correctly";
        }
      });
    }
  }












  onAddressSubmit(): void {
    if (this.addressForm.valid) {

      if (this.addressid) {
        this.addressDetailsService.updateAddress(this.addressid, this.addressForm.value).subscribe(
          response => {
            console.log('Address details updated successfully:', response);
            this.addressApiSuccess = true;
            this.addressApiError = 'Updated successsfully';
           
          },
          error => {
            console.error('Error updating address details:', error);
            this.addressApiSuccess = false;
            this.addressApiError = 'Error updating address details';
          }
        );
      }

      else{
        this.addressDetailsService.createAddressDetails(this.addressForm.value,StoreService.getUserData().userId).subscribe(
          response => {
            console.log('Address details submitted successfully:', response);
            this.addressApiSuccess = true;
            this.addressApiError = 'Successfully created';
            this.addressForm.reset();
          },
          error => {
            console.error('Error submitting address details:', error);
            this.addressApiSuccess = false;
            this.addressApiError = 'Error submitting address details';
          }
        );


      }
   
    }
    else{
      this.addressApibool=true;
      Object.keys(this.addressForm.controls).forEach(controlName => {
        const control = this.addressForm.get(controlName);
        if (control && !control.valid) {
          console.error(`Invalid control: ${controlName}`);
          this.addressApiError = "Please fill "+ controlName+ " data correctly";
        }
      });


    }
 
  }
}
