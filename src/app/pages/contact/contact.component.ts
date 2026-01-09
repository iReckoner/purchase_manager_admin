import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { 
  DxDataGridComponent, 
  DxDataGridModule, 
  DxFormModule, 
  DxButtonModule, 
  DxLoadPanelModule, 
  DxTabPanelModule,
  DxTemplateModule 
} from 'devextreme-angular';
import { ScreenService } from 'src/app/shared/services';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import 'devextreme/ui/load_panel';

// import defaultImage from '../../../assets/images/profileimg.png';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  dataSource: any[] = [];
  outletsDataSource: any[] = [];
  loading: boolean = false;
  showNoDataText: boolean = false;
  phonePattern: RegExp = /^\+?[0-9\s-]{7,15}$/;
  currentRow: any = {};
  currentContact: any = {};
  
  // Default image URL if no image is provided
  defaultImageUrl = 'assets/images/default-avatar.png';
  tabPanelItems: any[] = [
    { title: 'Outlets', icon: 'folder' },
    { title: 'Details', icon: 'info' }
  ];
  selectedTabIndex = 0;
  
  // Form field configuration
  formData: any = {};
  dynamicGridHeight: any;


  constructor(
    private service: ScreenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.service.executeData('ContactMaster').subscribe({
      next: (res: any) => {
        this.dataSource = res[0]?.data || [];
      },
      error: (error) => {
        console.error('Error loading data:', error);
        notify('Failed to load contacts', 'error', 3000);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  loadOutletsForContact(contactId: number) {
    if (!contactId) {
      console.error('No contact ID provided');
      return;
    }
    
    console.log('Executing GetOutletsByContact for contact ID:', contactId);
    this.loading = true;
    
    // Simulate empty data for now
    setTimeout(() => {
      this.outletsDataSource = [];
      this.showNoDataText = true;
      this.loading = false;
    }, 500);
    
  }

  onRowUpdating(e: any) {
    // Store the current row being edited
    this.currentRow = e.oldData;
  }

  onEditingStart(e: any) {
    debugger;
    // Navigate to the edit page instead of inline editing
    e.cancel = true;
    this.router.navigate(['/contacts', 'edit', e.data.ContactId]);
  }

  onTabSelectionChanged(e: any) {
    this.selectedTabIndex = e.component.option('selectedIndex');
    console.log('Tab changed to index:', this.selectedTabIndex);
  }
  
  onFocusedRowChanged(e: any) {
    if (e.row && e.row.data) {
      this.currentRow = e.row.data;
      
    }
  }
  
  getFullName(data: any): string {
    return data.FirstName + ' ' + data.LastName;
  }
  
  // onDeleteClick(e: any) {
  //   const contactId = e.row?.data?.ContactId;
  //   if (!contactId) return;

  //   this.loading = true;
  //   this.service.deleteContact(contactId).subscribe({
  //     next: () => {
  //       notify('Contact deleted successfully', 'success', 3000);
  //       this.loadData();
  //     },
  //     error: (error) => {
  //       console.error('Error deleting contact:', error);
  //       notify('Error deleting contact', 'error', 3000);
  //       this.loading = false;
  //     }
  //   });
  // }
  

  onAddClick() {
    this.router.navigate(['/contacts', 'new']);
  }

  onEditClick(e: any) {
    debugger;
    let contactId: number | undefined;
    
    if (e.row) {
      // If called from row click
      contactId = e.row.data.ContactId;
    } else if (e.event && e.rowIndex >= 0) {
      // If called from edit button
      contactId = this.dataSource[e.rowIndex].ContactId;
    } else if (e.data) {
      // If called from grid's onRowClick
      contactId = e.data.ContactId;
    }
    
    if (contactId) {
      this.router.navigate(['/contacts', 'edit', contactId]);
    }
  }

  onSaving(e: any) {
    e.cancel = true; // Prevent default processing
    
    if (e.changes?.length) {
      // Show loading indicator
      this.loading = true;
      
      // Get the change
      const change = e.changes[0];
      
      if (change.type === 'update' || change.type === 'insert') {
        // Update the current contact with the changes
        this.currentContact = { ...this.currentContact, ...change.data };
        
        // Prepare data for API call
        const data = { data: { "ContactMaster": change.data } };
        
        // Call the appropriate service method based on the operation type
        const apiCall$ = change.type === 'insert' 
          ? this.service.createContact(data)
          : this.service.updateContact(change.key, data);
          
        apiCall$.subscribe({
          next: () => {
            notify('Contact saved successfully!', 'success', 3000);
            // Refresh the data after successful save
            this.loadData();
          },
          error: (error) => {
            console.error('Error saving contact:', error);
            notify('Error saving contact. Please try again.', 'error', 3000);
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else if (change.type === 'remove') {
        // Handle delete operation
        this.service.deleteContact(change.key).subscribe({
          next: () => {
            notify('Contact deleted successfully!', 'success', 3000);
            // Refresh the data after successful delete
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting contact:', error);
            notify('Error deleting contact. Please try again.', 'error', 3000);
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        // Handle other change types if needed
        this.loading = false;
      }
    }
  }

  onGridContentReady(e: any): void {
    debugger
    const headerDrop = document.getElementById('headerdrop');
    
    if (headerDrop) {
      this.dynamicGridHeight = window.innerHeight - (headerDrop.clientHeight + 70);
    }
    
    const gridElement = e.component.getScrollable();
    // this.gridWidth = gridElement.scrollWidth();
    // console.log('Grid Width:', this.gridWidth, 'pixels');
  }
}