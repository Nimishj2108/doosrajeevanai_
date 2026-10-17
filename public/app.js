/**
 * Doosra Jeevan | दूसरा जीवन
 * Complete Application State Machine & Blockchain Simulation Engine
 * Supports 87 Patients across 10 Donatable Organs under NOTTO THOA Protocol
 */

class OrganTwinApp {
  constructor() {
    window.app = this;
    this.patients = [];
    this.decisionLogs = [];
    this.archivedPatients = [];
    this.fetchedPatients = [];
    this.donorHistory = [];
    this.role = 'admin'; // 'admin' | 'consumer'
    this.selectedOrgan = 'Eyes';
    this.activePatientId = 'PT-001';
    this.activeCustodyOrgan = 'Heart';
    this.activeAnimMode = 'perfusion'; // 'perfusion' | 'xray' | 'thermal'
    this.tamperAlertActive = false;
    this.custodyAnimInterval = null;
    this.clearanceUploaded = { 1: false, 2: false };
    
    this.organAnimationInterval = null;
    this.allocationTimerInterval = null;
    this.networkCanvasInterval = null;
    this.scannerInterval = null;
    this.expandedCards = new Set();
    this.currentFontSize = 16;
    
    this.organWaitlistMap = {};
    this.leafletMap = null;
    this.mapMarkers = [];
    this.mapRouteLine = null;
    this.activeTransportIndex = 0;

    // Patient Portal Document Filters & Active State
    this.patientDocFilter = 'all';
    this.patientDocSearch = '';
    this.activeDocReport = null;

    // Registry Dashboard & 100-Hospital Dataset State
    this.selectedBloodGroupFilter = 'ALL';
    this.selectedDashboardState = 'ALL';
    this.selectedDashboardOrgan = 'ALL';
    this.selectedDashboardType = 'ALL';
    this.selectedSpotlightHospitalId = 1;
    this.hospitalSearchQuery = '';

    // Anomaly Scanner & 9-Node BFT Quorum State
    this.anomalyTab = 'nodes'; // 'nodes' | 'ledger' | 'telemetry'
    this.isAnomalyDetected = false;
    this.isAttacking = false;
    this.isHealing = false;
    this.expandedAnomalyHistoryId = null;
    this.activeRawBlockJson = null;
    this.anomalyNodes = [];
    this.anomalyHistory = [];
    this.anomalyAuditLogs = [];

    this.organList = [
      { id: 'Eyes', nameEn: 'Eyes (Cornea)', nameHi: 'आँखें / कॉर्निया', icon: '👁️' },
      { id: 'Heart', nameEn: 'Heart', nameHi: 'हृदय', icon: '🫀' },
      { id: 'Liver', nameEn: 'Liver', nameHi: 'यकृत / लिवर', icon: '🩸' },
      { id: 'Kidney', nameEn: 'Kidney', nameHi: 'गुर्दे / किडनी', icon: '🧬' },
      { id: 'Blood', nameEn: 'Blood / Stem Cells', nameHi: 'रक्त / स्टेम सेल', icon: '💉' },
      { id: 'Lungs', nameEn: 'Lungs', nameHi: 'फेफड़े / लंग्स', icon: '🫁' },
      { id: 'Pancreas', nameEn: 'Pancreas', nameHi: 'अग्न्याशय', icon: '⚡' },
      { id: 'Skin', nameEn: 'Skin (Tissue)', nameHi: 'त्वचा / टिश्यू', icon: '🩹' },
      { id: 'Bone Marrow', nameEn: 'Bone Marrow', nameHi: 'अस्थि मज्जा', icon: '🦴' },
      ];

    this.organSpecs = {
      'Eyes': {
        efficiency: 'Stromal Clarity: 95% (Optimal)',
        vitals: 'Endothelial Cell Count: 2850 cells/mm² · Pachymetry: 535 µm · Corneal Diameter: 11.5 mm',
        tests: 'Pre-op Eye Viral Screen (HIV/HCV) & SOTTO Specimen Form-B',
        docs: [
          { id: 1, name: 'Pre-op Eye Viral Screen (HIV/HCV)', code: 'DOC-EYE-01' },
          { id: 2, name: 'SOTTO Specimen Form-B Clearance', code: 'DOC-EYE-02' }
        ]
      },
      'Heart': {
        efficiency: 'LVEF (Ejection Fraction): 64%',
        vitals: 'Cardiac Output: 5.6 L/min · Ischemic Time: 1h 40m · Crossmatch: Negative Cytotoxic',
        tests: 'Hemodynamic Stability Chart & Medical Board Form-A',
        docs: [
          { id: 1, name: 'Hemodynamic Stability Chart', code: 'DOC-HRT-01' },
          { id: 2, name: 'Apex Medical Board Form-A', code: 'DOC-HRT-02' }
        ]
      },
      'Liver': {
        efficiency: 'Steatosis Index: 4.2% (Optimal Healthy)',
        vitals: 'ICG-R15 Clearance: 7.9% · Graft-to-Recipient Weight: 1.18% · Portal Velocity: 28 cm/s',
        tests: 'Liver Function Panel Clearance & Anesthesia Certificate',
        docs: [
          { id: 1, name: 'Liver Function Panel Clearance', code: 'DOC-LIV-01' },
          { id: 2, name: 'State Anesthesia Certificate', code: 'DOC-LIV-02' }
        ]
      },
      'Kidney': {
        efficiency: 'eGFR Clearance: 96 mL/min (Optimal >90)',
        vitals: 'Cold Ischemia: 3h 05m · HLA Mismatch: 0/6 (Exact Match) · Flow Crossmatch: Negative',
        tests: 'Crossmatch Immunological Screen & Biometric Consent Form-D',
        docs: [
          { id: 1, name: 'Crossmatch Immunological Screen', code: 'DOC-REN-01' },
          { id: 2, name: 'Biometric Consent Form-D', code: 'DOC-REN-02' }
        ]
      },
      'Blood': {
        efficiency: 'Hemoglobin: 14.2 g/dL · Platelets: 280,000 /µL',
        vitals: 'CD34+ Enumeration: 6.8 × 10⁶ /kg · CMV Status: Concordant Negative · Screening: Clean',
        tests: 'Blood Component Typing & NAT Testing Clearance',
        docs: [
          { id: 1, name: 'Blood Component Typing Panel', code: 'DOC-BLD-01' },
          { id: 2, name: 'NAT Viral Nucleic Acid Certificate', code: 'DOC-BLD-02' }
        ]
      },
      'Lungs': {
        efficiency: 'PaO2/FiO2 Ratio: 445 mmHg (Optimal Gas Exchange)',
        vitals: 'Cold Ischemia: 2h 10m · Bronchoscopy: Clean Airways · Lung Compliance: 54 mL/cmH2O',
        tests: 'Pulmonary Arterial Pressure Chart & Thoracic Board Form-E',
        docs: [
          { id: 1, name: 'Pulmonary Arterial Pressure Chart', code: 'DOC-LNG-01' },
          { id: 2, name: 'Thoracic Board Form-E', code: 'DOC-LNG-02' }
        ]
      },
      'Pancreas': {
        efficiency: 'C-Peptide Secretion: 3.5 ng/mL · Beta-Cell Mass: High',
        vitals: 'Amylase/Lipase: Normal · Islet Viability: 97.4% · Cold Preservation: 2h 30m',
        tests: 'Pancreatic Islet Viability Assay & Metabolic Clearance Form-P',
        docs: [
          { id: 1, name: 'Pancreatic Islet Viability Assay', code: 'DOC-PNC-01' },
          { id: 2, name: 'Metabolic Clearance Form-P', code: 'DOC-PNC-02' }
        ]
      },
      'Skin': {
        efficiency: 'Epidermal Viability: 96% · Bacterial Bioburden: Negative',
        vitals: 'Allograft Thickness: 0.35 mm · Preservation: Cryoprotective Glycerol · Sterility: Grade-A',
        tests: 'Skin Bio-Integrity Culture & Tissue Bank Certificate',
        docs: [
          { id: 1, name: 'Skin Bio-Integrity Culture Panel', code: 'DOC-SKN-01' },
          { id: 2, name: 'National Tissue Bank Certificate', code: 'DOC-SKN-02' }
        ]
      },
      'Bone Marrow': {
        efficiency: 'CD34+ Stem Cell Yield: 7.4 × 10⁶ cells/kg',
        vitals: 'Viability: 99.1% · HLA Match: 10/10 High-Resolution Allele Match · Engraftment Index: Fast',
        tests: 'Flow Cytometric CD34 Assay & Bone Marrow Registry Form-BM',
        docs: [
          { id: 1, name: 'Flow Cytometric CD34 Assay', code: 'DOC-BM-01' },
          { id: 2, name: 'Bone Marrow Registry Form-BM', code: 'DOC-BM-02' }
        ]
      },
      };

    this.init();
  }

  init() {
    this.runPreloader();
    this.initDatabase();
    this.initUI();
    }

  /* ══════════════════════════════════════════════
     PRELOADER & MULTI-LAYER TELEMETRY PROGRESSION
     ══════════════════════════════════════════════ */
  runPreloader() {
    const bar = document.getElementById('preloaderBar');
    const preloader = document.getElementById('preloader');
    const stageText = document.getElementById('preloaderStageText');
    const percentEl = document.getElementById('preloaderPercent');
    const p1 = document.getElementById('pNode1');
    const p2 = document.getElementById('pNode2');
    const p3 = document.getElementById('pNode3');
    const p4 = document.getElementById('pNode4');

    if (!bar || !preloader) return;

    let progress = 0;
    if (this.preloaderInterval) clearInterval(this.preloaderInterval);

    this.preloaderInterval = setInterval(() => {
      progress += 2.2;

      // Multi-Layer Loading Stages
      if (progress < 25) {
        if (stageText) stageText.textContent = "Calibrating Intracranial Telemetry (ICP / CPP / EEG)...";
        if (p1) p1.classList.add('active');
      } else if (progress < 50) {
        if (stageText) stageText.textContent = "Connecting Brain & Neurology Dept Clinical Apex...";
        if (p3) p3.classList.add('active');
      } else if (progress < 75) {
        if (stageText) stageText.textContent = "Synchronizing 9-Node Statutory BFT Consensus Quorum...";
        if (p2) p2.classList.add('active');
      } else if (progress < 95) {
        if (stageText) stageText.textContent = "Auditing 87 Recipient Waitlists across 9 Organs...";
        if (p4) p4.classList.add('active');
      } else {
        if (stageText) stageText.textContent = "Dual-UI Architecture Ready · Launching Home Screen...";
      }

      if (progress >= 100) {
        progress = 100;
        if (bar.style) bar.style.width = '100%';
        if (percentEl) percentEl.textContent = '100%';
        clearInterval(this.preloaderInterval);
        this.preloaderInterval = null;

        setTimeout(() => {
          if (preloader.style) preloader.style.opacity = '0';
          setTimeout(() => {
            if (preloader.style) preloader.style.display = 'none';
            this.initCranialNeuralCanvas();
          }, 350);
        }, 300);
      } else {
        if (bar.style) bar.style.width = Math.min(progress, 100) + '%';
        if (percentEl) percentEl.textContent = Math.round(progress) + '%';
      }
    }, 35);
  }

  skipPreloader() {
    if (this.preloaderInterval) {
      clearInterval(this.preloaderInterval);
      this.preloaderInterval = null;
    }
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        this.initCranialNeuralCanvas();
      }, 200);
    }
  }

  /* ══════════════════════════════════════════════
     DATABASE & WAITLIST REBUILDING
     ══════════════════════════════════════════════ */
  initDatabase() {
    try {
      const storedPatients = localStorage.getItem('doosra_patients_v2');
      if (storedPatients) {
        try {
          this.patients = JSON.parse(storedPatients);
        } catch (err) {
          this.patients = [];
        }
      }
      
      // If dataset is missing or corrupted/incomplete (less than 80 candidates), load full 87+ patient dataset
      if (!this.patients || !Array.isArray(this.patients) || this.patients.length < 80) {
        this.patients = window.INITIAL_DATASET ? JSON.parse(JSON.stringify(window.INITIAL_DATASET)) : [];
      }

      const storedLogs = localStorage.getItem('doosra_logs_v2');
      if (storedLogs) {
        try {
          this.decisionLogs = JSON.parse(storedLogs);
        } catch (err) {
          this.decisionLogs = [];
        }
      }
      if (!this.decisionLogs || !Array.isArray(this.decisionLogs) || this.decisionLogs.length === 0) {
        this.decisionLogs = window.INITIAL_BLOCKS ? JSON.parse(JSON.stringify(window.INITIAL_BLOCKS)) : [];
      }

      const storedArchived = localStorage.getItem('doosra_archived_v2');
      this.archivedPatients = storedArchived ? JSON.parse(storedArchived) : [];

      const storedFetched = localStorage.getItem('doosra_fetched_v2');
      this.fetchedPatients = storedFetched ? JSON.parse(storedFetched) : ['PT-001']; // PT-001 (Yashika Malhotra) is pre-verified anchor

      const storedHistory = localStorage.getItem('doosra_donor_history_v2');
      if (storedHistory) {
        try {
          this.donorHistory = JSON.parse(storedHistory);
        } catch (err) {
          this.donorHistory = [];
        }
      }
      if (!this.donorHistory || !Array.isArray(this.donorHistory) || this.donorHistory.length === 0) {
        this.donorHistory = window.INITIAL_DONOR_HISTORY ? JSON.parse(JSON.stringify(window.INITIAL_DONOR_HISTORY)) : [];
      }

      const storedOrganMap = localStorage.getItem('doosra_organ_map_v2');
      if (storedOrganMap) {
        try {
          this.organWaitlistMap = JSON.parse(storedOrganMap);
        } catch (err) {
          this.organWaitlistMap = {};
        }
      }

      // Check if organWaitlistMap contains all 10 organ queues with active patients
      const isMapComplete = this.organWaitlistMap &&
        this.organList.every(org => Array.isArray(this.organWaitlistMap[org.id]) && (this.organWaitlistMap[org.id].length > 0 || this.archivedPatients.length > 0));

      if (!isMapComplete) {
        this.initOrganWaitlists();
      }

      this.initAnomalyScannerData();

      this.saveState();
    } catch (e) {
      console.error('Failed to init DB:', e);
      this.resetDatabase();
    }
  }

  initOrganWaitlists() {
    this.organWaitlistMap = {};
    this.organList.forEach(org => {
      // Find all patients needing this organ who are not archived
      const patientIds = this.patients
        .filter(p => (p.organ_needed === org.id || p.organ === org.id) && !this.archivedPatients.includes(p.patient_id))
        .map(p => p.patient_id);
      
      this.organWaitlistMap[org.id] = patientIds;

      // Update their waitlist rank
      patientIds.forEach((pId, idx) => {
        const p = this.patients.find(item => item.patient_id === pId);
        if (p) {
          p.waitlist_rank = idx + 1;
        }
      });
    });
    this.saveState();
  }

  saveState() {
    try {
      localStorage.setItem('doosra_patients_v2', JSON.stringify(this.patients));
      localStorage.setItem('doosra_logs_v2', JSON.stringify(this.decisionLogs));
      localStorage.setItem('doosra_archived_v2', JSON.stringify(this.archivedPatients));
      localStorage.setItem('doosra_fetched_v2', JSON.stringify(this.fetchedPatients));
      localStorage.setItem('doosra_donor_history_v2', JSON.stringify(this.donorHistory));
      localStorage.setItem('doosra_organ_map_v2', JSON.stringify(this.organWaitlistMap));
    } catch (e) {
      console.warn('Storage save warning:', e);
    }
  }

  /* ══════════════════════════════════════════════
     RESET DATABASE (87 CANDIDATES & 10 ORGANS)
     ══════════════════════════════════════════════ */
  confirmResetDatabase() {
    const modal = document.getElementById('resetDbModal');
    if (modal) modal.classList.remove('hidden');
  }

  closeResetModal() {
    const modal = document.getElementById('resetDbModal');
    if (modal) modal.classList.add('hidden');
  }

  resetDatabase() {
    this.closeResetModal();

    localStorage.removeItem('doosra_patients_v2');
    localStorage.removeItem('doosra_logs_v2');
    localStorage.removeItem('doosra_archived_v2');
    localStorage.removeItem('doosra_fetched_v2');
    localStorage.removeItem('doosra_donor_history_v2');
    localStorage.removeItem('doosra_organ_map_v2');

    this.patients = window.INITIAL_DATASET ? JSON.parse(JSON.stringify(window.INITIAL_DATASET)) : [];
    this.decisionLogs = window.INITIAL_BLOCKS ? JSON.parse(JSON.stringify(window.INITIAL_BLOCKS)) : [];
    this.donorHistory = window.INITIAL_DONOR_HISTORY ? JSON.parse(JSON.stringify(window.INITIAL_DONOR_HISTORY)) : [];
    this.archivedPatients = [];
    this.fetchedPatients = [];
    this.activePatientId = 'PT-001';
    this.clearanceUploaded = { 1: false, 2: false };

    this.initOrganWaitlists();
    this.saveState();

    this.initUI();
    this.showToast('National Database Reset: 87 Candidates across 10 Organs re-established.', 'success');
  }

  /* ══════════════════════════════════════════════
     UI INITIALIZATION & NAVIGATION
     ══════════════════════════════════════════════ */
  initUI() {
    this.renderOrganTabs();
    this.renderWaitlists();
    this.renderDecisionLogs();
    this.renderArchiveVault();
    this.renderDonorHistory();
    this.renderDashboard();
    this.initConsumerLoginDropdown();
    this.updateHeaderMetrics();
    this.updateRoleView();
    this.navigate('home');
  }

  navigate(viewId) {
    const views = [
      'view-home',
      'view-neurology-dept',
      'view-donor-registration',
      'view-dashboard',
      'view-waitlists',
      'view-anomaly-scanner',
      'view-chain-custody',
      'view-ai-agent',
      'view-decision-log',
      'view-zkp-vault',
      'view-donor-history',
      'view-consumer-login',
      'view-consumer-portal'
    ];

    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.classList.add('hidden');
    });

    const target = document.getElementById('view-' + viewId);
    if (target) {
      target.classList.remove('hidden');
    }

    // Update active nav button styling
    const navButtons = [
      { id: 'navHome', target: 'home' },
      { id: 'navNeurologyDept', target: 'neurology-dept' },
      { id: 'navDonorRegistration', target: 'donor-registration' },
      { id: 'navDashboard', target: 'dashboard' },
      { id: 'navWaitlists', target: 'waitlists' },
      { id: 'navAnomalyScanner', target: 'anomaly-scanner' },
      { id: 'navChainCustody', target: 'chain-custody' },
      { id: 'navAiAgent', target: 'ai-agent' },
      { id: 'navDecisionLog', target: 'decision-log' },
      { id: 'navZkpVault', target: 'zkp-vault' },
      { id: 'navDonorHistory', target: 'donor-history' },
      { id: 'navConsumerPortal', target: 'consumer-portal' }
    ];

    navButtons.forEach(btn => {
      const el = document.getElementById(btn.id);
      if (el) {
        if (btn.target === viewId || (btn.target === 'consumer-portal' && (viewId === 'consumer-portal' || viewId === 'consumer-login'))) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });

    if (viewId === 'home') {
      this.renderHomeScreen();
    } else if (viewId === 'neurology-dept') {
      this.renderNeurologyDept();
    } else if (viewId === 'dashboard') {
      this.renderDashboard();
      setTimeout(() => this.initLeafletMap(), 100);
    } else if (viewId === 'waitlists') {
      this.renderWaitlists();
    } else if (viewId === 'anomaly-scanner') {
      this.renderAnomalyScanner();
    } else if (viewId === 'chain-custody') {
      this.renderChainCustody();
    } else if (viewId === 'ai-agent') {
      this.renderAiAgentHub();
    } else if (viewId === 'decision-log') {
      this.renderDecisionLogs();
    } else if (viewId === 'zkp-vault') {
      this.renderArchiveVault();
    } else if (viewId === 'donor-history') {
      this.renderDonorHistory();
    } else if (viewId === 'consumer-portal') {
      this.renderConsumerPortal();
    }

    // Auto-close mobile sidebar drawer upon selecting a destination
    this.toggleMobileSidebar(false);
  }

  /* ══════════════════════════════════════════════
     HOME SCREEN & INTRACRANIAL PROJECT CONTROLLERS
     ══════════════════════════════════════════════ */
  startPlatform(targetView = 'waitlists') {
    this.showToast('🚀 Launching Doosra Jeevan Organ Allocation Engine...', 'success');
    this.navigate(targetView);
  }

  renderHomeScreen() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.initCranialNeuralCanvas();

    // Subtle natural physiological variation in live ICP and CPP
    if (!this.vitalInterval) {
      this.vitalInterval = setInterval(() => {
        const icpEl = document.getElementById('liveIcpVal');
        const cppEl = document.getElementById('liveCppVal');
        if (icpEl && cppEl) {
          const baseIcp = 13.8;
          const delta = (Math.random() * 0.6 - 0.3);
          const currentIcp = (baseIcp + delta).toFixed(1);
          const mapVal = 92.4;
          const currentCpp = (mapVal - parseFloat(currentIcp)).toFixed(1);
          icpEl.innerHTML = `${currentIcp} <span class="vital-unit">mmHg</span>`;
          cppEl.innerHTML = `${currentCpp} <span class="vital-unit">mmHg</span>`;
        }
      }, 2500);
    }
  }

  simulateBrainstemAudit() {
    const badges = [
      { id: 'refBadge1', text: 'VERIFIED ABSENT (FIXED 5mm)' },
      { id: 'refBadge2', text: 'VERIFIED ABSENT (NO BLINK)' },
      { id: 'refBadge3', text: 'VERIFIED ABSENT (DOLL\'S EYE NEGATIVE)' },
      { id: 'refBadge4', text: 'VERIFIED ABSENT (COLD CALORIC NEGATIVE)' },
      { id: 'refBadge5', text: 'VERIFIED ABSENT (ZERO GAG/COUGH)' },
      { id: 'refBadge6', text: 'AUDIT PASS (PaCO₂ 64.2 mmHg)' }
    ];

    badges.forEach(b => {
      const el = document.getElementById(b.id);
      if (el) {
        el.textContent = b.text;
        el.className = 'reflex-badge pass';
      }
    });

    const statusBadge = document.getElementById('thoaCertStatusBadge');
    if (statusBadge) {
      statusBadge.innerHTML = `<span class="status-pulse-dot"></span><span>CLINICAL AUDIT COMPLETE · ALL 6 REFLEXES CERTIFIED (PASSED)</span>`;
      statusBadge.style.background = '#dcfce7';
      statusBadge.style.color = '#15803d';
    }

    this.showToast('THOA Statutory Brainstem Death Audit Complete: 6/6 Reflexes Certified Absent under Section 3.', 'success');
  }

  renderNeurologyDept() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  dispatchNeurologyDonor() {
    this.showToast('Rahul Sharma (B+) Form-8 BSD Certification dispatched to NOTTO National Allocation Queue.', 'success');
    setTimeout(() => {
      this.navigate('waitlists');
      this.selectOrgan('Heart');
    }, 600);
  }

  initCranialNeuralCanvas() {
    const canvas = document.getElementById('cranialNeuralCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 1200;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : 450;
    canvas.width = width;
    canvas.height = height;

    if (this.cranialAnimFrame) {
      cancelAnimationFrame(this.cranialAnimFrame);
      this.cranialAnimFrame = null;
    }

    const nodeCount = Math.floor(width / 28);
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.5,
        pulse: Math.random() * Math.PI
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        a.pulse += 0.03;

        if (a.x < 0 || a.x > width) a.vx *= -1;
        if (a.y < 0 || a.y > height) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Draw node
        const glow = Math.sin(a.pulse) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(14, 165, 233, ${0.4 * glow})`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius * glow, 0, Math.PI * 2);
        ctx.fill();
      }

      this.cranialAnimFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  toggleMobileSidebar(forceState) {
    const sidebar = document.getElementById('appSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('mobile-open');
    const shouldOpen = forceState !== undefined ? !!forceState : !isOpen;

    if (shouldOpen) {
      sidebar.classList.add('mobile-open');
      if (backdrop) backdrop.classList.add('active');
    } else {
      sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    }
  }

  toggleRole() {
    if (this.role === 'admin') {
      this.role = 'consumer';
      this.navigate('consumer-login');
    } else {
      this.role = 'admin';
      this.navigate('waitlists');
    }
    this.updateRoleView();
  }

  updateRoleView() {
    const roleNameEl = document.getElementById('sidebarRoleName');
    const headerToggleText = document.getElementById('headerRoleToggleText');

    if (this.role === 'admin') {
      if (roleNameEl) roleNameEl.textContent = 'NOTTO Apex Admin';
      if (headerToggleText) headerToggleText.textContent = 'Switch to Patient Portal ↔';
    } else {
      if (roleNameEl) roleNameEl.textContent = 'Patient Portal User';
      if (headerToggleText) headerToggleText.textContent = 'Switch to Admin View ↔';
    }
  }

  /* ══════════════════════════════════════════════
     DONOR REGISTRATION & MATCHING (3.1)
     ══════════════════════════════════════════════ */
  handleHealthCheckbox(cb) {
    const noneCb = document.getElementById('healthNone');
    if (cb.checked && noneCb) {
      noneCb.checked = false;
    }
  }

  handleHealthNoneCheckbox(noneCb) {
    if (noneCb.checked) {
      const checkboxes = document.querySelectorAll('input[name="healthHist"]');
      checkboxes.forEach(cb => {
        if (cb !== noneCb) cb.checked = false;
      });
    }
  }

  handleDonorSubmit(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('donorFullName')?.value.trim();
    const age = parseInt(document.getElementById('donorAge')?.value, 10);
    const bloodGroup = document.getElementById('donorBloodGroup')?.value;
    const region = document.getElementById('donorRegion')?.value;
    const organ = document.getElementById('donorOrgan')?.value;
    const insurance = document.getElementById('donorInsurance')?.value;
    const policyNum = document.getElementById('donorPolicyNum')?.value.trim();
    const coordinator = document.getElementById('donorCoordinatorName')?.value.trim();
    const coordinatorPhone = document.getElementById('donorCoordinatorPhone')?.value.trim();

    if (!fullName || isNaN(age) || !bloodGroup || !region || !organ) {
      this.showToast('Please fill out all required donor fields.', 'error');
      return;
    }

    const donorId = `DNR-${Math.floor(1000 + Math.random() * 9000)}`;
    const mintedToken = `0xnotto_${this.generateHash().slice(2, 10)}`;

    // Run matching algorithm against active waitlist for this organ
    const matchingCandidates = this.runMatchingAlgorithm(organ, bloodGroup, age, region);

    // Render Success Screen with Top 3 compatible matches
    this.renderDonorRegistrationSuccess({
      donorId,
      fullName,
      age,
      bloodGroup,
      region,
      organ,
      insurance,
      policyNum,
      coordinator,
      coordinatorPhone,
      mintedToken,
      matches: matchingCandidates
    });

    // Record decision log block for registration
    const newBlockNum = this.getLatestBlockNumber() + 1;
    const lastBlock = this.decisionLogs[0] || {};
    const prevHash = lastBlock.currHash || this.generateHash();
    const currHash = this.generateHash();

    const blockObj = {
      blockNumber: newBlockNum,
      timestamp: this.getFormattedTimestamp(),
      action: `DONOR REGISTERED ON-CHAIN: ${fullName} (${donorId}) donated ${organ}. Minted Token: ${mintedToken}. Matched with ${matchingCandidates.length} candidate(s).`,
      clause: "THOA Section 5 & NOTTO Decentralized Allocation Protocol",
      prevHash: prevHash,
      currHash: currHash,
      mintingNode: `${region} Regional Organ Hub`,
      status: "VALIDATED"
    };

    this.decisionLogs.unshift(blockObj);
    this.saveState();
    this.updateHeaderMetrics();

    this.showToast(`Donor ${fullName} registered! Top ${matchingCandidates.length} matches calculated.`, 'success');

    // Trigger Agentic AI pipeline in background (Mistral AI Viability + Resend Email + Telegram Alert)
    this.triggerAutonomousAiAgent({
      donorId,
      fullName,
      age,
      bloodGroup,
      region,
      organ,
      insurance,
      policyNum,
      coordinator,
      coordinatorPhone,
      mintedToken,
      matches: matchingCandidates
    });
  }

  async triggerAutonomousAiAgent(donorData) {
    try {
      console.log('[Frontend Trigger] Initiating Agentic AI Pipeline via POST /api/agent/run-organ-donation...');
      const res = await fetch('/api/agent/run-organ-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData)
      });
      if (res.ok) {
        const report = await res.json();
        console.log('[Frontend Trigger] Agentic AI Pipeline Report:', report);
        if (report?.evaluation?.viable) {
          this.showToast(`🤖 AI Agent: Viability score ${report.evaluation.viabilityScore}%! Hospital & Telegram alerts dispatched.`, 'info');
        }
      }
    } catch (e) {
      console.warn('[Frontend Trigger] Agentic background trigger note:', e.message);
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // AI AGENTS HUB INTERACTIVE HANDLERS (REAL API CALLS)
  // ══════════════════════════════════════════════════════════════════════

  async runMasterAgenticPipeline() {
    const logsEl = document.getElementById('masterAgentTelemetryLogs');
    if (logsEl) {
      logsEl.textContent = '⏳ [Step 1/3] Calling Mistral AI Engine with custom inputs...\n' +
        '⏳ [Step 2/3] Preparing Autonomous Hospital Dispatch (Resend Email API)...\n' +
        '⏳ [Step 3/3] Preparing Real-Time Admin Broadcast (Telegram Bot API)...\n';
    }

    const name = document.getElementById('mistralInputName')?.value || 'Rahul Sharma';
    const age = Number(document.getElementById('mistralInputAge')?.value) || 34;
    const bloodGroup = document.getElementById('mistralInputBlood')?.value || 'O+';
    const organ = document.getElementById('mistralInputOrgan')?.value || 'Kidney';
    const condition = document.getElementById('mistralInputCondition')?.value || 'Optimal preservation.';
    const hospitalEmail = document.getElementById('resendInputEmail')?.value || 'organ-transplant-team@resend.dev';

    try {
      const startTime = performance.now();
      const res = await fetch('/api/agent/run-organ-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          age,
          bloodGroup,
          organ,
          organCondition: condition,
          hospitalEmail
        })
      });

      const elapsed = Math.round(performance.now() - startTime);
      const data = await res.json();

      if (logsEl) {
        logsEl.textContent = `🚀 [MASTER PIPELINE EXECUTION SUCCESSFUL — ${elapsed}ms]\n\n` +
          `🧠 1. MISTRAL AI CLINICAL DECISION:\n` +
          `   • Viability Score: ${data.evaluation?.viabilityScore}%\n` +
          `   • Priority Level: ${data.evaluation?.priorityLevel}\n` +
          `   • Ischemia Risk: ${data.evaluation?.ischemiaRisk}\n` +
          `   • Clinical Summary: "${data.evaluation?.clinicalSummary}"\n` +
          `   • Recommended Action: "${data.evaluation?.recommendedAction}"\n\n` +
          `📧 2. RESEND EMERGENCY EMAIL DISPATCH:\n` +
          `   • Status: ${data.actionsTriggered?.email?.success ? '✅ SUCCESS (Sent via Resend API)' : '⚠️ ' + (data.actionsTriggered?.email?.error || 'Triggered')}\n` +
          `   • Message ID: ${data.actionsTriggered?.email?.data?.id || 'resend-queue'}\n\n` +
          `📱 3. TELEGRAM ADMIN BOT BROADCAST:\n` +
          `   • Status: ${data.actionsTriggered?.telegram?.success ? '✅ DELIVERED' : '⚠️ Response: ' + (data.actionsTriggered?.telegram?.error || 'Active Token Broadcast')}\n\n` +
          `📄 FULL STRUCTURED JSON PAYLOAD:\n` +
          JSON.stringify(data, null, 2);
      }

      this.showToast(`Master AI Pipeline complete! Viability: ${data.evaluation?.viabilityScore}%`, 'success');
    } catch (err) {
      if (logsEl) logsEl.textContent += `\n❌ Pipeline Error: ${err.message}`;
      this.showToast(`Error running Master Pipeline: ${err.message}`, 'error');
    }
  }

  async executeMistralAgent() {
    const outputEl = document.getElementById('mistralAgentOutput');
    const logsEl = document.getElementById('masterAgentTelemetryLogs');
    const btn = document.getElementById('btnTestMistral');
    if (btn) btn.disabled = true;

    const name = document.getElementById('mistralInputName')?.value || 'Rahul Sharma';
    const age = Number(document.getElementById('mistralInputAge')?.value) || 34;
    const bloodGroup = document.getElementById('mistralInputBlood')?.value || 'O+';
    const organ = document.getElementById('mistralInputOrgan')?.value || 'Kidney';
    const condition = document.getElementById('mistralInputCondition')?.value || 'Optimal perfusion';

    if (outputEl) {
      outputEl.style.display = 'block';
      outputEl.innerHTML = '<em>⏳ Calling Mistral AI API (mistral-small-latest)...</em>';
    }

    try {
      const res = await fetch('/api/agent/evaluate-viability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          age,
          bloodGroup,
          organ,
          organCondition: condition
        })
      });

      const data = await res.json();
      const evalData = data.evaluation;

      if (outputEl) {
        outputEl.innerHTML = `
          <strong>✔ Mistral AI Viability Report:</strong><br/>
          • Score: <strong>${evalData.viabilityScore}%</strong> (${evalData.priorityLevel})<br/>
          • Ischemia Risk: <strong>${evalData.ischemiaRisk}</strong><br/>
          • Summary: <em>${evalData.clinicalSummary}</em><br/>
          • Action: ${evalData.recommendedAction}
        `;
      }

      if (logsEl) {
        logsEl.textContent = `[MISTRAL AI EVALUATION RESULT]\n` + JSON.stringify(data, null, 2);
      }

      this.showToast(`Mistral AI assessed ${organ}: ${evalData.viabilityScore}% viable`, 'success');
    } catch (e) {
      if (outputEl) outputEl.innerHTML = `<span style="color:#dc2626;">Error: ${e.message}</span>`;
      this.showToast(`Mistral API Error: ${e.message}`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async executeResendAgent() {
    const outputEl = document.getElementById('resendAgentOutput');
    const logsEl = document.getElementById('masterAgentTelemetryLogs');
    const btn = document.getElementById('btnTestResend');
    if (btn) btn.disabled = true;

    const email = document.getElementById('resendInputEmail')?.value || 'organ-transplant-team@resend.dev';
    const hospital = document.getElementById('resendInputHospital')?.value || 'AIIMS New Delhi';
    const organ = document.getElementById('resendInputOrgan')?.value || 'Kidney (O+)';
    const mandate = document.getElementById('resendInputMandate')?.value || 'CRITICAL URGENT';

    if (outputEl) {
      outputEl.style.display = 'block';
      outputEl.innerHTML = '<em>⏳ Transmitting via Resend API (api.resend.com)...</em>';
    }

    try {
      const res = await fetch('/api/agent/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorData: {
            fullName: 'Donor Verification Test',
            organ: organ,
            bloodGroup: 'O+',
            age: 32,
            donorId: 'DNR-RESEND-' + Math.floor(1000 + Math.random() * 9000),
            hospitalEmail: email,
            hospitalName: hospital
          },
          evaluation: {
            viabilityScore: 94,
            priorityLevel: 'CRITICAL_URGENT',
            clinicalSummary: `Donor tissue verified for ${organ}. Allocation ready.`,
            ischemiaRisk: 'LOW',
            recommendedAction: mandate
          }
        })
      });

      const data = await res.json();
      if (outputEl) {
        if (data.success) {
          outputEl.innerHTML = `
            <strong>✔ Resend Emergency Email Dispatched!</strong><br/>
            • Recipient: <code>${email}</code><br/>
            • Resend Email ID: <code>${data.data?.id}</code><br/>
            • Status: Delivered to SMTP relay.
          `;
        } else {
          outputEl.innerHTML = `<span style="color:#b45309;">Resend Response: ${data.error}</span>`;
        }
      }

      if (logsEl) {
        logsEl.textContent = `[RESEND EMAIL API RESULT]\n` + JSON.stringify(data, null, 2);
      }

      this.showToast('Resend Emergency Email processed!', 'success');
    } catch (e) {
      if (outputEl) outputEl.innerHTML = `<span style="color:#dc2626;">Error: ${e.message}</span>`;
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async executeTelegramAgent() {
    const outputEl = document.getElementById('telegramAgentOutput');
    const logsEl = document.getElementById('masterAgentTelemetryLogs');
    const btn = document.getElementById('btnTestTelegram');
    if (btn) btn.disabled = true;

    const chatId = document.getElementById('telegramInputChatId')?.value || '@notto_organ_alerts';
    const tokenId = document.getElementById('telegramInputToken')?.value || 'DNR-3535-NOTTO';
    const score = document.getElementById('telegramInputScore')?.value || '95%';
    const headline = document.getElementById('telegramInputHeadline')?.value || '🚨 URGENT ALLOCATION';

    if (outputEl) {
      outputEl.style.display = 'block';
      outputEl.innerHTML = '<em>⏳ Posting message to Telegram Bot API...</em>';
    }

    try {
      const res = await fetch('/api/agent/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorData: {
            fullName: 'Donor Verification',
            organ: 'Kidney',
            bloodGroup: 'O+',
            age: 34,
            donorId: tokenId,
            region: 'North Regional Node'
          },
          evaluation: {
            viabilityScore: 95,
            priorityLevel: score,
            clinicalSummary: headline,
            ischemiaRisk: 'LOW',
            recommendedAction: 'Proceed with green corridor protocol.'
          }
        })
      });

      const data = await res.json();
      if (outputEl) {
        if (data.success) {
          outputEl.innerHTML = `
            <strong>✔ Telegram Message Sent!</strong><br/>
            • Target: <code>${chatId}</code><br/>
            • Bot Token: Active Validated<br/>
            • Payload successfully received by Telegram servers.
          `;
        } else {
          outputEl.innerHTML = `
            <span style="color:#1d4ed8;">Telegram API Response:</span><br/>
            <code>${data.error || 'Token Validated (Add bot to chat/channel to receive)'}</code>
          `;
        }
      }

      if (logsEl) {
        logsEl.textContent = `[TELEGRAM BOT API RESULT]\n` + JSON.stringify(data, null, 2);
      }

      this.showToast('Telegram API executed!', 'info');
    } catch (e) {
      if (outputEl) outputEl.innerHTML = `<span style="color:#dc2626;">Error: ${e.message}</span>`;
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  runMatchingAlgorithm(organ, bloodGroup, age, region) {
    // Fetch active unallocated candidates for this organ
    const candidates = this.patients.filter(p => p.organ_needed === organ && !this.archivedPatients.includes(p.patient_id));

    const scored = candidates.map(patient => {
      let score = 70; // baseline

      // Blood group compatibility
      if (patient.blood_group === bloodGroup) {
        score += 15;
      } else if (bloodGroup === 'O-' || (bloodGroup === 'O+' && patient.blood_group.includes('+'))) {
        score += 10;
      } else if (patient.blood_group === 'AB+') {
        score += 8;
      }

      // Regional proximity
      if (patient.region === region) {
        score += 8;
      }

      // Age compatibility (closer ages score higher)
      const ageDiff = Math.abs(patient.age - age);
      if (ageDiff <= 10) score += 4;
      else if (ageDiff <= 20) score += 2;

      // Severity score boost
      if (patient.severity_score && (patient.severity_score.includes('MELD 3') || patient.severity_score.includes('High') || patient.severity_score.includes('Urgent'))) {
        score += 3;
      }

      // Cap and round score
      const finalScore = Math.min(99.4, Math.max(78.5, score + (Math.random() * 1.8 - 0.9)));

      return {
        patient,
        score: finalScore.toFixed(1)
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

    return scored.slice(0, 3);
  }

  renderDonorRegistrationSuccess(donorData) {
    const formCard = document.getElementById('donorFormContainer');
    const successCard = document.getElementById('donorSuccessContainer');
    if (!formCard || !successCard) return;

    formCard.classList.add('hidden');
    successCard.classList.remove('hidden');

    let matchesHtml = '';
    if (donorData.matches.length === 0) {
      matchesHtml = `<div style="color: #64748b; font-size: 0.85rem; padding: 1rem; background: #f8fafc; border-radius: 6px;">No active waiting candidates currently for ${donorData.organ}. Organ preserved in cryogenic bank.</div>`;
    } else {
      matchesHtml = donorData.matches.map((m, idx) => {
        const rank = idx + 1;
        const p = m.patient;
        return `
          <div class="compatible-recipient-card">
            <div class="crecipient-header">
              <div class="crecipient-rank">
                <span style="font-size: 1.1rem;">${rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉')}</span>
                <span>MATCH #${rank}: <strong>${p.name}</strong> (${p.patient_id})</span>
              </div>
              <div class="crecipient-score-val">${m.score}% MATCH</div>
            </div>

            <div class="crecipient-progress-bar-wrap">
              <div class="crecipient-progress-bar" style="width: ${m.score}%;"></div>
            </div>

            <div class="crecipient-meta-row">
              <span>Waitlist Rank: <strong>#${p.waitlist_rank || rank}</strong> · ${p.age}y / ${p.gender} · Blood: <strong>${p.blood_group}</strong></span>
              <span>Hospital: <strong>${p.hospital}</strong> (${p.region})</span>
            </div>
            
            <div style="font-size: 0.72rem; color: #475569; margin-top: 2px;">
              Clinical Condition: <em>${p.clinical_condition}</em>
            </div>
          </div>
        `;
      }).join('');
    }

    successCard.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.25rem;">
        <div class="success-header-badge">
          <span>✔</span> DONOR ORGAN REGISTERED ON BLOCKCHAIN
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 700; color: #003087;">
          Registration & Crossmatch Verified
        </h3>
        <p style="font-size: 0.8rem; color: #64748b;">
          National multi-sig matching algorithm has paired this donor organ with priority waitlist candidates.
        </p>
      </div>

      <!-- Registered Donor Summary -->
      <div class="registered-donor-summary">
        <div>
          <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Donor ID</div>
          <div style="font-family: var(--font-mono); font-weight: 700; color: #003087;">${donorData.donorId}</div>
        </div>
        <div>
          <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Organ Donated</div>
          <div style="font-weight: 700; color: #7c3aed;">${donorData.organ}</div>
        </div>
        <div>
          <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Age · Blood Group</div>
          <div style="font-weight: 600;">${donorData.age}y · <span style="color: #dc2626; font-weight: 700;">${donorData.bloodGroup}</span></div>
        </div>
        <div>
          <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Origin Region</div>
          <div style="font-weight: 600;">${donorData.region}</div>
        </div>
        <div>
          <div style="font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Minted Token</div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: #059669; font-weight: 700;">${donorData.mintedToken}</div>
        </div>
      </div>

      <!-- Top 3 Compatible Recipients -->
      <div class="top-recipients-section-title">
        <span>🎯</span> Top Compatible Recipients on National Waitlist
      </div>
      <div>
        ${matchesHtml}
      </div>

      <!-- Actions -->
      <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap;">
        <button type="button" class="btn-certify-match" style="flex: 1; min-width: 200px;" onclick="window.app.navigate('waitlists'); window.app.selectOrgan('${donorData.organ}');">
          View Matches on Waitlist →
        </button>
        <button type="button" class="btn-cancel-modal" style="flex: 1; min-width: 200px;" onclick="window.app.resetDonorForm()">
          + Register Another Donor
        </button>
      </div>
    `;
  }

  resetDonorForm() {
    const formCard = document.getElementById('donorFormContainer');
    const successCard = document.getElementById('donorSuccessContainer');
    const form = document.getElementById('donorEnrollmentForm');
    
    if (form) form.reset();
    if (formCard) formCard.classList.remove('hidden');
    if (successCard) successCard.classList.add('hidden');
  }

  /* ══════════════════════════════════════════════
     REGISTRY DASHBOARD & ANALYTICS CHARTS
     ══════════════════════════════════════════════ */
  renderDashboard() {
    this.renderDashboardStats();
    this.renderBloodGroupMatrix();
    this.populateDashboardFilters();
    this.renderHospitalSpotlight(this.selectedSpotlightHospitalId);
    this.renderOrganAvailabilityChart();
    this.renderDonutDemographicsChart();
    this.renderAgeDistributionChart();
    this.renderRegionalDistributionChart();
    this.renderHospitalTable();
    this.renderTransportCasesSidebar();
  }

  /* Safe Hospital Property Extraction Helpers */
  getHospitalOrgansList(hosp) {
    if (!hosp || !hosp.organs) return ['Kidney', 'Liver'];
    if (Array.isArray(hosp.organs)) return hosp.organs.map(s => String(s).trim()).filter(Boolean);
    if (typeof hosp.organs === 'string') return hosp.organs.split(',').map(s => s.trim()).filter(Boolean);
    return [String(hosp.organs)];
  }

  getHospitalOrgansString(hosp) {
    const list = this.getHospitalOrgansList(hosp);
    return list.join(', ');
  }

  getHospitalBloodGroup(hosp) {
    if (!hosp) return 'O+';
    if (hosp.required_blood_group && typeof hosp.required_blood_group === 'string') return hosp.required_blood_group;
    if (Array.isArray(hosp.required_blood_groups) && hosp.required_blood_groups.length > 0) {
      return hosp.required_blood_groups.join(', ');
    }
    if (Array.isArray(hosp.required_blood_group) && hosp.required_blood_group.length > 0) {
      return hosp.required_blood_group.join(', ');
    }
    if (typeof hosp.required_blood_groups === 'string') return hosp.required_blood_groups;
    return 'O+';
  }

  getHospitalPriceAlert(hosp) {
    if (!hosp) return '₹4,50,000 - ₹7,80,000 (PM-JAY & CM Relief Scheme Subsidy)';
    return hosp.price_alert_inr || hosp.price_alert || hosp.cost_estimate || '₹4,50,000 - ₹7,80,000 (PM-JAY Subsidy)';
  }

  getHospitalSuccessRate(hosp) {
    if (!hosp) return '99.2%';
    return hosp.success_rate_percent || hosp.success_rate || '99.2%';
  }

  /* Enlarged Blood Group Inventory & Requirements Matrix */
  renderBloodGroupMatrix() {
    const grid = document.getElementById('bloodGroupEnlargedGrid');
    if (!grid) return;

    const bloodGroups = [
      { bg: 'O+', desc: 'Universal RBC Compatible', rarity: 'Most Common' },
      { bg: 'O-', desc: 'Universal Donor', rarity: 'High Emergency Demand' },
      { bg: 'A+', desc: 'High Demand in North & South', rarity: 'Common' },
      { bg: 'A-', desc: 'Compatible for A & AB', rarity: 'Rare' },
      { bg: 'B+', desc: 'Highest National Prevalence', rarity: 'Very High Demand' },
      { bg: 'B-', desc: 'Compatible for B & AB', rarity: 'Rare' },
      { bg: 'AB+', desc: 'Universal Recipient', rarity: 'Universal Recipient' },
      { bg: 'AB-', desc: 'Rare Phenotype Allograft', rarity: 'Ultra Rare' }
    ];

    const hospitals = window.HOSPITAL_REGISTRY_METRICS || [];
    const patients = this.patients.filter(p => !this.archivedPatients.includes(p.patient_id));

    let html = '';
    bloodGroups.forEach(item => {
      const activeClass = this.selectedBloodGroupFilter === item.bg ? 'active' : '';
      
      // Count hospitals requiring this blood group
      const reqHospCount = hospitals.filter(h => {
        const bgStr = this.getHospitalBloodGroup(h);
        return bgStr.includes(item.bg);
      }).length;
      
      // Count waiting candidates
      const waitingCount = patients.filter(p => p.blood_group === item.bg).length;

      html += `
        <div class="blood-group-enlarged-card ${activeClass}" onclick="window.app.filterByBloodGroup('${item.bg}')" title="Click to filter 100-hospital network for ${item.bg}">
          <div class="blood-badge-enlarged">${item.bg}</div>
          <div class="blood-group-count">${reqHospCount} Hospitals Req</div>
          <div class="blood-group-tag" style="font-weight: 600; color: #003087;">${waitingCount} Patients Waiting</div>
          <div class="blood-group-tag" style="font-size: 0.65rem; color: #64748b;">${item.desc}</div>
        </div>
      `;
    });

    grid.innerHTML = html;

    const allBtn = document.getElementById('bloodFilterAllBtn');
    if (allBtn) {
      if (this.selectedBloodGroupFilter === 'ALL') {
        allBtn.classList.add('active');
        allBtn.textContent = 'Showing All Blood Groups (Click to Reset)';
      } else {
        allBtn.classList.remove('active');
        allBtn.textContent = `Filtered: ${this.selectedBloodGroupFilter} (Click to Show All)`;
      }
    }
  }

  filterByBloodGroup(bg) {
    if (this.selectedBloodGroupFilter === bg && bg !== 'ALL') {
      this.selectedBloodGroupFilter = 'ALL';
    } else {
      this.selectedBloodGroupFilter = bg;
    }
    this.renderBloodGroupMatrix();
    this.renderHospitalTable();
    this.showToast(`Blood group filter updated to: ${this.selectedBloodGroupFilter}`, 'info');
  }

  /* Populate State & Hospital Dropdown Selectors */
  populateDashboardFilters() {
    const stateSelect = document.getElementById('dashStateFilter');
    const hospitalSelect = document.getElementById('dashHospitalSelect');
    const hospitals = window.HOSPITAL_REGISTRY_METRICS || [];

    if (stateSelect) {
      const states = Array.from(new Set(hospitals.map(h => h.state))).sort();
      let stateHtml = '<option value="ALL">All States / UTs (सम्पूर्ण भारत - ' + hospitals.length + ' Centers)</option>';
      states.forEach(st => {
        const count = hospitals.filter(h => h.state === st).length;
        const selected = this.selectedDashboardState === st ? 'selected' : '';
        stateHtml += `<option value="${st}" ${selected}>${st} (${count} Centers)</option>`;
      });
      stateSelect.innerHTML = stateHtml;
    }

    if (hospitalSelect) {
      let filteredHospitals = this.getFilteredHospitals();
      let hospHtml = '<option value="">-- Choose Hospital to View Price Alerts & Details --</option>';
      filteredHospitals.forEach(h => {
        const selected = String(this.selectedSpotlightHospitalId) === String(h.id) ? 'selected' : '';
        hospHtml += `<option value="${h.id}" ${selected}>${h.id}. ${h.hospital_name} (${h.state})</option>`;
      });
      hospitalSelect.innerHTML = hospHtml;
    }

    const badge = document.getElementById('datasetCounterBadge');
    if (badge) {
      const filtered = this.getFilteredHospitals();
      badge.textContent = `Showing ${filtered.length} of ${hospitals.length} Hospitals`;
    }
  }

  getFilteredHospitals() {
    let list = window.HOSPITAL_REGISTRY_METRICS || [];

    // State filter
    if (this.selectedDashboardState && this.selectedDashboardState !== 'ALL') {
      list = list.filter(h => h.state === this.selectedDashboardState);
    }

    // Organ filter
    if (this.selectedDashboardOrgan && this.selectedDashboardOrgan !== 'ALL') {
      const organTerm = this.selectedDashboardOrgan.toLowerCase();
      list = list.filter(h => {
        const orgStr = this.getHospitalOrgansString(h).toLowerCase();
        return orgStr.includes(organTerm);
      });
    }

    // Type filter
    if (this.selectedDashboardType && this.selectedDashboardType !== 'ALL') {
      list = list.filter(h => h.type === this.selectedDashboardType);
    }

    // Blood Group filter
    if (this.selectedBloodGroupFilter && this.selectedBloodGroupFilter !== 'ALL') {
      list = list.filter(h => {
        const bgStr = this.getHospitalBloodGroup(h);
        return bgStr.includes(this.selectedBloodGroupFilter);
      });
    }

    // Search query
    if (this.hospitalSearchQuery) {
      const q = this.hospitalSearchQuery.toLowerCase();
      list = list.filter(h => 
        (h.hospital_name && h.hospital_name.toLowerCase().includes(q)) ||
        (h.state && h.state.toLowerCase().includes(q)) ||
        (h.district && h.district.toLowerCase().includes(q)) ||
        (this.getHospitalOrgansString(h).toLowerCase().includes(q)) ||
        (h.primary_surgery && h.primary_surgery.toLowerCase().includes(q))
      );
    }

    return list;
  }

  handleDashboardStateFilter(val) {
    this.selectedDashboardState = val;
    const filtered = this.getFilteredHospitals();
    if (filtered.length > 0) {
      this.selectedSpotlightHospitalId = filtered[0].id;
    }
    this.populateDashboardFilters();
    this.renderHospitalSpotlight(this.selectedSpotlightHospitalId);
    this.renderHospitalTable();
  }

  handleDashboardOrganFilter(val) {
    this.selectedDashboardOrgan = val;
    const filtered = this.getFilteredHospitals();
    if (filtered.length > 0) {
      this.selectedSpotlightHospitalId = filtered[0].id;
    }
    this.populateDashboardFilters();
    this.renderHospitalSpotlight(this.selectedSpotlightHospitalId);
    this.renderHospitalTable();
  }

  handleDashboardTypeFilter(val) {
    this.selectedDashboardType = val;
    const filtered = this.getFilteredHospitals();
    if (filtered.length > 0) {
      this.selectedSpotlightHospitalId = filtered[0].id;
    }
    this.populateDashboardFilters();
    this.renderHospitalSpotlight(this.selectedSpotlightHospitalId);
    this.renderHospitalTable();
  }

  selectHospitalSpotlight(id) {
    if (!id) return;
    this.selectedSpotlightHospitalId = parseInt(id, 10) || id;
    this.renderHospitalSpotlight(this.selectedSpotlightHospitalId);
    
    // Scroll smoothly to spotlight card
    const spotlightEl = document.getElementById('hospitalSpotlightWrap');
    if (spotlightEl) {
      spotlightEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* Render Spotlight Hospital Profile Card with Price Alerts and Success Rate */
  renderHospitalSpotlight(hospitalId) {
    const wrap = document.getElementById('hospitalSpotlightWrap');
    if (!wrap) return;

    const hospitals = window.HOSPITAL_REGISTRY_METRICS || [];
    let hosp = hospitals.find(h => String(h.id) === String(hospitalId));
    if (!hosp && hospitals.length > 0) {
      hosp = hospitals[0];
    }

    if (!hosp) {
      wrap.innerHTML = '<div style="color: #64748b; text-align: center; padding: 1rem;">No hospital selected</div>';
      return;
    }

    const organList = this.getHospitalOrgansList(hosp);
    const organBadges = organList.map(o => `<span class="organ-tag-pill">🫀 ${o}</span>`).join(' ');
    const requiredBloodGroup = this.getHospitalBloodGroup(hosp);
    const priceAlert = this.getHospitalPriceAlert(hosp);
    const successRate = this.getHospitalSuccessRate(hosp);
    
    const websiteHtml = hosp.website && hosp.website !== 'N/A' 
      ? `<a href="${hosp.website.startsWith('http') ? hosp.website : 'https://' + hosp.website}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; font-size: 0.78rem; font-family: var(--font-mono); margin-left: 8px;">🔗 Official Portal</a>` 
      : '';

    wrap.innerHTML = `
      <div class="hospital-spotlight-card">
        <div class="spotlight-top-row">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; background: #003087; color: white; padding: 2px 8px; border-radius: 4px;">#${hosp.id}</span>
              <h3 class="spotlight-hosp-name">${hosp.hospital_name}</h3>
              ${websiteHtml}
            </div>
            <div class="spotlight-location">
              📍 <strong>${hosp.district}, ${hosp.state}</strong> (${hosp.region} Region) · ${hosp.address || ''}
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-top: 0.4rem;">
              <span class="spotlight-type-badge">${hosp.type || 'Transplant Centre'}</span>
              <span style="font-size: 0.76rem; color: #059669; font-weight: 700;">● ${hosp.compliance_score || '99.5%'} SOTTO / NOTTO Certified</span>
            </div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 2px;">Required Blood Group</div>
            <div class="blood-badge-enlarged" style="font-size: 1.45rem; padding: 0.35rem 0.9rem;">
              ${requiredBloodGroup}
            </div>
          </div>
        </div>

        <!-- Authorized Organs for this Center -->
        <div style="margin: 0.75rem 0; padding: 0.65rem 0.85rem; background: #ffffff; border: 1px solid var(--border-light); border-radius: 6px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #003087; margin-bottom: 0.3rem; text-transform: uppercase;">
            Marked State & Authorized Transplant Organs:
          </div>
          <div style="display: flex; gap: 0.3rem; flex-wrap: wrap;">
            <span style="font-size: 0.72rem; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px;">State: ${hosp.state}</span>
            ${organBadges}
          </div>
        </div>

        <!-- PRICE ALERT & CLINICAL HIGHLIGHT BOX -->
        <div class="price-alert-box">
          <div class="price-alert-icon">💡</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
              <div style="font-weight: 800; font-size: 0.92rem; color: #92400e; display: flex; align-items: center; gap: 0.4rem;">
                <span>💰 Price Alert & Surgery Specialty:</span>
                <span style="color: #0f172a;">${hosp.primary_surgery || 'Major Organ Transplant'}</span>
              </div>
              <div class="success-rate-badge-lg">
                ⭐ Success Rate: ${successRate} (Excellent!!)
              </div>
            </div>
            
            <div class="price-alert-text">
              <strong>Price Estimate:</strong> <span style="font-family: var(--font-mono); font-weight: 700; color: #b45309;">${priceAlert}</span>
            </div>

            <div style="margin-top: 0.4rem; font-size: 0.8rem; color: #78350f; background: rgba(254, 243, 199, 0.6); padding: 0.35rem 0.6rem; border-radius: 4px;">
              📢 <strong>Clinical Notice:</strong> This hospital requires blood group <strong style="color: #dc2626; font-size: 0.9rem;">${requiredBloodGroup}</strong> for <strong>${hosp.primary_surgery || 'Organ Transplant'}</strong> surgery, and the success rate for this surgery is <strong>${successRate} (excellent!!)</strong>.
            </div>
          </div>
        </div>

        <!-- Capacity & Performance Metrics -->
        <div class="spotlight-stats-grid">
          <div class="spotlight-stat-item">
            <div class="spotlight-stat-val" style="color: #003087;">${hosp.total_requirements || 120}</div>
            <div class="spotlight-stat-lbl">Total Requirements</div>
          </div>
          <div class="spotlight-stat-item">
            <div class="spotlight-stat-val" style="color: #0284c7;">${hosp.active_recipients_waiting || 34}</div>
            <div class="spotlight-stat-lbl">Waiting Recipients</div>
          </div>
          <div class="spotlight-stat-item">
            <div class="spotlight-stat-val" style="color: #059669;">${hosp.donors_submitted || 28}</div>
            <div class="spotlight-stat-lbl">Donors Submitted</div>
          </div>
          <div class="spotlight-stat-item">
            <div class="spotlight-stat-val" style="color: #7c3aed;">${hosp.completed_transplants || 85}</div>
            <div class="spotlight-stat-lbl">Transplants Completed</div>
          </div>
          <div class="spotlight-stat-item">
            <div class="spotlight-stat-val" style="color: #d97706;">${hosp.avg_wait_time_days || 45}d</div>
            <div class="spotlight-stat-lbl">Avg Wait Time</div>
          </div>
        </div>
      </div>
    `;
  }

  renderDashboardStats() {
    const grid = document.getElementById('dashboardStatsGrid');
    if (!grid) return;

    const totalPatients = this.patients.length;
    const unarchivedCount = this.patients.filter(p => !this.archivedPatients.includes(p.patient_id)).length;
    const completedCount = this.archivedPatients.length + (this.donorHistory ? this.donorHistory.length : 12);
    const blockNum = this.getLatestBlockNumber();

    grid.innerHTML = `
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Total Recipients</span><span>👥</span></div>
        <div class="stat-card-value">${totalPatients}</div>
        <div class="stat-card-sub">Registered across 10 organs</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Active On Waitlist</span><span>⏳</span></div>
        <div class="stat-card-value" style="color: #0284c7;">${unarchivedCount}</div>
        <div class="stat-card-sub">Awaiting allocation</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Transplants Done</span><span>💖</span></div>
        <div class="stat-card-value" style="color: #059669;">${completedCount}</div>
        <div class="stat-card-sub">Historical & live archived</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Organs Tracked</span><span>🩺</span></div>
        <div class="stat-card-value" style="color: #7c3aed;">10</div>
        <div class="stat-card-sub">All THOA approved classes</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Avg Match Score</span><span>🎯</span></div>
        <div class="stat-card-value" style="color: #d97706;">96.4%</div>
        <div class="stat-card-sub">Crossmatch & HLA precision</div>
      </div>
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Ledger Height</span><span>⛓️</span></div>
        <div class="stat-card-value" style="font-size: 1.3rem;">#${blockNum}</div>
        <div class="stat-card-sub">9-Node Multi-Sig Active</div>
      </div>
    `;
  }

  /* Interactive Leaflet Map for Geo-Spatial Organ Transport */
  initLeafletMap() {
    const mapEl = document.getElementById('leafletTransportMap');
    if (!mapEl || typeof L === 'undefined') return;

    if (this.leafletMap) {
      this.leafletMap.invalidateSize();
      this.focusTransportCase(this.activeTransportIndex);
      return;
    }

    try {
      this.leafletMap = L.map('leafletTransportMap', {
        center: [22.5, 78.9],
        zoom: 4.5,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.leafletMap);

      this.focusTransportCase(0);
    } catch (e) {
      console.warn('Leaflet init error:', e);
    }
  }

  focusTransportCase(index) {
    const cases = window.ACTIVE_TRANSPORT_CASES || [];
    if (!cases[index] || !this.leafletMap) return;

    this.activeTransportIndex = index;
    const tcase = cases[index];

    // Clear old markers and lines
    this.mapMarkers.forEach(m => this.leafletMap.removeLayer(m));
    this.mapMarkers = [];
    if (this.mapRouteLine) {
      this.leafletMap.removeLayer(this.mapRouteLine);
      this.mapRouteLine = null;
    }

    const originLat = tcase.originCoords ? tcase.originCoords[0] : (tcase.origin_lat || 28.6139);
    const originLng = tcase.originCoords ? tcase.originCoords[1] : (tcase.origin_lng || 77.2090);
    const destLat = tcase.destCoords ? tcase.destCoords[0] : (tcase.dest_lat || 28.4395);
    const destLng = tcase.destCoords ? tcase.destCoords[1] : (tcase.dest_lng || 77.0427);

    const originHosp = tcase.originHospital || tcase.origin_hospital || tcase.originCity || 'Origin Hospital';
    const destHosp = tcase.destHospital || tcase.dest_hospital || tcase.destCity || 'Destination Hospital';
    const surgeonName = tcase.surgeon || tcase.lead_surgeon || 'Lead Surgeon';
    const etaText = tcase.eta || '30m';

    // Pulse Origin Icon
    const originIcon = L.divIcon({
      className: 'leaflet-origin-icon',
      html: `<div style="width: 26px; height: 26px; border-radius: 50%; background: #0284c7; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🛫</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const destIcon = L.divIcon({
      className: 'leaflet-dest-icon',
      html: `<div style="width: 28px; height: 28px; border-radius: 50%; background: #10b981; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold; box-shadow: 0 0 0 4px rgba(16,185,129,0.3);">🏥</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const originMarker = L.marker([originLat, originLng], { icon: originIcon })
      .addTo(this.leafletMap)
      .bindPopup(`<strong>Donor Origin:</strong><br>${originHosp}`);
    
    const destMarker = L.marker([destLat, destLng], { icon: destIcon })
      .addTo(this.leafletMap)
      .bindPopup(`<strong>Destination Hospital:</strong><br>${destHosp}<br><em>ETA: ${etaText}</em>`);

    this.mapMarkers.push(originMarker, destMarker);

    // Draw route line
    this.mapRouteLine = L.polyline([[originLat, originLng], [destLat, destLng]], {
      color: '#0284c7',
      weight: 3.5,
      dashArray: '6, 6',
      opacity: 0.85
    }).addTo(this.leafletMap);

    this.leafletMap.fitBounds([[originLat, originLng], [destLat, destLng]], {
      padding: [40, 40]
    });

    // Update overlay badge
    const badgeText = document.getElementById('mapOverlayCaseText');
    if (badgeText) {
      const originShort = originHosp.split('(')[0].split(',')[0].trim();
      const destShort = destHosp.split('(')[0].split(',')[0].trim();
      badgeText.textContent = `${tcase.organ}: ${originShort} → ${destShort} (ETA ${etaText})`;
    }

    // Update sidebar active classes
    const cards = document.querySelectorAll('.transport-case-card');
    cards.forEach((card, idx) => {
      if (idx === index) card.classList.add('active');
      else card.classList.remove('active');
    });
  }

  renderTransportCasesSidebar() {
    const container = document.getElementById('transportCasesList');
    if (!container) return;

    const cases = window.ACTIVE_TRANSPORT_CASES || [];
    let html = '';

    cases.forEach((tcase, idx) => {
      const isActive = idx === this.activeTransportIndex;
      const originHosp = tcase.originHospital || tcase.origin_hospital || tcase.originCity || 'Origin';
      const destHosp = tcase.destHospital || tcase.dest_hospital || tcase.destCity || 'Destination';
      const originShort = originHosp.split('(')[0].split(',')[0].trim();
      const destShort = destHosp.split('(')[0].split(',')[0].trim();
      const surgeonName = tcase.surgeon || tcase.lead_surgeon || 'Specialist Team';
      const etaText = tcase.eta || 'In Transit';

      html += `
        <div class="transport-case-card ${isActive ? 'active' : ''}" onclick="window.app.focusTransportCase(${idx})">
          <div class="tcase-top-row">
            <span class="tcase-organ-tag ${isActive ? 'active' : ''}">${tcase.organ}</span>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #059669;">ETA: ${etaText}</span>
          </div>
          <div class="tcase-route">
            ${originShort} ➔ ${destShort}
          </div>
          <div class="tcase-details">
            <span>✈️ ${tcase.mode || 'Green Corridor'}</span>
            <span>Surgeon: ${surgeonName}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* Chart 1: Organ Availability Horizontal Bar Chart */
  renderOrganAvailabilityChart() {
    const wrap = document.getElementById('chartOrganAvailabilityWrap');
    if (!wrap) return;

    const organCounts = {};
    this.organList.forEach(org => {
      organCounts[org.id] = (this.organWaitlistMap[org.id] || []).length;
    });

    const maxCount = Math.max(...Object.values(organCounts), 1);
    const colors = ['#38bdf8', '#ef4444', '#f59e0b', '#8b5cf6', '#dc2626', '#06b6d4', '#eab308', '#ec4899', '#6366f1', '#10b981'];

    let html = `<div class="custom-chart-bar-wrap">`;
    this.organList.forEach((org, idx) => {
      const count = organCounts[org.id] || 0;
      const widthPct = ((count / maxCount) * 100).toFixed(0);
      const color = colors[idx % colors.length];

      html += `
        <div class="chart-bar-row">
          <div class="chart-bar-label" title="${org.nameEn}">${org.icon} ${org.id}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${widthPct}%; background: ${color};"></div>
          </div>
          <div class="chart-bar-val">${count}</div>
        </div>
      `;
    });
    html += `</div>`;

    wrap.innerHTML = html;
  }

  /* Chart 2: Donut Demographics Chart by Organ */
  renderDonutDemographicsChart() {
    const wrap = document.getElementById('chartDonutOrganWrap');
    if (!wrap) return;

    const organCounts = {};
    let total = 0;
    this.organList.forEach(org => {
      const count = (this.organWaitlistMap[org.id] || []).length;
      organCounts[org.id] = count;
      total += count;
    });

    if (total === 0) total = 1;

    const colors = ['#0284c7', '#dc2626', '#d97706', '#7c3aed', '#b91c1c', '#0891b2', '#ca8a04', '#db2777', '#4f46e5', '#059669'];
    let cumulative = 0;
    const slices = [];

    this.organList.forEach((org, idx) => {
      const count = organCounts[org.id] || 0;
      const pct = count / total;
      const startAngle = cumulative * 2 * Math.PI;
      cumulative += pct;
      const endAngle = cumulative * 2 * Math.PI;
      slices.push({ org, count, pct, startAngle, endAngle, color: colors[idx % colors.length] });
    });

    // Build SVG Donut
    const size = 160;
    const center = size / 2;
    const radius = 65;
    const innerRadius = 42;

    let svgPaths = '';
    slices.forEach(s => {
      if (s.pct === 0) return;
      const x1 = center + radius * Math.sin(s.startAngle);
      const y1 = center - radius * Math.cos(s.startAngle);
      const x2 = center + radius * Math.sin(s.endAngle);
      const y2 = center - radius * Math.cos(s.endAngle);

      const ix1 = center + innerRadius * Math.sin(s.startAngle);
      const iy1 = center - innerRadius * Math.cos(s.startAngle);
      const ix2 = center + innerRadius * Math.sin(s.endAngle);
      const iy2 = center - innerRadius * Math.cos(s.endAngle);

      const largeArc = s.pct > 0.5 ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix2} ${iy2}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}
        Z
      `;

      svgPaths += `<path d="${pathData}" fill="${s.color}" stroke="#ffffff" stroke-width="1.5"/>`;
    });

    // Legend
    let legendHtml = `<div class="donut-legend">`;
    slices.forEach(s => {
      legendHtml += `
        <div class="legend-item">
          <div class="legend-dot" style="background: ${s.color};"></div>
          <span>${s.org.id}: <strong>${s.count}</strong> (${(s.pct * 100).toFixed(0)}%)</span>
        </div>
      `;
    });
    legendHtml += `</div>`;

    wrap.innerHTML = `
      <div class="donut-chart-flex">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          ${svgPaths}
          <text x="${center}" y="${center - 3}" text-anchor="middle" font-size="16" font-weight="700" fill="#0f172a">${total}</text>
          <text x="${center}" y="${center + 12}" text-anchor="middle" font-size="9" fill="#64748b" font-weight="600">WAITING</text>
        </svg>
        ${legendHtml}
      </div>
    `;
  }

  /* Chart 3: Age Distribution Bar Chart */
  renderAgeDistributionChart() {
    const wrap = document.getElementById('chartAgeDistWrap');
    if (!wrap) return;

    const brackets = {
      '<18 (Pediatric)': 0,
      '18 - 35': 0,
      '36 - 50': 0,
      '51 - 65': 0,
      '>65 (Senior)': 0
    };

    const activePatients = this.patients.filter(p => !this.archivedPatients.includes(p.patient_id));
    activePatients.forEach(p => {
      if (p.age < 18) brackets['<18 (Pediatric)']++;
      else if (p.age <= 35) brackets['18 - 35']++;
      else if (p.age <= 50) brackets['36 - 50']++;
      else if (p.age <= 65) brackets['51 - 65']++;
      else brackets['>65 (Senior)']++;
    });

    const maxCount = Math.max(...Object.values(brackets), 1);
    const colors = ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'];

    let html = `<div class="custom-chart-bar-wrap">`;
    Object.entries(brackets).forEach(([label, count], idx) => {
      const widthPct = ((count / maxCount) * 100).toFixed(0);
      html += `
        <div class="chart-bar-row">
          <div class="chart-bar-label" title="${label}">${label}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${widthPct}%; background: ${colors[idx % colors.length]};"></div>
          </div>
          <div class="chart-bar-val">${count}</div>
        </div>
      `;
    });
    html += `</div>`;

    wrap.innerHTML = html;
  }

  /* Chart 4: Regional Distribution Bar Chart */
  renderRegionalDistributionChart() {
    const wrap = document.getElementById('chartRegionDistWrap');
    if (!wrap) return;

    const regions = {
      'North': 0,
      'South': 0,
      'West': 0,
      'East': 0,
      'Central': 0,
      'Northeast': 0
    };

    const activePatients = this.patients.filter(p => !this.archivedPatients.includes(p.patient_id));
    activePatients.forEach(p => {
      if (regions[p.region] !== undefined) {
        regions[p.region]++;
      } else {
        regions['North']++;
      }
    });

    const maxCount = Math.max(...Object.values(regions), 1);
    const colors = ['#0284c7', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

    let html = `<div class="custom-chart-bar-wrap">`;
    Object.entries(regions).forEach(([label, count], idx) => {
      const widthPct = ((count / maxCount) * 100).toFixed(0);
      html += `
        <div class="chart-bar-row">
          <div class="chart-bar-label" title="${label} Region">${label}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${widthPct}%; background: ${colors[idx % colors.length]};"></div>
          </div>
          <div class="chart-bar-val">${count}</div>
        </div>
      `;
    });
    html += `</div>`;

    wrap.innerHTML = html;
  }

  /* Hospital Dashboard Table with Filter & 100 Centers */
  renderHospitalTable(searchTerm = '') {
    const tbody = document.getElementById('hospitalTableBody');
    if (!tbody) return;

    if (searchTerm !== undefined) {
      this.hospitalSearchQuery = searchTerm;
    }

    const hospitals = this.getFilteredHospitals();

    if (hospitals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b; padding: 2rem;">No transplant centers found matching current filters. Try resetting filters or search term.</td></tr>`;
      return;
    }

    let html = '';
    hospitals.forEach(h => {
      const organList = this.getHospitalOrgansList(h);
      const organBadges = organList.map(o => `<span class="organ-tag-pill">${o}</span>`).join(' ');
      const requiredBloodGroup = this.getHospitalBloodGroup(h);
      const priceAlert = this.getHospitalPriceAlert(h);
      const successRate = this.getHospitalSuccessRate(h);

      const websiteLink = h.website && h.website !== 'N/A'
        ? `<a href="${h.website.startsWith('http') ? h.website : 'https://' + h.website}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-size: 0.7rem;">🌐 Web</a>`
        : '';

      const isSpotlight = String(this.selectedSpotlightHospitalId) === String(h.id);

      html += `
        <tr style="${isSpotlight ? 'background: #eff6ff; border-left: 3px solid #003087;' : ''}">
          <td style="font-family: var(--font-mono); font-weight: 700; color: #64748b;">${h.id}</td>
          <td>
            <div style="font-weight: 700; color: #0f172a;">${h.hospital_name}</div>
            <div style="font-size: 0.7rem; color: #64748b; display: flex; gap: 0.4rem; align-items: center; margin-top: 2px;">
              <span>${h.type || 'Transplant Centre'}</span>
              ${websiteLink}
            </div>
          </td>
          <td>
            <div style="font-weight: 600; color: #003087;">${h.state}</div>
            <div style="font-size: 0.72rem; color: #64748b;">${h.district} (${h.region || 'National'})</div>
          </td>
          <td>
            <div style="max-width: 170px;">${organBadges}</div>
          </td>
          <td style="text-align: center;">
            <span class="blood-badge-enlarged" style="font-size: 1.1rem; padding: 0.2rem 0.55rem;">${requiredBloodGroup}</span>
          </td>
          <td>
            <div style="font-size: 0.76rem; font-weight: 600; color: #0f172a;">${h.primary_surgery || 'Organ Transplant'}</div>
            <div style="font-size: 0.7rem; color: #b45309; font-weight: 600;">${priceAlert}</div>
          </td>
          <td>
            <span class="compliance-badge" style="background: #ecfdf5; color: #047857; border-color: #6ee7b7;">
              ${successRate} ★ Excellent!!
            </span>
          </td>
          <td>
            <div style="font-family: var(--font-mono); font-size: 0.74rem;">
              <span style="color: #0284c7;" title="Waiting Recipients">⏳ ${h.active_recipients_waiting || 25}</span> · 
              <span style="color: #059669;" title="Completed Transplants">✔ ${h.completed_transplants || 60}</span>
            </div>
            <div style="font-size: 0.68rem; color: #64748b;">Avg: ${h.avg_wait_time_days || 45}d</div>
          </td>
          <td>
            <button type="button" class="btn-certify-match" style="padding: 0.25rem 0.6rem; font-size: 0.72rem; min-width: unset;" onclick="window.app.selectHospitalSpotlight(${h.id})">
              Details & Price
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  filterHospitalTable(term) {
    this.renderHospitalTable(term);
  }

  /* ══════════════════════════════════════════════
     DONOR HISTORY ARCHIVE RENDERING
     ══════════════════════════════════════════════ */
  renderDonorHistory() {
    const container = document.getElementById('donorHistoryContainer');
    if (!container) return;

    const searchTerm = (document.getElementById('donorHistorySearch')?.value || '').toLowerCase();
    const organFilter = document.getElementById('donorHistoryOrganFilter')?.value || 'All';

    let list = this.donorHistory || [];

    if (organFilter !== 'All') {
      list = list.filter(item => (item.organ || item.organDonated) === organFilter);
    }

    if (searchTerm) {
      list = list.filter(item => {
        const dName = item.donorName || item.donor_name || '';
        const rName = item.recipientName || item.recipient_name || '';
        const hosp = item.recipientHospital || item.hospital || item.donorHospital || '';
        const dId = item.donorId || item.donor_id || '';
        const rId = item.recipientId || item.recipient_id || '';
        return (
          dName.toLowerCase().includes(searchTerm) ||
          rName.toLowerCase().includes(searchTerm) ||
          hosp.toLowerCase().includes(searchTerm) ||
          dId.toLowerCase().includes(searchTerm) ||
          rId.toLowerCase().includes(searchTerm)
        );
      });
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; background: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📜</div>
          <h4 style="font-weight: 700; color: #003087;">No Donor Archive Records Found</h4>
          <p style="font-size: 0.85rem; color: #64748b;">Try changing your search or organ filter.</p>
        </div>
      `;
      return;
    }

    let html = '';
    list.forEach(record => {
      const donorId = record.donorId || record.donor_id || 'DOR-100';
      const organ = record.organDonated || record.organ || 'Organ';
      const transplantDate = record.date || record.transplant_date || '2026-08-20';
      const donorName = record.donorName || record.donor_name || 'Anonymous Donor';
      const donorAge = record.donorAge || record.donor_age || 40;
      const donorBloodGroup = record.donorBloodGroup || record.donor_blood_group || 'O+';
      const donorRegion = record.donorRegion || record.donor_region || 'North';
      const recipientName = record.recipientName || record.recipient_name || 'Patient';
      const recipientId = record.recipientId || record.recipient_id || 'PT-000';
      const recipientAge = record.recipientAge || record.recipient_age || 35;
      const recipientBloodGroup = record.recipientBloodGroup || record.recipient_blood_group || 'O+';
      const hospital = record.recipientHospital || record.hospital || record.donorHospital || 'Apex Transplant Center';
      const surgeon = record.leadSurgeon || record.surgeon || 'Dr. Transplant Team';
      const outcome = record.outcome || 'Graft Function Normal';
      const rawHash = record.blockchain_block_hash || record.zkpSeal || (record.blockNumber ? `0x${record.blockNumber}f9a8b` : '0xzkp_notto_sealed');
      const hashDisplay = String(rawHash).slice(0, 14);

      html += `
        <div class="history-card">
          <div class="history-card-header">
            <div>
              <span class="history-donor-badge">${donorId}</span>
              <div style="font-weight: 700; font-size: 0.95rem; color: #0f172a; margin-top: 4px;">
                Organ: <span style="color: #7c3aed;">${organ}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #64748b;">📅 ${transplantDate}</span>
              <div style="font-size: 0.68rem; color: #059669; font-weight: 700;">● BLOCKCHAIN SEALED</div>
            </div>
          </div>

          <div class="history-details-grid">
            <!-- Donor Info Box -->
            <div class="history-section-box">
              <div class="history-section-title">Donor Details</div>
              <div style="font-weight: 600; color: #0f172a;">${donorName}</div>
              <div style="color: #64748b; font-size: 0.72rem;">${donorAge}y · Blood: <strong style="color: #dc2626;">${donorBloodGroup}</strong></div>
              <div style="color: #64748b; font-size: 0.72rem;">Region: ${donorRegion}</div>
            </div>

            <!-- Recipient Info Box -->
            <div class="history-section-box">
              <div class="history-section-title">Recipient Details</div>
              <div style="font-weight: 600; color: #003087;">${recipientName}</div>
              <div style="color: #64748b; font-size: 0.72rem;">ID: ${recipientId} · ${recipientAge}y</div>
              <div style="color: #64748b; font-size: 0.72rem;">Blood: <strong style="color: #dc2626;">${recipientBloodGroup}</strong></div>
            </div>
          </div>

          <!-- Hospital & Surgeon -->
          <div style="font-size: 0.74rem; color: #334155;">
            <strong>Hospital:</strong> ${hospital}<br>
            <strong>Lead Surgeon:</strong> ${surgeon}
          </div>

          <!-- Outcome & Seal -->
          <div class="history-outcome-banner">
            <span>✔</span>
            <span>Outcome: <strong>${outcome}</strong> · ZKP Hash: <code>${hashDisplay}...</code></span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ══════════════════════════════════════════════
     10-ORGAN TABS RENDERING
     ══════════════════════════════════════════════ */
  renderOrganTabs() {
    const container = document.getElementById('organTabsContainer');
    if (!container) return;

    let html = '';
    this.organList.forEach(org => {
      const activeClass = this.selectedOrgan === org.id ? 'active' : '';
      const queue = this.organWaitlistMap[org.id] || [];
      const count = queue.length;

      html += `
        <button type="button" class="organ-tab-btn ${activeClass}" onclick="window.app.selectOrgan('${org.id}')">
          <span>${org.icon}</span>
          <span>${org.nameEn}</span>
          <span class="organ-tab-badge">${count}</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  selectOrgan(organId) {
    this.selectedOrgan = organId;
    this.renderOrganTabs();
    this.renderWaitlists();
  }

  /* ══════════════════════════════════════════════
     WAITLIST RENDERING & CARD ACTIONS
     ══════════════════════════════════════════════ */
  renderWaitlists() {
    const container = document.getElementById('waitlistCardsContainer');
    if (!container) return;

    const queue = this.organWaitlistMap[this.selectedOrgan] || [];
    
    if (queue.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2.5rem; text-align: center; background: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
          <h4 style="font-weight: 700; color: #003087;">All Candidates Liberated for ${this.selectedOrgan}</h4>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">
            Every patient in the ${this.selectedOrgan} queue has received verified allocation and is archived in the Zero-Knowledge Vault.
          </p>
          <button type="button" class="btn-clean-reset" style="margin-top: 1rem;" onclick="window.app.confirmResetDatabase()">
            🔄 Reset Database to Refill Queue
          </button>
        </div>
      `;
      return;
    }

    let html = '';
    queue.forEach((patientId, idx) => {
      const patient = this.patients.find(p => p.patient_id === patientId);
      if (!patient) return;

      const rank = idx + 1;
      const isRank1 = rank === 1;
      const isFetched = this.fetchedPatients.includes(patient.patient_id);
      const isExpanded = this.expandedCards.has(patient.patient_id);

      html += `
        <div class="patient-card ${isRank1 ? 'rank-1-card' : ''}" id="card-${patient.patient_id}">
          <div>
            <div class="patient-card-header">
              <div>
                <span class="rank-pill ${isRank1 ? 'rank-1-pill' : 'rank-sub-pill'}">
                  ${isRank1 ? '⭐ RANK 1 (PRIORITY)' : `RANK #${rank}`}
                </span>
                <div class="patient-name-hi" style="margin-top: 4px;">${patient.name}</div>
                <div class="patient-meta-row">
                  <span>ID: <strong>${patient.patient_id}</strong></span>
                  <span>·</span>
                  <span>${patient.age}y / ${patient.gender}</span>
                  <span>·</span>
                  <span style="font-weight: 700; color: #dc2626;">Group: ${patient.blood_group}</span>
                </div>
              </div>
              <button type="button" class="utility-link" onclick="window.app.openClausesModal()" title="View THOA Matching Protocol" style="font-size: 0.72rem; color: #003087;">
                THOA ⚖
              </button>
            </div>

            <div class="patient-clinical-box" style="margin-top: 0.6rem;">
              <div class="clinical-diag-text">${patient.clinical_condition}</div>
              <div class="clinical-score-text">${patient.severity_score}</div>
              <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
                Hospital: ${patient.hospital}
              </div>
            </div>

            <!-- Expandable 15-report summary -->
            <div style="margin-top: 0.5rem;">
              <button type="button" class="utility-link" onclick="window.app.toggleCardExpand('${patient.patient_id}')" style="font-size: 0.72rem; color: #0284c7; font-weight: 600;">
                ${isExpanded ? '▲ Hide 15 Diagnostic Reports' : '▼ Inspect 15 SOTTO Reports'}
              </button>

              ${isExpanded ? `
                <div style="margin-top: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.5rem; max-height: 160px; overflow-y: auto; font-size: 0.72rem;">
                  <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">Verified Clinical Documents:</div>
                  ${(patient.reports || []).map(r => `
                    <div style="display: flex; justify-content: space-between; padding: 2px 0; border-bottom: 1px dashed #e2e8f0;">
                      <span style="color: #0f172a;">${r.test}</span>
                      <span style="font-family: var(--font-mono); color: #003087;">${r.hash}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="patient-card-footer">
            <div class="token-row">
              <span style="color: #64748b;">Minted Token:</span>
              <span class="token-chip">${patient.minted_token}</span>
            </div>

            <div class="card-actions-row">
              ${!isFetched ? `
                <button type="button" class="btn-fetch-verify" onclick="window.app.triggerFetchOverlay('${patient.patient_id}')">
                  ⚡ Fetch & Verify (Consensus)
                </button>
              ` : `
                <div class="badge-verified-consensus" style="flex: 1;">
                  ✔ 9-Node Multi-Sig Verified
                </div>
              `}

              ${isRank1 ? `
                <button type="button" class="btn-certify-match" onclick="window.app.allocateOrganToPatient('${patient.patient_id}', '${patient.name}', '${patient.organ_needed}')">
                  Certify Match ⚖
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  toggleCardExpand(patientId) {
    if (this.expandedCards.has(patientId)) {
      this.expandedCards.delete(patientId);
    } else {
      this.expandedCards.add(patientId);
    }
    this.renderWaitlists();
  }

  /* ══════════════════════════════════════════════
     AUTOMATIC WAITLIST ADVANCEMENT & ARCHIVING
     ══════════════════════════════════════════════ */
  allocateOrganToPatient(patientId, name, organ) {
    // 1. Move patient to archived/liberated
    if (!this.archivedPatients.includes(patientId)) {
      this.archivedPatients.push(patientId);
    }
    
    // 2. Remove patient from the active waitlist queue for this organ
    if (this.organWaitlistMap[organ]) {
      this.organWaitlistMap[organ] = this.organWaitlistMap[organ].filter(id => id !== patientId);
    }
    
    // 3. Mark patient object as allocated
    const patient = this.patients.find(p => p.patient_id === patientId);
    if (patient) {
      patient.allocated = true;
    }
    
    // 4. Update ranks of remaining patients for this organ: Next patient becomes Rank 1!
    const remaining = this.organWaitlistMap[organ] || [];
    remaining.forEach((pId, idx) => {
      const p = this.patients.find(item => item.patient_id === pId);
      if (p) {
        p.waitlist_rank = idx + 1;
      }
    });

    // 5. Add to Donor History Archive
    const newHistoryRecord = {
      donor_id: `DNR-${Math.floor(2000 + Math.random() * 8000)}`,
      donor_name: "Anonymous Cadaveric Donor",
      donor_age: Math.floor(22 + Math.random() * 38),
      donor_blood_group: patient ? patient.blood_group : "O+",
      donor_region: patient ? patient.region : "North",
      organ: organ,
      transplant_date: new Date().toISOString().split('T')[0],
      recipient_id: patientId,
      recipient_name: name,
      recipient_age: patient ? patient.age : 35,
      recipient_blood_group: patient ? patient.blood_group : "O+",
      hospital: patient ? patient.hospital : "AIIMS New Delhi",
      surgeon: "Dr. Aniruddh Sharma & Team",
      outcome: "Successful Engraftment (Hemodynamically Stable)",
      blockchain_block_hash: this.generateHash()
    };
    this.donorHistory.unshift(newHistoryRecord);

    // 6. Mint decision log block
    const newBlockNum = this.getLatestBlockNumber() + 1;
    const lastBlock = this.decisionLogs[0] || {};
    const prevHash = lastBlock.currHash || this.generateHash();
    const currHash = this.generateHash();

    const blockObj = {
      blockNumber: newBlockNum,
      timestamp: this.getFormattedTimestamp(),
      action: `ORGAN ALLOCATION CERTIFIED: ${organ} successfully allocated to ${name} (${patientId}). Next candidate ${remaining[0] ? `(${remaining[0]}) advanced to Rank #1` : 'queue fulfilled'}.`,
      clause: "THOA Section 9 & NOTTO Rule 4B - Apex Match Certification",
      prevHash: prevHash,
      currHash: currHash,
      mintingNode: "NOTTO National Apex Authority",
      status: "VALIDATED"
    };

    this.decisionLogs.unshift(blockObj);
    this.saveState();
    this.updateHeaderMetrics();

    // 7. Provide clear feedback and refresh UI immediately
    if (remaining.length > 0) {
      const nextPatient = this.patients.find(p => p.patient_id === remaining[0]);
      this.showToast(`Allocation complete for ${name}! Queue advanced: ${nextPatient ? nextPatient.name : 'Next patient'} is now Rank #1 for ${organ}.`, 'success');
    } else {
      this.showToast(`Allocation complete for ${name}! All registered candidates for ${organ} have received allocations.`, 'success');
    }
    
    this.renderOrganTabs();
    this.renderWaitlists();
    this.renderArchiveVault();
    this.renderDonorHistory();
    this.renderDecisionLogs();
    this.initConsumerLoginDropdown();
    
    if (this.role === 'consumer' && this.activePatientId) {
      this.renderConsumerPortal();
    }
  }

  /* ══════════════════════════════════════════════
     IMMUTABLE DECISION LOG RENDERING
     ══════════════════════════════════════════════ */
  renderDecisionLogs() {
    const container = document.getElementById('decisionLogsContainer');
    if (!container) return;

    if (this.decisionLogs.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 2rem;">No decision blocks recorded.</div>`;
      return;
    }

    let html = '';
    this.decisionLogs.forEach(block => {
      html += `
        <div class="block-entry-card">
          <div class="block-entry-header">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="block-num-pill">BLOCK #${block.blockNumber}</span>
              <span style="font-size: 0.75rem; font-weight: 700; color: #059669; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0;">
                ✔ ${block.status || 'VALIDATED'}
              </span>
            </div>
            <span class="block-timestamp">${block.timestamp}</span>
          </div>

          <div class="block-action-text">${block.action}</div>
          <div class="block-clause-text">Statutory Reference: ${block.clause}</div>

          <div class="block-hashes-row">
            <div><span style="color: #64748b;">Prev Hash:</span> <span>${block.prevHash}</span></div>
            <div><span style="color: #64748b;">Curr Hash:</span> <strong style="color: #003087;">${block.currHash}</strong></div>
            <div><span style="color: #64748b;">Minting Authority:</span> <span>${block.mintingNode}</span></div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ══════════════════════════════════════════════
     ZERO-KNOWLEDGE VAULT RENDERING
     ══════════════════════════════════════════════ */
  renderArchiveVault() {
    const container = document.getElementById('vaultCardsContainer');
    if (!container) return;

    if (this.archivedPatients.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 3rem; text-align: center; background: #ffffff; border-radius: 8px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔒</div>
          <h4 style="font-weight: 700; color: #003087;">Zero-Knowledge Archive is Currently Clear</h4>
          <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">
            When a patient is granted an organ in the waitlist or signs their allocation agreement, their identity is cryptographically sealed here under THOA Privacy Protocol Clause IV.
          </p>
        </div>
      `;
      return;
    }

    let html = '';
    this.archivedPatients.forEach(pId => {
      const patient = this.patients.find(p => p.patient_id === pId);
      if (!patient) return;

      const zkpHash = `0xzkp_${this.generateHash().slice(2, 14)}`;

      html += `
        <div class="vault-card">
          <div class="vault-header-row">
            <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${patient.name}</div>
            <span class="vault-sealed-badge">ZKP ENCRYPTED</span>
          </div>

          <div style="font-size: 0.78rem; color: #64748b;">
            Allocated Organ: <strong style="color: #7c3aed;">${patient.organ_needed}</strong> · Hospital: ${patient.hospital}
          </div>

          <div class="vault-hash-box">
            <div style="font-size: 0.68rem; text-transform: uppercase; color: #7c3aed; font-weight: 700; margin-bottom: 2px;">
              Zero-Knowledge Verification Seal
            </div>
            <div>${zkpHash}</div>
          </div>

          <div style="font-size: 0.72rem; color: #059669; font-weight: 600;">
            ✔ Identity Permanently Anonymized under THOA Clause IV
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ══════════════════════════════════════════════
     CONSUMER PORTAL & LOGIN
     ══════════════════════════════════════════════ */
  initConsumerLoginDropdown() {
    const select = document.getElementById('consumerPatientSelect');
    if (!select) return;

    let html = '';
    this.patients.forEach(p => {
      const isArchived = this.archivedPatients.includes(p.patient_id);
      html += `
        <option value="${p.patient_id}" ${p.patient_id === this.activePatientId ? 'selected' : ''}>
          ${p.name} (${p.patient_id}) — ${p.organ_needed} [${p.hospital}] ${isArchived ? '· SEALED (ZKP)' : `· Rank #${p.waitlist_rank || 'N/A'}`}
        </option>
      `;
    });

    select.innerHTML = html;
  }

  loginAsPatient() {
    const select = document.getElementById('consumerPatientSelect');
    if (select) {
      this.activePatientId = select.value;
    }
    this.role = 'consumer';
    this.navigate('consumer-portal');
    this.updateRoleView();
    this.showToast(`Authenticated as ${this.getActivePatient()?.name}`, 'success');
  }

  logoutPatient() {
    this.role = 'admin';
    this.navigate('waitlists');
    this.updateRoleView();
    this.showToast('Signed out of Patient Portal. Returned to Admin view.', 'info');
  }

  getActivePatient() {
    return this.patients.find(p => p.patient_id === this.activePatientId) || this.patients[0];
  }

  renderConsumerPortal() {
    const patient = this.getActivePatient();
    if (!patient) return;

    const isArchived = this.archivedPatients.includes(patient.patient_id);
    const queue = this.organWaitlistMap[patient.organ_needed] || [];
    const currentRank = queue.indexOf(patient.patient_id) + 1;
    const isRank1 = currentRank === 1 && !isArchived;

    const greeting = document.getElementById('consumerGreeting');
    const subheading = document.getElementById('consumerSubheading');
    if (greeting) greeting.textContent = `${patient.name} (मरीज़ ID: ${patient.patient_id})`;
    if (subheading) subheading.textContent = `National ${patient.organ_needed} Allocation Registry · ${patient.hospital}`;

    const container = document.getElementById('consumerPortalDynamicContent');
    if (!container) return;

    const specs = this.organSpecs[patient.organ_needed] || this.organSpecs['Eyes'];

    if (isArchived) {
      container.innerHTML = `
        <div class="glass-panel status-hero-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div style="font-size: 1.15rem; font-weight: 800; color: #059669; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎉</span> 10-Organ Allocation & Surgery Verified
            </div>
            <span class="vault-sealed-badge" style="font-size: 0.78rem;">SEALED IN ZKP VAULT</span>
          </div>

          <p style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin-bottom: 1.25rem;">
            Congratulations, <strong>${patient.name}</strong>! Your ${patient.organ_needed} transplant matching agreement has been cryptographically signed and confirmed across all 9 SOTTO nodes. Per THOA Privacy Protocol Clause IV, all your biometric identifiers are permanently anonymized in the Zero-Knowledge Vault.
          </p>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1rem; margin-bottom: 1.25rem;">
            <div style="font-weight: 700; color: #166534; font-size: 0.82rem; margin-bottom: 4px;">Zero-Knowledge Cryptographic Token:</div>
            <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #15803d; word-break: break-all;">
              0xzkp_liberated_${patient.patient_id}_${patient.minted_token}
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn-clean-reset" onclick="window.app.navigate('zkp-vault')">
              View Entry in Zero-Knowledge Vault →
            </button>
            <button type="button" class="btn-secondary-portal" onclick="window.app.openNottoDigitalSlipModal()">
              🖨️ View NOTTO Digital Slip (PDF)
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <!-- 1. Top Quick Metrics Strip -->
        <div class="portal-metrics-ribbon">
          <div class="portal-metric-card">
            <div class="portal-metric-icon" style="background: ${isRank1 ? '#ecfdf5' : '#eff6ff'}; color: ${isRank1 ? '#059669' : '#1d4ed8'};">
              ${isRank1 ? '⭐' : '📋'}
            </div>
            <div class="portal-metric-content">
              <div class="portal-metric-label">Registry Queue Position</div>
              <div class="portal-metric-value" style="color: ${isRank1 ? '#059669' : '#1d4ed8'};">
                ${isRank1 ? 'Rank #1 (Priority Match)' : `Rank #${currentRank} in Waitlist`}
              </div>
            </div>
          </div>

          <div class="portal-metric-card">
            <div class="portal-metric-icon" style="background: #faf5ff; color: #7c3aed;">
              ${specs.icon || '🫀'}
            </div>
            <div class="portal-metric-content">
              <div class="portal-metric-label">Target Organ Needed</div>
              <div class="portal-metric-value" style="color: #7c3aed;">
                ${patient.organ_needed}
              </div>
            </div>
          </div>

          <div class="portal-metric-card">
            <div class="portal-metric-icon" style="background: #fef2f2; color: #dc2626;">
              🩸
            </div>
            <div class="portal-metric-content">
              <div class="portal-metric-label">Blood Group / Severity</div>
              <div class="portal-metric-value">
                <span style="color: #dc2626; font-weight: 800;">${patient.blood_group}</span> · Score ${patient.severity_score}/100
              </div>
            </div>
          </div>

          <div class="portal-metric-card">
            <div class="portal-metric-icon" style="background: #ecfdf5; color: #059669;">
              🛡️
            </div>
            <div class="portal-metric-content">
              <div class="portal-metric-label">Ayushman PM-JAY</div>
              <div class="portal-metric-value" style="color: #059669;">
                100% Cashless Covered
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Priority Allocation Hero Banner (When Rank #1) -->
        ${isRank1 ? `
          <div class="allocation-hero-banner">
            <div class="allocation-banner-header">
              <div>
                <div style="font-size: 1.05rem; font-weight: 800; color: #1e3a8a; display: flex; align-items: center; gap: 0.5rem;">
                  <span>⚡</span> IMMEDIATE ALLOCATION PRIORITY MATCH ACTIVE
                </div>
                <div style="font-size: 0.78rem; color: #3b82f6; margin-top: 2px;">
                  Matched Deceased Donor ${patient.organ_needed} (0/6 HLA Mismatches) · Priority Rights under NOTTO Rule 4B
                </div>
              </div>
              <div class="allocation-timer-box">
                <span style="font-size: 0.72rem; font-weight: 700; color: #64748b;">ACCEPTANCE WINDOW:</span>
                <span class="timer-countdown-val" id="allocationTimer">04:59:42</span>
              </div>
            </div>

            <p style="font-size: 0.82rem; color: #334155; line-height: 1.5; margin-bottom: 0.75rem;">
              A verified deceased donor ${patient.organ_needed} is currently in continuous hypothermic perfusion and routed to <strong>${patient.hospital}</strong>. Please upload the 2 statutory pre-op diagnostic clearances below to execute the multi-sig smart contract.
            </p>

            <div class="preop-docs-grid">
              ${specs.docs.map(doc => `
                <div class="preop-doc-upload-card">
                  <div>
                    <div style="font-weight: 700; color: #0f172a; font-size: 0.82rem;">${doc.name}</div>
                    <div style="font-size: 0.7rem; color: #64748b;">Statutory Code: ${doc.code}</div>
                  </div>
                  <button type="button" class="btn-upload-preop ${this.clearanceUploaded[doc.id] ? 'uploaded' : ''}" onclick="window.app.uploadClearanceDoc(${doc.id})">
                    ${this.clearanceUploaded[doc.id] ? '✔ Signed & Sealed' : 'Upload & Hash ⭳'}
                  </button>
                </div>
              `).join('')}
            </div>

            <button type="button" class="btn-sign-multisig-allocation" id="btnSignAgreement" onclick="window.app.signAllocationAgreement()" ${(!this.clearanceUploaded[1] || !this.clearanceUploaded[2]) ? 'disabled' : ''}>
              ${(!this.clearanceUploaded[1] || !this.clearanceUploaded[2]) ? '🔒 Upload Both Pre-Op Clearances Above to Sign' : '✍ Sign & Liberate Organ Allocation Multi-Sig Agreement'}
            </button>
          </div>
        ` : ''}

        <!-- 3. Two-Column Split Architecture: Segregated Recipient vs Donor Dossiers -->
        <div class="portal-split-layout">
          <!-- LEFT COLUMN: 🧑 RECIPIENT CLINICAL & IDENTITY DOSSIER -->
          <div class="recipient-dossier-card">
            <div class="dossier-card-header">
              <div class="dossier-title-group">
                <span style="font-size: 1.25rem;">🧑</span>
                <div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">RECIPIENT CLINICAL DOSSIER</div>
                  <div style="font-size: 0.7rem; color: #64748b;">Patient Identity & Pre-Transplant Baseline</div>
                </div>
              </div>
              <span class="dossier-tag-blue">RECIPIENT RECORD</span>
            </div>

            <div class="dossier-grid">
              <div class="dossier-item">
                <div class="dossier-label">Full Legal Name</div>
                <div class="dossier-val">${patient.name}</div>
              </div>
              <div class="dossier-item">
                <div class="dossier-label">Patient Registry ID</div>
                <div class="dossier-val dossier-val-highlight">${patient.patient_id}</div>
              </div>

              <div class="dossier-item">
                <div class="dossier-label">Age / Gender</div>
                <div class="dossier-val">${patient.age} Years / ${patient.gender}</div>
              </div>
              <div class="dossier-item">
                <div class="dossier-label">Recipient Blood Group</div>
                <div class="dossier-val" style="color: #dc2626;">${patient.blood_group}</div>
              </div>

              <div class="dossier-item full-width">
                <div class="dossier-label">Primary Clinical Diagnosis</div>
                <div class="dossier-val">${patient.clinical_condition}</div>
              </div>

              <div class="dossier-item">
                <div class="dossier-label">MELD / Urgency Score</div>
                <div class="dossier-val">${patient.severity_score} / 100</div>
              </div>
              <div class="dossier-item">
                <div class="dossier-label">DigiLocker ABHA ID</div>
                <div class="dossier-val" style="font-family: var(--font-mono); font-size: 0.76rem;">91-8821-4091-${patient.patient_id.replace('PT-', '')}</div>
              </div>

              <div class="dossier-item full-width">
                <div class="dossier-label">Admitted Transplant Center</div>
                <div class="dossier-val">${patient.hospital}</div>
              </div>

              <div class="dossier-item full-width dossier-hla-box">
                <div style="font-weight: 700; color: #166534; font-size: 0.72rem; margin-bottom: 2px;">
                  🧬 Recipient HLA Immunological Loci:
                </div>
                <div class="dossier-hla-pills">
                  <span class="hla-chip">A*02:01</span>
                  <span class="hla-chip">A*24:02</span>
                  <span class="hla-chip">B*07:02</span>
                  <span class="hla-chip">B*40:01</span>
                  <span class="hla-chip">DRB1*04:01</span>
                  <span class="hla-chip">DRB1*15:01</span>
                </div>
                <div style="font-size: 0.68rem; color: #15803d; margin-top: 4px;">
                  Panel Reactive Antibodies (cPRA): <strong>2%</strong> (Low antibody sensitization)
                </div>
              </div>

              <div class="dossier-item full-width">
                <div class="dossier-label">SOTTO Cryptographic Root Token</div>
                <div class="dossier-val" style="font-family: var(--font-mono); font-size: 0.72rem; color: #003087; word-break: break-all;">
                  ${patient.minted_token}
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: 🫀 MATCHED DONOR & ORGAN PRESERVATION PIPELINE -->
          <div class="donor-pipeline-card">
            <div class="dossier-card-header">
              <div class="dossier-title-group">
                <span style="font-size: 1.25rem;">🫀</span>
                <div>
                  <div style="font-size: 0.95rem; font-weight: 800; color: #047857;">MATCHED DONOR & ORGAN PIPELINE</div>
                  <div style="font-size: 0.7rem; color: #64748b;">Deceased Donor Profile & Preservation Telemetry</div>
                </div>
              </div>
              <span class="dossier-tag-green">DONOR PIPELINE</span>
            </div>

            <!-- Donor Profile & Compatibility Matrix -->
            <div class="dossier-grid">
              <div class="dossier-item">
                <div class="dossier-label">Matched Donor Identifier</div>
                <div class="dossier-val" style="color: #047857;">DNR-ND-8941 (BSD)</div>
              </div>
              <div class="dossier-item">
                <div class="dossier-label">Donor Age / Blood Group</div>
                <div class="dossier-val">38y / <span style="color: #059669; font-weight: 800;">${patient.blood_group} (Iso)</span></div>
              </div>

              <div class="dossier-item full-width">
                <div class="dossier-label">Retrieval Source Center</div>
                <div class="dossier-val">AIIMS Apex Retrieval Unit · Form 8 Medical Board Cleared</div>
              </div>
            </div>

            <div class="donor-compat-grid">
              <div class="compat-badge-box">
                <div class="compat-badge-label">HLA MATCH</div>
                <div class="compat-badge-val">6/6 COMPATIBLE</div>
              </div>
              <div class="compat-badge-box">
                <div class="compat-badge-label">CROSSMATCH</div>
                <div class="compat-badge-val">NEGATIVE (CDC)</div>
              </div>
              <div class="compat-badge-box">
                <div class="compat-badge-label">VIRAL NAT</div>
                <div class="compat-badge-val">NON-REACTIVE</div>
              </div>
            </div>

            <!-- Cold Ischemia & Smart Container Telemetry -->
            <div class="telemetry-mini-strip">
              <div class="telemetry-mini-item">
                <span style="color: #64748b;">Cold Ischemia Clock:</span>
                <strong>02h 45m remaining</strong>
              </div>
              <div class="telemetry-mini-item">
                <span style="color: #64748b;">Smart Container E-Seal:</span>
                <strong style="color: #059669;">0.02 Ω (Armed)</strong>
              </div>
              <div class="telemetry-mini-item">
                <span style="color: #64748b;">Perfusion Temp:</span>
                <strong>2.4°C (Optimal)</strong>
              </div>
              <div class="telemetry-mini-item">
                <span style="color: #64748b;">Green Corridor ETA:</span>
                <strong style="color: #1e40af;">26 Mins (76 km/h)</strong>
              </div>
            </div>

            <!-- Live Organ Canvas -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <span style="font-size: 0.78rem; font-weight: 700; color: #003087;">
                  Live Anatomical Digital Twin (${patient.organ_needed})
                </span>
                <span style="font-family: var(--font-mono); font-size: 0.68rem; color: #059669; font-weight: 700;">● 60 FPS RENDER</span>
              </div>
              <div class="organ-canvas-wrap" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px;">
                <canvas id="consumerOrganCanvas" width="320" height="180" style="width: 100%; height: 180px; display: block;"></canvas>
              </div>
              <div class="organ-spec-info" style="margin-top: 4px; padding: 4px 8px; background: #f1f5f9; border-radius: 4px;">
                <div style="font-weight: 700; color: #0f172a; font-size: 0.76rem;">${specs.efficiency}</div>
                <div style="font-size: 0.68rem; color: #64748b;">${specs.vitals}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. UPGRADED CLINICAL DIAGNOSTIC DOCUMENTATION HUB -->
        <div class="doc-hub-container" id="patientDocHub">
          <div class="doc-hub-header">
            <div>
              <div class="doc-hub-title">
                <span>📑</span> Synchronized Clinical Diagnostic Documents Repository
              </div>
              <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
                All 15 statutory medical tests cryptographically sealed and synced across 9 SOTTO nodal hospital registries.
              </div>
            </div>
            <button type="button" class="btn-secondary-portal" onclick="window.app.openNottoDigitalSlipModal()">
              🖨️ View NOTTO Digital Slip (PDF)
            </button>
          </div>

          <!-- Documentation Summary KPI Ribbon -->
          <div class="doc-stats-strip">
            <div class="doc-stat-pill">
              <span>🗂️</span> Total Records: <strong>15 Synchronized Files</strong>
            </div>
            <div class="doc-stat-pill success">
              <span>✔</span> Cryptographic Integrity: <strong>100% Verified</strong>
            </div>
            <div class="doc-stat-pill">
              <span>🏛️</span> Consensus Nodes: <strong>9-Node SOTTO Quorum</strong>
            </div>
            <div class="doc-stat-pill success">
              <span>🔒</span> Tamper Violations: <strong>0 Discrepancies</strong>
            </div>
          </div>

          <!-- Search Bar & Category Filter Toolbar -->
          <div class="doc-toolbar">
            <div class="doc-search-box">
              <span class="doc-search-icon">🔍</span>
              <input type="text" id="patientDocSearchInput" placeholder="Search by test name, category, lab, or SHA-256 hash..." oninput="window.app.searchPatientDocs(this.value)">
            </div>

            <div class="doc-category-tabs">
              <button type="button" class="doc-cat-btn ${this.patientDocFilter === 'all' ? 'active' : ''}" onclick="window.app.filterPatientDocs('all')">
                All (15)
              </button>
              <button type="button" class="doc-cat-btn ${this.patientDocFilter === 'hla' ? 'active' : ''}" onclick="window.app.filterPatientDocs('hla')">
                🧬 Immunology & HLA
              </button>
              <button type="button" class="doc-cat-btn ${this.patientDocFilter === 'serology' ? 'active' : ''}" onclick="window.app.filterPatientDocs('serology')">
                🧪 Viral Serology
              </button>
              <button type="button" class="doc-cat-btn ${this.patientDocFilter === 'pathology' ? 'active' : ''}" onclick="window.app.filterPatientDocs('pathology')">
                🫁 Organ Pathology
              </button>
              <button type="button" class="doc-cat-btn ${this.patientDocFilter === 'imaging' ? 'active' : ''}" onclick="window.app.filterPatientDocs('imaging')">
                🩻 Imaging & Radiology
              </button>
              <button type="button" class="doc-cat-btn ${this.patientDocFilter === 'statutory' ? 'active' : ''}" onclick="window.app.filterPatientDocs('statutory')">
                ⚖️ Statutory Forms
              </button>
            </div>
          </div>

          <!-- Dynamic Documents Container -->
          <div id="patientDocsDynamicGrid" class="doc-cards-grid">
            <!-- Rendered by renderPatientDocsGrid() -->
          </div>

          <!-- Pre-Op Supplementary Document Drag & Drop Dropzone -->
          <div style="margin-top: 1.25rem; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 8px; padding: 1rem; text-align: center;">
            <div style="font-size: 1.2rem; margin-bottom: 4px;">📥</div>
            <div style="font-weight: 700; color: #1e293b; font-size: 0.82rem;">Upload Supplementary Clinical Diagnostic Report</div>
            <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">
              Drag & drop pre-op CT scans, echocardiograms, or serology PDFs for instant SHA-256 sealing and SOTTO node broadcasting.
            </div>
            <div style="margin-top: 0.6rem;">
              <input type="file" id="patientDocUploadInput" style="display: none;" onchange="window.app.simulatePatientDocUpload(this)">
              <button type="button" class="btn-secondary-portal" onclick="document.getElementById('patientDocUploadInput').click()">
                📂 Select File from Device
              </button>
            </div>
          </div>
        </div>
      `;

      setTimeout(() => {
        this.initOrganCanvas(patient.organ_needed);
        if (isRank1) this.startAllocationTimer();
        this.renderPatientDocsGrid(patient);
      }, 50);
    }

    this.renderConsumerReportsTable(patient);
  }

  getReportCategory(testName) {
    const t = (testName || '').toLowerCase();
    if (t.includes('hla') || t.includes('crossmatch') || t.includes('panel') || t.includes('pra') || t.includes('allele')) return 'hla';
    if (t.includes('hiv') || t.includes('serology') || t.includes('hepatitis') || t.includes('hbv') || t.includes('hcv') || t.includes('cmv') || t.includes('viral') || t.includes('nat')) return 'serology';
    if (t.includes('biopsy') || t.includes('pathology') || t.includes('lft') || t.includes('kft') || t.includes('creatinine') || t.includes('bilirubin') || t.includes('cardiac') || t.includes('enzyme')) return 'pathology';
    if (t.includes('ct') || t.includes('x-ray') || t.includes('echo') || t.includes('mri') || t.includes('ultrasound') || t.includes('doppler') || t.includes('scan')) return 'imaging';
    return 'statutory';
  }

  getCategoryLabel(category) {
    switch (category) {
      case 'hla': return { label: '🧬 Immunology & HLA', class: 'hla' };
      case 'serology': return { label: '🧪 Viral Serology', class: 'serology' };
      case 'pathology': return { label: '🫁 Organ Pathology', class: 'pathology' };
      case 'imaging': return { label: '🩻 Imaging & Radiology', class: 'imaging' };
      default: return { label: '⚖️ Statutory SOTTO Form', class: 'statutory' };
    }
  }

  renderPatientDocsGrid(patient) {
    const grid = document.getElementById('patientDocsDynamicGrid');
    if (!grid) return;

    const reports = patient.reports || [];
    const filter = this.patientDocFilter || 'all';
    const query = (this.patientDocSearch || '').trim().toLowerCase();

    const filtered = reports.filter(r => {
      const category = this.getReportCategory(r.test);
      const matchesCat = filter === 'all' || category === filter;
      if (!matchesCat) return false;

      if (!query) return true;
      const testName = (r.test || '').toLowerCase();
      const reportId = (r.report_id || r.id || '').toLowerCase();
      const hospital = (r.hospital || '').toLowerCase();
      const lab = (r.lab || '').toLowerCase();
      const hash = (r.hash || '').toLowerCase();
      return testName.includes(query) || reportId.includes(query) || hospital.includes(query) || lab.includes(query) || hash.includes(query);
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: #64748b; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔍</div>
          <div style="font-weight: 700; color: #334155;">No matching clinical documents found</div>
          <div style="font-size: 0.78rem; margin-top: 2px;">Try adjusting your search keywords or switching category filters.</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(r => {
      const reportId = r.report_id || r.id || 'RPT-001';
      const testName = r.test || 'Clinical Diagnostic Panel';
      const category = this.getReportCategory(testName);
      const catMeta = this.getCategoryLabel(category);
      const hospitalName = r.hospital || patient.hospital || 'AIIMS New Delhi';
      const labVendor = r.lab || r.vendor || 'National Histocompatibility Registry';
      const testDate = r.date || '2026-08-01';
      const docHash = r.hash || '0x7a8b9c0d1e';

      return `
        <div class="doc-record-card" id="card-${reportId}">
          <div>
            <div class="doc-card-top">
              <span class="doc-cat-badge ${catMeta.class}">${catMeta.label}</span>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700; color: #003087;">${reportId}</span>
            </div>

            <div class="doc-card-name">${testName}</div>
            <div class="doc-card-meta" style="margin-top: 4px;">
              <div>🏛️ <strong>${hospitalName}</strong></div>
              <div>🔬 ${labVendor} · 📅 ${testDate}</div>
            </div>
          </div>

          <div>
            <div class="doc-card-hash-bar">
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">
                ${docHash.slice(0, 16)}...${docHash.slice(-8)}
              </span>
              <button type="button" onclick="window.app.copySpecificHash('${docHash}')" style="background: none; border: none; cursor: pointer; font-size: 0.72rem; color: #003087; font-weight: 700;" title="Copy SHA-256">
                📋 Copy
              </button>
            </div>

            <div class="doc-card-actions">
              <button type="button" class="btn-view-doc" onclick="window.app.viewPatientDoc('${reportId}')">
                👁️ View Document
              </button>
              <button type="button" class="btn-verify-seal" onclick="window.app.verifyPatientDocSeal('${docHash}', '${testName.replace(/'/g, "\\'")}')">
                🔗 Verify Seal
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  filterPatientDocs(cat) {
    this.patientDocFilter = cat;
    const patient = this.getActivePatient();
    if (patient) this.renderConsumerPortal();
  }

  searchPatientDocs(query) {
    this.patientDocSearch = query;
    const patient = this.getActivePatient();
    if (patient) this.renderPatientDocsGrid(patient);
  }

  viewPatientDoc(reportId) {
    const patient = this.getActivePatient();
    if (!patient) return;

    const report = (patient.reports || []).find(r => (r.report_id || r.id) === reportId) || patient.reports[0];
    if (!report) return;

    this.activeDocReport = report;
    const testName = report.test || 'Clinical Diagnostic Panel';
    const category = this.getReportCategory(testName);
    const catMeta = this.getCategoryLabel(category);
    const hospitalName = report.hospital || patient.hospital || 'AIIMS New Delhi';
    const labVendor = report.lab || report.vendor || 'National Histocompatibility Registry';
    const testDate = report.date || '2026-08-01';
    const docHash = report.hash || '0x7a8b9c0d1e';

    const contentEl = document.getElementById('patientDocModalContent');
    if (!contentEl) return;

    contentEl.innerHTML = `
      <div class="doc-clinical-sheet">
        <div class="doc-sheet-watermark">NOTTO VERIFIED</div>

        <div class="doc-report-title-strip">
          <div>
            <div class="doc-report-name">${testName}</div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
              Category: <strong>${catMeta.label}</strong> · Specimen Source: Peripheral Whole Blood & Biopsy Core
            </div>
          </div>
          <div class="doc-report-id">
            ${report.report_id || report.id || 'RPT-001'}
          </div>
        </div>

        <div class="doc-patient-meta-grid">
          <div><strong>Recipient Name:</strong> ${patient.name}</div>
          <div><strong>Recipient ID:</strong> ${patient.patient_id}</div>
          <div><strong>Age / Gender:</strong> ${patient.age}y / ${patient.gender}</div>
          <div><strong>Blood Group:</strong> <span style="color: #dc2626; font-weight: 700;">${patient.blood_group}</span></div>
          <div><strong>Admitted Center:</strong> ${hospitalName}</div>
          <div><strong>Testing Laboratory:</strong> ${labVendor}</div>
          <div><strong>Collection Date:</strong> ${testDate}</div>
          <div><strong>Protocol Reference:</strong> SOTTO-HISTO-STD-v4.2</div>
        </div>

        <table class="doc-param-table">
          <thead>
            <tr>
              <th>Diagnostic Parameter</th>
              <th>Observed Result</th>
              <th>Reference Interval</th>
              <th>Status / Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Primary Target Assay</strong></td>
              <td style="color: #003087; font-weight: 700;">Complete Concordance</td>
              <td>Target Specific</td>
              <td><span style="color: #059669; font-weight: 700;">✔ VALIDATED</span></td>
            </tr>
            <tr>
              <td><strong>Histocompatibility Index</strong></td>
              <td>0/6 Mismatch (Optimal)</td>
              <td>≤ 2 Mismatches Allowed</td>
              <td><span style="color: #059669; font-weight: 700;">✔ 100% MATCH</span></td>
            </tr>
            <tr>
              <td><strong>Cytotoxic Crossmatch (CDC)</strong></td>
              <td>Negative (&lt; 5% lysis)</td>
              <td>Negative (&lt; 10%)</td>
              <td><span style="color: #059669; font-weight: 700;">✔ NEGATIVE</span></td>
            </tr>
            <tr>
              <td><strong>Nucleic Acid Test (NAT)</strong></td>
              <td>Non-Reactive (HIV/HBV/HCV)</td>
              <td>Non-Reactive</td>
              <td><span style="color: #059669; font-weight: 700;">✔ CLEARED</span></td>
            </tr>
          </tbody>
        </table>

        <div class="doc-interpretation-box">
          <strong>Pathologist Clinical Interpretation:</strong> Specimen meets all regulatory criteria under Transplantation of Human Organs and Tissues Act (THOA 1994, Amendment 2011). No donor-specific HLA antibodies detected. Pre-transplantation histocompatibility cleared for immediate surgical allocation.
        </div>

        <div class="doc-sign-block">
          <div class="doc-qr-stamp">
            <div class="doc-qr-box">
              NOTTO<br>SEAL<br>2026
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.76rem; color: #0f172a;">SHA-256 SOTTO Consensus Seal</div>
              <div style="font-family: var(--font-mono); font-size: 0.68rem; color: #64748b; word-break: break-all;">
                ${docHash}
              </div>
            </div>
          </div>

          <div style="text-align: right; font-size: 0.72rem; color: #475569;">
            <div style="font-family: 'Brush Script MT', cursive; font-size: 1.1rem; color: #003087;">Dr. A. K. Sengupta</div>
            <div style="font-weight: 700; color: #0f172a;">Dr. A. K. Sengupta, MD (Immunohematology)</div>
            <div>Apex Laboratory Director · SOTTO India</div>
          </div>
        </div>
      </div>
    `;

    const modal = document.getElementById('patientDocModal');
    if (modal) modal.classList.remove('hidden');
  }

  closePatientDocModal() {
    const modal = document.getElementById('patientDocModal');
    if (modal) modal.classList.add('hidden');
  }

  copyActiveDocHash() {
    if (!this.activeDocReport) return;
    const hash = this.activeDocReport.hash || '0x7a8b9c0d1e';
    navigator.clipboard.writeText(hash).then(() => {
      this.showToast('SHA-256 Document Hash copied to clipboard.', 'success');
    }).catch(() => {
      this.showToast('Hash: ' + hash, 'info');
    });
  }

  copySpecificHash(hash) {
    navigator.clipboard.writeText(hash).then(() => {
      this.showToast('SHA-256 hash copied to clipboard.', 'success');
    }).catch(() => {
      this.showToast('Hash: ' + hash, 'info');
    });
  }

  printPatientDoc() {
    window.print();
  }

  verifyPatientDocSeal(hash, testName) {
    this.showToast(`✔ Merkle Proof verified for "${testName}". Confirmed on all 9 SOTTO hospital nodes.`, 'success');
  }

  simulatePatientDocUpload(input) {
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const patient = this.getActivePatient();
    if (!patient) return;

    const newReportId = `RPT-${patient.patient_id.replace('PT-', '')}-SUP`;
    const randomHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    patient.reports = patient.reports || [];
    patient.reports.unshift({
      report_id: newReportId,
      source: 'SOTTO Telemetry Ingestion',
      hospital: patient.hospital,
      lab: 'Apex Pre-Op Diagnostic Unit',
      test: `Pre-Op Supplementary Clearance (${file.name})`,
      date: new Date().toISOString().split('T')[0],
      hash: randomHash
    });

    this.showToast(`"${file.name}" uploaded, SHA-256 stamped, and broadcast to SOTTO network.`, 'success');
    this.renderConsumerPortal();
    input.value = '';
  }

  renderConsumerReportsTable(patient) {
    const tbody = document.getElementById('consumerReportsTableBody');
    if (!tbody) return;

    let html = '';
    const reports = patient.reports || [];
    reports.forEach(r => {
      const reportId = r.report_id || r.id || 'RPT-001';
      const nodeSource = r.source || r.node || 'SOTTO Apex Node';
      const hospitalName = r.hospital || patient.hospital || 'AIIMS New Delhi';
      const labVendor = r.lab || r.vendor || 'National Histocompatibility Registry';
      const testName = r.test || 'Clinical Diagnostic Panel';
      const testDate = r.date || '2026-08-01';
      const docHash = r.hash || '0x7a8b9c0d1e';

      html += `
        <tr>
          <td style="font-family: var(--font-mono); font-weight: 700; color: #003087;">${reportId}</td>
          <td><span style="color: #64748b; font-size: 0.72rem;">${nodeSource}</span></td>
          <td>${hospitalName}</td>
          <td><span style="color: #475569;">${labVendor}</span></td>
          <td><strong>${testName}</strong></td>
          <td style="font-size: 0.72rem; color: #64748b;">${testDate}</td>
          <td style="font-family: var(--font-mono); font-size: 0.72rem; color: #7c3aed;">${docHash.slice(0, 14)}...</td>
          <td>
            <button type="button" class="btn-verify-seal" style="padding: 2px 6px; font-size: 0.68rem;" onclick="window.app.viewPatientDoc('${reportId}')">
              👁️ View
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  uploadClearanceDoc(docId) {
    this.clearanceUploaded[docId] = true;
    this.showToast(`Pre-Op Document #${docId} signed & stamped with SHA-256 hash.`, 'success');
    this.renderConsumerPortal();
  }

  signAllocationAgreement() {
    const patient = this.getActivePatient();
    if (!patient) return;

    this.allocateOrganToPatient(patient.patient_id, patient.name, patient.organ_needed);
    this.showToast('Transplant Allocation Agreement signed & sealed into Zero-Knowledge Vault!', 'success');
  }

  startAllocationTimer() {
    if (this.allocationTimerInterval) clearInterval(this.allocationTimerInterval);
    let secondsLeft = 17982; // ~4h 59m 42s

    this.allocationTimerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft <= 0) {
        clearInterval(this.allocationTimerInterval);
        return;
      }

      const hours = Math.floor(secondsLeft / 3600);
      const mins = Math.floor((secondsLeft % 3600) / 60);
      const secs = secondsLeft % 60;

      const pad = n => n.toString().padStart(2, '0');
      const timerEl = document.getElementById('allocationTimer');
      if (timerEl) {
        timerEl.textContent = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
      }
    }, 1000);
  }

  initOrganCanvas(organType) {
    const canvas = document.getElementById('consumerOrganCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.organAnimationInterval) clearInterval(this.organAnimationInterval);

    let angle = 0;
    let pulse = 0;

    this.organAnimationInterval = setInterval(() => {
      angle += 0.03;
      pulse += 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.save();
      ctx.translate(cx, cy);

      try {
        if (organType === 'Eyes') {
          // 3D CORNEA / EYE: Concentric optical shells, limbus & pupil
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let r = 20; r <= 60; r += 12) {
            const rx = Math.max(1, r);
            const ry = Math.max(1, r * 0.7);
            ctx.ellipse(0, 0, rx, ry, angle * 0.5, 0, Math.PI * 2);
          }
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(Math.sin(angle) * 10, Math.cos(angle) * 8, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(Math.sin(angle) * 10, Math.cos(angle) * 8, 6, 0, Math.PI * 2);
          ctx.fill();

        } else if (organType === 'Heart') {
          // Parametric heart wireframe
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let t = 0; t <= Math.PI * 2; t += 0.1) {
            const x = 16 * Math.pow(Math.sin(t), 3) * 3;
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 3;
            const rotX = x * Math.cos(angle) - y * Math.sin(angle) * 0.3;
            const rotY = x * Math.sin(angle) * 0.3 + y;
            if (t === 0) ctx.moveTo(rotX, rotY);
            else ctx.lineTo(rotX, rotY);
          }
          ctx.closePath();
          ctx.stroke();

          // Aorta curve
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, -45, 18, Math.PI, Math.PI * 2);
          ctx.stroke();

        } else if (organType === 'Liver') {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const w = Math.max(2, 70 - i * 6);
            const h = Math.max(2, 40 - i * 4);
            ctx.ellipse(Math.sin(angle + i * 0.2) * 6, -10 + i * 5, w, h, angle * 0.4, 0, Math.PI * 2);
          }
          ctx.stroke();

        } else if (organType === 'Kidney') {
          ctx.strokeStyle = '#a855f7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const rot = angle + i * 0.3;
            ctx.ellipse(0, 0, 35, 55, rot * 0.4, 0, Math.PI * 2);
          }
          ctx.stroke();

        } else if (organType === 'Blood') {
          ctx.fillStyle = '#dc2626';
          for (let i = 0; i < 12; i++) {
            const px = Math.sin(angle + i * 0.6) * 50;
            const py = Math.cos(angle * 1.5 + i * 0.4) * 35;
            const r = Math.max(1, 6 + Math.sin(pulse + i) * 2);
            ctx.beginPath();
            ctx.arc(px, py, r, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (organType === 'Lungs') {
          const breath = Math.sin(pulse) * 4;
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.8;

          const rx = Math.max(1, 24 + breath);
          const ry = Math.max(1, 45 + breath);

          ctx.beginPath();
          ctx.ellipse(-35 - breath, 15, rx, ry, -0.2, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(35 + breath, 15, rx, ry, 0.2, 0, Math.PI * 2);
          ctx.stroke();

        } else if (organType === 'Pancreas') {
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-50, 10);
          ctx.bezierCurveTo(-20, -30, 20, -25, 50, -5);
          ctx.stroke();

          for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(-40 + i * 28, -10 + Math.sin(angle + i) * 6, 12, 0, Math.PI * 2);
            ctx.stroke();
          }

        } else if (organType === 'Skin') {
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 1.5;
          for (let y = -40; y <= 40; y += 15) {
            ctx.beginPath();
            for (let x = -60; x <= 60; x += 10) {
              const dy = Math.sin(angle + x * 0.05) * 6;
              if (x === -60) ctx.moveTo(x, y + dy);
              else ctx.lineTo(x, y + dy);
            }
            ctx.stroke();
          }

        } else if (organType === 'Bone Marrow') {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.5;
          
          ctx.beginPath();
          ctx.ellipse(0, -45, 25, 12, 0, 0, Math.PI * 2);
          ctx.ellipse(0, 45, 25, 12, 0, 0, Math.PI * 2);
          ctx.moveTo(-25, -45);
          ctx.lineTo(-25, 45);
          ctx.moveTo(25, -45);
          ctx.lineTo(25, 45);
          ctx.stroke();

          for (let i = 0; i < 8; i++) {
            const px = Math.sin(angle * 2 + i) * 14;
            const py = -30 + i * 8;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

        }
      } catch (err) {
        console.warn('Canvas render caught:', err);
      } finally {
        ctx.restore();
      }
    }, 40);
  }

  initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.networkCanvasInterval) clearInterval(this.networkCanvasInterval);

    const nodes = [
      { name: "AIIMS Delhi", x: 140, y: 50 },
      { name: "Medanta", x: 75, y: 110 },
      { name: "PGIMER", x: 205, y: 100 },
      { name: "Apollo", x: 140, y: 220 },
      { name: "CMC Vellore", x: 70, y: 180 },
      { name: "SSKM Kolkata", x: 215, y: 175 },
      { name: "Apex Hub", x: 140, y: 135 }
    ];

    let pulse = 0;
    this.networkCanvasInterval = setInterval(() => {
      pulse += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1.5;
      nodes.forEach((n1, i) => {
        nodes.forEach((n2, j) => {
          if (i < j) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node, idx) => {
        const isCenter = node.name === "Apex Hub";
        const r = isCenter ? 12 : 7;
        const glow = Math.max(0.5, Math.abs(Math.sin(pulse + idx)) * 5);

        // Halo
        ctx.fillStyle = isCenter ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, r + glow), 0, Math.PI * 2);
        ctx.fill();

        // Node dot
        ctx.fillStyle = isCenter ? '#38bdf8' : '#10b981';
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, node.x, node.y + (isCenter ? 20 : 16));
      });
    }, 40);
  }

  /* ══════════════════════════════════════════════
     12-SECOND MULTI-NODE CONSENSUS MODAL
     ══════════════════════════════════════════════ */
  triggerFetchOverlay(patientId) {
    const overlay = document.getElementById('fetchOverlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    this.initNetworkCanvas();

    const progressBar = document.getElementById('fetchProgressBar');
    const digits = document.getElementById('fetchCountdownDigits');
    const logs = document.getElementById('fetchTerminalLogs');
    const statusText = document.getElementById('networkStatusText');

    if (logs) logs.innerHTML = '';

    const nodes = [
      "AIIMS New Delhi (Apex Node #01)",
      "Medanta Heart Institute (SOTTO #02)",
      "PGIMER Chandigarh (ROTTO North)",
      "Apollo Hospitals Chennai (ROTTO South)",
      "Tata Memorial Mumbai (ROTTO West)",
      "ILBS New Delhi (SOTTO #06)",
      "CMC Vellore (SOTTO #07)",
      "Dr Lal PathLabs Central Registry",
      "DigiLocker ABHA Health Gateway"
    ];

    let timeLeft = 12;
    let percent = 0;

    const logMessages = [
      { t: 11, msg: "Broadcasting cryptographic inquiry across 9 SOTTO nodes..." },
      { t: 10, msg: "AIIMS Delhi Node: Biometric UIDAI e-KYC signature verified." },
      { t: 8, msg: "Medanta & PGIMER: Retrieving 15 clinical diagnostic reports..." },
      { t: 6, msg: "Luminex HLA & PRA Crossmatch parameters ingested." },
      { t: 4, msg: "Multi-sig quorum achieved: 9 of 9 node signatures valid." },
      { t: 2, msg: "Writing state Merkle root into decision log memory..." },
      { t: 0, msg: "Verification Complete: Patient records immutable & confirmed." }
    ];

    const interval = setInterval(() => {
      timeLeft -= 0.5;
      percent = ((12 - timeLeft) / 12) * 100;

      if (progressBar) progressBar.style.width = `${percent}%`;
      if (digits) digits.textContent = `${Math.ceil(timeLeft)}s REMAINING`;

      const matchLog = logMessages.find(m => Math.abs(m.t - timeLeft) < 0.3);
      if (matchLog && logs) {
        const line = document.createElement('div');
        line.style.color = '#38bdf8';
        line.textContent = `[${this.getTimeString()}] ${matchLog.msg}`;
        logs.appendChild(line);
        logs.scrollTop = logs.scrollHeight;
      }

      if (statusText) {
        const randNode = nodes[Math.floor(Math.random() * nodes.length)];
        statusText.textContent = `Consensus Sync: Ingesting ${randNode}...`;
      }

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (this.networkCanvasInterval) clearInterval(this.networkCanvasInterval);
        setTimeout(() => {
          overlay.classList.add('hidden');
          if (!this.fetchedPatients.includes(patientId)) {
            this.fetchedPatients.push(patientId);
          }

          const patient = this.patients.find(p => p.patient_id === patientId);
          const patientName = patient ? patient.name : patientId;
          const patientHospital = patient ? patient.hospital : 'Apex Central Node';
          const patientOrgan = patient ? (patient.organ_needed || patient.organ || 'Organ') : 'Organ';

          // Mint immutable consensus verification block in decision logs
          const newBlockNum = this.getLatestBlockNumber() + 1;
          const lastBlock = this.decisionLogs[0] || {};
          const prevHash = lastBlock.currHash || this.generateHash();
          const currHash = this.generateHash();

          const blockObj = {
            blockNumber: newBlockNum,
            timestamp: this.getFormattedTimestamp(),
            action: `CONSENSUS VERIFICATION SEALED: 9-Node SOTTO Multi-Sig verified 15 clinical diagnostic reports for ${patientName} (${patientId}) needing ${patientOrgan}. e-KYC Identity & Luminex Crossmatch: AUTHENTICATED.`,
            clause: "THOA Section 9-1A & NOTTO Protocol Clause I",
            prevHash: prevHash,
            currHash: currHash,
            mintingNode: `${patientHospital} SOTTO Node`,
            status: "VALIDATED"
          };

          this.decisionLogs.unshift(blockObj);
          this.saveState();
          this.updateHeaderMetrics();
          this.renderWaitlists();
          this.renderDecisionLogs();
          this.showToast(`Consensus verified for ${patientName} (${patientId}) across 9 SOTTO nodes. Sealed in Block #${newBlockNum}.`, 'success');
        }, 500);
      }
    }, 500);
  }

  /* ══════════════════════════════════════════════
     LEGAL CLAUSES MODAL
     ══════════════════════════════════════════════ */
  openClausesModal() {
    const modal = document.getElementById('clausesModal');
    if (modal) modal.classList.remove('hidden');
  }

  closeClausesModal() {
    const modal = document.getElementById('clausesModal');
    if (modal) modal.classList.add('hidden');
  }

  /* ══════════════════════════════════════════════
     FONT SIZE ACCESSIBILITY
     ══════════════════════════════════════════════ */
  fontIncrease() {
    this.currentFontSize = Math.min(22, this.currentFontSize + 1);
    document.documentElement.style.setProperty('--font-base-size', `${this.currentFontSize}px`);
    this.showToast(`Font size increased to ${this.currentFontSize}px`, 'info');
  }

  fontDecrease() {
    this.currentFontSize = Math.max(13, this.currentFontSize - 1);
    document.documentElement.style.setProperty('--font-base-size', `${this.currentFontSize}px`);
    this.showToast(`Font size decreased to ${this.currentFontSize}px`, 'info');
  }

  fontReset() {
    this.currentFontSize = 16;
    document.documentElement.style.setProperty('--font-base-size', '16px');
    this.showToast('Font size reset to default (16px)', 'info');
  }

  /* ══════════════════════════════════════════════
     TOAST SYSTEM & UTILITIES
     ══════════════════════════════════════════════ */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✔' : (type === 'error' ? '✖' : 'ℹ')}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  updateHeaderMetrics() {
    const blockDisplay = document.getElementById('headerBlockDisplay');
    const tickerHeight = document.getElementById('tickerLedgerHeight');
    const tickerActive = document.getElementById('tickerActiveCount');

    const latestBlock = this.getLatestBlockNumber();
    if (blockDisplay) blockDisplay.textContent = `Block #${latestBlock} · 9-Node Consensus Active`;
    if (tickerHeight) tickerHeight.textContent = `#${latestBlock} BLOCKS`;
    
    const unarchivedCount = this.patients.filter(p => !this.archivedPatients.includes(p.patient_id)).length;
    if (tickerActive) tickerActive.textContent = `${unarchivedCount} Active (${this.patients.length} Registered) · 10 Organs`;
  }

  refreshNetworkState() {
    this.showToast('Polling SOTTO nodes... Consensus synchronized at 100%.', 'info');
    this.updateHeaderMetrics();
  }

  getLatestBlockNumber() {
    if (this.decisionLogs && this.decisionLogs.length > 0) {
      return this.decisionLogs[0].blockNumber || 14901;
    }
    return 14901;
  }

  generateHash() {
    const hex = '0123456789abcdef';
    let str = '0x';
    for (let i = 0; i < 40; i++) {
      str += hex[Math.floor(Math.random() * hex.length)];
    }
    return str;
  }

  getFormattedTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19) + ' IST';
  }

  getTimeString() {
    const now = new Date();
    return now.toTimeString().slice(0, 8);
  }

  /* ══════════════════════════════════════════════
     ORGAN AIRTAG & A2A CHAIN-OF-CUSTODY (2.5)
     ══════════════════════════════════════════════ */
  renderChainCustody() {
    this.renderCustodyOrganTabs();
    this.renderA2AWorkflowBanner();
    this.renderCustodyMainGrid();
  }

  renderCustodyOrganTabs() {
    const container = document.getElementById('custodyOrganTabsContainer');
    if (!container) return;

    const currentOrgan = this.activeCustodyOrgan || 'Heart';
    container.innerHTML = this.organList.map(org => {
      const isActive = org.id === currentOrgan;
      const tele = (window.CONTAINER_TELEMETRY_CASES && window.CONTAINER_TELEMETRY_CASES[org.id]) || {};
      const statusIcon = tele.a2aStep === 3 ? '🟢' : (tele.a2aStep === 2 ? '⚡' : '📋');
      return `
        <button type="button" class="organ-tab-btn ${isActive ? 'active' : ''}" onclick="window.app && window.app.switchActiveCustodyOrgan('${org.id}')">
          <span style="font-size: 1.15rem;">${org.icon}</span>
          <span style="font-weight: 700;">${org.nameEn}</span>
          <span style="font-size: 0.72rem; margin-left: 0.25rem;">${statusIcon}</span>
        </button>
      `;
    }).join('');
  }

  switchActiveCustodyOrgan(organId) {
    this.activeCustodyOrgan = organId;
    this.renderChainCustody();
  }

  renderA2AWorkflowBanner() {
    const banner = document.getElementById('a2aWorkflowBanner');
    if (!banner) return;

    const organ = this.activeCustodyOrgan || 'Heart';
    const tele = (window.CONTAINER_TELEMETRY_CASES && window.CONTAINER_TELEMETRY_CASES[organ]) || {
      a2aStep: 2,
      caseNumber: 'CASE-NOTTO-2026-HRT',
      donorHospital: 'AIIMS New Delhi',
      recipientHospital: 'Fortis Escorts Heart Institute',
      recipientPatient: 'PT-002 (Dr. Rajesh Verma, Priority 1)'
    };

    const isStep1Done = true;
    const isStep2Done = tele.a2aStep >= 3;
    const isStep2Active = tele.a2aStep === 2;
    const isStep3Active = tele.a2aStep >= 3;

    banner.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <div>
          <span style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: #003087; letter-spacing: 0.5px;">
            ACTION-TO-APPROVAL-TO-ACTION (A2A) STATE PROTOCOL · ${organ.toUpperCase()} CONTAINER
          </span>
          <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 0.15rem;">
            ${tele.caseNumber} · SOTTO Regional Dispatch Node
          </div>
        </div>
        <div style="text-align: right;">
          <span class="hud-pill" style="color: #10b981; border-color: #a7f3d0; background: #ecfdf5;">
            ● NOTTO PROTOCOL COMPLIANT (THOA SEC 8/10)
          </span>
        </div>
      </div>

      <div class="a2a-stepper-row">
        <!-- Step 1: Hospital Submission -->
        <div class="a2a-step-card ${isStep1Done ? 'completed' : ''}">
          <div class="a2a-step-header">
            <span class="a2a-step-number">ACTION 1: SUBMISSION</span>
            <span style="color: #059669; font-weight: 800; font-size: 0.72rem;">✔ COMPLETED</span>
          </div>
          <div class="a2a-step-title">Hospital Diagnostic Evaluation</div>
          <div class="a2a-step-desc">
            ${tele.donorHospital} evaluated organ integrity, performed 10-point test suite, and generated NOTTO Form-8 statutory record.
          </div>
        </div>

        <!-- Step 2: Officer Approval -->
        <div class="a2a-step-card ${isStep2Done ? 'completed' : (isStep2Active ? 'active' : '')}">
          <div class="a2a-step-header">
            <span class="a2a-step-number">STEP 2: APPROVAL</span>
            <span style="font-weight: 800; font-size: 0.72rem; color: ${isStep2Done ? '#059669' : '#b45309'};">
              ${isStep2Done ? '✔ AUTHORIZED' : '⚡ AWAITING OFFICER APPROVAL'}
            </span>
          </div>
          <div class="a2a-step-title">Transplant Officer Multi-Sig Review</div>
          <div class="a2a-step-desc">
            Transplant Officer evaluates physical container seals, temperature curve (0-4°C), and recipient priority for final transit greenlight.
          </div>
        </div>

        <!-- Step 3: Green Corridor Action -->
        <div class="a2a-step-card ${isStep3Active ? 'active' : ''}">
          <div class="a2a-step-header">
            <span class="a2a-step-number">ACTION 3: DISPATCH</span>
            <span style="font-weight: 800; font-size: 0.72rem; color: ${isStep3Active ? '#2563eb' : '#64748b'};">
              ${isStep3Active ? '🚀 AIRTAG LIVE IN TRANSIT' : '🔒 PENDING APPROVAL'}
            </span>
          </div>
          <div class="a2a-step-title">Green Corridor & Recipient Delivery</div>
          <div class="a2a-step-desc">
            Live GPS telemetry tracked by Traffic Command, tamper sensor armed, destined for ${tele.recipientHospital}.
          </div>
        </div>
      </div>

      <div class="a2a-action-bar">
        <div style="font-size: 0.76rem; color: #475569;">
          <strong>Target Recipient:</strong> ${tele.recipientPatient} · <strong>Retrieval Lead:</strong> ${tele.surgeon}
        </div>
        <div>
          ${!isStep2Done ? `
            <button type="button" class="btn-approve-a2a" onclick="window.app && window.app.approveA2ATransfer('${organ}')">
              ✍️ Digitally Approve & Authorize Green Corridor Dispatch
            </button>
          ` : `
            <span style="font-size: 0.78rem; font-weight: 800; color: #059669; background: #ecfdf5; padding: 0.4rem 0.8rem; border-radius: 6px; border: 1px solid #a7f3d0;">
              ✔ Multi-Sig Signed & Dispatched by Apex Officer at ${this.getTimeString()} IST
            </span>
          `}
        </div>
      </div>
    `;
  }

  approveA2ATransfer(organId) {
    if (window.CONTAINER_TELEMETRY_CASES && window.CONTAINER_TELEMETRY_CASES[organId]) {
      window.CONTAINER_TELEMETRY_CASES[organId].a2aStep = 3;
      window.CONTAINER_TELEMETRY_CASES[organId].gpsStatus = 'LIVE IN GREEN CORRIDOR (ACTIVE GPS AIRTAG)';
    }

    const txHash = this.generateHash();
    const newBlock = {
      blockNumber: this.getLatestBlockNumber() + 1,
      timestamp: this.getFormattedTimestamp(),
      hash: txHash,
      prevHash: this.decisionLogs[0]?.hash || '0x4f8a9b1c7e',
      event: 'A2A_OFFICER_APPROVAL_DISPATCH',
      organ: organId,
      patientId: window.CONTAINER_TELEMETRY_CASES?.[organId]?.recipientPatient?.split(' ')[0] || 'PT-MATCH',
      patientName: `A2A Approved Dispatch (${organId})`,
      allocatedHospital: window.CONTAINER_TELEMETRY_CASES?.[organId]?.recipientHospital || 'Apex Transplant Center',
      zkpProof: `ZKP_A2A_${organId.toUpperCase()}_SIGNATURE_VALID`,
      donorId: window.CONTAINER_TELEMETRY_CASES?.[organId]?.donorId || 'DNR-NOTTO-77',
      scoreBreakdown: 'Physical Seal: 100% | Hospital Vitals: 10/10 PASS | CIT Window: Optimal'
    };

    this.decisionLogs.unshift(newBlock);
    localStorage.setItem('doosra_logs_v2', JSON.stringify(this.decisionLogs));

    this.showToast(`✔ A2A Approval Granted for ${organId}! Organ AirTag Smart Container Dispatched with Green Corridor Lock.`, 'success');
    this.renderChainCustody();
  }

  simulateContainerTamper() {
    const organ = this.activeCustodyOrgan || 'Heart';
    const tele = window.CONTAINER_TELEMETRY_CASES?.[organ];
    if (tele) {
      tele.sealStatus = 'TAMPER BREACH DETECTED! CIRCUIT RESISTANCE > 100 kΩ';
      tele.tamperAttempts = (tele.tamperAttempts || 0) + 1;
    }
    this.tamperAlertActive = true;

    // Trigger audio beep alert via Web Audio API if supported
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}

    this.showToast(`🚨 CRITICAL SECURITY ALERT: Physical E-Seal Tamper Detected on ${organ} Container (${tele?.containerId || 'BOX-01'})!`, 'error');
    this.renderCustodyMainGrid();
  }

  resetContainerSeal() {
    const organ = this.activeCustodyOrgan || 'Heart';
    const tele = window.CONTAINER_TELEMETRY_CASES?.[organ];
    if (tele) {
      tele.sealStatus = 'LOCKED & ARMED (0.02 Ω Loop Intact)';
    }
    this.tamperAlertActive = false;
    this.showToast(`🛡️ E-Seal Re-Armed & Validated for ${organ} Smart Container.`, 'info');
    this.renderCustodyMainGrid();
  }

  setAnimMode(mode) {
    this.activeAnimMode = mode;
    this.renderCustodyMainGrid();
  }

  renderCustodyMainGrid() {
    const grid = document.getElementById('custodyMainGrid');
    if (!grid) return;

    const organ = this.activeCustodyOrgan || 'Heart';
    const tele = (window.CONTAINER_TELEMETRY_CASES && window.CONTAINER_TELEMETRY_CASES[organ]) || {};
    const tests = tele.tests || [];
    const isTampered = (tele.sealStatus && tele.sealStatus.includes('BREACH')) || this.tamperAlertActive;

    grid.innerHTML = `
      <!-- ════════════ COLUMN 1: AIRTAG IOT & ANTI-TAMPERING ════════════ -->
      <div class="custody-column-card">
        <div class="custody-card-header">
          <div class="custody-card-title">
            <span>📡 Physical Anti-Tampering & Digital AirTag</span>
          </div>
          <span class="hud-pill" style="color: #38bdf8;">${tele.containerId || 'NOTTO-BOX'}</span>
        </div>

        <div class="custody-card-body">
          <!-- E-Seal Status Box -->
          <div class="e-seal-badge-box ${isTampered ? 'breached' : ''}">
            <div class="seal-top-row">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="font-size: 1.2rem;">${isTampered ? '🚨' : '🛡️'}</span>
                <div>
                  <div style="font-size: 0.78rem; font-weight: 800; color: ${isTampered ? '#991b1b' : '#065f46'};">
                    ${isTampered ? 'E-SEAL CIRCUIT BREACH DETECTED' : 'E-SEAL: CRYPTOGRAPHIC CONTINUITY SECURE'}
                  </div>
                  <div style="font-size: 0.68rem; color: ${isTampered ? '#b91c1c' : '#047857'}; font-family: var(--font-mono);">
                    Seal ID: ${tele.sealId || 'SEAL-NOTTO-889'} · ${isTampered ? 'Resistance: 120.4 kΩ (BROKEN)' : 'Loop Resistance: 0.02 Ω (INTACT)'}
                  </div>
                </div>
              </div>
              <span class="seal-status-pill">${isTampered ? 'BREACHED' : 'ARMED'}</span>
            </div>

            <div style="font-size: 0.72rem; color: #475569; margin-top: 0.2rem;">
              <strong>Anti-Tamper Mechanics:</strong> Micro-filament wire loop embedded in vacuum seal lid. Any opening or puncture creates a permanent hardware tamper flag on the blockchain.
            </div>

            <div class="seal-controls-row">
              <button type="button" class="btn-tamper-test" onclick="window.app && window.app.simulateContainerTamper()">
                ⚡ Simulate E-Seal Breach
              </button>
              <button type="button" class="btn-rearm-seal" onclick="window.app && window.app.resetContainerSeal()">
                🛡️ Re-Arm E-Seal
              </button>
            </div>
          </div>

          <!-- Multi-Frequency Identity Passport (QR / NFC / RFID) -->
          <div class="digital-id-passport">
            <div class="qr-preview-box">
              <svg class="qr-live-svg" viewBox="0 0 100 100" fill="none">
                <!-- Outer framing -->
                <rect x="5" y="5" width="30" height="30" rx="3" stroke="#003087" stroke-width="4" fill="#ffffff"/>
                <rect x="13" y="13" width="14" height="14" fill="#003087"/>
                <rect x="65" y="5" width="30" height="30" rx="3" stroke="#003087" stroke-width="4" fill="#ffffff"/>
                <rect x="73" y="13" width="14" height="14" fill="#003087"/>
                <rect x="5" y="65" width="30" height="30" rx="3" stroke="#003087" stroke-width="4" fill="#ffffff"/>
                <rect x="13" y="73" width="14" height="14" fill="#003087"/>
                <!-- Matrix micro-cells -->
                <rect x="42" y="10" width="8" height="8" fill="#003087"/>
                <rect x="52" y="18" width="6" height="6" fill="#003087"/>
                <rect x="42" y="28" width="6" height="14" fill="#003087"/>
                <rect x="10" y="42" width="10" height="6" fill="#003087"/>
                <rect x="25" y="48" width="14" height="6" fill="#003087"/>
                <rect x="44" y="44" width="12" height="12" fill="#e11d48"/>
                <rect x="62" y="42" width="8" height="8" fill="#003087"/>
                <rect x="74" y="52" width="16" height="6" fill="#003087"/>
                <rect x="45" y="65" width="10" height="10" fill="#003087"/>
                <rect x="60" y="68" width="12" height="6" fill="#003087"/>
                <rect x="78" y="78" width="14" height="14" fill="#003087"/>
                <circle cx="50" cy="50" r="3" fill="#ffffff"/>
              </svg>
              <span style="font-size: 0.62rem; font-family: var(--font-mono); color: #059669; font-weight: 700; margin-top: 0.2rem;">
                ROTATING (30s)
              </span>
            </div>

            <div class="id-specs-list">
              <div class="id-spec-item">
                <span class="id-spec-label">NFC DNA UID:</span>
                <span class="id-spec-val">${tele.nfcUid || '04:E2:8B:FA:11'} (NTAG424)</span>
              </div>
              <div class="id-spec-item">
                <span class="id-spec-label">UHF RFID EPC:</span>
                <span class="id-spec-val">${tele.rfidTag || 'E280-6890-NOTTO'}</span>
              </div>
              <div class="id-spec-item">
                <span class="id-spec-label">Digital Token:</span>
                <span class="id-spec-val" style="color: #d97706;">${tele.digitalToken || '0xNOTTO_TOKEN'}</span>
              </div>
              <div class="id-spec-item">
                <span class="id-spec-label">NOTTO Digital Slip:</span>
                <span class="id-spec-val" style="color: #059669; font-weight: 800;">${tele.digitalSlipId || 'SLIP-NOTTO-2026'}</span>
              </div>
            </div>
          </div>

          <!-- Real-Time IoT Preservation Sensor Matrix -->
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 0.35rem;">
              REAL-TIME PRESERVATION SENSORS (0.0 - 4.0 °C)
            </div>
            <div class="sensors-grid">
              <div class="sensor-box highlight-temp">
                <div class="sensor-title">
                  <span>Preservation Temp</span>
                  <span style="color: #059669;">● PROBE 1 & 2</span>
                </div>
                <div class="sensor-val good">${tele.temperature || '2.4 °C'}</div>
                <div class="sensor-sub">Variance: ${tele.tempVariance || '±0.1 °C'} (Threshold: 0-4°C)</div>
              </div>

              <div class="sensor-box">
                <div class="sensor-title">
                  <span>Perfusion Flow</span>
                  <span>HYPOTHERMIC</span>
                </div>
                <div class="sensor-val" style="color: #0284c7;">${tele.perfusionFlow || '28 mL/min'}</div>
                <div class="sensor-sub">Pressure: ${tele.perfusionPressure || '22 mmHg'}</div>
              </div>

              <div class="sensor-box">
                <div class="sensor-title">
                  <span>Oxygenation (pO2)</span>
                  <span>ACTIVE</span>
                </div>
                <div class="sensor-val" style="color: #9333ea;">${tele.dissolvedOxygen || '185 mmHg'}</div>
                <div class="sensor-sub">Gas Saturation: 99.2%</div>
              </div>

              <div class="sensor-box">
                <div class="sensor-title">
                  <span>G-Force / Shock</span>
                  <span>ACCEL 3-AXIS</span>
                </div>
                <div class="sensor-val" style="color: #475569;">${tele.gForceMax || '0.12 G'}</div>
                <div class="sensor-sub">Threshold: < 0.5 G (Safe)</div>
              </div>
            </div>
          </div>

          <!-- Live GPS & Green Corridor Route -->
          <div class="gps-corridor-box">
            <div class="corridor-header">
              <span style="color: #003087;">🛰️ LIVE GPS AIRTAG TELEMETRY</span>
              <span style="font-family: var(--font-mono); color: #059669;">${tele.gpsSpeed || '48 km/h'}</span>
            </div>
            <div class="corridor-route-text">
              <strong>Corridor:</strong> ${tele.greenCorridorRoute || 'AIIMS Delhi → Fortis Escorts via Ring Road Flyover'}
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #475569;">
              <span><strong>Distance:</strong> ${tele.distanceRemaining || '8.4 km'}</span>
              <span><strong>Transit ETA:</strong> ${tele.etaTransit || '14 mins'}</span>
              <span><strong>Traffic Signals:</strong> 12/12 Cleared 🟢</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ════════════ COLUMN 2: BIOLOGICAL ORGAN DIGITAL TWIN ANIMATION ════════════ -->
      <div class="custody-column-card">
        <div class="custody-card-header">
          <div class="custody-card-title">
            <span>🧬 Biological Organ Digital Twin (${organ})</span>
          </div>
          <span class="hud-pill" style="color: #4ade80;">98.6% VIABILITY</span>
        </div>

        <div class="custody-card-body" style="padding: 0.75rem;">
          <!-- 3D Canvas Viewport -->
          <div class="organ-animation-viewport" id="organAnimationContainer">
            <div class="animation-overlay-hud">
              <span class="hud-pill">BIO-PULSE: SYNCED</span>
              <span class="hud-pill" style="color: #f59e0b;">CIT: ${tele.coldIschemiaRemaining || '3h 48m'}</span>
            </div>
            <canvas id="custodyBiologicalCanvas" width="340" height="300" class="organ-canvas-element"></canvas>
          </div>

          <!-- View Mode Switcher -->
          <div class="animation-mode-toggle-bar">
            <button type="button" class="btn-anim-mode ${this.activeAnimMode === 'perfusion' ? 'active' : ''}" onclick="window.app && window.app.setAnimMode('perfusion')">
              Anatomical Perfusion
            </button>
            <button type="button" class="btn-anim-mode ${this.activeAnimMode === 'xray' ? 'active' : ''}" onclick="window.app && window.app.setAnimMode('xray')">
              Micro-Vascular X-Ray
            </button>
            <button type="button" class="btn-anim-mode ${this.activeAnimMode === 'thermal' ? 'active' : ''}" onclick="window.app && window.app.setAnimMode('thermal')">
              Thermal Preservation (2.4°C)
            </button>
          </div>

          <!-- Organ Anatomical Summary Box -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.65rem; font-size: 0.72rem; color: #334155; margin-top: 0.5rem;">
            <div style="font-weight: 800; color: #003087; margin-bottom: 0.2rem;">
              ${organ.toUpperCase()} BIOLOGICAL TELEMETRY & PRESERVATION METRICS
            </div>
            <div>
              <strong>Viability Grade:</strong> Grade A1 (SOTTO Gold Tier) · <strong>Cold Preservation Solution:</strong> University of Wisconsin (UW) / Celsior Sol.
            </div>
            <div style="margin-top: 0.2rem;">
              <strong>Preservation Mechanics:</strong> Pulsatile hypothermic machine perfusion with continuous dissolved oxygen saturation and arterial resistance feedback.
            </div>
          </div>
        </div>
      </div>

      <!-- ════════════ COLUMN 3: HOSPITAL CLINICAL ORGAN EVALUATION ════════════ -->
      <div class="custody-column-card">
        <div class="custody-card-header">
          <div class="custody-card-title">
            <span>📋 Hospital Organ Evaluation & Diagnostic Suite</span>
          </div>
          <button type="button" class="btn-notto-slip" onclick="window.app && window.app.openNottoDigitalSlipModal()">
            📜 Digital Slip
          </button>
        </div>

        <div class="custody-card-body">
          <!-- Hospital Header Info -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0.65rem; font-size: 0.72rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem;">
              <span><strong>Donor Hospital:</strong> ${tele.donorHospital}</span>
              <span style="color: #059669; font-weight: 700;">● SOTTO Form-8 Signed</span>
            </div>
            <div><strong>Lead Surgeon:</strong> ${tele.surgeon} · <strong>Retrieval Time:</strong> ${tele.retrievalTime || '14:20 IST'}</div>
            <div style="color: #64748b; margin-top: 0.15rem;">Statutory compliance: NOTTO National Allocation Manual 2026</div>
          </div>

          <!-- Comprehensive 10-Test Table -->
          <div class="tests-table-scroll">
            <table class="clinical-eval-table">
              <thead>
                <tr>
                  <th>Test Name & Parameter</th>
                  <th>Observed Value</th>
                  <th>Standard Range</th>
                  <th>Category</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                ${tests.map(t => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: #0f172a;">${t.name}</div>
                      <div style="font-size: 0.64rem; color: #64748b;">${t.desc}</div>
                    </td>
                    <td style="font-family: var(--font-mono); font-weight: 700; color: #003087;">
                      ${t.val}
                    </td>
                    <td style="font-size: 0.68rem; color: #475569;">
                      ${t.range}
                    </td>
                    <td>
                      <span class="tests-category-badge">${t.category}</span>
                    </td>
                    <td>
                      <span class="test-pass-pill">PASS ✔</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Medical Board Sign-off Stamp -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 0.6rem 0.75rem; font-size: 0.72rem; color: #065f46;">
            <div>
              <div style="font-weight: 800;">APEX MEDICAL BOARD SIGN-OFF</div>
              <div style="font-size: 0.68rem;">Verified by 3 Independent Transplant Surgeons</div>
            </div>
            <span style="font-family: var(--font-mono); font-weight: 800; font-size: 0.72rem;">SOTTO-SIG: 0x9e4b...88c2</span>
          </div>
        </div>
      </div>
    `;

    // Start high-fidelity biological animation
    setTimeout(() => {
      this.initBiologicalOrganAnimation('custodyBiologicalCanvas', organ, this.activeAnimMode);
    }, 50);
  }

  initBiologicalOrganAnimation(canvasId, organType, mode) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.custodyAnimInterval) {
      clearInterval(this.custodyAnimInterval);
    }

    let time = 0;

    this.custodyAnimInterval = setInterval(() => {
      time += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 10;

      ctx.save();
      ctx.translate(cx, cy);

      if (organType === 'Heart') {
        this.drawBiologicalHeart(ctx, time, mode);
      } else if (organType === 'Lungs') {
        this.drawBiologicalLungs(ctx, time, mode);
      } else if (organType === 'Kidney') {
        this.drawBiologicalKidney(ctx, time, mode);
      } else if (organType === 'Liver') {
        this.drawBiologicalLiver(ctx, time, mode);
      } else if (organType === 'Eyes') {
        this.drawBiologicalCornea(ctx, time, mode);
      } else if (organType === 'Blood') {
        this.drawBiologicalBlood(ctx, time, mode);
      } else if (organType === 'Pancreas') {
        this.drawBiologicalPancreas(ctx, time, mode);
      } else if (organType === 'Skin') {
        this.drawBiologicalSkin(ctx, time, mode);
      } else if (organType === 'Bone Marrow') {
        this.drawBiologicalBoneMarrow(ctx, time, mode);
      }

      ctx.restore();

      // Bottom synchronized ECG / Perfusion Waveform
      this.drawEcgWaveform(ctx, canvas.width, canvas.height, time);
    }, 25);
  }

  drawBiologicalHeart(ctx, time, mode) {
    const pulse = Math.sin(time * 2.5);
    const scale = 1 + (pulse > 0.4 ? Math.sin(time * 10) * 0.06 : 0);

    ctx.scale(scale, scale);

    // Color palette based on mode
    let baseColor = mode === 'thermal' ? '#0284c7' : (mode === 'xray' ? '#38bdf8' : '#e11d48');
    let veinColor = mode === 'thermal' ? '#0369a1' : '#2563eb';
    let arteryColor = mode === 'thermal' ? '#0284c7' : '#ef4444';

    // Superior Vena Cava & Pulmonary Trunk (Upper Veins)
    ctx.strokeStyle = veinColor;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(-25, -65);
    ctx.lineTo(-25, -30);
    ctx.stroke();

    // Aortic Arch (curving right to left)
    ctx.strokeStyle = arteryColor;
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.bezierCurveTo(-5, -80, 45, -80, 40, -30);
    ctx.stroke();

    // 3 Carotid Branches on Aortic Arch
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(10, -72); ctx.lineTo(10, -88);
    ctx.moveTo(22, -74); ctx.lineTo(22, -90);
    ctx.moveTo(34, -70); ctx.lineTo(34, -86);
    ctx.stroke();

    // Heart Muscle Body (Ventricles + Atria)
    ctx.fillStyle = mode === 'xray' ? 'rgba(56, 189, 248, 0.15)' : (mode === 'thermal' ? '#0ea5e9' : '#be123c');
    ctx.strokeStyle = mode === 'xray' ? '#38bdf8' : '#fda4af';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(0, 75);
    // Left Ventricle curve
    ctx.bezierCurveTo(-75, 40, -85, -30, -35, -35);
    // Atrial base
    ctx.bezierCurveTo(-20, -45, 20, -45, 35, -35);
    // Right Ventricle curve
    ctx.bezierCurveTo(85, -30, 75, 40, 0, 75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left Anterior Descending (LAD) Coronary Artery & Micro-branches
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-10, -25);
    ctx.bezierCurveTo(-5, 0, 15, 30, 0, 70);
    ctx.stroke();

    // Diagonal branchings
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-3, 0); ctx.lineTo(-28, 15);
    ctx.moveTo(5, 20); ctx.lineTo(30, 35);
    ctx.moveTo(2, 42); ctx.lineTo(-18, 55);
    ctx.stroke();

    // Perfusion Flow Particles
    const numParticles = 6;
    for (let i = 0; i < numParticles; i++) {
      const prog = (time * 1.5 + i / numParticles) % 1;
      const px = -10 + prog * 10;
      const py = -25 + prog * 95;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBiologicalLungs(ctx, time, mode) {
    const breath = Math.sin(time * 1.8) * 8;

    // Trachea with Cartilaginous Rings
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, -95);
    ctx.lineTo(0, -40);
    ctx.stroke();

    // Cartilage lines
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    for (let y = -90; y <= -45; y += 8) {
      ctx.beginPath();
      ctx.moveTo(-6, y);
      ctx.lineTo(6, y);
      ctx.stroke();
    }

    // Carina / Bronchial Bifurcation
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(0, -40); ctx.lineTo(-30, -15);
    ctx.moveTo(0, -40); ctx.lineTo(30, -15);
    ctx.stroke();

    // Right Lung (3 Lobes: Superior, Middle, Inferior)
    ctx.fillStyle = mode === 'thermal' ? '#0284c7' : (mode === 'xray' ? 'rgba(6, 182, 212, 0.2)' : '#0891b2');
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2;

    ctx.save();
    ctx.translate(-45 - breath * 0.3, 10);
    ctx.beginPath();
    ctx.ellipse(0, 0, 38 + breath, 65 + breath * 0.8, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Fissures (Horizontal & Oblique)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(-25, -10); ctx.lineTo(25, -15);
    ctx.moveTo(-20, 15); ctx.lineTo(30, 25);
    ctx.stroke();
    ctx.restore();

    // Left Lung (2 Lobes + Cardiac Notch)
    ctx.save();
    ctx.translate(45 + breath * 0.3, 10);
    ctx.beginPath();
    ctx.ellipse(0, 0, 36 + breath, 65 + breath * 0.8, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Oblique Fissure
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.moveTo(-25, 0); ctx.lineTo(25, 25);
    ctx.stroke();
    ctx.restore();

    // Oxygenation Glow Wave (PaO2 particles)
    for (let i = 0; i < 8; i++) {
      const a = time * 2 + i;
      const ox = Math.sin(a) * 45;
      const oy = Math.cos(a) * 40;
      ctx.fillStyle = '#67e8f9';
      ctx.beginPath();
      ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBiologicalKidney(ctx, time, mode) {
    const pulse = Math.sin(time * 3);

    // Renal Capsule & Cortex Outline
    ctx.fillStyle = mode === 'thermal' ? '#0369a1' : (mode === 'xray' ? 'rgba(168, 85, 247, 0.2)' : '#9333ea');
    ctx.strokeStyle = '#d8b4fe';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-20, -75);
    ctx.bezierCurveTo(60, -75, 75, 75, -20, 75);
    ctx.bezierCurveTo(-5, 40, -5, -40, -20, -75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Renal Medullary Pyramids (5 Pyramids)
    ctx.fillStyle = mode === 'xray' ? '#c084fc' : '#6b21a8';
    for (let i = -2; i <= 2; i++) {
      const y = i * 26;
      ctx.beginPath();
      ctx.moveTo(15, y - 8);
      ctx.lineTo(42, y);
      ctx.lineTo(15, y + 8);
      ctx.closePath();
      ctx.fill();
    }

    // Renal Artery (Red) & Renal Vein (Blue) with Aortic Patch
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-60, -15);
    ctx.lineTo(-5, -15);
    ctx.stroke();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-60, 10);
    ctx.lineTo(-5, 10);
    ctx.stroke();

    // Ureter (Yellow/Green drainage)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(-15, 50, -25, 75, -25, 95);
    ctx.stroke();

    // Urine Droplet Flow
    const dropProg = (time * 1.5) % 1;
    const dy = 20 + dropProg * 75;
    const dx = 0 - dropProg * 25;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBiologicalLiver(ctx, time, mode) {
    ctx.fillStyle = mode === 'thermal' ? '#0284c7' : (mode === 'xray' ? 'rgba(245, 158, 11, 0.25)' : '#b45309');
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 2.5;

    // Hepatic Lobes (Right & Left)
    ctx.beginPath();
    ctx.moveTo(-75, -15);
    ctx.bezierCurveTo(-45, -55, 65, -50, 85, 5);
    ctx.bezierCurveTo(70, 45, 10, 45, -75, -15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Falciform Ligament
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(15, -45);
    ctx.lineTo(25, 30);
    ctx.stroke();

    // Portal Vein Trunk & Hepatic Arteries
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(20, 55);
    ctx.lineTo(20, 20);
    ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(32, 55);
    ctx.lineTo(32, 22);
    ctx.stroke();

    // Micro-Vascular Sinusoid Wave
    for (let i = 0; i < 6; i++) {
      const px = -50 + i * 22;
      const py = -10 + Math.sin(time * 2 + i) * 12;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBiologicalCornea(ctx, time, mode) {
    // 5-Layer Optical Dome
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    for (let r = 25; r <= 70; r += 11) {
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.75, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Endothelial Hexagonal Lattice Overlay
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    for (let x = -35; x <= 35; x += 15) {
      for (let y = -25; y <= 25; y += 15) {
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (a * 60 * Math.PI) / 180;
          const hx = x + Math.cos(angle) * 6;
          const hy = y + Math.sin(angle) * 6;
          if (a === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Iris & Pupil Center
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Refractive Optical Ray Sweep
    const rx = Math.sin(time * 2) * 45;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx, -65);
    ctx.lineTo(0, 0);
    ctx.stroke();
  }

  drawBiologicalBlood(ctx, time, mode) {
    for (let i = 0; i < 14; i++) {
      const angle = time * 1.5 + (i * Math.PI * 2) / 14;
      const dist = 35 + Math.sin(time + i) * 20;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * (dist * 0.7);
      
      // Biconcave Erythrocyte Shape
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center CD34+ Hematopoietic Stem Cell with Receptors
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    for (let a = 0; a < 8; a++) {
      const rad = (a * 45 * Math.PI) / 180;
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * 16, Math.sin(rad) * 16);
      ctx.lineTo(Math.cos(rad) * 24, Math.sin(rad) * 24);
      ctx.stroke();
    }
  }

  drawBiologicalPancreas(ctx, time, mode) {
    ctx.fillStyle = '#ca8a04';
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-65, 10);
    ctx.bezierCurveTo(-30, -35, 30, -30, 65, 0);
    ctx.bezierCurveTo(45, 30, -40, 35, -65, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Islets of Langerhans (Insulin Secreting Beta-Cell clusters)
    for (let i = 0; i < 6; i++) {
      const px = -40 + i * 16;
      const py = Math.sin(time * 2 + i) * 6;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBiologicalSkin(ctx, time, mode) {
    // Stratified Epidermal Keratinocyte Layers
    for (let y = -45; y <= 45; y += 15) {
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -70; x <= 70; x += 10) {
        const dy = Math.sin(time * 2 + x * 0.08) * 5;
        if (x === -70) ctx.moveTo(x, y + dy);
        else ctx.lineTo(x, y + dy);
      }
      ctx.stroke();
    }
  }

  drawBiologicalBoneMarrow(ctx, time, mode) {
    // Cortical Bone Column
    ctx.strokeStyle = '#fda4af';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-35, -70); ctx.lineTo(-35, 70);
    ctx.moveTo(35, -70); ctx.lineTo(35, 70);
    ctx.stroke();

    // Medullary Cavity Hematopoietic Cord
    for (let y = -60; y <= 60; y += 15) {
      const px = Math.sin(time * 3 + y) * 15;
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(px, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawEcgWaveform(ctx, w, h, time) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();

    const baseY = h - 22;
    for (let x = 0; x < w; x += 3) {
      const relTime = (x * 0.05 - time * 3) % (Math.PI * 2);
      let spike = 0;
      if (relTime > 0 && relTime < 0.3) spike = Math.sin(relTime * 10) * 14;
      else if (relTime > 0.4 && relTime < 0.6) spike = -Math.sin(relTime * 15) * 5;
      ctx.lineTo(x, baseY - spike);
    }
    ctx.stroke();
  }

  /* ══════════════════════════════════════════════
     NOTTO OFFICIAL DIGITAL SLIP CERTIFICATE (MODAL)
     ══════════════════════════════════════════════ */
  openNottoDigitalSlipModal() {
    const modal = document.getElementById('nottoDigitalSlipModal');
    const content = document.getElementById('nottoDigitalSlipContent');
    if (!modal || !content) return;

    const organ = this.activeCustodyOrgan || 'Heart';
    const tele = (window.CONTAINER_TELEMETRY_CASES && window.CONTAINER_TELEMETRY_CASES[organ]) || {};
    const tests = tele.tests || [];

    content.innerHTML = `
      <div class="notto-certificate-sheet">
        <div class="slip-gov-head">
          <div class="slip-gov-emblem-text">भारत सरकार · MINISTRY OF HEALTH & FAMILY WELFARE</div>
          <div class="slip-title-main">NATIONAL ORGAN & TISSUE TRANSPLANT ORGANISATION (NOTTO)</div>
          <div class="slip-title-sub">
            STATUTORY DIGITAL ORGAN EVALUATION & GREEN CORRIDOR CHAIN-OF-CUSTODY CERTIFICATE (FORM 8/10)
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 800; color: #003087; margin-top: 0.35rem;">
            REGISTRY SLIP ID: ${tele.digitalSlipId || 'SLIP-NOTTO-2026-HRT'} · ISSUED UNDER THOA 1994
          </div>
        </div>

        <div class="slip-data-grid">
          <div class="slip-data-card">
            <div class="slip-data-card-title">1. DONOR & RETRIEVAL DETAILS</div>
            <div style="font-size: 0.72rem; line-height: 1.6; color: #1e293b;">
              <div><strong>Donor ID:</strong> ${tele.donorId || 'DNR-NOTTO-77'}</div>
              <div><strong>Retrieval Hospital:</strong> ${tele.donorHospital || 'AIIMS New Delhi'}</div>
              <div><strong>Lead Surgeon:</strong> ${tele.surgeon || 'Dr. V. K. Paul, MS, MCh'}</div>
              <div><strong>Retrieval Timestamp:</strong> ${tele.retrievalTime || '14:20 IST'}</div>
              <div><strong>Organ Procured:</strong> ${organ} (Optimal Preservation Grade A1)</div>
            </div>
          </div>

          <div class="slip-data-card">
            <div class="slip-data-card-title">2. RECIPIENT & ALLOCATION CLEARANCE</div>
            <div style="font-size: 0.72rem; line-height: 1.6; color: #1e293b;">
              <div><strong>Allocated Candidate:</strong> ${tele.recipientPatient || 'PT-002'}</div>
              <div><strong>Destination Center:</strong> ${tele.recipientHospital || 'Fortis Escorts'}</div>
              <div><strong>Multi-Sig Approval:</strong> AUTHORIZED (NOTTO Apex Board)</div>
              <div><strong>Green Corridor Transit:</strong> ${tele.greenCorridorRoute || 'Flyover Expressway'}</div>
              <div><strong>Max CIT Limit:</strong> 4h 00m (Target Delivery in 2h 15m)</div>
            </div>
          </div>
        </div>

        <div class="slip-data-grid">
          <div class="slip-data-card">
            <div class="slip-data-card-title">3. PHYSICAL ANTI-TAMPERING & AIRTAG TELEMETRY</div>
            <div style="font-size: 0.72rem; line-height: 1.6; color: #1e293b;">
              <div><strong>Container E-Seal ID:</strong> ${tele.sealId || 'SEAL-NOTTO-889'} (Continuous Loop)</div>
              <div><strong>NFC Identity DNA:</strong> ${tele.nfcUid || '04:E2:8B:FA:11'} (NTAG424 Cryptographic)</div>
              <div><strong>RFID Frequency:</strong> 865-868 MHz India Band (${tele.rfidTag || 'E280-NOTTO'})</div>
              <div><strong>Preservation Temperature:</strong> ${tele.temperature || '2.4 °C'} (${tele.tempVariance || '±0.1°C'})</div>
            </div>
          </div>

          <div class="slip-data-card">
            <div class="slip-data-card-title">4. HOSPITAL CLINICAL TESTS SUMMARY (10/10 PASS)</div>
            <div style="font-size: 0.72rem; line-height: 1.6; color: #1e293b;">
              <div><strong>Viral Serology:</strong> HIV, HCV, HBsAg, CMV (ALL NEGATIVE)</div>
              <div><strong>Vascular Perfusion:</strong> Pristine patency (${tele.perfusionFlow || '28 mL/min'})</div>
              <div><strong>Crossmatch:</strong> Negative Cytotoxic Anti-HLA Screen</div>
              <div><strong>Metabolic Viability:</strong> Optimal (Score 98.6%)</div>
            </div>
          </div>
        </div>

        <!-- 10 Comprehensive Tests Mini-Grid -->
        <div style="margin-top: 0.5rem; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.68rem;">
            <thead style="background: #f1f5f9; color: #475569; font-weight: 700;">
              <tr>
                <th style="padding: 0.4rem; text-align: left;">Clinical Parameter</th>
                <th style="padding: 0.4rem; text-align: left;">Observed Value</th>
                <th style="padding: 0.4rem; text-align: left;">Reference Standard</th>
                <th style="padding: 0.4rem; text-align: left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${tests.slice(0, 6).map(t => `
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 0.35rem 0.4rem; font-weight: 700;">${t.name}</td>
                  <td style="padding: 0.35rem 0.4rem; font-family: var(--font-mono); color: #003087;">${t.val}</td>
                  <td style="padding: 0.35rem 0.4rem; color: #64748b;">${t.range}</td>
                  <td style="padding: 0.35rem 0.4rem; color: #059669; font-weight: 800;">PASS ✔</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="slip-signature-row">
          <div class="slip-doc-sign-box">
            <div class="slip-sign-stamp">SURGEON SIGNATURE</div>
            <div>${tele.surgeon || 'Dr. V. K. Paul, MS, MCh'}</div>
            <div>Retrieval Lead, ${tele.donorHospital || 'AIIMS'}</div>
          </div>

          <div class="slip-doc-sign-box">
            <div class="slip-sign-stamp" style="border-color: #003087; background: #eff6ff; color: #003087;">NOTTO APEX SEAL</div>
            <div>Director General of Health Services</div>
            <div>Ministry of Health & Family Welfare</div>
          </div>

          <div class="slip-doc-sign-box">
            <div class="slip-sign-stamp">TRANSPLANT OFFICER</div>
            <div>Dr. Alok Verma, MD</div>
            <div>State Organ Authority (SOTTO)</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
  }

  closeNottoDigitalSlipModal() {
    const modal = document.getElementById('nottoDigitalSlipModal');
    if (modal) modal.classList.add('hidden');
  }

  printNottoDigitalSlip() {
    this.showToast('Generating official NOTTO PDF certificate...', 'info');
    setTimeout(() => {
      window.print();
    }, 300);
  }

  /* ══════════════════════════════════════════════
     CSV DATASET MANIPULATION METHODS
     ══════════════════════════════════════════════ */
  openCsvModal() {
    const modal = document.getElementById('modalCsvDataset');
    const textarea = document.getElementById('csvTextarea');
    if (!modal || !textarea) return;

    const hospitals = window.HOSPITAL_REGISTRY_METRICS || [];
    let csv = 'S.No,Hospital Name,Address,District,State,Type,Organs,Website\n';
    hospitals.forEach(h => {
      const organsStr = this.getHospitalOrgansString(h);
      const row = [
        h.id,
        `"${(h.hospital_name || '').replace(/"/g, '""')}"`,
        `"${(h.address || '').replace(/"/g, '""')}"`,
        `"${(h.district || '').replace(/"/g, '""')}"`,
        `"${(h.state || '').replace(/"/g, '""')}"`,
        `"${(h.type || '').replace(/"/g, '""')}"`,
        `"${(organsStr || '').replace(/"/g, '""')}"`,
        `"${(h.website || '').replace(/"/g, '""')}"`
      ].join(',');
      csv += row + '\n';
    });

    textarea.value = csv;
    modal.classList.remove('hidden');
  }

  closeCsvModal() {
    const modal = document.getElementById('modalCsvDataset');
    if (modal) modal.classList.add('hidden');
  }

  exportDatasetCsv() {
    const hospitals = window.HOSPITAL_REGISTRY_METRICS || [];
    let csv = 'S.No,Hospital Name,Address,District,State,Type,Organs,Website,Required Blood Group,Primary Surgery,Price Alert,Success Rate,Total Requirements,Active Waiting,Completed Transplants\n';
    hospitals.forEach(h => {
      const organsStr = this.getHospitalOrgansString(h);
      const bgStr = this.getHospitalBloodGroup(h);
      const priceAlert = this.getHospitalPriceAlert(h);
      const successRate = this.getHospitalSuccessRate(h);

      const row = [
        h.id,
        `"${(h.hospital_name || '').replace(/"/g, '""')}"`,
        `"${(h.address || '').replace(/"/g, '""')}"`,
        `"${(h.district || '').replace(/"/g, '""')}"`,
        `"${(h.state || '').replace(/"/g, '""')}"`,
        `"${(h.type || '').replace(/"/g, '""')}"`,
        `"${(organsStr || '').replace(/"/g, '""')}"`,
        `"${(h.website || '').replace(/"/g, '""')}"`,
        `"${bgStr}"`,
        `"${(h.primary_surgery || '').replace(/"/g, '""')}"`,
        `"${(priceAlert || '').replace(/"/g, '""')}"`,
        `"${successRate}"`,
        h.total_requirements || 100,
        h.active_recipients_waiting || 30,
        h.completed_transplants || 70
      ].join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NOTTO_100_Hospital_Registry_Dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast('CSV dataset exported successfully!', 'success');
  }

  applyCsvDataFromTextarea() {
    const textarea = document.getElementById('csvTextarea');
    if (!textarea || !textarea.value.trim()) return;

    try {
      const parsed = this.parseCsvString(textarea.value.trim());
      if (parsed && parsed.length > 0) {
        window.HOSPITAL_REGISTRY_METRICS = parsed;
        this.selectedSpotlightHospitalId = parsed[0].id;
        this.renderDashboard();
        this.closeCsvModal();
        this.showToast(`Successfully imported ${parsed.length} hospitals from CSV dataset!`, 'success');
      } else {
        alert('Invalid CSV data or empty rows.');
      }
    } catch (e) {
      alert('Error parsing CSV: ' + e.message);
    }
  }

  handleCsvFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const textarea = document.getElementById('csvTextarea');
      if (textarea) textarea.value = text;
      this.applyCsvDataFromTextarea();
    };
    reader.readAsText(file);
  }

  parseCsvString(csvText) {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const surgeryMap = {
      'Kidney': { name: 'Kidney (Renal) Allograft & Living Donor Nephrectomy', price: '₹4,50,000 - ₹7,20,000 (100% Cashless PM-JAY)', rate: '99.4%' },
      'Liver': { name: 'Orthotopic Living / Deceased Donor Liver Transplant', price: '₹14,00,000 - ₹21,50,000 (State Subsidy PM-JAY)', rate: '98.9%' },
      'Heart': { name: 'Orthotopic Heart Allograft & LVAD Bridging', price: '₹16,50,000 - ₹24,00,000 (National Relief Fund)', rate: '98.7%' },
      'Lung': { name: 'Bilateral / Single Lung Thoracic Allograft', price: '₹18,00,000 - ₹26,50,000 (State Subsidy)', rate: '97.8%' },
      'Cornea': { name: 'Keratoplasty & Deep Anterior Lamellar Surgery', price: '₹65,000 - ₹1,20,000 (100% Free under NPCB)', rate: '99.8%' },
      'Pancreas': { name: 'Simultaneous Pancreas-Kidney (SPK) Transplant', price: '₹12,00,000 - ₹18,00,000 (PM-JAY Scheme)', rate: '98.2%' },
      'Skin': { name: 'Cryopreserved Cadaveric Split-Thickness Skin Graft', price: '₹85,000 - ₹1,80,000 (National Burn Care Scheme)', rate: '99.5%' },
      'Bone Marrow': { name: 'Allogeneic Hematopoietic Stem Cell Transplant (HSCT)', price: '₹10,50,000 - ₹15,80,000 (RAN Scheme Supported)', rate: '98.9%' },
      'Blood': { name: 'Rare Blood Group & Cryoprecipitate Transfusion', price: '₹12,00,000 - ₹35,000 (National Blood Transfusion Council)', rate: '99.9%' }
    };

    const results = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle quotes in CSV
      const cols = [];
      let inQuote = false;
      let cur = '';
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          cols.push(cur.trim());
          cur = '';
        } else {
          cur += char;
        }
      }
      cols.push(cur.trim());

      const id = parseInt(cols[0], 10) || i;
      const hospital_name = cols[1] || `Transplant Center #${id}`;
      const address = cols[2] || '';
      const district = cols[3] || '';
      const state = cols[4] || 'National';
      const type = cols[5] || 'Transplant Centre';
      let organs = cols[6] || 'Kidney, Liver';
      // Clean intestine if present in user CSV
      organs = organs.replace(/Intestine,?\s*/gi, '').replace(/,\s*$/, '');
      const website = cols[7] || 'N/A';

      const firstOrgan = organs.split(',')[0].trim() || 'Kidney';
      const surgInfo = surgeryMap[firstOrgan] || surgeryMap['Kidney'];
      const bg = bloodGroups[(id - 1) % bloodGroups.length];

      results.push({
        id,
        hospital_name,
        address,
        district,
        state,
        type,
        organs,
        website,
        region: (state === 'Delhi' || state === 'Haryana' || state === 'Punjab' || state === 'Uttarakhand' || state === 'Uttar Pradesh' || state === 'Rajasthan' || state === 'Chandigarh') ? 'North'
              : (state === 'Tamil Nadu' || state === 'Karnataka' || state === 'Kerala' || state === 'Puducherry' || state === 'Telangana') ? 'South'
              : (state === 'Maharashtra' || state === 'Gujarat') ? 'West'
              : (state === 'West Bengal' || state === 'Assam' || state === 'Odisha') ? 'East' : 'Central',
        required_blood_group: bg,
        primary_surgery: surgInfo.name,
        price_alert_inr: surgInfo.price,
        success_rate_percent: surgInfo.rate,
        total_requirements: 80 + ((id * 7) % 180),
        active_recipients_waiting: 20 + ((id * 3) % 65),
        donors_submitted: 15 + ((id * 4) % 55),
        completed_transplants: 50 + ((id * 9) % 140),
        avg_wait_time_days: 30 + ((id * 5) % 60),
        compliance_score: 95 + ((id * 2) % 6)
      });
    }
    return results;
  }

  loadSample100Hospitals() {
    if (window.ORIGINAL_HOSPITAL_METRICS && window.ORIGINAL_HOSPITAL_METRICS.length > 0) {
      window.HOSPITAL_REGISTRY_METRICS = JSON.parse(JSON.stringify(window.ORIGINAL_HOSPITAL_METRICS));
    }
    this.selectedSpotlightHospitalId = 1;
    this.renderDashboard();
    this.closeCsvModal();
    this.showToast('Reset to original 100 apex hospitals!', 'info');
  }

  /* ══════════════════════════════════════════════
     AI AGENTS HUB & REAL API WORKBENCH
     ══════════════════════════════════════════════ */
  renderAiAgentHub() {
    // Fetch live system status to confirm backend API endpoints
    fetch('/api/agent/system-status')
      .then(res => res.json())
      .then(data => {
        console.log('[AI Agents Hub] Live System Status:', data);
      })
      .catch(err => {
        console.warn('[AI Agents Hub] Status fetch notice:', err.message);
      });

    // Auto-detect latest active Telegram chat if input is present
    fetch('/api/agent/telegram-latest-chat')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.chatId) {
          const input = document.getElementById('telegramInputChatId');
          if (input && (!input.value || input.value === '@notto_organ_alerts')) {
            input.value = data.chatId;
          }
        }
      })
      .catch(() => {});
  }

  async autoDetectTelegramChat() {
    this.appendMasterLog('Querying Telegram Bot updates for active subscriber chat ID...');
    try {
      const res = await fetch('/api/agent/telegram-latest-chat');
      const data = await res.json();
      if (data.ok && data.chatId) {
        const input = document.getElementById('telegramInputChatId');
        if (input) input.value = data.chatId;
        this.appendMasterLog(`Auto-detected Telegram Chat ID: ${data.chatId} (${data.user || 'Verified User'})`, 'success');
        this.showToast(`Auto-detected Telegram Chat: ${data.user || ''} (${data.chatId})`, 'success');
      } else {
        this.appendMasterLog(`Telegram Notice: ${data.error || 'No recent chats detected'}`, 'info');
        this.showToast('Please open @OrganVault_bot on Telegram & send /start, then try again.', 'info');
      }
    } catch (e) {
      this.appendMasterLog(`Failed to auto-detect chat ID: ${e.message}`, 'error');
    }
  }

  appendMasterLog(msg, type = 'info') {
    const logBox = document.getElementById('masterAgentTelemetryLogs');
    if (!logBox) return;
    const now = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌ [ERROR]' : (type === 'success' ? '✔ [SUCCESS]' : 'ℹ [LOG]');
    logBox.textContent += `\n[${now}] ${prefix} ${msg}`;
    logBox.scrollTop = logBox.scrollHeight;
  }

  /**
   * 1. Run Mistral AI Viability Assessment Agent with Interactive Inputs
   */
  async executeMistralAgent() {
    const btn = document.getElementById('btnTestMistral');
    const outBox = document.getElementById('mistralAgentOutput');
    const name = document.getElementById('mistralInputName')?.value || 'Rahul Sharma';
    const age = document.getElementById('mistralInputAge')?.value || 34;
    const bloodGroup = document.getElementById('mistralInputBlood')?.value || 'O+';
    const organ = document.getElementById('mistralInputOrgan')?.value || 'Kidney';
    const condition = document.getElementById('mistralInputCondition')?.value || 'Optimal perfusion';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳ Evaluating with Mistral AI...</span>`;
    }

    if (outBox) {
      outBox.style.display = 'block';
      outBox.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem;"><div class="spinner-small" style="width:14px; height:14px; border:2px solid #6366f1; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></div> <span>Mistral AI clinical neural network is evaluating donor viability...</span></div>`;
    }

    this.appendMasterLog(`Invoking Mistral AI Engine (model: mistral-small) for ${organ} from ${name} (${age}y, ${bloodGroup})...`);

    try {
      const response = await fetch('/api/agent/evaluate-viability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          age: parseInt(age, 10),
          bloodGroup,
          organ,
          organCondition: condition
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to evaluate with Mistral AI');
      }

      const evalRes = resData.evaluation;
      this.appendMasterLog(`Mistral Assessment complete: Score = ${evalRes.viabilityScore}%, Priority = ${evalRes.priorityLevel}, Ischemia Risk = ${evalRes.ischemiaRisk}`, 'success');

      if (outBox) {
        outBox.innerHTML = `
          <div style="font-weight: 700; color: #4338ca; margin-bottom: 4px; display: flex; justify-content: space-between;">
            <span>✔ MISTRAL VIABILITY SCORE: ${evalRes.viabilityScore}%</span>
            <span style="background: ${evalRes.viable ? '#10b981' : '#ef4444'}; color: #ffffff; padding: 1px 6px; border-radius: 4px; font-size: 0.7rem;">${evalRes.priorityLevel}</span>
          </div>
          <div style="margin-bottom: 4px;"><strong>Clinical Summary:</strong> ${evalRes.clinicalSummary}</div>
          <div style="margin-bottom: 4px;"><strong>Ischemia Risk:</strong> ${evalRes.ischemiaRisk}</div>
          <div style="font-size: 0.72rem; color: #6b21a8; background: #f3e8ff; padding: 4px 6px; border-radius: 4px;">
            <strong>Mandate:</strong> ${evalRes.recommendedAction}
          </div>
        `;
      }
      this.showToast('Mistral AI evaluation completed successfully!', 'success');
    } catch (err) {
      console.error('[Mistral Test Error]', err);
      this.appendMasterLog(`Mistral AI Error: ${err.message}`, 'error');
      if (outBox) {
        outBox.innerHTML = `<div style="color: #dc2626; font-weight: 600;">❌ Evaluation Error: ${err.message}</div>`;
      }
      this.showToast('Mistral AI evaluation error: ' + err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>🧠 Run Mistral AI Assessment</span>`;
      }
    }
  }

  /**
   * 2. Run Resend Emergency Hospital Email Dispatch Agent with Interactive Inputs
   */
  async executeResendAgent() {
    const btn = document.getElementById('btnTestResend');
    const outBox = document.getElementById('resendAgentOutput');
    const email = document.getElementById('resendInputEmail')?.value?.trim() || 'kashwi0103@gmail.com';
    const hospital = document.getElementById('resendInputHospital')?.value || 'AIIMS New Delhi';
    const organInfo = document.getElementById('resendInputOrgan')?.value || 'Kidney (O+)';
    const mandate = document.getElementById('resendInputMandate')?.value || 'CRITICAL URGENT';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳ Dispatching via Resend...</span>`;
    }

    if (outBox) {
      outBox.style.display = 'block';
      outBox.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem;"><div class="spinner-small" style="width:14px; height:14px; border:2px solid #0284c7; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></div> <span>Connecting to Resend Email API gateway...</span></div>`;
    }

    this.appendMasterLog(`Dispatching emergency hospital allocation email to ${email} (${hospital})...`);

    try {
      const response = await fetch('/api/agent/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorData: {
            fullName: 'Emergency Donor Case',
            age: 32,
            bloodGroup: 'O+',
            organ: organInfo,
            hospitalName: hospital,
            customRecipientEmail: email,
            donorId: 'DNR-TEST-' + Math.floor(1000 + Math.random() * 9000)
          },
          evaluation: {
            viable: true,
            viabilityScore: 96,
            priorityLevel: 'CRITICAL_URGENT',
            clinicalSummary: `Autonomous organ match confirmed for ${hospital}. Optimal cold preservation active.`,
            ischemiaRisk: 'LOW',
            recommendedAction: mandate
          }
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to dispatch email via Resend API');
      }

      this.appendMasterLog(`Resend Email successfully transmitted! ID: ${resData.data ? resData.data.id : 'OK'}`, 'success');

      if (outBox) {
        outBox.innerHTML = `
          <div style="font-weight: 700; color: #0369a1; margin-bottom: 4px;">
            ✔ RESEND EMERGENCY EMAIL DISPATCHED
          </div>
          <div><strong>Recipient:</strong> ${resData.recipient || email}</div>
          <div><strong>Hospital:</strong> ${hospital}</div>
          ${resData.note ? `<div style="color: #0284c7; font-size: 0.72rem; margin-top: 3px; background: #e0f2fe; padding: 4px 6px; border-radius: 4px;">ℹ ${resData.note}</div>` : ''}
          <div style="font-family: monospace; font-size: 0.72rem; color: #0284c7; margin-top: 4px;">
            Resend Msg ID: ${resData.data ? resData.data.id : 'Dispatched'}
          </div>
        `;
      }
      this.showToast(`Emergency email sent via Resend API!`, 'success');
    } catch (err) {
      console.error('[Resend Test Error]', err);
      this.appendMasterLog(`Resend Email Error: ${err.message}`, 'error');
      if (outBox) {
        outBox.innerHTML = `<div style="color: #dc2626; font-weight: 600;">❌ Resend Dispatch Error: ${err.message}</div>`;
      }
      this.showToast('Resend API notice: ' + err.message, 'info');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>📧 Send Emergency Resend Email</span>`;
      }
    }
  }

  /**
   * 3. Run Telegram Bot Alert Agent with Interactive Inputs
   */
  async executeTelegramAgent() {
    const btn = document.getElementById('btnTestTelegram');
    const outBox = document.getElementById('telegramAgentOutput');
    let chatId = document.getElementById('telegramInputChatId')?.value?.trim() || '6998121144';
    const tokenId = document.getElementById('telegramInputToken')?.value || 'DNR-3535-NOTTO';
    const score = document.getElementById('telegramInputScore')?.value || '95% (HIGH_PRIORITY)';
    const headline = document.getElementById('telegramInputHeadline')?.value || '🚨 Organ Allocation Alert';

    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>⏳ Broadcasting to Telegram...</span>`;
    }

    if (outBox) {
      outBox.style.display = 'block';
      outBox.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem;"><div class="spinner-small" style="width:14px; height:14px; border:2px solid #2563eb; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite;"></div> <span>Transmitting Telegram Bot API message...</span></div>`;
    }

    this.appendMasterLog(`Broadcasting alert to Telegram Bot channel/chat: ${chatId}...`);

    try {
      const response = await fetch('/api/agent/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorData: {
            fullName: 'Priority Allocation Patient',
            age: 28,
            bloodGroup: 'B+',
            organ: 'Heart',
            region: 'Northern Apex Hub',
            donorId: tokenId,
            customTelegramChatId: chatId
          },
          evaluation: {
            viable: true,
            viabilityScore: 95,
            priorityLevel: 'CRITICAL_URGENT',
            clinicalSummary: headline,
            ischemiaRisk: 'LOW',
            recommendedAction: `Score: ${score}. Immediate surgical team readiness instructed.`
          }
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to send Telegram alert');
      }

      this.appendMasterLog(`Telegram Alert successfully posted! ${resData.note || 'Chat ID: ' + chatId}`, 'success');

      if (outBox) {
        outBox.innerHTML = `
          <div style="font-weight: 700; color: #1d4ed8; margin-bottom: 4px;">
            ✔ TELEGRAM ALERT DISPATCHED
          </div>
          <div><strong>Chat / Subscriber Target:</strong> ${chatId}</div>
          <div><strong>Token:</strong> ${tokenId}</div>
          ${resData.note ? `<div style="color: #059669; font-size: 0.72rem; margin-top: 2px;">ℹ ${resData.note}</div>` : ''}
          <div style="font-family: monospace; font-size: 0.72rem; color: #2563eb; margin-top: 4px;">
            Telegram Status: Delivered (200 OK) • Bot: @OrganVault_bot
          </div>
        `;
      }
      this.showToast(`Telegram alert sent successfully!`, 'success');
    } catch (err) {
      console.error('[Telegram Test Error]', err);
      this.appendMasterLog(`Telegram Notice: ${err.message}`, 'error');
      if (outBox) {
        outBox.innerHTML = `
          <div style="color: #dc2626; font-weight: 600; margin-bottom: 4px;">
            ⚠️ Telegram API Status: ${err.message}
          </div>
          <div style="font-size: 0.74rem; color: #475569; background: #fff; border: 1px solid #fed7aa; padding: 6px 8px; border-radius: 4px;">
            <strong>Quick Setup:</strong>
            <ol style="margin: 4px 0 0 16px; padding: 0;">
              <li>Open <a href="https://t.me/OrganVault_bot" target="_blank" rel="noreferrer" style="color: #2563eb; font-weight: 700; text-decoration: underline;">@OrganVault_bot</a> in Telegram.</li>
              <li>Click <strong>Start</strong> or send <code>/start</code>.</li>
              <li>Click the <strong>⚡ Auto-Detect Chat ID</strong> button above to automatically grab your Chat ID!</li>
            </ol>
          </div>
        `;
      }
      this.showToast('Telegram status note: ' + err.message, 'info');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>📱 Send Telegram Bot Alert</span>`;
      }
    }
  }

  /**
   * 4. Run Master Autonomous Multi-Agent Pipeline (Mistral -> Resend -> Telegram)
   */
  async runMasterAgenticPipeline() {
    const donorName = document.getElementById('mistralInputName')?.value || 'Pooja Verma';
    const age = document.getElementById('mistralInputAge')?.value || 31;
    const bloodGroup = document.getElementById('mistralInputBlood')?.value || 'O+';
    const organ = document.getElementById('mistralInputOrgan')?.value || 'Kidney';
    const customEmail = document.getElementById('resendInputEmail')?.value?.trim() || 'kashwi0103@gmail.com';
    const customChatId = document.getElementById('telegramInputChatId')?.value?.trim() || '6998121144';

    this.appendMasterLog(`=======================================================`);
    this.appendMasterLog(`🚀 [MASTER ORCHESTRATOR] Starting End-to-End Autonomous Pipeline for Donor: ${donorName} (${organ}, ${bloodGroup})...`);
    this.showToast('Launching Master Agentic AI Workflow...', 'info');

    try {
      const response = await fetch('/api/agent/run-organ-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: donorName,
          age: parseInt(age, 10),
          bloodGroup,
          organ,
          region: 'Northern Apex Hub',
          organCondition: 'Normothermic perfusion, CIT < 3 hours',
          customRecipientEmail: customEmail,
          customTelegramChatId: customChatId,
          donorId: 'DNR-' + Math.floor(1000 + Math.random() * 9000)
        })
      });

      const report = await response.json();
      if (!response.ok || !report.success) {
        throw new Error(report.error || 'Agentic AI Master Pipeline encountered an error');
      }

      this.appendMasterLog(`Step 1 (Mistral AI): Viability ${report.evaluation.viabilityScore}% (${report.evaluation.priorityLevel})`, 'success');
      this.appendMasterLog(`Step 2 (Resend Email): ${report.actionsTriggered.email.success ? 'DISPATCHED ✔' : 'FAILED ❌ (' + (report.actionsTriggered.email.error || '') + ')'}`);
      this.appendMasterLog(`Step 3 (Telegram Bot): ${report.actionsTriggered.telegram.success ? 'DISPATCHED ✔' : 'FAILED ❌ (' + (report.actionsTriggered.telegram.error || '') + ')'}`);
      this.appendMasterLog(`🎉 Master Agent Pipeline completed all steps with real APIs!`, 'success');

      this.showToast(`Master AI Pipeline successfully executed for ${donorName}!`, 'success');
    } catch (err) {
      console.error('[Master Pipeline Error]', err);
      this.appendMasterLog(`Master Pipeline Error: ${err.message}`, 'error');
      this.showToast('Master Pipeline note: ' + err.message, 'error');
    }
  }

  /**
   * ══════════════════════════════════════════════════════════════════════
   * ANOMALY SCANNER & 9-NODE BFT QUORUM ENGINE
   * ══════════════════════════════════════════════════════════════════════
   */
  initAnomalyScannerData() {
    // 9 Statutory Authority Nodes under NOTTO Decentralized Consensus Protocol
    this.anomalyNodes = [
      { id: 'NODE-01', name: 'National Central Spine (NOTTO Apex)', ip: '10.0.1.1', vote: 'AGREED', status: 'ONLINE', latency: '12ms', weight: '20%', sig: '0x8f7a90b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d719e0', isByzantine: false, role: 'Leader / Proposer' },
      { id: 'NODE-02', name: 'AIIMS New Delhi Central Spine', ip: '10.0.2.14', vote: 'AGREED', status: 'ONLINE', latency: '19ms', weight: '10%', sig: '0x3c4b5a6978102f3e4d5c6b7a8901e2f3a4b5c6d7e8f901a2b3c4d5e6f7e89a', isByzantine: false, role: 'Apex Hospital Validator' },
      { id: 'NODE-03', name: 'ROTTO Western Authority (Mumbai KEM)', ip: '10.0.3.8', vote: 'AGREED', status: 'ONLINE', latency: '24ms', weight: '10%', sig: '0x9a12bc34de56f7890123456789abcdef0123456789abcdef012345678977fe', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-04', name: 'SOTTO Southern Node (Chennai Apex)', ip: '10.0.4.2', vote: 'AGREED', status: 'ONLINE', latency: '31ms', weight: '10%', sig: '0x712abb149023456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-05', name: 'DigiLocker ABHA Gateway (UIDAI / NHA)', ip: '10.0.5.55', vote: 'AGREED', status: 'ONLINE', latency: '16ms', weight: '10%', sig: '0xee8149cb0123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Identity Anchor' },
      { id: 'NODE-06', name: 'PGIMER Northern Node (Chandigarh)', ip: '10.0.6.19', vote: 'AGREED', status: 'ONLINE', latency: '22ms', weight: '10%', sig: '0x45a9008f0123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-07', name: 'ROTTO Eastern Node (IPGMER Kolkata)', ip: '10.0.7.41', vote: 'AGREED', status: 'ONLINE', latency: '28ms', weight: '10%', sig: '0xbf93e12a0123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-08', name: 'SOTTO Central Regional Node (Bhopal)', ip: '10.0.8.12', vote: 'AGREED', status: 'ONLINE', latency: '25ms', weight: '10%', sig: '0x10cd88630123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-09', name: 'ICMR Bioethics Oversight Spine', ip: '10.0.9.99', vote: 'AGREED', status: 'ONLINE', latency: '18ms', weight: '10%', sig: '0x62ef99110123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Ethics & Compliance' }
    ];

    // Last 5 computed block history items with node agreement timestamps
    this.anomalyHistory = [
      {
        id: 'hist-108',
        blockNumber: 108,
        action: 'ORGAN ALLOCATION CERTIFIED: Heart (DNR-NOTTO-77 -> Yashika Malhotra)',
        hash: '0x8f4d92a10e7b5c3f4a9812e6d5b4c3a2f1e0d9c8b7a6f5e4d3c2b1a098765432',
        prevHash: '0x7e3c81f09d6a4b2e3f8701d5c4a3b2e1f0d9c8b7a6e5d4c3b2a109876543210f',
        timestamp: '2026-08-24 12:45:10 IST',
        computedAt: '12:45:10.842',
        status: 'VERIFIED',
        agreementCount: 9,
        totalNodes: 9,
        nodeAgreements: [
          { nodeId: 'NODE-01', nodeName: 'NOTTO Central Spine', timestamp: '12:45:10.844', status: 'AGREED', signature: '0x8f7a...19e0', latency: '12ms' },
          { nodeId: 'NODE-02', nodeName: 'AIIMS New Delhi', timestamp: '12:45:10.851', status: 'AGREED', signature: '0x3c4b...e89a', latency: '19ms' },
          { nodeId: 'NODE-03', nodeName: 'Western ROTTO', timestamp: '12:45:10.856', status: 'AGREED', signature: '0x9a12...77fe', latency: '24ms' },
          { nodeId: 'NODE-04', nodeName: 'Southern SOTTO', timestamp: '12:45:10.863', status: 'AGREED', signature: '0x712a...bb14', latency: '31ms' },
          { nodeId: 'NODE-05', nodeName: 'DigiLocker ABHA', timestamp: '12:45:10.848', status: 'AGREED', signature: '0xee81...49cb', latency: '16ms' },
          { nodeId: 'NODE-06', nodeName: 'PGIMER Northern', timestamp: '12:45:10.854', status: 'AGREED', signature: '0x45a9...008f', latency: '22ms' },
          { nodeId: 'NODE-07', nodeName: 'Eastern ROTTO', timestamp: '12:45:10.860', status: 'AGREED', signature: '0xbf93...e12a', latency: '28ms' },
          { nodeId: 'NODE-08', nodeName: 'Central SOTTO', timestamp: '12:45:10.857', status: 'AGREED', signature: '0x10cd...8863', latency: '25ms' },
          { nodeId: 'NODE-09', nodeName: 'ICMR Bioethics', timestamp: '12:45:10.850', status: 'AGREED', signature: '0x62ef...9911', latency: '18ms' }
        ]
      },
      {
        id: 'hist-107',
        blockNumber: 107,
        action: 'SMART CONTAINER E-SEAL ARMED: Box #NOTTO-BOX-01 (Heart Perfusion)',
        hash: '0x7e3c81f09d6a4b2e3f8701d5c4a3b2e1f0d9c8b7a6e5d4c3b2a109876543210f',
        prevHash: '0x6d2b70e18c5f3a1d2e7690c4b3a2e1d0f9c8b7a6e5d4c3b2a109876543210fe9',
        timestamp: '2026-08-24 11:30:22 IST',
        computedAt: '11:30:22.415',
        status: 'VERIFIED',
        agreementCount: 9,
        totalNodes: 9,
        nodeAgreements: [
          { nodeId: 'NODE-01', nodeName: 'NOTTO Central Spine', timestamp: '11:30:22.418', status: 'AGREED', signature: '0x8f7a...19e0', latency: '12ms' },
          { nodeId: 'NODE-02', nodeName: 'AIIMS New Delhi', timestamp: '11:30:22.424', status: 'AGREED', signature: '0x3c4b...e89a', latency: '18ms' },
          { nodeId: 'NODE-03', nodeName: 'Western ROTTO', timestamp: '11:30:22.429', status: 'AGREED', signature: '0x9a12...77fe', latency: '23ms' },
          { nodeId: 'NODE-04', nodeName: 'Southern SOTTO', timestamp: '11:30:22.435', status: 'AGREED', signature: '0x712a...bb14', latency: '29ms' },
          { nodeId: 'NODE-05', nodeName: 'DigiLocker ABHA', timestamp: '11:30:22.421', status: 'AGREED', signature: '0xee81...49cb', latency: '15ms' },
          { nodeId: 'NODE-06', nodeName: 'PGIMER Northern', timestamp: '11:30:22.427', status: 'AGREED', signature: '0x45a9...008f', latency: '21ms' },
          { nodeId: 'NODE-07', nodeName: 'Eastern ROTTO', timestamp: '11:30:22.432', status: 'AGREED', signature: '0xbf93...e12a', latency: '26ms' },
          { nodeId: 'NODE-08', nodeName: 'Central SOTTO', timestamp: '11:30:22.430', status: 'AGREED', signature: '0x10cd...8863', latency: '24ms' },
          { nodeId: 'NODE-09', nodeName: 'ICMR Bioethics', timestamp: '11:30:22.423', status: 'AGREED', signature: '0x62ef...9911', latency: '17ms' }
        ]
      },
      {
        id: 'hist-106',
        blockNumber: 106,
        action: 'DONOR REGISTERED ON-CHAIN: Rahul Sharma (DNR-NOTTO-77 Kidney & Heart)',
        hash: '0x6d2b70e18c5f3a1d2e7690c4b3a2e1d0f9c8b7a6e5d4c3b2a109876543210fe9',
        prevHash: '0x5c1a69d07b4e2f0c1d6589b3a2e1d0f9c8b7a6e5d4c3b2a109876543210fed8',
        timestamp: '2026-08-24 10:15:04 IST',
        computedAt: '10:15:04.112',
        status: 'VERIFIED',
        agreementCount: 9,
        totalNodes: 9,
        nodeAgreements: [
          { nodeId: 'NODE-01', nodeName: 'NOTTO Central Spine', timestamp: '10:15:04.115', status: 'AGREED', signature: '0x8f7a...19e0', latency: '11ms' },
          { nodeId: 'NODE-02', nodeName: 'AIIMS New Delhi', timestamp: '10:15:04.120', status: 'AGREED', signature: '0x3c4b...e89a', latency: '17ms' },
          { nodeId: 'NODE-03', nodeName: 'Western ROTTO', timestamp: '10:15:04.126', status: 'AGREED', signature: '0x9a12...77fe', latency: '22ms' },
          { nodeId: 'NODE-04', nodeName: 'Southern SOTTO', timestamp: '10:15:04.133', status: 'AGREED', signature: '0x712a...bb14', latency: '28ms' },
          { nodeId: 'NODE-05', nodeName: 'DigiLocker ABHA', timestamp: '10:15:04.118', status: 'AGREED', signature: '0xee81...49cb', latency: '14ms' },
          { nodeId: 'NODE-06', nodeName: 'PGIMER Northern', timestamp: '10:15:04.124', status: 'AGREED', signature: '0x45a9...008f', latency: '20ms' },
          { nodeId: 'NODE-07', nodeName: 'Eastern ROTTO', timestamp: '10:15:04.130', status: 'AGREED', signature: '0xbf93...e12a', latency: '25ms' },
          { nodeId: 'NODE-08', nodeName: 'Central SOTTO', timestamp: '10:15:04.128', status: 'AGREED', signature: '0x10cd...8863', latency: '23ms' },
          { nodeId: 'NODE-09', nodeName: 'ICMR Bioethics', timestamp: '10:15:04.122', status: 'AGREED', signature: '0x62ef...9911', latency: '16ms' }
        ]
      },
      {
        id: 'hist-105',
        blockNumber: 105,
        action: 'ZKP MERKLE LEAF ANCHORED: 15 SOTTO Diagnostic Reports for PT-001',
        hash: '0x5c1a69d07b4e2f0c1d6589b3a2e1d0f9c8b7a6e5d4c3b2a109876543210fed8',
        prevHash: '0x4b0958c96a3d1e9b0c5478a291d0f9c8b7a6e5d4c3b2a109876543210fed7',
        timestamp: '2026-08-24 09:00:15 IST',
        computedAt: '09:00:15.670',
        status: 'VERIFIED',
        agreementCount: 9,
        totalNodes: 9,
        nodeAgreements: [
          { nodeId: 'NODE-01', nodeName: 'NOTTO Central Spine', timestamp: '09:00:15.673', status: 'AGREED', signature: '0x8f7a...19e0', latency: '12ms' },
          { nodeId: 'NODE-02', nodeName: 'AIIMS New Delhi', timestamp: '09:00:15.680', status: 'AGREED', signature: '0x3c4b...e89a', latency: '18ms' },
          { nodeId: 'NODE-03', nodeName: 'Western ROTTO', timestamp: '09:00:15.685', status: 'AGREED', signature: '0x9a12...77fe', latency: '23ms' },
          { nodeId: 'NODE-04', nodeName: 'Southern SOTTO', timestamp: '09:00:15.692', status: 'AGREED', signature: '0x712a...bb14', latency: '30ms' },
          { nodeId: 'NODE-05', nodeName: 'DigiLocker ABHA', timestamp: '09:00:15.677', status: 'AGREED', signature: '0xee81...49cb', latency: '15ms' },
          { nodeId: 'NODE-06', nodeName: 'PGIMER Northern', timestamp: '09:00:15.683', status: 'AGREED', signature: '0x45a9...008f', latency: '21ms' },
          { nodeId: 'NODE-07', nodeName: 'Eastern ROTTO', timestamp: '09:00:15.689', status: 'AGREED', signature: '0xbf93...e12a', latency: '27ms' },
          { nodeId: 'NODE-08', nodeName: 'Central SOTTO', timestamp: '09:00:15.687', status: 'AGREED', signature: '0x10cd...8863', latency: '24ms' },
          { nodeId: 'NODE-09', nodeName: 'ICMR Bioethics', timestamp: '09:00:15.679', status: 'AGREED', signature: '0x62ef...9911', latency: '17ms' }
        ]
      },
      {
        id: 'hist-104',
        blockNumber: 104,
        action: 'GENESIS NOTTO CONSENSUS EPOCH INITIALIZED: 87 Active Candidates Anchor',
        hash: '0x4b0958c96a3d1e9b0c5478a291d0f9c8b7a6e5d4c3b2a109876543210fed7',
        prevHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: '2026-08-24 08:00:00 IST',
        computedAt: '08:00:00.001',
        status: 'VERIFIED',
        agreementCount: 9,
        totalNodes: 9,
        nodeAgreements: [
          { nodeId: 'NODE-01', nodeName: 'NOTTO Central Spine', timestamp: '08:00:00.005', status: 'AGREED', signature: '0x8f7a...19e0', latency: '12ms' },
          { nodeId: 'NODE-02', nodeName: 'AIIMS New Delhi', timestamp: '08:00:00.010', status: 'AGREED', signature: '0x3c4b...e89a', latency: '17ms' },
          { nodeId: 'NODE-03', nodeName: 'Western ROTTO', timestamp: '08:00:00.015', status: 'AGREED', signature: '0x9a12...77fe', latency: '22ms' },
          { nodeId: 'NODE-04', nodeName: 'Southern SOTTO', timestamp: '08:00:00.021', status: 'AGREED', signature: '0x712a...bb14', latency: '28ms' },
          { nodeId: 'NODE-05', nodeName: 'DigiLocker ABHA', timestamp: '08:00:00.008', status: 'AGREED', signature: '0xee81...49cb', latency: '15ms' },
          { nodeId: 'NODE-06', nodeName: 'PGIMER Northern', timestamp: '08:00:00.013', status: 'AGREED', signature: '0x45a9...008f', latency: '20ms' },
          { nodeId: 'NODE-07', nodeName: 'Eastern ROTTO', timestamp: '08:00:00.019', status: 'AGREED', signature: '0xbf93...e12a', latency: '26ms' },
          { nodeId: 'NODE-08', nodeName: 'Central SOTTO', timestamp: '08:00:00.017', status: 'AGREED', signature: '0x10cd...8863', latency: '24ms' },
          { nodeId: 'NODE-09', nodeName: 'ICMR Bioethics', timestamp: '08:00:00.011', status: 'AGREED', signature: '0x62ef...9911', latency: '18ms' }
        ]
      }
    ];

    this.anomalyAuditLogs = [
      { time: '12:45:10', level: 'SUCCESS', message: 'BFT Supermajority Consensus Reached: 9/9 statutory nodes signed Block #108.' },
      { time: '12:45:09', level: 'INFO', message: 'Keccak-256 Merkle root validated against Genesis State Proof (0x8f4d92...5432).' },
      { time: '11:30:22', level: 'SUCCESS', message: 'Smart Container Box #NOTTO-BOX-01 state committed with 9 multi-signatures.' },
      { time: '10:15:04', level: 'INFO', message: 'Donor registration DNR-NOTTO-77 broadcasted to all regional validator nodes.' },
      { time: '08:00:00', level: 'INFO', message: 'Genesis epoch initialized under THOA Section 5 consensus protocol.' }
    ];
  }

  renderAnomalyScanner() {
    this.renderAnomalyMetrics();
    this.renderAnomalyBannerState();
    this.renderAnomalyTabContent();
    this.renderAnomalyHistorySidebar();
  }

  renderAnomalyBannerState() {
    const bannerBadge = document.getElementById('anomalyBannerBadge');
    const alertBanner = document.getElementById('anomalyAlertBanner');
    const agreeCount = this.anomalyNodes.filter(n => n.vote === 'AGREED').length;
    const isCompromised = this.isAnomalyDetected || agreeCount < 7;

    if (bannerBadge) {
      if (isCompromised) {
        bannerBadge.style.background = '#e11d48';
        bannerBadge.innerHTML = `<span class="live-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#ffffff;"></span> <span>QUORUM COMPROMISED (${agreeCount}/9)</span>`;
      } else {
        bannerBadge.style.background = '#10b981';
        bannerBadge.innerHTML = `<span class="live-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#ffffff;"></span> <span>QUORUM HEALTHY (9/9)</span>`;
      }
    }

    if (alertBanner) {
      alertBanner.style.display = isCompromised ? 'block' : 'none';
    }
  }

  renderAnomalyMetrics() {
    const grid = document.getElementById('anomalyMetricsGrid');
    if (!grid) return;

    const agreeCount = this.anomalyNodes.filter(n => n.vote === 'AGREED').length;
    const isCompromised = this.isAnomalyDetected || agreeCount < 7;
    const agreementPct = Math.round((agreeCount / 9) * 100);
    const latestBlock = this.anomalyHistory[0] || { blockNumber: 108, hash: '0x8f4d92a10e...5432' };

    grid.innerHTML = `
      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>BFT Consensus Quorum</span><span>🏛️</span></div>
        <div class="stat-card-value" style="color: ${isCompromised ? '#e11d48' : '#059669'};">${agreeCount} / 9 Nodes</div>
        <div class="stat-card-sub">${agreementPct}% Multi-Sig Agreement (Min 67% Req)</div>
      </div>

      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Active Chain Height</span><span>⛓️</span></div>
        <div class="stat-card-value" style="color: #003087;">#${latestBlock.blockNumber}</div>
        <div class="stat-card-sub">5 Computed Blocks Anchored</div>
      </div>

      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Merkle Root Integrity</span><span>🔐</span></div>
        <div class="stat-card-value" style="font-size: 1.1rem; color: ${isCompromised ? '#dc2626' : '#7c3aed'}; font-family: var(--font-mono);">
          ${isCompromised ? 'HASH MISMATCH' : '0x8f4d...5432'}
        </div>
        <div class="stat-card-sub">${isCompromised ? '🚨 Byzantine State Branch' : '✔ SHA-256 / Keccak-256 Valid'}</div>
      </div>

      <div class="dashboard-stat-card">
        <div class="stat-card-label"><span>Byzantine Fault Status</span><span>🛡️</span></div>
        <div class="stat-card-value" style="color: ${isCompromised ? '#b91c1c' : '#0284c7'}; font-size: 1.2rem;">
          ${isCompromised ? 'QUORUM ISOLATED' : 'ONLINE & VERIFIED'}
        </div>
        <div class="stat-card-sub">Tolerance: f &le; 2 (3f+1 = 7 Valid Nodes)</div>
      </div>
    `;
  }

  setAnomalyTab(tab) {
    this.anomalyTab = tab;
    
    // Update tab button styles
    const tabs = ['nodes', 'ledger', 'telemetry'];
    tabs.forEach(t => {
      const btn = document.getElementById('tabBtnAnomaly' + t.charAt(0).toUpperCase() + t.slice(1));
      if (btn) {
        if (t === tab) {
          btn.style.color = '#003087';
          btn.style.borderBottom = '2px solid #003087';
          btn.style.fontWeight = '700';
        } else {
          btn.style.color = '#64748b';
          btn.style.borderBottom = '2px solid transparent';
          btn.style.fontWeight = '600';
        }
      }
    });

    this.renderAnomalyTabContent();
  }

  renderAnomalyTabContent() {
    const container = document.getElementById('anomalyTabContent');
    if (!container) return;

    if (this.anomalyTab === 'nodes') {
      this.renderAnomalyNodesTab(container);
    } else if (this.anomalyTab === 'ledger') {
      this.renderAnomalyLedgerTab(container);
    } else if (this.anomalyTab === 'telemetry') {
      this.renderAnomalyTelemetryTab(container);
    }
  }

  renderAnomalyNodesTab(container) {
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #0f172a;">9 Statutory Consensus Nodes (3x3 Authority Grid)</h3>
          <div style="font-size: 0.75rem; color: #64748b;">Independent cryptographic validator nodes validating each organ allocation block.</div>
        </div>
        <span style="font-size: 0.72rem; background: #f1f5f9; padding: 3px 8px; border-radius: 4px; color: #334155; font-family: var(--font-mono);">
          Protocol: PBFT / Raft Multi-Sig
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.85rem;">
    `;

    this.anomalyNodes.forEach(node => {
      const isAgreed = node.vote === 'AGREED';
      const isLeader = node.id === 'NODE-01';

      html += `
        <div style="background: ${isAgreed ? '#ffffff' : '#fff1f2'}; border: 1px solid ${isAgreed ? '#e2e8f0' : '#f87171'}; border-radius: 6px; padding: 0.85rem; box-shadow: 0 1px 2px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: #003087; background: #e0f2fe; padding: 1px 6px; border-radius: 4px;">
                ${node.id}
              </span>
              <span style="font-size: 0.68rem; font-weight: 700; padding: 1px 7px; border-radius: 10px; ${isAgreed ? 'background:#dcfce7; color:#15803d;' : 'background:#fee2e2; color:#b91c1c;'}">
                ${node.vote}
              </span>
            </div>

            <div style="font-weight: 700; font-size: 0.82rem; color: #0f172a; margin-bottom: 0.15rem;">
              ${node.name}
            </div>
            
            <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 0.4rem;">
              Role: <strong style="color:#334155;">${node.role}</strong> · Weight: <strong>${node.weight}</strong>
            </div>
          </div>

          <div style="border-top: 1px dashed ${isAgreed ? '#e2e8f0' : '#fecdd3'}; padding-top: 0.4rem; font-size: 0.68rem; color: #64748b;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>IP: <code>${node.ip}</code></span>
              <span style="color: #0284c7;">Ping: ${node.latency}</span>
            </div>
            <div style="font-family: var(--font-mono); color: #7c3aed; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              Sig: ${node.sig}
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderAnomalyLedgerTab(container) {
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #0f172a;">Blockchain Blocks & Merkle Verification</h3>
          <div style="font-size: 0.75rem; color: #64748b;">Immutable ledger blocks validated across the 9 statutory nodes.</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
    `;

    this.anomalyHistory.forEach(block => {
      const isTampered = block.status === 'TAMPERED';
      const isHealed = block.status === 'HEALED';

      html += `
        <div style="background: ${isTampered ? '#fff1f2' : (isHealed ? '#f0fdf4' : '#ffffff')}; border: 1px solid ${isTampered ? '#f87171' : (isHealed ? '#86efac' : '#e2e8f0')}; border-radius: 6px; padding: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.4rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="background: #003087; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px;">
                BLOCK #${block.blockNumber}
              </span>
              <span style="font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; ${isTampered ? 'background:#fee2e2; color:#b91c1c;' : (isHealed ? 'background:#dcfce7; color:#15803d;' : 'background:#e0f2fe; color:#0369a1;')}">
                ${block.status}
              </span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-size: 0.72rem; color: #64748b;">🕒 ${block.timestamp}</span>
              <button type="button" class="btn-verify-seal" style="padding: 2px 8px; font-size: 0.7rem;" onclick="window.app && window.app.inspectRawBlockPayload(${block.blockNumber})">
                🔍 Inspect Raw Payload
              </button>
            </div>
          </div>

          <div style="font-size: 0.82rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem;">
            ${block.action}
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.5rem 0.75rem; font-family: var(--font-mono); font-size: 0.72rem; display: flex; flex-direction: column; gap: 0.2rem;">
            <div style="display: flex; justify-content: space-between; overflow: hidden;">
              <span style="color: #64748b;">Current Hash:</span>
              <span style="color: ${isTampered ? '#dc2626' : '#003087'}; font-weight: 700; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 75%;">
                ${block.hash}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; overflow: hidden;">
              <span style="color: #64748b;">Previous Hash:</span>
              <span style="color: #7c3aed; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 75%;">
                ${block.prevHash}
              </span>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  renderAnomalyTelemetryTab(container) {
    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
        <div>
          <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #0f172a;">Live Cryptographic Consensus Telemetry Feed</h3>
          <div style="font-size: 0.75rem; color: #64748b;">Real-time stream of multi-sig rounds, cryptographic proofs, and anomaly alerts.</div>
        </div>
        <button type="button" style="background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;" onclick="window.app && window.app.clearAnomalyTelemetry()">
          Clear Telemetry
        </button>
      </div>

      <div id="anomalyTelemetryLogContainer" style="background: #030712; color: #38bdf8; border: 1px solid #1e293b; border-radius: 6px; padding: 1rem; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 0.78rem; min-height: 320px; max-height: 480px; overflow-y: auto; line-height: 1.6;">
    `;

    this.anomalyAuditLogs.forEach(log => {
      const color = log.level === 'SUCCESS' ? '#4ade80' : (log.level === 'CRITICAL' ? '#f87171' : (log.level === 'WARN' ? '#fbbf24' : '#38bdf8'));
      const badge = log.level === 'SUCCESS' ? '✔ [CONSENSUS]' : (log.level === 'CRITICAL' ? '🚨 [ANOMALY]' : (log.level === 'WARN' ? '⚠️ [WARNING]' : 'ℹ [TELEMETRY]'));

      html += `
        <div style="margin-bottom: 0.4rem; word-break: break-word;">
          <span style="color: #64748b;">[${log.time}]</span>
          <span style="color: ${color}; font-weight: 700; margin: 0 4px;">${badge}</span>
          <span style="color: #f1f5f9;">${log.message}</span>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  clearAnomalyTelemetry() {
    this.anomalyAuditLogs = [
      { time: new Date().toLocaleTimeString(), level: 'INFO', message: 'Telemetry console reset. Awaiting next BFT consensus round.' }
    ];
    this.renderAnomalyTabContent();
    this.showToast('Consensus telemetry log cleared.', 'info');
  }

  renderAnomalyHistorySidebar() {
    const container = document.getElementById('anomalyHistoryListContainer');
    if (!container) return;

    let html = '';
    this.anomalyHistory.forEach(item => {
      const isExpanded = this.expandedAnomalyHistoryId === item.id;
      const isTampered = item.status === 'TAMPERED';
      const isHealed = item.status === 'HEALED';
      const statusBg = isTampered ? '#fee2e2' : (isHealed ? '#dcfce7' : '#e0f2fe');
      const statusColor = isTampered ? '#b91c1c' : (isHealed ? '#15803d' : '#0369a1');

      html += `
        <div style="background: ${isTampered ? '#fff1f2' : (isHealed ? '#f0fdf4' : '#ffffff')}; border: 1px solid ${isTampered ? '#f87171' : (isHealed ? '#86efac' : '#e2e8f0')}; border-radius: 6px; padding: 0.85rem; transition: all 0.2s ease;">
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="background: #003087; color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 1px 6px; border-radius: 4px;">
                #${item.blockNumber}
              </span>
              <span style="background: ${statusBg}; color: ${statusColor}; font-size: 0.65rem; font-weight: 700; padding: 1px 6px; border-radius: 8px;">
                ${item.status}
              </span>
            </div>
            <span style="font-size: 0.68rem; color: #64748b;">${item.computedAt}</span>
          </div>

          <div style="font-size: 0.78rem; font-weight: 600; color: #0f172a; margin-bottom: 0.4rem; line-height: 1.3;">
            ${item.action}
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.35rem 0.5rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-family: var(--font-mono); font-size: 0.68rem; color: #003087; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
              ${item.hash.slice(0, 18)}...${item.hash.slice(-6)}
            </span>
            <button type="button" style="background: transparent; border: none; color: #0284c7; font-size: 0.68rem; cursor: pointer; font-weight: 600; padding: 0 4px;" onclick="window.app && window.app.copyAnomalyHash('${item.hash}')" title="Copy SHA-256 Hash">
              📋 Copy
            </button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.68rem; color: ${item.agreementCount === 9 ? '#16a34a' : '#dc2626'}; font-weight: 700;">
              ✔ ${item.agreementCount}/${item.totalNodes} Nodes Agreed
            </span>
            <button type="button" style="background: transparent; border: none; color: #003087; font-size: 0.7rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 2px;" onclick="window.app && window.app.toggleAnomalyHistoryItem('${item.id}')">
              <span>${isExpanded ? '▲ Hide Nodes' : '▼ View 9 Timestamps'}</span>
            </button>
          </div>

          ${isExpanded ? `
            <div style="margin-top: 0.6rem; border-top: 1px dashed #cbd5e1; padding-top: 0.5rem; max-height: 200px; overflow-y: auto;">
              <div style="font-size: 0.68rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
                Multi-Sig Agreement Timestamps:
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.65rem;">
                <thead>
                  <tr style="color: #64748b; border-bottom: 1px solid #e2e8f0; text-align: left;">
                    <th style="padding: 2px 0;">Node</th>
                    <th style="padding: 2px 0;">Timestamp</th>
                    <th style="padding: 2px 0; text-align: right;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${item.nodeAgreements.map(na => `
                    <tr style="border-bottom: 1px dashed #f1f5f9;">
                      <td style="padding: 2px 0; font-weight: 600; color: #0f172a;">${na.nodeName}</td>
                      <td style="padding: 2px 0; font-family: var(--font-mono); color: #64748b;">${na.timestamp}</td>
                      <td style="padding: 2px 0; text-align: right; font-weight: 700; color: ${na.status === 'AGREED' ? '#16a34a' : '#dc2626'};">
                        ${na.status}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

        </div>
      `;
    });

    container.innerHTML = html;
  }

  toggleAnomalyHistoryItem(id) {
    if (this.expandedAnomalyHistoryId === id) {
      this.expandedAnomalyHistoryId = null;
    } else {
      this.expandedAnomalyHistoryId = id;
    }
    this.renderAnomalyHistorySidebar();
  }

  copyAnomalyHash(hash) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hash).then(() => {
        this.showToast('Block hash copied to clipboard.', 'success');
      }).catch(() => {
        this.showToast('Hash: ' + hash, 'info');
      });
    } else {
      this.showToast('Hash: ' + hash, 'info');
    }
  }

  simulateAnomalyTamper() {
    this.isAnomalyDetected = true;

    // Flip 3 validator nodes to REJECTED (Western ROTTO, Eastern ROTTO, Southern SOTTO)
    this.anomalyNodes.forEach(node => {
      if (node.id === 'NODE-03' || node.id === 'NODE-04' || node.id === 'NODE-07') {
        node.vote = 'REJECTED';
        node.sig = '0x0000000000000000000000000000000000000000000000000000000000000000';
      }
    });

    // Mark active block #108 as TAMPERED
    const topBlock = this.anomalyHistory[0];
    if (topBlock) {
      topBlock.status = 'TAMPERED';
      topBlock.agreementCount = 6;
      topBlock.hash = '0xDEADBEEF92a10e7b5c3f4a9812e6d5b4c3a2f1e0d9c8b7a6f5e4d3c2b1a09999';
      topBlock.nodeAgreements.forEach(na => {
        if (na.nodeId === 'NODE-03' || na.nodeId === 'NODE-04' || na.nodeId === 'NODE-07') {
          na.status = 'REJECTED';
        }
      });
    }

    const now = new Date().toLocaleTimeString();
    this.anomalyAuditLogs.unshift(
      { time: now, level: 'CRITICAL', message: 'BYZANTINE ATTACK SIMULATED: State corruption on Block #108 priority rank.' },
      { time: now, level: 'WARN', message: 'Quorum degraded to 66.7% (6/9 nodes). Supermajority threshold of 67% violated.' },
      { time: now, level: 'CRITICAL', message: 'Western ROTTO, Southern SOTTO, Eastern ROTTO rejected forged block signature.' }
    );

    // Trigger audio beep alert
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}

    this.showToast('🚨 BYZANTINE FAULT DETECTED: 3 Authority Nodes rejected state tamper!', 'error');
    this.renderAnomalyScanner();
  }

  restoreAnomalyConsensus() {
    this.isAnomalyDetected = false;

    // Restore all 9 nodes to AGREED with valid signatures
    this.anomalyNodes = [
      { id: 'NODE-01', name: 'National Central Spine (NOTTO Apex)', ip: '10.0.1.1', vote: 'AGREED', status: 'ONLINE', latency: '12ms', weight: '20%', sig: '0x8f7a90b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d719e0', isByzantine: false, role: 'Leader / Proposer' },
      { id: 'NODE-02', name: 'AIIMS New Delhi Central Spine', ip: '10.0.2.14', vote: 'AGREED', status: 'ONLINE', latency: '19ms', weight: '10%', sig: '0x3c4b5a6978102f3e4d5c6b7a8901e2f3a4b5c6d7e8f901a2b3c4d5e6f7e89a', isByzantine: false, role: 'Apex Hospital Validator' },
      { id: 'NODE-03', name: 'ROTTO Western Authority (Mumbai KEM)', ip: '10.0.3.8', vote: 'AGREED', status: 'ONLINE', latency: '24ms', weight: '10%', sig: '0x9a12bc34de56f7890123456789abcdef0123456789abcdef012345678977fe', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-04', name: 'SOTTO Southern Node (Chennai Apex)', ip: '10.0.4.2', vote: 'AGREED', status: 'ONLINE', latency: '31ms', weight: '10%', sig: '0x712abb149023456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-05', name: 'DigiLocker ABHA Gateway (UIDAI / NHA)', ip: '10.0.5.55', vote: 'AGREED', status: 'ONLINE', latency: '16ms', weight: '10%', sig: '0xee8149cb0123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Identity Anchor' },
      { id: 'NODE-06', name: 'PGIMER Northern Node (Chandigarh)', ip: '10.0.6.19', vote: 'AGREED', status: 'ONLINE', latency: '22ms', weight: '10%', sig: '0x45a9008f0123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-07', name: 'ROTTO Eastern Node (IPGMER Kolkata)', ip: '10.0.7.41', vote: 'AGREED', status: 'ONLINE', latency: '28ms', weight: '10%', sig: '0xbf93e12a0123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-08', name: 'SOTTO Central Regional Node (Bhopal)', ip: '10.0.8.12', vote: 'AGREED', status: 'ONLINE', latency: '25ms', weight: '10%', sig: '0x10cd88630123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Regional Authority' },
      { id: 'NODE-09', name: 'ICMR Bioethics Oversight Spine', ip: '10.0.9.99', vote: 'AGREED', status: 'ONLINE', latency: '18ms', weight: '10%', sig: '0x62ef99110123456789abcdef0123456789abcdef0123456789abcdef01234567', isByzantine: false, role: 'Ethics & Compliance' }
    ];

    // Mark active block #108 as HEALED
    const topBlock = this.anomalyHistory[0];
    if (topBlock) {
      topBlock.status = 'HEALED';
      topBlock.agreementCount = 9;
      topBlock.hash = '0x8f4d92a10e7b5c3f4a9812e6d5b4c3a2f1e0d9c8b7a6f5e4d3c2b1a098765432';
      topBlock.nodeAgreements.forEach(na => {
        na.status = 'AGREED';
      });
    }

    const now = new Date().toLocaleTimeString();
    this.anomalyAuditLogs.unshift(
      { time: now, level: 'SUCCESS', message: 'BFT SELF-HEALING COMPLETE: Canonical Merkle branch broadcasted from Central Spine.' },
      { time: now, level: 'SUCCESS', message: 'Quorum restored to 100% (9/9 nodes). Ledger integrity verified and re-anchored.' }
    );

    this.showToast('🛡️ BFT Consensus Restored: 9/9 Authority Nodes re-aligned & state healed!', 'success');
    this.renderAnomalyScanner();
  }

  inspectRawBlockPayload(blockNum) {
    const block = this.anomalyHistory.find(b => b.blockNumber === blockNum) || this.anomalyHistory[0];
    const modal = document.getElementById('modalRawBlockPayload');
    const title = document.getElementById('modalRawBlockTitle');
    const viewer = document.getElementById('rawBlockJsonViewer');

    if (!modal || !viewer) return;

    if (title) {
      title.textContent = `📦 Block #${block.blockNumber} - Cryptographic Payload`;
    }

    const payloadObj = {
      block_header: {
        block_height: block.blockNumber,
        epoch_timestamp: block.timestamp,
        computed_at: block.computedAt,
        status: block.status,
        algorithm: 'Keccak-256 / SHA-256 PBFT',
        quorum_agreement: `${block.agreementCount}/${block.totalNodes} Nodes`
      },
      cryptographic_hashes: {
        current_block_hash: block.hash,
        previous_block_hash: block.prevHash,
        merkle_root: '0x8f4d92a10e7b5c3f4a9812e6d5b4c3a2f1e0d9c8b7a6f5e4d3c2b1a098765432',
        state_commitment_root: '0xa1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0'
      },
      statutory_action: block.action,
      statutory_compliance: 'Transplantation of Human Organs Act (THOA) 1994 & NOTTO Protocol 2026',
      multi_sig_authority_signatures: block.nodeAgreements
    };

    this.activeRawBlockJson = JSON.stringify(payloadObj, null, 2);
    viewer.textContent = this.activeRawBlockJson;
    modal.classList.remove('hidden');
  }

  closeRawBlockModal() {
    const modal = document.getElementById('modalRawBlockPayload');
    if (modal) modal.classList.add('hidden');
  }

  copyActiveRawBlockJson() {
    if (!this.activeRawBlockJson) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.activeRawBlockJson).then(() => {
        this.showToast('Raw Block JSON copied to clipboard.', 'success');
      }).catch(() => {
        this.showToast('Copied JSON payload.', 'info');
      });
    }
  }

  /**
   * Autonomous Agent Trigger Hooked on Every Donor Registration
   */
  async triggerAutonomousAiAgent(donorData) {
    console.log('[Autonomous AI Agent] Registration detected. Initiating pipeline for:', donorData.donorId);
    try {
      const response = await fetch('/api/agent/run-organ-donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: donorData.donorId,
          fullName: donorData.fullName || 'Registered Donor',
          age: donorData.age,
          bloodGroup: donorData.bloodGroup,
          organ: donorData.organ,
          region: donorData.region,
          organCondition: donorData.organCondition || 'Clinical Perfusion Standard',
          hospitalName: donorData.hospital || 'AIIMS New Delhi'
        })
      });
      const report = await response.json();
      console.log('[Autonomous AI Agent] Pipeline Execution Report:', report);
    } catch (err) {
      console.warn('[Autonomous AI Agent] Background execution note:', err.message);
    }
  }

}
// Global initialization - resilient to async/defer and already-loaded states
function initOrganTwinApp() {
  if (!window.app) {
    window.app = new OrganTwinApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initOrganTwinApp);
} else {
  initOrganTwinApp();
}

// Global safety timeout to ensure preloader is never stuck
setTimeout(() => {
  const p = document.getElementById('preloader');
  if (p && p.style.display !== 'none') {
    p.style.opacity = '0';
    setTimeout(() => { 
      p.style.display = 'none'; 
      if (window.app && window.app.initCranialNeuralCanvas) {
        window.app.initCranialNeuralCanvas();
      }
    }, 250);
  }
}, 4000);
