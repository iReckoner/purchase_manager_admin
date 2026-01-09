import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScreenService } from 'src/app/shared/services';
import notify from 'devextreme/ui/notify';
import { DxFormComponent, DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
@Component({
  selector: 'app-resturantlinkage-edit',
  templateUrl: './resturantlinkage-edit.component.html',
  styleUrls: ['./resturantlinkage-edit.component.scss']
})
export class ResturantlinkageEditComponent implements OnInit {
  @Input() partyId?: number;
  
  @ViewChild('form') form: any;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(DxFormComponent) formComponent!: DxFormComponent;
  @ViewChild('restaurantGrid') restaurantGrid!: DxDataGridComponent;
  @ViewChild('restaurantPopup') restaurantPopup!: DxPopupComponent;
  
  currentParty: any = {};
  linkedRestaurants: any[] = [];
  allRestaurants: any[] = [];
  contacts: any[] = [];
  selectedRestaurantKeys: any[] = [];
  isRestaurantPopupVisible = false;
  contactImageUrl: string = '';
  defaultImageUrl = '../../../assets/images/profileimg.png';
  clientId: string = '';
  companyId: string = '';
  phonePattern = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/;
  loading = false;
  apiUrl: any;
  

  constructor(
    private service: ScreenService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.apiUrl = this.service.getApiUrl();
    this.route.params.subscribe(async (params) => {
      if (params['id']) {
        this.partyId = +params['id'];
        await this.loadContacts();
        this.loadContact();
      } else {
        await this.loadContacts();
      }
    });
  }

  loadContacts() {
    return new Promise<void>((resolve) => {
      this.service.getDocmentInfo2('Contacts', {})
        .subscribe({
          next: (res: any) => {
            if (res && res.length > 0) {
              this.contacts = res[0].data.map((contact: any) => ({
                id: contact.ContactId,
                name: contact.ContactName || `Contact #${contact.ContactId}`
              }));
            }
            resolve();
          },
          error: (error) => {
            console.error('Error loading contacts:', error);
            notify('Failed to load contacts', 'error', 3000);
            resolve();
          }
        });
    });
  }

  loadContact(): void {
    if (!this.partyId) return;
    
    this.loading = true;
    this.service.getDocmentInfo2('ResturantLinkage', {PartyId: this.partyId})
      .subscribe({
        next: (res: any) => {
          if (res && res.length > 0) {
            this.currentParty = res[0]['data'][0];
            this.linkedRestaurants =  res[1]['data'];
            
            // Set clientId and companyId from the contact data
            // Adjust these property names according to your actual data structure
            this.clientId = this.currentParty.ClientId || 'DEFAULT_CLIENT';
            this.companyId = this.currentParty.CompanyId || 'DEFAULT_COMPANY';
            
            // Update the image URL with the correct path
            // this.updateImageUrl();
          }
        },
        error: (error) => {
          console.error('Error loading contact:', error);
          notify('Failed to load contact', 'error', 3000);
        },
        complete: () => {
          this.loading = false;
        }
      }); 
  }

  

  onSaving(): void {
    debugger;
    if (!this.currentParty) {
      notify('No contact data to save', 'error', 3000);
      return;
    }
    
    this.loading = true;
    
    // Create a copy of the contact data to avoid modifying the original
    const partyData = { ...this.currentParty };
    
    
    // Format dates to YYYY-MM-DD format for SQL Server
    // const dateFields = ['LastModifyDate', 'CreatedDate'];
    // dateFields.forEach(field => {
    //   if (partyData[field]) {
    //     // If it's a Date object, format it
    //     if (partyData[field] instanceof Date) {
    //       partyData[field] = partyData[field].toISOString().split('T')[0];
    //     }
    //     // If it's a string that looks like a date, format it
    //     else if (typeof partyData[field] === 'string' && Date.parse(partyData[field])) {
    //       partyData[field] = new Date(partyData[field]).toISOString().split('T')[0];
    //     }
    //   }
    // });
    
    // Prepare the data for the API
    const data = { data: { "RestroLinkage": partyData } };
    
    // Determine if this is a new contact or an update
    const apiCall$ = this.partyId 
      ? this.service.resturantLinkage(this.partyId, data)
      : this.service.createContact(data);
    
    apiCall$.subscribe({
      next: () => {
        notify('Contact saved successfully!', 'success', 3000);
        this.router.navigate(['/resturantlinkage']);
      },
      error: (error) => {
        console.error('Error saving contact:', error);
        notify('Error saving contact. Please try again.', 'error', 3000);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onFormContentReady(e: any) {
    // Form is ready, you can perform any initialization here
  }

  onCancel(): void {
    this.location.back();
  }
}
