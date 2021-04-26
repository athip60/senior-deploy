import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { RoomService } from 'src/app/shared/services/room.service';

@Component({
  selector: 'app-add-update-img',
  templateUrl: './add-update-img.component.html',
  styleUrls: ['./add-update-img.component.scss']
})
export class AddUpdateImgComponent implements OnInit {
  progressBar = false;
  image1;
  image2;
  image3;
  url1 = "../../../assets/images/not-loadimg.jpg";
  url2 = "../../../assets/images/not-loadimg.jpg";
  url3 = "../../../assets/images/not-loadimg.jpg";
  form: any = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddUpdateImgComponent>,
    public dialogService: DialogService,
    public leaseService: LeaseService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    if (this.data.data.photo_1 != null && this.data.data.photo_2 != null && this.data.data.photo_3 != null) {
      this.url1 = `../../../assets/uploads/lease/${this.data.data.photo_1}`
      this.url2 = `../../../assets/uploads/lease/${this.data.data.photo_2}`
      this.url3 = `../../../assets/uploads/lease/${this.data.data.photo_3}`
    }
    this.form = {
      id: this.data.data.id,
      status: this.data.data.status,
      photo_1: this.data.data.photo_1,
      photo_2: this.data.data.photo_2,
      photo_3: this.data.data.photo_3
    }
  }

  selectImage1(event) {
    if (event.target.files.length > 0) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url1 = event.target.result
      }
      const file = event.target.files[0];
      this.image1 = file;
    }
  }
  selectImage2(event) {
    if (event.target.files.length > 0) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url2 = event.target.result
      }
      const file = event.target.files[0];
      this.image2 = file;
    }
  }

  selectImage3(event) {
    if (event.target.files.length > 0) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url3 = event.target.result
      }
      const file = event.target.files[0];
      this.image3 = file;
    }
  }

  onSubmit() {
    this.progressBar = true;
    for (let i = 0; i < 3; i++) {
      if (i == 0) {
        const formData = new FormData();
        formData.append('file', this.image1);
        this.http.post<any>(`http://localhost:8080/api/lease/img1/${this.data.data.room_number + '_1'}`, formData).subscribe((res) => {
          this.leaseService.uploadPhotoLease1(this.data.token, res, this.data.data.id).subscribe((res) => {
          })
        },
          (err) => console.log(err)
        );
      }
      else if (i == 1) {
        const formData = new FormData();
        formData.append('file', this.image2);
        this.http.post<any>(`http://localhost:8080/api/lease/img2/${this.data.data.room_number + '_2'}`, formData).subscribe((res) => {
          this.leaseService.uploadPhotoLease2(this.data.token, res, this.data.data.id).subscribe((res) => {
          })
        },
          (err) => console.log(err)
        );
      }
      else if (i == 2) {
        const formData = new FormData();
        formData.append('file', this.image3);
        this.http.post<any>(`http://localhost:8080/api/lease/img3/${this.data.data.room_number + '_3'}`, formData).subscribe((res) => {
          this.leaseService.uploadPhotoLease3(this.data.token, res, this.data.data.id).subscribe((res) => {
            this.dialogRef.close(true)
          })
        },
          (err) => console.log(err)
        );
      }
    }
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
