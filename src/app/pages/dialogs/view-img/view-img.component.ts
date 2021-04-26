import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-view-img',
  templateUrl: './view-img.component.html',
  styleUrls: ['./view-img.component.scss']
})
export class ViewImgComponent implements OnInit {
  progressBar = false;
  currentIndex: any = -1;
  showFlag: any = false;
  imageObject: Array<object> = [
    {
      image: `../../../assets/uploads/lease/${this.data.photo_1}`,
      thumbImage: `../../../assets/uploads/lease/${this.data.photo_1}`,
    },
    {
      image: `../../../assets/uploads/lease/${this.data.photo_2}`,
      thumbImage: `../../../assets/uploads/lease/${this.data.photo_2}`
    },
    {
      image: `../../../assets/uploads/lease/${this.data.photo_3}`,
      thumbImage: `../../../assets/uploads/lease/${this.data.photo_3}`
    }
  ];
  
  constructor(@
    Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ViewImgComponent>,
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
