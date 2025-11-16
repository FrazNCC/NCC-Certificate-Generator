function renderCertificate() {
  const type = document.getElementById('certificateType').value;
  const student = document.getElementById('studentName').value;
  const course = document.getElementById('courseName').value;
  const lecturer = document.getElementById('lecturerName').value;
  const date = document.getElementById('issueDate').value;

  if (!student || !course || !lecturer || !date) {
    alert('Please fill in all fields.');
    return;
  }

  // Main color palette
  const colors = {
    gold: "#D4AF37",
    navy: "#1a1a2e",
    cream: "#FBF8F3",
    burgundy: "#800020"
  };

  // Certificate heading styling based on type
  let headingColor = colors.navy;
  if (type === "Excellence") headingColor = colors.burgundy;

  // Create certificate HTML
  const certHTML = `
    <div id="certArea" style="
      position:relative;
      width:930px; height:690px;
      background:${colors.cream};
      margin:0 auto;
      border:0;
      font-family:Georgia, Garamond, serif;">
      <svg width="930" height="690" style="position:absolute;left:0;top:0;z-index:0;">
        <rect x="6" y="6" width="918" height="678" rx="21" fill="none" stroke="${colors.gold}" stroke-width="12"/>
        <rect x="30" y="30" width="870" height="630" rx="10" fill="none" stroke="${colors.navy}" stroke-width="2"/>
        <!-- Ornamental corner flourishes -->
        <text x="60" y="80" fill="${colors.gold}" font-size="42">&#10022;</text>
        <text x="870" y="80" fill="${colors.gold}" font-size="42">&#10022;</text>
        <text x="60" y="650" fill="${colors.gold}" font-size="42">&#10022;</text>
        <text x="870" y="650" fill="${colors.gold}" font-size="42">&#10022;</text>
        <!-- Decorative ribbon behind heading -->
        <rect x="260" y="125" width="410" height="58" rx="28" fill="${colors.gold}" opacity="0.14"/>
      </svg>
      <div style="position:absolute;top:40px;width:100%;text-align:center;">
        <div style="font-family:Georgia,Garamond,serif;font-size:48px;font-weight:bold;color:${headingColor};letter-spacing:2px;">
          Certificate of ${type}
        </div>
        <div style="margin:0;font-size:15px;color:${colors.navy};font-family:Baskerville,Georgia,serif;">
          <span style="font-size:18px;">This certifies that</span>
        </div>
        <div style="margin:18px 0 8px;font-size:40px;color:${colors.gold};font-family:Garamond,serif;font-weight:bold;">
          ${student}
        </div>
        <div style="margin-top:0;font-size:15px;color:${colors.navy};">
          <span>has successfully completed the course</span>
        </div>
        <div style="margin:12px 0;font-size:26px;font-family:Georgia,serif;color:${colors.navy};font-weight:bold;border-bottom:2px solid ${colors.gold};display:inline-block;">
          ${course}
        </div>
        <div style="margin:12px 0 0;font-size:14px;color:${colors.navy};font-style:italic;">
          under the distinguished instruction of
        </div>
        <div style="margin:3px 0 8px;font-size:18px;color:${colors.navy};font-family:Garamond,serif">
          ${lecturer}
        </div>
      </div>
      <div style="position:absolute;bottom:60px;width:100%;text-align:center;">
        <div style="font-size:12px;color:${colors.navy};margin-top:36px;">
          <span style="margin-right:10px;">Issued on:</span>
          <span style="font-weight:bold;">${date}</span>
        </div>
        <div style="margin:16px auto 0 auto;width:230px;">
          <span style="font-size:14px;color:${colors.navy};">____________________</span>
          <br>
          <span style="font-size:12px;color:${colors.navy};">Issued By</span>
        </div>
      </div>
      <!-- Academic emblem/badge -->
      <svg width="75" height="75" style="position:absolute;top:25px;left:60px;">
        <circle cx="37.5" cy="37.5" r="35" fill="${colors.gold}" stroke="${colors.navy}" stroke-width="2"/>
        <text x="37.5" y="47" text-anchor="middle" fill="${colors.navy}" font-size="32px" font-family="Georgia,serif">&#x1f393;</text>
      </svg>
    </div>
  `;
  document.getElementById("certificatePreview").innerHTML = certHTML;
}

window.downloadPDF = function() {
  const student = document.getElementById('studentName').value;
  const course = document.getElementById('courseName').value;

  html2canvas(document.getElementById('certArea'), { scale:2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF('landscape', 'pt', [930, 690]);
    pdf.addImage(imgData, 'PNG', 0, 0, 930, 690);
    pdf.save(`${course}_${student}.pdf`);
  });
};
