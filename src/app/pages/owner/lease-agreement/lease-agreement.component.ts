import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/shared/services/dialog.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LeaseService } from 'src/app/shared/services/lease.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-lease-agreement',
  templateUrl: './lease-agreement.component.html',
  styleUrls: ['./lease-agreement.component.scss']
})
export class LeaseAgreementComponent implements OnInit {
  lease_data = []
  images;
  successful = 0
  unsuccessful = 0
  month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  token: string;
  displayedColumns: string[] = ['room', 'status', 'createdAt', 'updatedAt', 'pdf', 'actions'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  statusFilter = new FormControl('');

  constructor(
    private authService: AuthService,
    private leaseService: LeaseService,
    private tokenStorage: TokenStorageService,
    public dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.lease_data = []
    this.token = this.tokenStorage.getToken()

    this.leaseService.findAll(this.token).subscribe(response => {
      response.forEach(data => {
        data['dateCreateTranform'] = `${parseInt(moment.utc(data.createdAt).format('DD'))} ${this.month[parseInt(moment.utc(data.createdAt).format('MM')) - 1]} ${parseInt(moment.utc(data.createdAt).format('YYYY')) + 543} เวลา ${moment(data.createdAt).format('HH:mm')}`
        data['dateUpdateTranform'] = `${parseInt(moment.utc(data.updatedAt).format('DD'))} ${this.month[parseInt(moment.utc(data.updatedAt).format('MM')) - 1]} ${parseInt(moment.utc(data.updatedAt).format('YYYY')) + 543} เวลา ${moment(data.updatedAt).format('HH:mm')}`
      });
      this.lease_data = response
      this.dataSource = new MatTableDataSource(this.lease_data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.lease_data.forEach(element => {
        if (element.lease_status === 'บันทึกสัญญาเรียบร้อยแล้ว') {
          this.successful += 1
        } else {
          this.unsuccessful += 1
        }
      });
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  makePdfLease(data, option = 'open') {
    this.authService.findById(data.user_id, this.token).subscribe((response) => {
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
          title: `สัญญาเช่าห้อง_${data.room_number}`,
          // author: 'john doe',
          // subject: 'subject of document',
          // keywords: 'keywords for document',
        },
        header: {
        },
        footer(currentPage, pageCount) {
          return {
            columns: [
              {
                text: 'หน้าที่ ' + currentPage.toString() + ' จาก ' + pageCount + ' หน้า', style: 'footer',
              },
            ]
          };
        },
        content: [
          {
            text: `แบบสัญญาเช่าหอพัก`,
            style: 'header'
          },
          {
            stack: [
              { text: `ทำที่......................................................` },
              { text: `${parseInt(moment.utc(data.updatedAt).format('DD'))} ${this.month[parseInt(moment.utc(data.updatedAt).format('MM')) - 1]} ${parseInt(moment.utc(data.updatedAt).format('YYYY')) + 543}` }
            ],
            style: 'align_right'
          },
          {
            fontSize: 17,
            text: [
              {
                text: '.                 ',
                color: 'white'

              },
              `สัญญานี้ทำขึ้นที่ หอ AA Place เมื่อวันที่ ${parseInt(moment.utc(data.updatedAt).format('DD'))} ${this.month[parseInt(moment.utc(data.updatedAt).format('MM')) - 1]} ${parseInt(moment.utc(data.updatedAt).format('YYYY')) + 543} เวลา ${moment(data.updatedAt).format('HH:mm')} ระหว่าง นายอธิป ศิริเศวกุลวงศ์ อยู่บ้านเลขที่  -  ตำบล/แขวง  ธาตุ  อำเภอ/เขต  วารินชำราบ  จังหวัด  อุบลราชธานี  ซึ่งต่อไปในสัญญานี้จะเรียกว่า “ผู้ให้เช่า” ฝ่ายหนึ่งกับ  ${response.name}  ${response.surname}  อยู่บ้านเลขที่………………ตำบล/แขวง…………………………..อำเภอ/เขต…………………………จังหวัด………………………ซึ่งต่อไปในสัญญานี้จะเรียกว่า “ผู้เช่า” อีกฝ่ายหนึ่ง\n`,
              {
                text: '.                 ',
                color: 'white'

              },
              'ทั้งสองฝ่ายตกลงทำสัญญากันโดยมีข้อความดังต่อไปนี้\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑  ', bold: true },
              `ผู้เช่าตกลงเช่าและผู้ให้เช่าตกลงให้เช่าห้องพักอาศัยห้องเลขที่ ${data.room_number} ชั้นที่………..  ของ หอ \nAA place ซึ่งตั้งอยู่ที่  -  ตำบล/แขวง  ธาตุ  อำเภอ/เขต  วารินชำราบ  จังหวัด  อุบลราชธานี  เพื่อใช้เป็นที่พักอาศัย ในอัตราค่าเช่าเดือนละ…………….บาท  (…………………………..……) ค่าเช่านี้ไม่รวมถึงค่าไฟฟ้าค่าน้ำประปา ค่าโทรศัพท์ ซึ่งผู้เช่าต้องชำระแก่ผู้ให้เช่าตามอัตราที่กำหนดไว้ในสัญญาข้อ ๔\n`,
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๒  ', bold: true },
              'ผู้เช่าตกลงเช่าห้องพักอาศัยตามสัญญาข้อ ๑ มีกำหนดเวลา………ปี นับตั้งแต่วันที่……………………ถึงวันที่……………………..\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๓  ', bold: true },
              'การชำระค่าเช่า ผู้เช่าตกลงจะชำระค่าเช่าแก่ผู้ให้เช่าเป็นการล่วงหน้าโดยชำระภายใน วันที่\n………………….. ของทุกเดือนตลอดเวลาอายุการเช่า\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๔  ', bold: true },
              'ผู้ให้เช่าคิดค่าไฟฟ้า ค่าน้ำประปา ค่าโทรศัพท์ ในอัตราดังนี้\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๑) ค่าไฟฟ้ายูนิตละ……………….บาท\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๒) ค่าน้ำประปาลูกบาศก์เมตรละ………………….บาท\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๓) ค่าโทรศัพท์ (โทร. ออก) ครั้งละ…………………….บาท\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๕  ', bold: true },
              'ผู้เช่าต้องชำระค่าไฟฟ้า ค่าน้ำประปา ค่าโทรศัพท์ ตามจำนวนหน่วยที่ใช้ในแต่ละเดือนและต้อง\nชำระพร้อมกับการชำระค่าเช่าของเดือนถัดไป\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๖  ', bold: true },
              'เพื่อเป็นการปฏิบัติตามสัญญาเช่า ผู้เช่าตกลงมอบเงินประกันแก่ผู้ให้เช่าไว้เป็นจำนวน\n……………….บาท(…………………………..……) เงินประกันนี้ผู้ให้เช่าจะคืนให้แก่ผู้เช่าเมื่อผู้เช่ามิได้ผิดสัญญา และมิได้ค้างชำระเงินต่างๆ ตามสัญญานี้\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๗  ', bold: true },
              'ผู้เช่าต้องเป็นผู้ชำระเงินค่ากำจัดขยะเดือนละ……………..บาท (…………………………..……)\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๘  ', bold: true },
              'ผู้เช่าต้องเป็นผู้ดูแลรักษาความสะอาดบริเวณทางเดินส่วนกลางหน้าห้องพักอาศัยของผู้เช่า และผู้เช่าจะต้องไม่นำสิ่งของใดๆ มาวางไว้ในบริเวณทางเดินดังกล่าว\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๙  ', bold: true },
              'ผู้เช่าต้องดูแลห้องพักอาศัยและทรัพย์สินต่างๆ ในห้องพักดังกล่าวเสมือนเป็นทรัพย์สินของ\nตนเอง และต้องรักษาความสะอาดตลอดจนรักษาความสงบเรียบร้อย ไม่ก่อให้เกิดเสียงให้เป็นที่เดือดร้อนรำคาญ\nแก่ผู้อยู่ห้องพักอาศัยข้างเคียง\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๐  ', bold: true },
              'ผู้เช่าต้องเป็นผู้รับผิดชอบในบรรดาความสูญหาย เสียหาย หรือบุบสลายอย่างใดๆ อันเกิดแก่ห้องพักอาศัยและทรัพย์สินต่างๆ ในห้องพักดังกล่าว\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๑  ', bold: true },
              'ผู้เช่าต้องยอมให้ผู้ให้เช่า หรือตัวแทนของผู้ให้เช่าเข้าตรวจดูห้องพักอาศัยได้เป็นครั้งคราว\nในระยะเวลาอันสมควร\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๒  ', bold: true },
              'ผู้เช่าต้องไม่ทำการดัดแปลง ต่อเติม หรือรื้อถอนห้องพักอาศัยและทรัพย์สินต่างๆ ในห้อง\nพักดังกล่าว ไม่ว่าทั้งหมดหรือบางส่วน หากฝ่าฝืนผู้ให้เช่าจะเรียกให้ผู้เช่าทำทรัพย์สินดังกล่าวให้กลับคืนสู่สภาพเดิม และเรียกให้ผู้เช่ารับผิดชดใช้ค่าเสียหายอันเกิดความสูญหาย เสียหาย หรือบุบสลายใดๆ อันเนื่องมาจากการดัดแปลง ต่อเติม หรือรื้อถอนดังกล่าว\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๓  ', bold: true },
              'ผู้เช่าต้องไม่นำบุคคลอื่นนอกจากบุคคลในครอบครัวของผู้เช่าเข้ามาพักอาศัยในห้องพักอาศัย\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๔  ', bold: true },
              'ผู้เช่าสัญญาว่าจะปฏิบัติตามระเบียบข้อบังคับของอพาร์ตเม้นต์ท้ายสัญญานี้ ซึ่งคู่สัญญา\nทั้งสองฝ่ายให้ถือว่าระเบียบข้อบังคับดังกล่าวเป็นส่วนหนึ่งแห่งสัญญาเช่านี้ด้วย หากผู้เช่าละเมิดแล้วผู้ให้เช่าย่อมให้\nสิทธิตามข้อ ๑๗ และข้อ ๑๘ แห่งสัญญานี้ได้\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๕  ', bold: true },
              'ผู้ให้เช่าไม่ต้องรับผิดชอบในความสูญหายหรือความเสียหายอย่างใดๆ อันเกิดขึ้นแก่รถยนต์\nรวมทั้งทรัพย์สินต่างๆ ในรถยนต์ของผู้เช่า ซึ่งได้นำมาจอดไว้ในที่จอดรถยนต์ที่ผู้ให้เช่าจัดไว้ให้\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๖  ', bold: true },
              'ผู้เช่าตกลงว่าการผิดสัญญาเช่าเครื่องเรือนซึ่งผู้เช่าได้ทำไว้กับผู้ให้เช่าต่างหากจากสัญญานี้ ถือว่าเป็นการผิดสัญญานี้ด้วย และโดยนัยเดียวกัน การผิดสัญญานี้ย่อมถือเป็นการผิดสัญญาเช่าเครื่องเรือนด้วย\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๗  ', bold: true },
              'หากผู้เช่าประพฤติผิดสัญญาข้อหนึ่งข้อใด หรือหลายข้อก็ดี ผู้เช่าตกลงให้ผู้ให้เช่าใช้สิทธิ\nดังต่อไปนี้ ข้อใดข้อหนึ่งหรือหลายข้อรวมกันก็ได้ คือ\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๑) บอกเลิกสัญญาเช่า\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๒) เรียกค่าเสียหาย\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๓) บอกกล่าวให้ผู้เช่าปฏิบัติตามข้อกำหนดในสัญญาภายในกำหนดเวลาที่ผู้ให้เช่า\nเห็นสมควร\n',
              {
                text: '.                                  ',
                color: 'white'

              },
              '(๔) ตัดกระแสไฟฟ้า น้ำประปา และโทรศัพท์ ได้ในทันที โดยไม่จำเป็นต้องบอกกล่าว\nแก่ผู้เช่าเป็นการล่วงหน้า\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๘  ', bold: true },
              'ในกรณีที่สัญญาเช่าระงับสิ้นลง ไม่ว่าด้วยเหตุใดๆ ก็ตาม ผู้เช่าต้องส่งมอบห้อง พักอาศัยคืน\nแก่ผู้ให้เช่าทันที หากผู้เช่าไม่ปฏิบัติ ผู้ให้เช่าสิทธิกลับเข้าครอบครองห้องพักอาศัยที่ให้เช่าและขนย้ายบุคคลและ\nทรัพย์สินของผู้เช่าออกจากห้องพักดังกล่าวได้ โดยผู้เช่าเป็นผู้รับผิดชอบในความสูญหายหรือความเสียหายอย่างใดๆ อันเกิดขึ้นแก่ทรัพย์สินของผู้เช่า ทั้งผู้ให้เช่ามีสิทธิริบเงินประกันการเช่า ตามที่ระบุไว้ในสัญญาข้อ ๖ ได้ด้วย\n',
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'ข้อ ๑๙  ', bold: true },
              'ในวันทำสัญญานี้ ผู้เช่าได้ตรวจดูห้องพักอาศัยที่เช่าตลอดจนทรัพย์สินต่างๆ ในห้องพักดังกล่าว\nแล้วเห็นว่ามีสภาพปกติทุกประการ และผู้ให้เช่าได้ส่งมอบห้องพักอาศัยและทรัพย์สินต่างๆ ในห้องพักแก่ผู้เช่าแล้ว\n',
              {
                text: '.                 ',
                color: 'white'

              },
            ],
          }, {
            fontSize: 17,
            pageBreak: 'before',
            text: [
              {
                text: '.                 ',
                color: 'white'

              },
              { text: 'คู่สัญญาได้อ่านและเข้าใจข้อความในสัญญานี้โดยตลอดแล้วเห็นว่าถูกต้อง จึงได้ลงลายมือชื่อไว้เป็น\nสำคัญต่อหน้าพยาน\n\n', },
            ]
          },
          { text: 'ลงชื่อ..........................................ผู้เช่า\n', alignment: 'right', fontSize: 17, margin: [0, 0, 37, 0] },
          { text: '(..........................................)\n', alignment: 'right', fontSize: 17, margin: [0, 0, 54, 0] },
          { text: 'ลงชื่อ............................................ผู้ให้เช่า\n', alignment: 'right', fontSize: 17, margin: [0, 0, 20, 0] },
          { text: '(..........................................)\n', alignment: 'right', fontSize: 17, margin: [0, 0, 54, 0] },
          { text: 'ลงชื่อ............................................พยาน\n', alignment: 'right', fontSize: 17, margin: [0, 0, 26, 0] },
          { text: '(..........................................)\n', alignment: 'right', fontSize: 17, margin: [0, 0, 54, 0] },
          { text: 'ลงชื่อ............................................พยาน\n', alignment: 'right', fontSize: 17, margin: [0, 0, 26, 0] },
          { text: '(..........................................)\n', alignment: 'right', fontSize: 17, margin: [0, 0, 54, 0] },
        ],
        styles: {
          header: {
            fontSize: 20,
            alignment: 'center',
            bold: 'true',
            margin: [0, 0, 0, 10]
          },
          align_right: {
            fontSize: 16,
            alignment: 'right',
            margin: [0, 10, 0, 30]
          },
          content: {
            margin: [50, 0, 0, 0]
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
        watermark: { text: 'AA Place', color: 'blue', opacity: 0.1, bold: true },
      };

      switch (option) {
        case 'open': pdfMake.createPdf(pdf_file).open(); break;
        case 'print': pdfMake.createPdf(pdf_file).print(); break;
        case 'download': pdfMake.createPdf(pdf_file).download(`สัญญาเช่าห้อง_${data.room_number}`); break;

        default: pdfMake.createPdf(pdf_file).open(); break;
      }
    })
  }

  addUpdatePhoto(data) {
    if (data.photo_1 != null && data.photo_2 != null && data.photo_3 != null) {
      this.dialogService.openDialogAddPhotoLease(this.token, 'แก้ไขรูปสัญญาเช่าห้อง', 'แก้ไขข้อมูล', data).afterClosed().subscribe(res => {
        if (res === true) {
          this.reloadPage()
        }
      })
    } else {
      this.dialogService.openDialogAddPhotoLease(this.token, 'เพิ่มรูปข้อมูลสัญญาห้อง', 'บันทึกข้อมูล', data).afterClosed().subscribe(res => {
        if (res === true) {
          this.reloadPage()
        }
      })
    }
  }

  viewImg(data) {
    this.dialogService.openDialogViewImgLease(data).afterClosed().subscribe(res => {
    })
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
