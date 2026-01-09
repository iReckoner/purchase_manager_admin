import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScreenService } from 'src/app/shared/services';
import notify from 'devextreme/ui/notify';
import { DxFormComponent, DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {
  @Input() contactId?: number;
  
  @ViewChild('form') form: any;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(DxFormComponent) formComponent!: DxFormComponent;
  @ViewChild('restaurantGrid') restaurantGrid!: DxDataGridComponent;
  @ViewChild('restaurantPopup') restaurantPopup!: DxPopupComponent;
  
  currentContact: any = {};
  linkedRestaurants: any[] = [];
  allRestaurants: any[] = [];
  selectedRestaurantKeys: any[] = [];
  isRestaurantPopupVisible = false;
  contactImageUrl: string = '';
  defaultImageUrl = '../../../assets/images/images.png';
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
    debugger;
    this.apiUrl = this.service.getApiUrl();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.contactId = +params['id'];
        this.contactImageUrl = `${this.service.getApiUrl()}/images/viewImage/Contact_${this.contactId}.PNG`
        this.loadContact();
      }else{
        this.currentContact = {Designation: "Purchase Officer", Department: "Purchase"};
      }
    });
    // this.loadAllRestaurants();
  }

  loadContact(): void {
    if (!this.contactId) return;
    
    this.loading = true;
    this.service.getDocmentInfo2('ContactMaster', {ContactId: this.contactId})
      .subscribe({
        next: (res: any) => {
          if (res && res.length > 0) {
            this.currentContact = res[0]['data'][0];
            this.linkedRestaurants =  res[1]['data'];
            
            // Set clientId and companyId from the contact data
            // Adjust these property names according to your actual data structure
            this.clientId = this.currentContact.ClientId || 'DEFAULT_CLIENT';
            this.companyId = this.currentContact.CompanyId || 'DEFAULT_COMPANY';
            
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

  // loadAllRestaurants(): void {
  //   this.service.getDocmentInfo2('RestaurantMaster', {}).subscribe({
  //     next: (data: any) => {
  //       this.allRestaurants = data || [];
  //     },
  //     error: (error: any) => {
  //       console.error('Error loading restaurants:', error);
  //       notify('Failed to load restaurants', 'error', 3000);
  //     }
  //   });
  // }

  // loadLinkedRestaurants(): void {
  //   if (!this.contactId) return;
    
  //   this.service.getDocmentInfo2('ContactRestaurantMapping', { ContactId: this.contactId })
  //     .subscribe({
  //       next: (data: any) => {
  //         this.linkedRestaurants = data || [];
  //       },
  //       error: (error) => {
  //         console.error('Error loading linked restaurants:', error);
  //         notify('Failed to load linked restaurants', 'error', 3000);
  //       }
  //     });
  // }

  // openRestaurantPopup(): void {
  //   this.selectedRestaurantKeys = this.linkedRestaurants.map(r => r.RestaurantId);
  //   this.isRestaurantPopupVisible = true;
  // }

  // saveLinkedRestaurants(): void {
  //   if (!this.contactId) return;

  //   const payload = {
  //     ContactId: this.contactId,
  //     RestaurantIds: this.selectedRestaurantKeys
  //   };

  //   this.loading = true;
  //   // Using getDocmentInfo2 for saving since it's the only available method
  //   this.service.getDocmentInfo2('SaveContactRestaurantMapping', payload).subscribe({
  //     next: () => {
  //       notify('Restaurants linked successfully', 'success', 2000);
  //       this.loadLinkedRestaurants();
  //       this.isRestaurantPopupVisible = false;
  //     },
  //     error: (error: any) => {
  //       console.error('Error linking restaurants:', error);
  //       notify('Failed to link restaurants', 'error', 3000);
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     }
  //   });
  // }

  // deleteLinkedRestaurant(e: any): void {
  //   if (!confirm('Are you sure you want to unlink this restaurant?')) {
  //     e.cancel = true;
  //     return;
  //   }

  //   const restaurantId = e.row.data.RestaurantId;
  //   // Using getDocmentInfo2 for deletion since it's the only available method
  //   this.service.getDocmentInfo2('DeleteContactRestaurantMapping', { 
  //     ContactId: this.contactId, 
  //     RestaurantId: restaurantId 
  //   }).subscribe({
  //     next: () => {
  //       notify('Restaurant unlinked successfully', 'success', 2000);
  //       this.loadLinkedRestaurants();
  //     },
  //     error: (error: any) => {
  //       console.error('Error unlinking restaurant:', error);
  //       notify('Failed to unlink restaurant', 'error', 3000);
  //     }
  //   });
  // }

  onSaving(): void {
    if (!this.currentContact) {
      notify('No contact data to save', 'error', 3000);
      return;
    }
    
    this.loading = true;
    
    // Create a copy of the contact data to avoid modifying the original
    const contactData = { ...this.currentContact };
    
    // Always update the LastModifyDate to current date
    contactData.LastModifyDate = new Date();
    
    // Format dates to YYYY-MM-DD format for SQL Server
    const dateFields = ['LastModifyDate', 'CreatedDate'];
    dateFields.forEach(field => {
      if (contactData[field]) {
        // If it's a Date object, format it
        if (contactData[field] instanceof Date) {
          contactData[field] = contactData[field].toISOString().split('T')[0];
        }
        // If it's a string that looks like a date, format it
        else if (typeof contactData[field] === 'string' && Date.parse(contactData[field])) {
          contactData[field] = new Date(contactData[field]).toISOString().split('T')[0];
        }
      }
    });
    
    // Prepare the data for the API
    const data = { data: { "ContactMaster": contactData } };
    
    // Determine if this is a new contact or an update
    const apiCall$ = this.contactId 
      ? this.service.updateContact(this.contactId, data)
      : this.service.createContact(data);
    
    apiCall$.subscribe({
      next: () => {
        notify('Contact saved successfully!', 'success', 3000);
        this.router.navigate(['/contact']);
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

  onImageChange(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          notify('Image size should be less than 5MB', 'error', 3000);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
          // Show preview
          this.contactImageUrl = e.target.result;
          
          // Upload the image
          this.uploadImage(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  // updateImageUrl(): void {
  //   if (this.contactId && this.clientId && this.companyId) {
  //     const fileName = `Contact_${this.contactId}.PNG`;
  //     this.contactImageUrl = `${this.service.apiUrl}/content/${this.clientId}/${this.companyId}/Contact/${fileName}?t=${new Date().getTime()}`;
  //   }
  // }

  uploadImage(file: File): void {
    if (!this.contactId) {
      notify('Contact ID is required', 'error', 3000);
      return;
    }

    if (!this.clientId || !this.companyId) {
      notify('Client ID or Company ID is missing', 'error', 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const entityType = 'Contact';
    const fileName = `Contact_${this.contactId}.PNG`;

    this.service.uploadImage(formData, 'Images', fileName).subscribe({
      next: (response: any) => {
        notify('Image uploaded successfully', 'success', 2000);
        // Update the image URL to refresh the view
        // this.updateImageUrl();
      },
      error: (error: any) => {
        console.error('Error uploading image:', error);
        notify('Failed to upload image', 'error', 3000);
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }
  handleImgError(event: any) {
    if (!event.target.dataset.hasError) {
      event.target.dataset.hasError = "true"; // only once
      event.target.src = this.defaultImageUrl;
    }
  }
}
