import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  constructor(private formBuilder: FormBuilder,
    private luv2ShopFormService: Luv2ShopFormService,
    private cartService: CartService) {}
  
  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                    [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        lastName: new FormControl('', 
                                  [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl('',
                                [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                [Validators.required, Validators.minLength(2), 
                                Luv2ShopValidators.notOnlyWhitespace]),
        city:new FormControl('', 
                            [Validators.required, Validators.minLength(2), 
                             Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', 
                                [Validators.required, Validators.minLength(2), 
                                 Luv2ShopValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
        [Validators.required, Validators.minLength(2), 
        Luv2ShopValidators.notOnlyWhitespace]),
        city:new FormControl('', 
                    [Validators.required, Validators.minLength(2), 
                     Luv2ShopValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', 
                        [Validators.required, Validators.minLength(2), 
                         Luv2ShopValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
                                          Luv2ShopValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

     // populate credit card months

     const startMonth: number = new Date().getMonth() + 1;
     console.log("startMonth: " + startMonth);
 
     this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
       data => {
         console.log("Retrieved credit card months: " + JSON.stringify(data));
         this.creditCardMonths = data;
       }
     );
 
     // populate credit card years
 
     this.luv2ShopFormService.getCreditCardYears().subscribe(
       data => {
         console.log("Retrieved credit card years: " + JSON.stringify(data));
         this.creditCardYears = data;
       }
     );

     //populate Countries
     this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
    
  }
  reviewCartDetails() {
    //subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    //subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The Email Address is "+this.checkoutFormGroup.get('customer')?.value.email);
    console.log("The Shipping Address is "+this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The Shipping Address is "+this.checkoutFormGroup.get('shippingAddress')?.value.state.name);

    console.log("The Shipping Address is "+this.checkoutFormGroup.get('billingAddress')?.value.country.name);
    console.log("The Shipping Address is "+this.checkoutFormGroup.get('billingAddress')?.value.state.name);
  }

  get firstName():any{ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName():any{ return this.checkoutFormGroup.get('customer.lastName'); }
  get email():any{ return this.checkoutFormGroup.get('customer.email'); }
  
  get shippingAddressStreet():any{ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity():any{ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState():any{ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode():any{ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry():any{ return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet():any{ return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity():any{ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState():any{ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode():any{ return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry():any{ return this.checkoutFormGroup.get('billingAddress.country');}

  get creditCardType():any { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard():any { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber():any { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode():any { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event:any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

            //bug fix for states
            this.billingAddressStates=this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for states
      this.billingAddressStates = [];
    }
    
  }

  handleMonthsAndYears(){
    const creditCardFormGroup:any = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {

    const formGroup: any = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data; 
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

}
