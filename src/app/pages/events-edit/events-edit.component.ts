import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScreenService } from 'src/app/shared/services';
import notify from 'devextreme/ui/notify';
import { DxFormComponent, DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent implements OnInit {
  @Input() tabId?: number;
  
  @ViewChild('form') form: any;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(DxFormComponent) formComponent!: DxFormComponent;
  @ViewChild('restaurantGrid') restaurantGrid!: DxDataGridComponent;
  @ViewChild('restaurantPopup') restaurantPopup!: DxPopupComponent;
  
  linkedRestaurants: any[] = [];
  allRestaurants: any[] = [];
  selectedRestaurantKeys: any[] = [];
  isRestaurantPopupVisible = false;
  defaultImageUrl = '../../../assets/images/profileimg.png';
  clientId: string = '';
  companyId: string = '';
  phonePattern = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/;
  loading = false;
  apiUrl: any;
  allTypes: any[] = [
    { name: 'MEETS', id: 'MEETS' },
    { name: 'PARTIES', id: 'PARTIES' },
    { name: 'TRAINING', id: 'TRAINING' },
    { name: 'PICNICS', id: 'PICNICS' },
    { name: 'BANNER', id: 'BANNER' }
  ];
  types: any[] = [];
  tabOptions: any[] = [
    { name: 'Events', value: 'Events' },
    { name: 'Banner', value: 'Banner' }
  ];
  currentEvent: any = {
    tab: 'Events', // Default to Events
    imageUrl: '',
    Active: 'N' // Default to 'N' if not set
  };

  // Tab select box options
  tabSelectBoxOptions: any = {
    dataSource: this.tabOptions,
    displayExpr: 'name',
    valueExpr: 'value',
    searchEnabled: false,
    placeholder: 'Select Tab',
    onValueChanged: (e: any) => this.onTabChanged(e)
  };

  // Handle tab change
  onTabChanged(e: any): void {
    console.log('Tab changed event:', e);
    const newValue = e.value || (e.component && e.component.option('value'));
    console.log('New tab value:', newValue);
    
    if (!newValue) {
      console.error('No value found in event:', e);
      return;
    }
    if (newValue === 'Banner') {
      this.types = this.allTypes.filter(type => type.id === 'BANNER');
      this.currentEvent.type = 'BANNER';
    } else {
      this.types = this.allTypes.filter(type => type.id !== 'BANNER');
      if (this.currentEvent.type === 'BANNER') {
        this.currentEvent.type = ''; // Clear the type if it was BANNER
      }
    }
  }
  eventImageUrl: string = '';
  
  // Handle Active checkbox changes
  onActiveChanged(e: any) {
    if (e && e.value !== undefined) {
      this.currentEvent.Active = e.value ? 'Y' : 'N';
      if (this.form && this.form.instance) {
        this.form.instance.updateData('Active', this.currentEvent.Active);
      }
    }
  }
  
  // Checkbox options for Active field
  activeCheckboxOptions: any;

  // Get checkbox options with proper binding
  getCheckboxOptions() {
    return {
      value: this.currentEvent?.Active === 'Y',
      onValueChanged: (e: any) => {
        if (e && e.event) {
          this.currentEvent.Active = e.value ? 'Y' : 'N';
          if (this.form && this.form.instance) {
            this.form.instance.updateData('Active', this.currentEvent.Active);
          }
        }
      }
    };
  }
  
  
  // Trigger file input click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file) {
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          notify('Image size should be less than 5MB', 'error', 3000);
          return;
        }

        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          notify('Only JPG, PNG, and GIF files are allowed', 'error', 3000);
          return;
        }

        // Create a preview of the image
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.currentEvent.imageUrl = e.target.result;
          // Here you would typically upload the file to your server
          this.uploadImage(file);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  // Remove the selected image
  removeImage(): void {
    this.currentEvent.imageUrl = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  
  // Store the current file for upload after event creation
  private pendingImageFile: File | null = null;
  private tempImageUrl: string | null = null;

  // Upload image to server
  uploadImage(file: File, tempId: string = 'temp'): void {
    // If this is a new event, store the file and show a preview
    if (!this.tabId) {
      this.pendingImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentEvent.imageUrl = e.target.result;
        this.tempImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    // Determine the file name based on the selected tab
    const isBanner = this.currentEvent.tab === 'Banner';
    const prefix = isBanner ? 'Banner' : 'Events';
    const fileName = `${prefix}_${this.tabId}.PNG`;
    const imagePath = `images/viewImage/${fileName}`;

    // Show loading state
    this.loading = true;

    this.service.uploadImage(formData, 'Images', fileName).subscribe({
      next: (response: any) => {
        // Update the image URL with a timestamp to force refresh
        const timestamp = new Date().getTime();
        this.eventImageUrl = `${this.apiUrl}/${imagePath}?t=${timestamp}`;
        this.currentEvent.imageUrl = this.eventImageUrl;
        
        notify('Image uploaded successfully', 'success', 2000);
      },
      error: (error: any) => {
        console.error('Error uploading image:', error);
        notify('Failed to upload image', 'error', 3000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  

  constructor(
    private service: ScreenService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.apiUrl = this.service.getApiUrl();
    
    // Initialize types based on the default tab value
    this.types = this.allTypes.filter(type => type.id !== 'BANNER');
    
    // Initialize checkbox options
    this.activeCheckboxOptions = this.getCheckboxOptions();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.tabId = +params['id'];
        // this.eventImageUrl = `${this.service.getApiUrl()}/images/viewImage/Events_${this.tabId}.PNG`
        this.loadEvent();
      } else {
        this.currentEvent = {
          tab: 'Events',
          date: new Date(),
          Active: 'N'  // Ensure Active is set to 'N' for new events
        };
        // Update checkbox for new event
        this.activeCheckboxOptions.value = false;
      }
    });
    // this.loadAllRestaurants();
  }

  loadEvent(): void {
    if (!this.tabId) return;
    
    this.loading = true;
    this.service.getDocmentInfo2('EventMaster', {tabId: this.tabId})
      .subscribe({
        next: (res: any) => {
          if (res && res.length > 0) {
            this.currentEvent = res[0]['data'][0];
            this.eventImageUrl = `${this.service.getApiUrl()}/images/viewImage/${this.currentEvent.tab}_${this.tabId}.PNG`
            
            // Ensure Active is initialized to 'N' if not set
            if (this.currentEvent.Active === undefined || this.currentEvent.Active === null) {
              this.currentEvent.Active = 'N';
            }
            
            // Force update the checkbox state after a small delay to ensure the form is ready
            setTimeout(() => {
              this.activeCheckboxOptions.value = this.currentEvent.Active === 'Y';
              if (this.form && this.form.instance) {
                this.form.instance.updateData('Active', this.currentEvent.Active);
              }
            }, 0);
            
            // Always use the constructed eventImageUrl for the image
            if (this.eventImageUrl) {
              this.currentEvent.imageUrl = this.eventImageUrl;
              
              // Check if the image exists
              this.checkImageExists(this.eventImageUrl).then(exists => {
                if (!exists) {
                  // If image doesn't exist, clear the URL to show placeholder
                  this.currentEvent.imageUrl = '';
                }
              });
            } else {
              this.currentEvent.imageUrl = '';
            }
          }
        },
        error: (error) => {
          console.error('Error loading event:', error);
          notify('Failed to load event', 'error', 3000);
        },
        complete: () => {
          this.loading = false;
        }
      }); 
  }
  
  // Helper method to check if an image exists at the given URL
  private checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Set a timeout in case the server doesn't respond
      setTimeout(() => {
        if (!img.complete) {
          img.src = '';
          resolve(false);
        }
      }, 2000);
    });
  }

  onSaving(): void {
    debugger;
    if (!this.currentEvent) {
      notify('No contact data to save', 'error', 3000);
      return;
    }
    
    this.loading = true;
    
    // Create a copy of the contact data to avoid modifying the original
    const contactData = { ...this.currentEvent };
    
    // Always update the LastModifyDate to current date
    contactData.LastModifyDate = new Date();
    
    // Format dates to YYYY-MM-DD format for SQL Server while preserving local date
    const dateFields = ['date'];
    dateFields.forEach(field => {
      if (contactData[field]) {
        let date: Date;
        
        // Get the date in local timezone
        if (contactData[field] instanceof Date) {
          date = contactData[field];
        } else if (typeof contactData[field] === 'string' && Date.parse(contactData[field])) {
          date = new Date(contactData[field]);
        } else {
          return; // Skip if not a valid date
        }
        
        // Format as YYYY-MM-DD in local timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        contactData[field] = `${year}-${month}-${day}`;
      }
    });
    
    // Prepare the data for the API
    const data = { data: { "other_tabs": contactData } };
    
    // Determine if this is a new contact or an update
    const isNew = !this.tabId;
    
    // If updating, ensure tabId is defined
    if (!isNew && !this.tabId) {
      notify('Error: Missing event ID for update', 'error', 3000);
      this.loading = false;
      return;
    }
    
    const apiCall$ = isNew 
      ? this.service.createContact(data)
      : this.service.updateContact(this.tabId as number, data);
    
    apiCall$.subscribe({
      next: (response: any) => {
        if (isNew && response && response.msg.code) {
          // For new events, save the generated ID and upload the image if there is one
          const newEventId = response.msg.code;
          
          // If we had a temp image URL, update it with the new event ID
          if (this.tempImageUrl) {
            this.currentEvent.imageUrl = this.tempImageUrl.replace('temp', newEventId);
            this.tempImageUrl = null;
          }
          
          if (this.pendingImageFile) {
            // Upload the image with the new event ID
            this.tabId = newEventId;
            this.uploadImage(this.pendingImageFile);
            this.pendingImageFile = null;
          }
        }
        
        notify('Event saved successfully!', 'success', 3000);
        this.router.navigate(['/events']);
      },
      error: (error: any) => {
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

  // Trigger file input click when clicking on the image
  onImageChange(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onCancel(): void {
    this.location.back();
  }
}