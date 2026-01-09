import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScreenService } from 'src/app/shared/services';
import notify from 'devextreme/ui/notify';
import { DxFormComponent, DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
@Component({
  selector: 'app-newandhotedit',
  templateUrl: './newandhotedit.component.html',
  styleUrls: ['./newandhotedit.component.scss']
})
export class NewandhoteditComponent implements OnInit {
  @Input() tabId?: number;
  
  @ViewChild('form') form: any;
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
  types: any[] = [{name: 'BACK IN STOCK', id: 'BACK IN STOCK'}, {name: 'TRENDING', id: 'TRENDING'}, {name: 'NEWLY ADDED', id: 'NEWLY ADDED'}];
  tabOptions: any[] = [
    { name: 'Events', value: 'Events' },
    { name: 'Banner', value: 'Banner' }
  ];
  
  // Sample items data - in real app, this would come from a service/API
  items: any[] = [
  ];
  
  // Multiselect configuration
  itemSelectBoxOptions: any = {
    dataSource: this.items,
    displayExpr: 'name',
    valueExpr: 'id',
    showSelectionControls: true,
    applyValueMode: 'useButtons',
    searchEnabled: true,
    placeholder: 'Select items...',
    showClearButton: true
  };
  
  currentEvent: any = {
    tab: 'Events', // Default to Events
    imageUrl: '',
    Active: 'N', // Default to 'N' if not set
    itemIds: [] // This will store the comma-separated item IDs
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
    const newValue = e.value || (e.component && e.component.option('value'));
    
    if (!newValue) {
      console.error('No value found in event:', e);
      return;
    }
    
    // Reset type when tab changes
    this.currentEvent.type = '';
  }

  // Handle item selection changes in the multiselect
  onItemsChanged = (e: any): void => {
    if (e && e.value !== undefined) {
      this.currentEvent.itemIds = e.value;
    }
  }
  
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
    
    // Initialize checkbox options
    this.activeCheckboxOptions = this.getCheckboxOptions();
    this.service.getItemData({}).subscribe({
      next: (data: any) => {
        if(data.length > 0){
          this.items = data;
        } else {
          alert("No data found");
          this.items = [];
        }
      },
      error: (error) => {
        //console.error('Error fetching report data:', error);
        alert(error.error.message);
      },
      complete: () => {
      }
    });
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.tabId = +params['id'];
        this.loadEvent();
      } else {
        this.currentEvent = {
          tab: 'New And Hot',
          date: new Date(),
          Active: 'N'  // Ensure Active is set to 'N' for new events
        };
        // Update checkbox for new event
        this.activeCheckboxOptions.value = false;
      }
    });
  }

  loadEvent(): void {
    if (!this.tabId) return;
    
    this.loading = true;
    this.service.getDocmentInfo2('NewandhotMaster', {tabId: this.tabId})
      .subscribe({
        next: (res: any) => {
          if (res && res.length > 0) {
            this.currentEvent = res[0]['data'][0];
            
            // Ensure Active is initialized to 'N' if not set
            if (this.currentEvent.Active === undefined || this.currentEvent.Active === null) {
              this.currentEvent.Active = 'N';
            }
            
            // Convert comma-separated itemIds string to array of numbers
            if (this.currentEvent.Id && typeof this.currentEvent.Id === 'string') {
              this.currentEvent.itemIds = this.currentEvent.Id.split(',').map((id: string) => parseInt(id.trim(), 10));
            } else if (this.currentEvent.Id && Array.isArray(this.currentEvent.Id)) {
              // If it's already an array, ensure all elements are numbers
              this.currentEvent.itemIds = this.currentEvent.Id.map((id: string | number) => 
                typeof id === 'string' ? parseInt(id.trim(), 10) : id
              );
            } else {
              this.currentEvent.itemIds = [];
            }
            
            // Force update the checkbox state after a small delay to ensure the form is ready
            setTimeout(() => {
              this.activeCheckboxOptions.value = this.currentEvent.Active === 'Y';
              if (this.form && this.form.instance) {
                this.form.instance.updateData('Active', this.currentEvent.Active);
              }
            }, 0);
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

  onSaving(): void {
    debugger;
    if (!this.currentEvent) {
      notify('No contact data to save', 'error', 3000);
      return;
    }
    
    if(this.currentEvent['itemIds'].length > 3){
      notify("Please select at most 3 items", 'error', 3000);
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

    contactData['Id'] = contactData['itemIds'].join(',')
    
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
        if (isNew && response && response.msg && response.msg.code) {
          // For new events, save the generated ID
          const newEventId = response.msg.code;
          this.tabId = newEventId;
        }
        
        notify('Event saved successfully!', 'success', 3000);
        this.router.navigate(['/newandhot']);
      },
      error: (error: any) => {
        console.error('Error saving event:', error);
        notify('Error saving event. Please try again.', 'error', 3000);
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

  onCancel(): void {
    this.location.back();
  }
}