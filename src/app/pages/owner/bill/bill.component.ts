import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { BillService } from 'src/app/shared/services/bill.service';
import { RoomService } from 'src/app/shared/services/room.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { IncomeService } from 'src/app/shared/services/income.service';
import * as moment from 'moment';
import { NotifyService } from 'src/app/shared/services/notify.service';

const dateObj = new Date();

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})

export class BillComponent implements OnInit {
  token: string;
  data_bill: [];
  change = 'lg';
  dateString: string;
  billSuccess = 0;
  billUnsuccess = 0;
  today = new Date();
  month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  watcher: Subscription;
  displayedColumns: string[] = ['status_bill', 'room_number', 'name', 'createdAt', 'payment_status', 'total_cost', 'pdf', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    mediaObserver: MediaObserver,
    private authService: AuthService,
    private roomService: RoomService,
    private billService: BillService,
    private dialogService: DialogService,
    private notifyService: NotifyService,
    private tokenStorage: TokenStorageService,
    public router: Router,
    public datepipe: DatePipe,
    private incomeService: IncomeService
  ) {
    this.change = 'lg';
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.change = 'xs';
      } else if (change.mqAlias === 'sm') {
        this.change = 'sm';
      } else if (change.mqAlias === 'md') {
        this.change = 'md';
      }
      else {
        this.change = 'lg';
      }
    });

  }

  ngOnInit(): void {
    this.dateString = `${this.today.getDate()} ${this.month[this.today.getMonth() + 1]} ${this.today.getFullYear()}`
    this.data_bill = []
    this.token = this.tokenStorage.getToken()
    this.billService.findAll(this.token).subscribe(dataBills => {
      dataBills.forEach(dataBill => {
        if ((this.today.getMonth() + 1) === parseInt(moment.utc(dataBill.createdAt).format('MM'))) {
          if (dataBill.bill_status === "ชำระเงินเรียบร้อย") {
            this.billSuccess += 1
          } else {
            this.billUnsuccess += 1
          }
        }
        dataBill['dateTranform'] = `${parseInt(moment.utc(dataBill.createdAt).format('DD'))} ${this.month[parseInt(moment.utc(dataBill.createdAt).format('MM')) - 1]} ${parseInt(moment.utc(dataBill.createdAt).format('YYYY')) + 543} เวลา ${moment(dataBill.createdAt).format('HH:mm')}`//แปลงวันที่
        this.roomService.findDataRoomById(this.token, dataBill.data_room_id).subscribe((dataRoom) => {
          dataBill['user_id'] = dataRoom.user_id //เปลี่ยนเป็นเพื่อ column ลง table bill แทน
          this.roomService.findById(this.token, dataRoom.room_id).subscribe((room) => {
            dataBill['room_number'] = room.room_number //เปลี่ยนเป็นเพื่อ column ลง table bill แทน
          })
        })
      });

      this.data_bill = dataBills
      this.dataSource = new MatTableDataSource(this.data_bill)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ThaiBaht(total_cost) {
    var textNumArr = new Array("ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ");
    var textDigitArr = new Array("", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน");
    var bahtText = '';
    var arrTotal = total_cost.toString().split("");
    var lenTotal = arrTotal.length
    for (let index = 0; index < arrTotal.length; index++) {
      if ((arrTotal[index]) != 0) {
        if (((arrTotal.length - 1) - (arrTotal.length - 2)) == ((arrTotal.length - 1) - index)) {
          if (textNumArr[(arrTotal[index])] === 'สอง' || textNumArr[(arrTotal[index])] === 'หนึ่ง') {
            if (textNumArr[(arrTotal[index])] === 'สอง') {
              bahtText += 'ยี่สิบ';
            }
            if (textNumArr[(arrTotal[index])] === 'หนึ่ง') {
              bahtText += 'สิบ';
            }
          }
          else {
            bahtText += textNumArr[(arrTotal[index])];
            bahtText += textDigitArr[lenTotal - 1];
          }

        } else {
          if (arrTotal != 1 && ((arrTotal.length - 1) - (arrTotal.length - 1)) == ((arrTotal.length - 1) - index)) {
            if (textNumArr[(arrTotal[index])] === "หนึ่ง") {
              // if (index === (arrTotal.length - 1) && textNumArr[(arrTotal[index])] === "หนึ่ง") {
              bahtText += 'เอ็ด';
            } else {
              bahtText += textNumArr[(arrTotal[index])];
            }
          } else {
            bahtText += textNumArr[(arrTotal[index])];
            bahtText += textDigitArr[lenTotal - 1];
          }
          lenTotal = lenTotal - 1
        }
      } else {
        lenTotal = lenTotal - 1
      }
    }
    bahtText += 'บาทถ้วน'
    return bahtText;
  }

  makePdfBill(data, option = 'open') {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.fonts = {
      THSarabunNew: {
        normal: 'THSarabunNew.ttf',
        bold: 'THSarabunNew Bold.ttf',
        italics: 'THSarabunNew Italic.ttf',
        bolditalics: 'THSarabunNew BoldItalic.ttf'
      },
      Roboto: {
        normal: 'Roboto- Regular.ttf',
        bold: 'Roboto- Medium.ttf',
        italics: 'Roboto - Italic.ttf',
        bolditalics: 'Roboto - MediumItalic.ttf'
      }
    };
    const pdf_file = {
      info: {
        title: `${data.room_number}_${this.datepipe.transform(data.createdAt, 'MMMM_yy')}`,
      },
      header: {
      },
      footer(currentPage, pageCount) {
        return {
          columns: [
            {
              text: `หน้าที่ ${currentPage.toString()} จาก ${pageCount} หน้า`,
              style: 'footer',
            },
          ]
        };
      },
      content: [
        {
          text: `ใบแจ้งชำระค่าหอ\n\n`,
          fontSize: 20,
          alignment: 'center',
          bold: 'true'
        },
        {
          text: `Schlaf`,
          fontSize: 17
        },
        {
          type: 'none',
          fontSize: 16.5,
          ol: [
            `ตำบล ธาตุ อำเภอวารินชำราบ อุบลราชธานี 34190`,
            `โทรศัพท์ : 098-105-5865`,
          ]
        },
        {
          stack: [
            { text: `วันที่ : ${parseInt(moment.utc(data.createdAt).format('DD'))} ${this.month[parseInt(moment.utc(data.createdAt).format('MM')) - 1]} ${parseInt(moment.utc(data.createdAt).format('YYYY')) + 543}` },
            { text: `ห้อง : ${data.room_number}` },
            { text: data.fullname_user_in_room }
          ],
          style: 'align_right'
        },
        {
          text: `รายการ ห้อง ${data.room_number}`,
          fontSize: 17,
          margin: [0, 0, 0, 10]

        },
        {
          // layout: 'lightHorizontalLines', // optional
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            headerRows: 1,
            body: [
              [
                {
                  text: `รายการ`,
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center'
                },
                {},
                {},
                {
                  text: `จำนวน`,
                  style: 'tableHeader'
                },
                {
                  text: `ราคา / หน่วย`,
                  style: 'tableHeader'
                },
                {
                  text: `จำนวนเงิน`,
                  style: 'tableHeader'
                },
                {
                  text: `รวมเป็นเงิน`,
                  style: 'tableHeader'
                }
              ],
              [
                {
                  rowSpan: 1,
                  alignment: 'left',
                  colSpan: 3,
                  text: `ค่าเช่า เดือน ${this.month[parseInt(moment.utc(data.createdAt).format('MM')) - 1]} ${parseInt(moment.utc(data.createdAt).format('YYYY')) + 543}\nค่าบริการ เฟอร์นิเจอร์\nค่าบริการ Internet\nค่าน้ำ\n\nค่าไฟฟ้า         ก่อน : ${data.total_unit - data.unit_in_month}, หลัง : ${data.total_unit}`
                },
                {},
                {},
                {
                  rowSpan: 1,
                  text: `1 เดือน\n1 เดือน\n1 เดือน\n1 คน\n\n${data.unit_in_month} Unit`
                },
                {
                  rowSpan: 1,
                  text: `${data.room_cost} บาท\n${data.furniture_cost} บาท\n${data.internet_cost} บาท\n${data.water_cost} บาท\n\n${data.unit_per_month} บาท`
                },
                {
                  rowSpan: 1,
                  text: `${data.room_cost}\n${data.furniture_cost}\n ${data.internet_cost}\n${data.water_cost}\n\n${data.unit_per_month * data.unit_in_month}`
                },
                {
                  rowSpan: 1,
                  text: `${data.room_cost}\n${data.furniture_cost}\n ${data.internet_cost}\n${data.water_cost}\n\n${data.unit_per_month * data.unit_in_month}`
                }],
              [
                {
                  rowSpan: 1,
                  colSpan: 4,
                  text: `ชำระเงิน`
                },
                {},
                {},
                {},
                {
                  rowSpan: 1,
                  colSpan: 2,
                  text: `รวมเป็นเงินทั้งสิ้น`
                },
                {},
                {
                  rowSpan: 1,
                  text: `${data.total_cost}`
                }
              ],
            ]
          }
        },
        {
          text: `จำนวนเงินรวมทั้งสิ้น(ตัวอักษร)(  ${this.ThaiBaht(data.total_cost)}  )`,
          style: 'all_cost',
        },
        {
          // style: 'tableExample',
          table: {
            widths: ['*',],
            headerRows: 1,
            body: [
              [
                {
                  stack: [
                    {
                      margin: [0, 10, 0, 10],
                      type: 'none',
                      fontSize: 17,
                      ul: [
                        {
                          text: `หมายเหตุ`,
                          bold: true
                        },

                        {
                          type: 'none',
                          fontSize: 17,
                          ul: [
                            `โอนเงินผ่านบัญชีธนาคารได้ที่`,
                            `ธนาคารกรุงเทพ 612 - 0 - 23308 - 2`,
                            `วาสนา แสนคำ`,
                            `หรือพร้อมเพย์ 084 - 021 - 4610`,
                            `พร้อมส่งหลักฐานการชำระในระบบและรอผลการตรวจสอบ`,
                          ]
                        },
                      ]
                    }
                  ]
                }
              ],
            ]
          }
        },
      ],
      styles: {
        align_right: {
          fontSize: 18,
          alignment: 'right',
          margin: [0, 10, 0, 30]
        },
        all_cost: {
          fontSize: 17,
          alignment: 'right',
          margin: [0, 20, 0, 30]
        },
        tableHeader: {
          fontSize: 17,
          alignment: 'center',
        },
        tableExample: {
          fontSize: 16,
          alignment: 'center',
        },
        footer: {
          fontSize: 15,
          margin: [5, 5, 15, 5],
          alignment: 'right'
        }
      },
      defaultStyle: {
        font: 'THSarabunNew'
      },
      watermark: {
        text: `Schlaf`,
        color: 'blue',
        opacity: 0.1,
        bold: true
      },
    };

    switch (option) {
      case 'open': pdfMake.createPdf(pdf_file).open(); break;
      case 'print': pdfMake.createPdf(pdf_file).print(); break;
      case 'download': pdfMake.createPdf(pdf_file).download(`${data.room_number}_${this.datepipe.transform(data.createdAt, 'MMMM_yy')}_${data.fullname_user_in_room}`); break;

      default: pdfMake.createPdf(pdf_file).open(); break;
    }
  }

  createBill() {
    this.dialogService.openDialogCreateNewBill(this.token, 'สร้างใบแจ้งชำระค่าห้อง', 'บันทึก').afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  editBill(data) {
    this.dialogService.openDialogEditbill(data, this.token).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  deleteBill(id) {
    this.dialogService.openDialogConfirm('ลบใบแจ้งชำระเงิน', 'ต้องการลบข้อมูล ใบแจ้งชำระเงินหรือไม่').afterClosed().subscribe(res => {
      if (res === "true") {
        this.billService.deleteBill(id, this.token).subscribe((afterDelete) => {
          if (afterDelete.status === true) {
            this.reloadPage()
          }
        })
      }
    })
  }

  sendToGuest(id, user_id) {
    this.dialogService.openDialogConfirm('ส่งให้ผู้เข้าพัก', 'หากกดส่งแล้วจะไม่สามารถแก้ไขข้อมูลได้ ยืนยันการทำรายการหรือไม่').afterClosed().subscribe(res => {
      if (res === "true") {
        this.billService.updateBill(id, { bill_status: 'รอผู้เข้าพักอัพโหลดข้อมูลการชำระเงิน' }, this.token).subscribe((afterSend) => {
          if (afterSend.status === true) {
            this.authService.updateUser({ status_bill: 'รอผู้เข้าพักอัพโหลดข้อมูลการชำระเงิน' }, user_id, this.token).subscribe((afterUser) => {
              let dataNotify = {
                user_id: user_id,
                description: "มีใบแจ้งชำระค่าเช่าห้องใหม่มาเข้ามา",
                status: "unread",
              }
              this.notifyService.createNoti(this.token, dataNotify).subscribe((afterUser) => {
                this.reloadPage()
              })
            })
          }
        })
      }
    })
  }

  viewBill(data) {
    this.dialogService.openDialogViewImgBill(data).afterClosed().subscribe(res => {
    })
  }

  confirmBill(data, id, user_id) {
    let bill_income = {
      date_program: (dateObj.getUTCFullYear()) + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getUTCDate()),
      program: `ค่าเช่าห้อง ห้อง ${data.room_number}`,
      credit: data.total_cost,
      debit: 0,
      balance: data.total_cost
    }
    this.dialogService.openDialogConfirm('ยืนยันข้อมูลใบแจ้งชำระเงิน**', 'หากกดยืนยันส่งแล้วจะไม่สามารถแก้ไขข้อมูลได้ ยืนยันการทำรายการหรือไม่?').afterClosed().subscribe(res => {
      if (res === "true") {
        this.billService.updateBill(id, { img_payment: res.filename, payment_status: 'ชำระเงินสำเร็จ', bill_status: 'ชำระเงินเรียบร้อย' }, this.token).subscribe((afterSend) => {
          if (afterSend.status === true) {
            this.authService.updateUser({ status_bill: 'ชำระเงินสำเร็จ' }, user_id, this.token).subscribe((afterUser) => {
              this.incomeService.createIncome(this.token, bill_income).subscribe((afterUser) => {
                let dataNotify = {
                  user_id: user_id,
                  description: "เจ้าของหอพักยืนยันการชำระเงินของท่านแล้ว",
                  status: "unread",
                }
                this.notifyService.createNoti(this.token, dataNotify).subscribe((afterUser) => {
                  this.reloadPage()
                })
              })
            })
          }
        })
      }
    })
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
