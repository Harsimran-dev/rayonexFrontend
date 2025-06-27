import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Router } from '@angular/router';

import html2canvas from 'html2canvas';

import { jsPDF } from 'jspdf';

import { forkJoin } from 'rxjs';
import { ExcelServiceService } from 'src/app/services/excel-service.service';
import { CAUSES_MAPPING } from 'src/app/enum/causes';
import { ActivatedRoute, Params } from '@angular/router';
import { PdfDataService } from 'src/app/services/pdf-data.service';
import { TabSwitchService } from 'src/app/services/tab-switch.service';


@Component({
  selector: 'app-word-reader',
  templateUrl: './word-reader.component.html',
  styleUrls: ['./word-reader.component.scss']
})
export class WordReaderComponent implements AfterViewInit {


  @ViewChild('pieChartCanvas') pieChartCanvas: any;
  colorCounts: { [color: string]: number } = {};
  clientData: any;
  showPieChart: boolean = false;
  pdfUrl: string | null = null;
  rahIdNumber: string | undefined;
  showPdfPreview: boolean = false;
  levelGroups: { [level: string]: string[] } = {
    "VERY HIGH (80% - 100%)": [],
    "HIGH (50% - 79%)": [],
    "MODERATE (30% - 49%)": [],
    "LOW (0% - 29%)": []
  };
  pendingRequests: number = 0;
  pdfBase64Url: string | undefined;

  causeGroups: any[] = [];
  patientName:string | null | undefined;
  expandedCauseGroup: boolean[] = [];
  showRootCauses = true; // default to visible
  rahHeaderSection: string = ""; 


  extractedCodes: string[] = [];
  causeCounts: { [key: string]: number } = {};
  causeCodes: { [key: string]: { code: string, name: string, percentage: number, color: string }[] } = {};  
  legendColors: string[] = [];

  causeDetailsVisibility: { [key: string]: boolean } = {};  
  selectedExcelRecord: any = null;  
  objectKeys = Object.keys;
  pdfSrc: SafeResourceUrl | null = null;
  private chartColors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#E7E9ED', '#8DD3C7', '#BEBADA', '#FB8072', '#80B1D3', '#FDB462'
  ];

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      }
    ]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(private tabSwitchService: TabSwitchService, private pdfDataService: PdfDataService,  private router: Router , private route: ActivatedRoute,private excelService: ExcelServiceService,public dialog: MatDialog,  private cdRef: ChangeDetectorRef,private sanitizer: DomSanitizer,private cdr: ChangeDetectorRef) {}

  async readFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resetData();
      console.log("📂 File selected:", file.name);
  
      if (file.type === "application/pdf") {
        const objectURL = URL.createObjectURL(file);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL); // Sanitize URL
        await this.readPDF(file);
      } else {
        console.warn("⚠️ Unsupported file format. Please upload a PDF.");
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const pdfBase64Url = this.pdfDataService.getPdfData();
    console.log("ngOnChanges in WordReader", pdfBase64Url);

    if (pdfBase64Url) {
      const pdfBase64 = pdfBase64Url.replace('data:application/pdf;base64,', '');
      this.loadPDFFromBase64(pdfBase64);
    }
  }


  ngOnInit() {
    // Get base64 string from service
    this.tabSwitchService.tabChange$.subscribe(index => {
      if (index === 2) { // Analysis tab
        const pdfBase64Url = this.pdfDataService.getPdfData();
        if (pdfBase64Url) {
          const pdfBase64 = pdfBase64Url.replace('data:application/pdf;base64,', '');
          this.loadPDFFromBase64(pdfBase64);
        }
      }
    });
  }

  async loadPDFFromBase64(base64: string) {
    this.resetData();

    // Decode base64 to binary
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create Blob from binary data
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Pass Blob to the reader function
    await this.readFileFromBlob(blob);
  }

  async readFileFromBlob(blob: Blob) {
    if (blob) {
      this.resetData();
      console.log("📂 Blob received, size:", blob.size);

      // Convert Blob to File (adds name and lastModified)
      const file = new File([blob], "document.pdf", { type: blob.type, lastModified: Date.now() });

      if (file.type === "application/pdf") {
        const objectURL = URL.createObjectURL(file);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        await this.readPDF(file);
      } else {
        console.warn("⚠️ Unsupported file format Blob.");
      }
    }
  }
  

  

  resetData() {
    this.extractedCodes = [];
    this.causeCounts = {};
    this.causeCodes = {}; 
    this.pieChartData.labels = [];
    this.pieChartData.datasets[0].data = [];
    this.legendColors = [];
    this.showPieChart = false;
  }

  async readPDF(file: File) {
  
    const reader = new FileReader();
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
    }

    console.log("📖 Extracted Text:", extractedText);
    this.processExtractedText(extractedText);
    const clientData = this.extractClientData(extractedText);
    console.log("Client Data:", clientData);
    const fileName = file.name;
    const rahIdMatch = fileName.match(/(\d{6}-\d{6})/); // Match pattern for numbers like 250202-180916
  
    if (rahIdMatch) {
      const rahId = rahIdMatch[0]; // Extracted RAH ID
      console.log("Extracted RAH ID:", rahId);
      this.rahIdNumber = rahId; // Store the extracted RAH ID number in the variable
    }
    const causeCount = this.getSortedCauses().length;
    console.log(this.expandedCauseGroup)
    this.expandedCauseGroup = new Array(causeCount).fill(true);
  }

  extractClientData(text: string) {
    // Adjusted regex patterns
    const namePattern = /Rayoscan\s*-\s*RAH\s*Scan\s*-\s*([A-Za-z\s]+)\s*Client\s*data/;
    const surnamePattern = /Surname:\s*([A-Za-z\s\-]+)\s*First\s*name:\s*([A-Za-z\s\-]+)/;
    const dobPattern = /Date\s*of\s*birth:\s*(\d{1,2}\.\d{1,2}\.\d{4})/;
  
    // Test for matches
    const nameMatch = text.match(namePattern);
    const surnameFirstNameMatch = text.match(surnamePattern);
    const dobMatch = text.match(dobPattern);
  
    // Extract the values
    const fullName = nameMatch ? nameMatch[1].trim() : null;
    this.patientName=fullName;
    const surname = surnameFirstNameMatch ? surnameFirstNameMatch[1].trim() : null;
    const firstName = surnameFirstNameMatch ? surnameFirstNameMatch[2].trim() : null;
    const dateOfBirth = dobMatch ? dobMatch[1].trim() : null;
  
    // Helper function to format the date to yyyy-mm-dd (without time)
    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
      const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
      return `${day}-${month}-${year}`;
    };
  
    // Parse Date of Birth
    let parsedDateOfBirth: Date | null = null;
    let formattedDob: string | null = null;
    if (dateOfBirth) {
      const [day, month, year] = dateOfBirth.split('.');
      parsedDateOfBirth = new Date(Number(year), Number(month) - 1, Number(day)); // Properly create Date object
      formattedDob = formatDate(parsedDateOfBirth); // Format date to yyyy-mm-dd
    }
  
    // Store the extracted data
    this.clientData = {
      fullName,
      surname,
      firstName,
      dateOfBirth: formattedDob, // Only store formatted date as string
    };
  
    // Log for verification
    console.log("Extracted Client Data:", this.clientData);
  }
  
  
  
  countColors() {
    this.colorCounts = {};

    // Iterate through causeCodes and count occurrences of each color
    for (const cause in this.causeCodes) {
      if (this.causeCodes.hasOwnProperty(cause)) {
        this.causeCodes[cause].forEach(item => {
          const color = item.color;
          this.colorCounts[color] = (this.colorCounts[color] || 0) + 1;
        });
      }
    }
  }
  calculatePercentage(colorCount: number): number {
    const totalCount = 40; // As mentioned, the total is 40
    return parseFloat(((colorCount / totalCount) * 100).toFixed(2)); // Converts the string back to a number
  }
  
  processExtractedText(text: string) {
    const regex = /(\d{2}\.\d{2})\s+([^\d%][^%]+?)\s+(\d{1,3})%/g;
  
    const highPercentageRahIds: { rahId: string, name: string, percentage: number, cause: string }[] = [];
    const categoryCounts: { [key: string]: number } = {};
    const categoryCodes: { [key: string]: { code: string, name: string, percentage: number, color: string }[] } = {};
  
    let match;
  
    // ✅ Improved Smart Clean: Skip 'RAH 46.00...' header and start from first line with: XX.XX SomeName 100%
   // Match the actual start of useful data
// Match the actual start of useful data
const actualStartMatch = text.match(/(\d{2}\.\d{2})\s+[^\d%]+\s+(\d{1,3})%/);

if (actualStartMatch && actualStartMatch.index !== undefined) {
  const headerPortion = text.substring(0, actualStartMatch.index);

  // Match only the line that starts with "RAH" and ends before "No." or a newline
  const rahLineMatch = headerPortion.match(/RAH\s+\d{2}\.\d{2}\s+(.+?)\s+(No\.|Program name|$)/);
  if (rahLineMatch) {
    const rahCleaned = ` ${rahLineMatch[0].split("No.")[0].trim()}`;
    this.rahHeaderSection = rahCleaned;
    console.log( this.rahHeaderSection)
  }

  text = text.substring(actualStartMatch.index);
}



  
    while ((match = regex.exec(text)) !== null) {
      const code = match[1]?.trim();
      const name = match[2]?.trim();
      const percentage = parseInt(match[3]);
      const prefix = code.substring(0, 2);
  
      const cause = CAUSES_MAPPING[prefix] || "Unknown cause";
      const color = this.getColorForFrequency(code);
  
      console.log(`🔍 Processing: Code=${code}, Name=${name}, Percentage=${percentage}, Cause=${cause}, Color=${color}`);
  
      if (!categoryCounts.hasOwnProperty(cause)) {
        categoryCounts[cause] = 0;
        categoryCodes[cause] = [];
      }
  
      categoryCounts[cause] += 1;
      categoryCodes[cause].push({ code, name, percentage, color });
  
      highPercentageRahIds.push({ rahId: code, name, percentage, cause });

    }
  
    // Assign to component properties
    this.causeCounts = categoryCounts;
    this.causeCodes = categoryCodes;
    this.countColors();
  
    // Fetch details for 100% entries
    highPercentageRahIds.forEach(record => this.fetchExcelRecord(record.rahId, record.name, record.percentage,record.cause));
  
    // Update Pie Chart
    this.pieChartData.labels = Object.keys(this.causeCounts);
    this.pieChartData.datasets[0].data = Object.values(this.causeCounts);
    this.legendColors = this.chartColors.slice(0, this.pieChartData.labels.length);
    this.pieChartData.datasets[0].backgroundColor = [...this.legendColors];
  
    this.showPieChart = true;
    this.updatePieChart();
  }
  
  
  
  
  
  toggleCause(index: number) {
    this.causeGroups[index].showDetails = !this.causeGroups[index].showDetails;
  }
  printPage() {
    const printContent = document.getElementById('printSection');
    const printWindow = window.open('', '', 'height=800,width=1000');
  
    if (printContent && printWindow) {
      // Replace all <textarea> with static <div>
      const textareas = printContent.querySelectorAll('textarea');
      const replacements: { original: HTMLTextAreaElement; replacement: HTMLDivElement }[] = [];
  
      textareas.forEach((textarea) => {
        const div = document.createElement('div');
        div.textContent = textarea.value;
        div.style.cssText = window.getComputedStyle(textarea).cssText;
        div.style.whiteSpace = 'pre-wrap';
        textarea.parentNode?.replaceChild(div, textarea);
        replacements.push({ original: textarea, replacement: div });
      });
  
      const rahId = this.rahIdNumber || 'RAHID';
      const patientName = this.clientData?.fullName || 'Patient';
      const pdfTitle = `${patientName}_${rahId}_Rayoscan_Report`;
  
      // Clone styled content for Base64 PDF generation
      html2canvas(printContent).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
        const base64String = pdf.output('datauristring');
        const pureBase64 = base64String.split(',')[1];
  
        // Save Base64 in service
        this.pdfDataService.setPdfData(pureBase64);
  
        // Optional: navigate to preview component
        this.router.navigate(['/component/create-treatment-plan']);
      });
      console.log("Hello")
  
      // Rebuild the print window for actual printing
      printWindow.document.write(`
        <html>
          <head>
            <title>${pdfTitle}</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
            <style>
              /* [Your full inline CSS here] */
              body {
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
                  Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 20px;
                background-color: #f8f9fa;
                color: #333;
                font-size: 14px;
              }
              .report-section { background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 30px; }
              .section-title { font-weight: 600; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #ccc; padding-bottom: 5px; text-align: center; text-transform: uppercase; color: #222; }
              .color-counts ul { list-style: none; padding-left: 0; margin: 0; }
              .color-counts li { display: flex; align-items: center; margin-bottom: 8px; }
              .color-counts span { width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 10px; }
              .cause-card { border: none; padding: 10px; margin-bottom: 10px; border-radius: 8px; background-color: #fdfdfd; box-shadow: inset 0 0 0 1px #e0e0e0; }
              .cause-card ul { padding-left: 15px; margin: 0; }
              .causes-box { border: 1px solid #bbb; border-radius: 10px; padding: 20px; margin-bottom: 30px; background-color: #fdfdfd; box-shadow: none; }
              .edit-description-container { background-color: #fff; border: none; padding: 20px; border-radius: 10px; }
              .edit-description-container h5 { font-size: 16px; font-weight: 600; margin-bottom: 12px; text-decoration: underline; }
              .info-box { border: 1px solid #ccc; border-radius: 10px; padding: 16px; background-color: #f9f9f9; margin-top: 16px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px; margin: 0 auto; }
              .info-box h5 { margin-top: 0; color: #333; text-align: center; font-weight: bold; }
              .info-row { margin-bottom: 8px; }
              .signature { margin-top: 20px; }
              .causes-wrapper { max-height: none !important; overflow: visible !important; }
              .note { font-size: 12px; color: #777; font-style: italic; text-align: center; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="report-section">
              ${printContent.innerHTML}
            </div>
          </body>
        </html>
      `);
  
      printWindow.document.close();
  
      replacements.forEach(({ original, replacement }) => {
        replacement.parentNode?.replaceChild(original, replacement);
      });
  
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  }
  
  
  
  
  
  
  
  getColorForFrequency(code: string): string {
    const frequency = parseFloat(code);
  
    if ((frequency >= 20.05 && frequency <= 27.05) || (frequency >= 8.0 && frequency <= 8.99)) {
      return 'red';
  }

  // Blue: Frequency between 6.00 and 10.95 (inclusive)
  if (frequency >= 6.00 && frequency <= 10.95) {
      return 'blue';
  }

  // Green: Frequency between 2.00 and 5.00 (inclusive)
  if (frequency >= 2.00 && frequency <= 5.00) {
      return 'green';
  }

  // Orange: Frequency between 30.00 and 77.00 (inclusive)
  if (frequency >= 30.00 && frequency <= 77.00) {
      return 'orange';
  }

  return 'black';  // Default color for frequencies outside the specified ranges
  }
  
  


  

  toggleCauseDetails(index: number) {
    // Toggle the expanded state for the given index
    this.expandedCauseGroup[index] = !this.expandedCauseGroup[index];
    console.log('Toggled cause group details:', this.expandedCauseGroup[index]);
    this.cdr.detectChanges(); // Ensure changes are reflected in the UI
  }
  
  
  getSortedCauses(): { cause: string, items: any[], showDetails: boolean }[] {
    const colorTotals: { [color: string]: number } = { red: 0, blue: 0, green: 0, orange: 0 };
  
    // Calculate total percentage per color
    for (const cause in this.causeCodes) {
      this.causeCodes[cause].forEach(item => {
        colorTotals[item.color] = (colorTotals[item.color] || 0) + item.percentage;
      });
    }
  
    // Sort colors by total percentage in descending order
    const sortedColors = Object.entries(colorTotals)
      .sort(([, totalA], [, totalB]) => totalB - totalA)
      .map(([color]) => color);
  
    // Group causes by color
    const colorGroupedCauses: { [color: string]: { cause: string, items: any[], showDetails: boolean }[] } = {};
    const seenCauses = new Set();
  
    for (const cause in this.causeCodes) {
      if (!seenCauses.has(cause)) {
        const causeItems = this.causeCodes[cause];
        const firstItemColor = causeItems[0]?.color;
  
        if (!colorGroupedCauses[firstItemColor]) {
          colorGroupedCauses[firstItemColor] = [];
        }
  
        // Initialize showDetails for each cause group
        colorGroupedCauses[firstItemColor].push({ cause, items: causeItems, showDetails: false });
        seenCauses.add(cause);
      }
    }
  
    // Sort causes by color and return them
    const sortedCauses: { cause: string, items: any[], showDetails: boolean }[] = [];
    sortedColors.forEach(color => {
      if (colorGroupedCauses[color]) {
        sortedCauses.push(...colorGroupedCauses[color]);
      }
    });
  
    return sortedCauses;
  }
  trackByCause(index: number, causeGroup: any) {
    return causeGroup.cause;  // Track by unique cause
  }
  
  



  togglePdfPreview() {
    this.showPdfPreview = !this.showPdfPreview;
  }

  fetchExcelRecord(rahId: string, name: string, percentage: number, cause: string) {
    this.pendingRequests++;
  
    this.excelService.searchRahId(rahId).subscribe(
      (description: string | null) => {
        console.log("🚀 Fetched Description:", description);
  
        const sortedColors = Object.entries(this.colorCounts)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0]);
  
        const dominantColor = sortedColors[0] || '';
        const secondDominantColor = sortedColors[1] || '';
  
        const getCausesForColor = (color: string): string[] => {
          return Object.entries(this.causeCodes)
            .filter(([cause, items]) => items.some(item => item.color === color))
            .map(([cause]) => cause);
        };
  
        const dominantCauses = getCausesForColor(dominantColor);
        const secondDominantCauses = getCausesForColor(secondDominantColor);
  
        let imbalanceLevel = '';
        let percentageRange = '';
        if (percentage >= 90) {
          imbalanceLevel = 'VERY HIGH';
          percentageRange = '90% - 100%';
        } else if (percentage >= 75) {
          imbalanceLevel = 'HIGH';
          percentageRange = '75% - 89%';
        } else {
          this.pendingRequests--;
          return; // Skip if outside required range
        }
  
        const levelKey = percentageRange;
  
        if (!this.levelGroups[levelKey]) {
          this.levelGroups[levelKey] = [];
        }
  
        const entry =
          `𝗖𝗔𝗨𝗦𝗘: ${cause.toUpperCase()}\n` + // Display cause
          `𝗡𝗔𝗠𝗘: ${name.toUpperCase()}\n` +   // Display name
          `𝗟𝗘𝗩𝗘𝗟: ${imbalanceLevel} (${percentageRange})\n` +
          `Description: ${description}\n=========================\n\n`;
  
        this.levelGroups[levelKey].push(entry);
  
        this.pendingRequests--;
  
        if (this.pendingRequests === 0) {
          this.assembleFullDescription(dominantColor, dominantCauses, secondDominantColor, secondDominantCauses);
        }
      },
      (error: any) => {
        console.error("❌ Error fetching record:", error);
        this.pendingRequests--;
  
        if (this.pendingRequests === 0) {
          this.assembleFullDescription('', [], '', []);
        }
      }
    );
  }
  toUnicodeBold(text: string): string {
    const offsetMap: { [key: string]: number } = {
      'lower': 0x1D41A - 'a'.charCodeAt(0), // a-z
      'upper': 0x1D400 - 'A'.charCodeAt(0), // A-Z
      'digit': 0x1D7CE - '0'.charCodeAt(0)  // 0-9
    };
  
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (char >= 'a' && char <= 'z') {
        return String.fromCodePoint(code + offsetMap['lower']);
      } else if (char >= 'A' && char <= 'Z') {
        return String.fromCodePoint(code + offsetMap['upper']);
      } else if (char >= '0' && char <= '9') {
        return String.fromCodePoint(code + offsetMap['digit']);
      } else {
        return char; // keep punctuation and spaces as is
      }
    }).join('');
  }
  
  
  
  
  assembleFullDescription(
    dominantColor: string,
    dominantCauses: string[],
    secondDominantColor: string,
    secondDominantCauses: string[]
  ) {
    let finalDescription = '';
    let veryHighIntroAdded = false;
    let highIntroAdded = false;
  
    const levelsOrder = ["90% - 100%", "75% - 89%"];
  
    for (const level of levelsOrder) {
      const entries = this.levelGroups[level];
      if (entries && entries.length > 0) {
        if (level === "90% - 100%" && !veryHighIntroAdded) {
          finalDescription += `The detailed scan shows 𝗩𝗘𝗥𝗬 𝗵𝗶𝗴𝗵 𝗲𝗻𝗲𝗿𝗴𝗲𝘁𝗶𝗰 𝗶𝗺𝗯𝗮𝗹𝗮𝗻𝗰𝗲𝘀 90%-100% in:\n\n\n`;
          veryHighIntroAdded = true;
        } else if (level === "75% - 89%" && !highIntroAdded) {
          finalDescription += `\n----------------------------------------\n\n`;
          finalDescription += `The detailed scan shows 𝗵𝗶𝗴𝗵 𝗲𝗻𝗲𝗿𝗴𝗲𝘁𝗶𝗰 𝗶𝗺𝗯𝗮𝗹𝗮𝗻𝗰𝗲𝘀 89% -75% in:\n\n\n`;
          highIntroAdded = true;
        }
  
        entries.forEach(entry => {
          const lines = entry.split('\n');
          const causeLine = lines.find(line => line.startsWith('𝗖𝗔𝗨𝗦𝗘:')) || '';
          const nameLine = lines.find(line => line.startsWith('𝗡𝗔𝗠𝗘:')) || '';
          const descLine = lines.find(line => line.trim().startsWith('Description:')) || '';
  
          const name = nameLine.replace('𝗡𝗔𝗠𝗘:', '').trim();
          const cause = causeLine.replace('𝗖𝗔𝗨𝗦𝗘:', '').trim();
  
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
          const formattedCause = cause.toLowerCase();
  
          if (level === "90% - 100%") {
            const rawName = nameLine.replace('𝗡𝗔𝗠𝗘:', '').trim();
            const boldName = this.toUnicodeBold(rawName);
            finalDescription += `${boldName} (${causeLine.replace('𝗖𝗔𝗨𝗦𝗘:', '').trim().toLowerCase()})\n\n${descLine}\n`;
            finalDescription += `\n----------------------------------------\n\n`;

          } else {
            finalDescription += `${formattedName} (${formattedCause})\n`;
          }
       
        });
      }
    }
  
    if (this.selectedExcelRecord) {
      this.selectedExcelRecord.fullDescription = finalDescription;
    } else {
      this.selectedExcelRecord = {
        rahId: '',
        name: '',
        description: '',
        fullDescription: finalDescription
      };
    }
  
    this.cdRef.detectChanges();
  }
  
  
  

  fetchExcelRecordPopup(rahId: string, name: string) {
    this.excelService.searchRahId(rahId).subscribe(
      (description: string | null) => {
        if (description) {
          const message =
  `The detailed scan shows high energetic imbalances in:
  
  CAUSE: ${name.toUpperCase()}
  Description: ${description}`;
  
          alert(message);
        } else {
          alert("No description found for RAH ID: " + rahId);
        }
      },
      (error: any) => {
        console.error("❌ Error fetching record:", error);
        alert("Something went wrong. Please try again.");
      }
    );
  }
  
  
  
  
  
  

  updatePieChart() {
    if (this.pieChartCanvas?.chart) {
      this.pieChartCanvas.chart.update();  
    } else {
      console.log("⚠️ Chart not initialized yet.");
    }
  }

  togglePieChart() {
    this.showPieChart = !this.showPieChart;
    if (this.showPieChart) {
      this.updatePieChart();
    }
  }


  

  ngAfterViewInit() {
    this.cdRef.detectChanges();  
    this.updatePieChart();
  }
}