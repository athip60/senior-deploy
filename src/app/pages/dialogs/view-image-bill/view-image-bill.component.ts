import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-view-image-bill',
  templateUrl: './view-image-bill.component.html',
  styleUrls: ['./view-image-bill.component.scss']
})
export class ViewImageBillComponent implements OnInit {
  progressBar = false;
  currentIndex: any = -1;
  showFlag: any = false;
  imageObject: Array<object> = [
    {
      image: `../../../assets/uploads/bills/${this.data.img_payment}`,
      thumbImage: `../../../assets/uploads/bills/${this.data.img_payment}`,
    },
  ];

  constructor(@
    Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ViewImageBillComponent>,
    public dialogService: DialogService,
    public leaseService: LeaseService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.currentIndex = 0;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
    this.dialogRef.close(false)
  }
}
