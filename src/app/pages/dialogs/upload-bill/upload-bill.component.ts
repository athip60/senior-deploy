import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BillService } from 'src/app/shared/services/bill.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-upload-bill',
  templateUrl: './upload-bill.component.html',
  styleUrls: ['./upload-bill.component.scss']
})
export class UploadBillComponent implements OnInit {
  progressBar = false
  image1;
  url1 = "../../../assets/images/not-loadimg.jpg";
  form: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<UploadBillComponent>,
    public dialogService: DialogService,
    public billService: BillService,
    private http: HttpClient,
    public datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (this.data.data.img_payment != null) {
      this.url1 = `../../../assets/uploads/bills/${this.data.data.img_payment}`
    }
    this.form = {
      img_payment: this.data.data.img_payment,
    }
  }

  selectImage(event) {
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

  onSubmit() {
    this.dialogService.openDialogConfirm(`ยืนยันการเพิ่มรูปภาพ`, `ยืนยันที่สลิปใบแจ้งชำระเงินหรือไม่?`).afterClosed().subscribe(res => {
      if (res === "true") {
        this.progressBar = true;
        const formData = new FormData();
        formData.append('file', this.image1);
        let latest_date = this.datepipe.transform(this.data.data.createdAt, 'yyyy-MM');
        this.http.post<any>(`http://localhost:8080/api/bill/upload-payment/${this.data.data.room_number + '_' + this.data.data.user_in_room + '_' + latest_date}`, formData).subscribe((res) => {
          if (res) {
            this.billService.updateBillGuest(this.data.data.id, { img_payment: res.filename, payment_status: 'รอการตรวจสอบ', bill_status: 'รอการส่งกลับให้เจ้าของหอพัก' }, this.data.token).subscribe((res) => {
              this.dialogRef.close(true)
            })
          }
        },
          (err) => console.log(err)
        );
      }
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
