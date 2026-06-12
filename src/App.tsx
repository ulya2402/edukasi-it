import React, { useState, useEffect } from 'react';
import { 
  Book, Brain, Code, Layers, MapPin, FileText, 
  CheckCircle, Menu, X, Play, ArrowRight,
  ArrowDown, CornerDownLeft, List, Search,
  Terminal, User
} from 'lucide-react';

// --- STYLES & TAILWIND INJECTION ---
const injectStyles = () => {
  if (!document.getElementById('tailwind-cdn')) {
    const script = document.createElement('script');
    script.id = 'tailwind-cdn';
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
  }

  if (!document.getElementById('app-custom-styles')) {
    const style = document.createElement('style');
    style.id = 'app-custom-styles';
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      :root {
        --bg-base: #FAFAFA;
        --text-main: #09090B;
        --text-muted: #71717A;
        --border-light: #E4E4E7;
        --glass-bg: rgba(255, 255, 255, 0.7);
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: var(--bg-base);
        color: var(--text-main);
        margin: 0;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
      }

      .bg-ambient {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: -1;
        background-image: radial-gradient(#E4E4E7 1px, transparent 1px);
        background-size: 24px 24px;
        background-position: center center;
      }
      
      .bg-ambient::before {
        content: '';
        position: absolute;
        top: -20%; left: -10%; width: 50vw; height: 50vw;
        background: radial-gradient(circle, rgba(228,228,231,0.8) 0%, rgba(250,250,250,0) 70%);
        filter: blur(80px);
      }

      .bg-ambient::after {
        content: '';
        position: absolute;
        bottom: -20%; right: -10%; width: 60vw; height: 60vw;
        background: radial-gradient(circle, rgba(212,212,216,0.6) 0%, rgba(250,250,250,0) 70%);
        filter: blur(100px);
      }

      .glass-card {
        background: var(--glass-bg);
        backdrop-filter: blur(20px) saturate(160%);
        -webkit-backdrop-filter: blur(20px) saturate(160%);
        border: 1px solid var(--border-light);
        border-radius: 24px;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .glass-card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.04);
        background: rgba(255, 255, 255, 0.9);
      }

      .animate-in {
        animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        will-change: transform, opacity;
        opacity: 0;
      }

      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .delay-1 { animation-delay: 100ms; }
      .delay-2 { animation-delay: 200ms; }
      .delay-3 { animation-delay: 300ms; }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #D4D4D8; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #A1A1AA; }

      .tab-container {
        background: rgba(228, 228, 231, 0.4);
        border-radius: 12px;
        padding: 4px;
      }
    `;
    document.head.appendChild(style);
  }
};

// --- DATA & CONTENT ---
const SECTIONS = [
  { id: 'home', title: 'Pendahuluan', icon: Book },
  { id: 'pengertian', title: 'Konsep Algoritma', icon: Brain },
  { id: 'alasan', title: 'Alasan Logis', icon: MapPin },
  { id: 'program', title: 'Sistem & Bahasa', icon: Code },
  { id: 'penyelesaian', title: 'Pola Pikir', icon: Layers },
  { id: 'ekspresi', title: 'Cara Penulisan', icon: FileText },
  { id: 'pedoman', title: 'Pedoman Standar', icon: CheckCircle },
  { id: 'struktur', title: 'Struktur Dasar', icon: List },
  { id: 'glosarium', title: 'Kamus Istilah', icon: Search },
];

const GLOSSARY = [
  { term: "CPU (Central Processing Unit)", desc: "Bagian utama komputer yang berfungsi sebagai 'otak'. Tugasnya menerima, menerjemahkan, dan menjalankan semua instruksi dari program." },
  { term: "Kecerdasan Buatan (AI)", desc: "Sistem komputer yang dilatih agar memiliki kemampuan layaknya manusia: mengenali pola, belajar dari pengalaman, dan mengambil keputusan sendiri." },
  { term: "Mnemonik", desc: "Sebuah teknik 'jembatan keledai'. Cara kreatif untuk membantu otak kita mengingat informasi kompleks dengan lebih mudah." },
  { term: "Pseudocode", desc: "Cara menuliskan langkah-langkah program menggunakan bahasa yang mirip bahasa manusia, agar mudah dibaca sebelum diubah menjadi kode bahasa pemrograman asli." },
  { term: "Flowchart", desc: "Bagan alir. Gambaran visual menggunakan bentuk-bentuk geometris (kotak, oval, belah ketupat) untuk menjelaskan urutan langkah sebuah sistem." }
];

type QuizQuestion = { q: string, options: string[], a: number };

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  tf1: [
    { q: "Suatu upaya dengan urutan operasi yang disusun secara logis dan sistematis untuk menyelesaikan masalah adalah...", options: ["Logika pemrograman", "Algoritma", "Program komputer", "Logika informatika"], a: 1 },
    { q: "Algoritma adalah suatu metode khusus untuk menyelesaikan suatu masalah, ini adalah definisi menurut...", options: ["Abu Ja'far Al-Khawarizmi", "Donald E. Knuth", "David Bolton", "Andrey Markov"], a: 0 },
    { q: "Jika pengembang tidak mempertimbangkan ruang memori yang terkuras, ia mengabaikan prinsip...", options: ["Abstraksi", "Efisiensi", "Reusability", "Semua benar"], a: 1 },
    { q: "Bahasa pemrograman tingkat tinggi dibuat agar...", options: ["Langsung dimengerti mesin", "Sulit diretas", "Menyerupai bahasa manusia", "Hanya menggunakan angka 0 dan 1"], a: 2 },
    { q: "Programmer pertama di dunia yang menyusun rencana mesin analitikal adalah...", options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "Donald E. Knuth"], a: 2 },
  ],
  tf2: [
    { q: "Struktur dasar yang menyelesaikan instruksi baris demi baris tanpa ada yang diloncati disebut...", options: ["Perulangan", "Skuensial", "Seleksi", "Variabel"], a: 1 },
    { q: "Sebuah algoritma yang memiliki kondisi 'Jika Benar lakukan A, Jika Salah lakukan B' menggunakan struktur...", options: ["Seleksi", "Skuensial", "Perulangan", "Abstraksi"], a: 0 },
    { q: "Cara paling efektif untuk mencetak angka 1 sampai 1.000 di layar komputer adalah menggunakan struktur...", options: ["Skuensial", "Seleksi", "Seleksi dan Skuensial", "Perulangan"], a: 3 },
    { q: "Jika C = 5, kemudian ada instruksi perulangan C = C + 1 sebanyak 5 kali. Berapakah nilai akhir C?", options: ["9", "10", "11", "12"], a: 1 },
    { q: "Struktur yang mencegah programmer menulis ribuan baris kode yang sama secara manual adalah...", options: ["Skuensial", "Abstraksi", "Perulangan", "Seleksi"], a: 2 },
  ]
};

// --- REUSABLE COMPONENTS ---
const Card = ({ children, className = "", delay = "" }: { children: React.ReactNode, className?: string, delay?: string }) => (
  <div className={`glass-card glass-card-hover p-8 animate-in ${delay} ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-14 animate-in">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">{title}</h2>
    <p className="text-[#71717A] text-lg leading-relaxed max-w-2xl">{subtitle}</p>
  </div>
);

// --- SECTIONS COMPONENTS ---
const HomeSection = ({ onNavigate }: { onNavigate: (id: string) => void }) => (
  <div className="flex flex-col justify-center min-h-[75vh] max-w-4xl pt-10">
    <div className="animate-in mb-6">
      <span className="px-4 py-2 rounded-full bg-black text-white text-xs font-semibold tracking-widest uppercase">
        Modul 1 • Pengantar
      </span>
    </div>
    
    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-8 animate-in delay-1 leading-tight">
      Seni Berpikir <br />
      Sistematis.
    </h1>
    
    <p className="text-xl text-[#71717A] mb-14 animate-in delay-2 max-w-2xl leading-relaxed">
      Memahami pola pikir fundamental di balik semua teknologi modern. Sebuah panduan ramah awam untuk memahami bagaimana komputer memecahkan masalah.
    </p>

    <div className="animate-in delay-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      <button 
        onClick={() => onNavigate('pengertian')}
        className="glass-card p-6 flex items-center justify-between group text-left"
      >
        <div className="flex items-center gap-5">
          <div className="bg-black/5 p-3 rounded-2xl text-black">
            <Brain size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">Mulai Membaca</h3>
            <p className="text-sm text-[#71717A]">Pahami Konsep Dasar</p>
          </div>
        </div>
        <ArrowRight className="text-[#A1A1AA] group-hover:text-black transition-colors" />
      </button>

      <button 
        onClick={() => onNavigate('glosarium')}
        className="glass-card p-6 flex items-center justify-between group text-left border-transparent"
      >
        <div className="flex items-center gap-5">
          <div className="bg-black/5 p-3 rounded-2xl text-black">
            <Search size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">Cari Istilah</h3>
            <p className="text-sm text-[#71717A]">Kamus Kata Sulit</p>
          </div>
        </div>
        <ArrowRight className="text-[#A1A1AA] group-hover:text-black transition-colors" />
      </button>
    </div>
  </div>
);

const PengertianSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Konsep Algoritma" 
      subtitle="Pada dasarnya, algoritma hanyalah urutan langkah-langkah logis untuk menyelesaikan masalah tertentu. Tidak lebih dari sebuah 'resep'."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h3 className="font-bold text-lg mb-2 text-black">Abu Ja'far Al-Khawarizmi</h3>
        <p className="text-[#71717A] text-sm leading-relaxed">"Sebuah metode khusus untuk menyelesaikan suatu permasalahan."</p>
      </Card>
      <Card delay="delay-1">
        <h3 className="font-bold text-lg mb-2 text-black">Andrey A. Markov</h3>
        <p className="text-[#71717A] text-sm leading-relaxed">"Keputusan tepat untuk merumuskan proses yang mengarahkan data awal menjadi hasil akhir."</p>
      </Card>
    </div>

    <div className="glass-card p-8 md:p-12 mt-12 animate-in delay-2">
      <h3 className="text-xl font-bold mb-6 text-black border-b border-black/10 pb-4">Analogi Nyata: Menuju Bogor</h3>
      <p className="text-[#71717A] mb-8">
        Untuk mencapai satu tujuan, ada banyak jalur (algoritma) yang bisa dipilih. Masing-masing memiliki efisiensi waktu dan biaya yang berbeda.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-black/5">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">1. Naik Kereta</h4>
          <ul className="space-y-2 text-sm text-[#71717A]">
            <li>• Berangkat ke stasiun</li>
            <li>• Beli tiket & masuk</li>
            <li>• Waktu pasti, biaya pas</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-black/5 border border-black/10">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">2. Naik Taksi</h4>
          <ul className="space-y-2 text-sm text-[#71717A]">
            <li>• Pesan lewat aplikasi</li>
            <li>• Lewat jalan tol</li>
            <li>• Tercepat, namun mahal</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-black/5">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">3. Naik Angkot</h4>
          <ul className="space-y-2 text-sm text-[#71717A]">
            <li>• Tunggu di pangkalan</li>
            <li>• Ngetem sampai penuh</li>
            <li>• Paling murah, tapi lama</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const AlasanSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Mengapa Harus Ada Algoritma?" 
      subtitle="Perusahaan besar bersedia membayar mahal untuk sebuah langkah kerja (algoritma) yang tepat karena tiga alasan utama."
    />

    <div className="grid grid-cols-1 gap-6">
      <Card className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-14 h-14 bg-black rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Efisiensi Tingkat Tinggi</h3>
          <p className="text-[#71717A] leading-relaxed">
            Mendapatkan hasil yang benar saja tidak cukup. Algoritma harus mampu memproses data dengan <b>sangat cepat (Waktu)</b> dan menggunakan spesifikasi <b>seminimal mungkin (Memori)</b>.
          </p>
        </div>
      </Card>

      <Card delay="delay-1" className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-14 h-14 bg-black rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Menyederhanakan yang Rumit (Abstraksi)</h3>
          <p className="text-[#71717A] leading-relaxed">
            Mengurai masalah yang terlihat mustahil atau sangat kompleks menjadi tahapan-tahapan kecil yang jelas, masuk akal, dan mudah diikuti oleh otak manusia.
          </p>
        </div>
      </Card>

      <Card delay="delay-2" className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-14 h-14 bg-black rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Dapat Dipakai Berulang (Reusability)</h3>
          <p className="text-[#71717A] leading-relaxed">
            Algoritma adalah konsep pola pikir, bukan sekadar kode. Pola yang bagus bisa diubah ke berbagai bahasa pemrograman dan dipakai berkali-kali untuk proyek yang berbeda.
          </p>
        </div>
      </Card>
    </div>
  </div>
);

const ProgramBahasaSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Sistem & Bahasa" 
      subtitle="Komputer adalah mesin yang patuh, tapi kita butuh 'penerjemah' dan 'jembatan' agar perintah kita dapat dijalankan."
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
      <div className="p-8 rounded-3xl bg-white border border-black/10 shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-black mb-2">Apa itu Programmer?</h3>
          <p className="text-[#71717A] text-sm leading-relaxed">
            Orang profesional yang bertanggung jawab merancang dan menyusun algoritma logika, lalu menerjemahkannya agar bisa dijalankan oleh mesin (komputer).
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-black/10 shadow-sm flex flex-col gap-4 delay-1 animate-in">
        <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
          <Terminal size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-black mb-2">Bahasa Pemrograman?</h3>
          <p className="text-[#71717A] text-sm leading-relaxed">
            Sebuah "Bahasa Formal" (set instruksi standar) yang dipakai oleh Programmer untuk berkomunikasi dan memberi perintah langsung kepada komputer.
          </p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 delay-2 animate-in">
      <div className="p-6 rounded-2xl border-l-4 border-l-black bg-black/5">
        <h3 className="font-bold text-black mb-2">1. Sistem Operasi (OS)</h3>
        <p className="text-[#71717A] text-sm leading-relaxed mb-4">Program pondasi yang mengelola seluruh perangkat keras (layar, keyboard) dan memberi ruang agar program lain bisa berjalan.</p>
        <span className="text-xs font-semibold px-3 py-1.5 bg-white rounded-full text-black shadow-sm">Windows, macOS, Linux</span>
      </div>
      <div className="p-6 rounded-2xl border-l-4 border-l-black bg-black/5">
        <h3 className="font-bold text-black mb-2">2. Program Aplikasi</h3>
        <p className="text-[#71717A] text-sm leading-relaxed mb-4">Program buatan manusia yang berjalan menumpang di atas Sistem Operasi (OS) untuk melakukan pekerjaan spesifik.</p>
        <span className="text-xs font-semibold px-3 py-1.5 bg-white rounded-full text-black shadow-sm">Word, WhatsApp, Chrome</span>
      </div>
    </div>

    <Card delay="delay-3">
      <h3 className="text-lg font-bold text-black mb-8 border-b border-black/10 pb-4">Tingkatan Bahasa Pemrograman</h3>
      <div className="space-y-6">
        <div className="flex gap-5">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
          <div>
            <h4 className="font-bold text-black mb-1">Tingkat Rendah (Bahasa Mesin)</h4>
            <p className="text-sm text-[#71717A]">Instruksi murni berupa deretan angka <code>0</code> dan <code>1</code>. Paling sulit dibaca manusia, tapi bisa langsung diproses mesin tanpa diterjemahkan.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
          <div>
            <h4 className="font-bold text-black mb-1">Tingkat Menengah (Assembly)</h4>
            <p className="text-sm text-[#71717A]">Mulai menggunakan kode singkatan logis seperti <code>MOV</code> (Move), <code>SUB</code> (Subtract). Masih cukup kaku namun lebih baik dari kode biner.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
          <div>
            <h4 className="font-bold text-black mb-1">Tingkat Tinggi</h4>
            <p className="text-sm text-[#71717A]">Paling modern dan dominan dipakai saat ini. Kosakatanya menyerupai bahasa manusia (Bahasa Inggris). Contoh: <code>Java, Python, PHP</code>.</p>
          </div>
        </div>
      </div>
    </Card>

    <div className="glass-card p-6 md:p-8 animate-in delay-3 bg-black text-white flex flex-col md:flex-row gap-6 items-center">
      <div className="p-4 bg-white/10 rounded-2xl shrink-0"><Code size={32}/></div>
      <p className="text-sm leading-relaxed text-center md:text-left">
        <span className="font-bold text-white text-base block mb-1">Sejarah Singkat:</span> 
        Tahukah Anda? Programmer pertama di dunia adalah seorang wanita bernama <b>Ada Lovelace</b> pada tahun 1843. Ia menyusun rencana komputasi yang dinobatkan sebagai cikal bakal program lunak modern.
      </p>
    </div>
  </div>
);

const PenyelesaianSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Pola Pikir Kreator" 
      subtitle="Membangun sebuah aplikasi yang andal harus selalu melalui 3 tahapan baku ini secara berurutan."
    />

    <div className="flex flex-col gap-4 relative">
      <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-black/10 z-0 hidden md:block"></div>
      
      {[
        { step: 1, title: "Menganalisa & Merancang Algoritma", desc: "Mencari inti masalah, menentukan apa yang harus dimasukkan (Input) dan apa yang diharapkan keluar (Output). Kemudian, menulis urutan langkah penyelesaiannya." },
        { step: 2, title: "Menuangkan ke dalam Kode (Coding)", desc: "Menerjemahkan urutan langkah yang sudah dirancang tadi ke dalam Bahasa Pemrograman pilihan (misal: Java, Python) agar dapat dieksekusi oleh mesin." },
        { step: 3, title: "Menguji dan Menjalankan", desc: "Aplikasi yang sudah ditulis harus dicoba (dikompilasi) berkali-kali untuk menemukan kesalahan penulisan (bug), lalu diperbaiki sebelum dirilis ke publik." }
      ].map((item, idx) => (
        <div key={idx} className="glass-card p-6 md:p-8 flex items-start gap-6 z-10 animate-in" style={{animationDelay: `${idx * 150}ms`}}>
          <div className="w-14 h-14 rounded-full bg-white border border-black/10 flex items-center justify-center font-bold text-black shadow-sm shrink-0">
            0{item.step}
          </div>
          <div className="pt-3">
            <h3 className="font-bold text-lg text-black mb-2">{item.title}</h3>
            <p className="text-sm text-[#71717A] leading-relaxed">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EkspresiSection = () => {
  const [activeTab, setActiveTab] = useState('bahasa');
  
  const tabs = [
    { id: 'bahasa', label: 'Bahasa Biasa' },
    { id: 'pseudo', label: 'Pseudocode' },
    { id: 'java', label: 'Kode Asli (Java)' }
  ];

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Cara Penulisan" 
        subtitle="Bagaimana cara memberi instruksi kepada komputer untuk mencari angka paling besar dari 3 angka? Berikut perbandingannya."
      />

      <div className="glass-card overflow-hidden animate-in">
        <div className="p-4 border-b border-black/10 flex justify-center bg-black/5">
          <div className="tab-container flex w-full max-w-md">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-[#71717A] hover:text-black'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-8 md:p-12 min-h-[350px] flex items-center justify-center bg-white">
          {activeTab === 'bahasa' && (
            <div className="space-y-4 text-black animate-in text-sm md:text-base w-full max-w-xl">
              <p className="font-medium text-[#71717A]">Langkah-langkah:</p>
              <ul className="space-y-3">
                <li>1. Mulai.</li>
                <li>2. Siapkan 3 angka di pikiran kita.</li>
                <li>3. Untuk awalan, anggap angka pertama adalah yang <b>terbesar</b>.</li>
                <li>4. Bandingkan angka kedua dengan angka pertama. Jika lebih besar, maka angka kedua jadi yang terbesar baru.</li>
                <li>5. Jika tidak, bandingkan angka ketiga. Jika ia lebih besar, maka catat sebagai terbesar.</li>
                <li>6. Tampilkan angka terbesarnya. Selesai.</li>
              </ul>
            </div>
          )}

          {activeTab === 'pseudo' && (
            <pre className="font-mono text-sm md:text-base text-black w-full max-w-xl animate-in whitespace-pre-wrap bg-black/5 p-6 rounded-2xl border border-black/10">
              <code>{`1  Mulai
2  Input ang1, ang2, ang3
3  Terbesar = ang1

4  Jika ang2 > Terbesar maka
5      Terbesar = ang2
6  Jika tidak, cek jika ang3 > Terbesar
7      Terbesar = ang3

8  Tampilkan Terbesar
9  Selesai`}</code>
            </pre>
          )}

          {activeTab === 'java' && (
            <pre className="font-mono text-sm md:text-base text-white bg-black w-full max-w-xl animate-in whitespace-pre-wrap p-6 rounded-2xl shadow-xl">
              <code>{`public class CariTerbesar {
  public static void main(String[] args) {
    int ang1 = 10, ang2 = 15, ang3 = 5;
    int terbesar = ang1;

    if (ang2 > terbesar) {
        terbesar = ang2;
    } else if (ang3 > terbesar) {
        terbesar = ang3;
    }

    System.out.println("Terbesar: " + terbesar);
  }
}`}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

const PedomanSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Pedoman Standar" 
      subtitle="Menurut ahli (Ellis Horowitz & Sartaj Sahni), algoritma yang valid dan tidak bermasalah harus memenuhi 5 kriteria mutlak ini."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: "Input (Masukan)", desc: "Boleh tidak ada masukan awal, atau bisa memiliki banyak masukan sekaligus dari pengguna." },
        { title: "Output (Keluaran)", desc: "Wajib menghasilkan minimal satu solusi, kesimpulan, atau hasil akhir yang dituju." },
        { title: "Definiteness (Pasti)", desc: "Tiap instruksi harus lugas, tegas, jelas, dan tidak memiliki arti ganda (ambigu)." },
        { title: "Finiteness (Ada Batas)", desc: "Bagaimanapun alur prosesnya, program wajib memiliki titik henti (selesai)." },
        { title: "Effectiveness (Efektif)", desc: "Setiap operasinya harus sesederhana mungkin dan selesai dalam waktu yang masuk akal." }
      ].map((item, idx) => (
        <Card key={idx} delay={`delay-${idx % 3}`} className={idx === 4 ? "md:col-span-2" : ""}>
          <h3 className="font-bold text-black mb-2">{item.title}</h3>
          <p className="text-[#71717A] text-sm leading-relaxed">{item.desc}</p>
        </Card>
      ))}
    </div>

    <div className="mt-16 animate-in delay-2 border-t border-black/10 pt-10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-black mb-2">Mengapa Awam Perlu Tahu?</h3>
        <p className="text-[#71717A]">Mempelajari alur ini bukan sekadar untuk menjadi programmer. Dampaknya sangat besar di kehidupan sehari-hari.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-black/10 flex items-start gap-4 hover:border-black transition-colors shadow-sm">
           <div className="p-2 bg-black/5 rounded-lg text-black shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-black mb-1">Berpikir Logis & Runtut</h4>
             <p className="text-xs text-[#71717A] leading-relaxed">Melatih otak untuk selalu menyusun urutan langkah secara terstruktur, tidak terbolak-balik atau melompat-lompat saat menghadapi sebuah masalah.</p>
           </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white border border-black/10 flex items-start gap-4 hover:border-black transition-colors shadow-sm">
           <div className="p-2 bg-black/5 rounded-lg text-black shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-black mb-1">Ketelitian Tingkat Tinggi</h4>
             <p className="text-xs text-[#71717A] leading-relaxed">Membiasakan diri memeriksa ulang dan menganalisis secara cermat ketika sebuah tugas (atau kode) ternyata tidak berjalan sesuai harapan.</p>
           </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-black/10 flex items-start gap-4 hover:border-black transition-colors shadow-sm">
           <div className="p-2 bg-black/5 rounded-lg text-black shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-black mb-1">Insting Problem Solving</h4>
             <p className="text-xs text-[#71717A] leading-relaxed">Meningkatkan kemampuan memprediksi hambatan yang mungkin muncul dan secara otomatis memikirkan solusi cadangan secara sistematis.</p>
           </div>
        </div>

        <div className="p-6 rounded-2xl bg-black text-white border border-black/10 flex items-start gap-4 shadow-sm">
           <div className="p-2 bg-white/20 rounded-lg text-white shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-white mb-1">Keteraturan Bekerja</h4>
             <p className="text-xs text-[#D4D4D8] leading-relaxed">Memahami bahwa semua aplikasi raksasa lahir dari instruksi kecil yang disiplin. Ini melatih kita bekerja secara bertahap namun pasti.</p>
           </div>
        </div>
      </div>
    </div>
  </div>
);

const StrukturSection = () => {
  const [activeTab, setActiveTab] = useState('sequential');
  
  return (
    <div className="space-y-12">
      <SectionTitle 
        title="3 Struktur Dasar" 
        subtitle="Sistem perbankan, aplikasi chat, hingga game 3D paling kompleks, semuanya dibangun hanya dari kombinasi tiga blok logika dasar ini."
      />

      <div className="flex flex-col md:flex-row gap-3 justify-center mb-10 animate-in">
        {[
          {id: 'sequential', label: '1. Skuensial (Urut)'},
          {id: 'selection', label: '2. Seleksi (Pilihan)'},
          {id: 'looping', label: '3. Perulangan (Loop)'}
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === t.id ? 'bg-black text-white shadow-lg' : 'bg-black/5 text-[#71717A] hover:bg-black/10 hover:text-black'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in delay-1">
        
        {/* Left: UI Timeline Flow Diagram */}
        <div className="lg:col-span-2 glass-card p-8 flex flex-col items-center justify-center min-h-[400px] bg-white">
          
          {activeTab === 'sequential' && (
            <div className="w-full max-w-[200px] flex flex-col items-center animate-in space-y-2">
              <div className="px-6 py-2 rounded-full border border-black/20 text-xs font-bold bg-black/5">Mulai</div>
              <ArrowDown size={16} className="text-[#A1A1AA]"/>
              <div className="w-full p-3 rounded-xl border border-black/20 text-sm text-center font-medium">Buka Botol</div>
              <ArrowDown size={16} className="text-[#A1A1AA]"/>
              <div className="w-full p-3 rounded-xl border border-black/20 text-sm text-center font-medium">Tuang Air</div>
              <ArrowDown size={16} className="text-[#A1A1AA]"/>
              <div className="w-full p-3 rounded-xl border border-black/20 text-sm text-center font-medium">Minum</div>
              <ArrowDown size={16} className="text-[#A1A1AA]"/>
              <div className="px-6 py-2 rounded-full border border-black/20 text-xs font-bold bg-black/5">Selesai</div>
            </div>
          )}
          
          {activeTab === 'selection' && (
            <div className="w-full max-w-[260px] flex flex-col items-center animate-in">
              <div className="px-6 py-2 rounded-full border border-black/20 text-xs font-bold bg-black/5 mb-2">Mulai</div>
              <ArrowDown size={16} className="text-[#A1A1AA] mb-2"/>
              
              <div className="w-full p-4 rounded-xl border-2 border-black bg-black text-white text-sm text-center font-bold relative mb-4">
                Apakah Hujan?
              </div>
              
              <div className="flex w-full justify-between items-start pt-2 border-t-2 border-[#E4E4E7] relative mt-2">
                <div className="absolute top-0 left-[20%] w-0.5 h-4 bg-[#E4E4E7]"></div>
                <div className="absolute top-0 right-[20%] w-0.5 h-4 bg-[#E4E4E7]"></div>
                
                <div className="w-[45%] flex flex-col items-center pt-4">
                  <span className="text-xs font-bold mb-2">YA</span>
                  <div className="w-full p-3 rounded-xl border border-black/20 text-xs text-center">Bawa Payung</div>
                </div>
                <div className="w-[45%] flex flex-col items-center pt-4">
                  <span className="text-xs font-bold mb-2 text-[#A1A1AA]">TIDAK</span>
                  <div className="w-full p-3 rounded-xl border border-black/20 text-xs text-center text-[#71717A]">Bawa Topi</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'looping' && (
            <div className="w-full max-w-[200px] flex flex-col items-center animate-in relative">
              <div className="px-6 py-2 rounded-full border border-black/20 text-xs font-bold bg-black/5 mb-3">Mulai</div>
              
              <div className="relative w-full border border-black rounded-2xl p-4 bg-black/5 flex flex-col items-center">
                <div className="w-full p-3 rounded-xl bg-white border border-black/20 text-xs text-center font-bold shadow-sm mb-4 z-10 relative">
                  Pukul Paku
                </div>
                
                <div className="text-xs font-bold mb-1">Sudah Tertancap?</div>
                <div className="flex w-full justify-between mt-2">
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] text-[#A1A1AA]">Belum</span>
                      <CornerDownLeft size={16} className="text-[#A1A1AA] mt-1 rotate-90"/>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold">Sudah</span>
                      <ArrowDown size={16} className="text-black mt-1"/>
                   </div>
                </div>
              </div>
              
              <div className="px-6 py-2 rounded-full border border-black/20 text-xs font-bold bg-black/5 mt-3">Selesai</div>
            </div>
          )}
        </div>

        {/* Right: Explanation */}
        <div className="lg:col-span-3 glass-card p-8 flex flex-col justify-center">
          {activeTab === 'sequential' && (
            <div className="animate-in">
              <h3 className="text-2xl font-bold text-black mb-4">Garis Lurus Tanpa Henti</h3>
              <p className="text-[#71717A] leading-relaxed mb-6">
                Tipe kode yang paling jujur. Mesin membaca instruksi dari baris paling atas, lalu turun satu per satu hingga selesai. Tidak ada baris yang dilewati. Cocok untuk operasi matematika sederhana.
              </p>
              <div className="p-4 bg-black/5 rounded-xl border border-black/10 text-sm">
                <strong className="text-black">Cara Awam Memahami:</strong> Seperti membaca resep masakan mi instan. Semua langkah harus urut dari masak air sampai menuang bumbu.
              </div>
            </div>
          )}
          
          {activeTab === 'selection' && (
            <div className="animate-in">
              <h3 className="text-2xl font-bold text-black mb-4">Pembuat Keputusan (Percabangan)</h3>
              <p className="text-[#71717A] leading-relaxed mb-6">
                Ini yang membuat komputer seolah 'pintar'. Ia diajari untuk memeriksa suatu <b>Syarat</b>. Jika syarat terpenuhi (Benar), mesin akan melakukan A. Jika tidak (Salah), ia melakukan B.
              </p>
              <div className="p-4 bg-black/5 rounded-xl border border-black/10 text-sm">
                <strong className="text-black">Cara Awam Memahami:</strong> Seperti bertanya pada diri sendiri sebelum keluar rumah. "Jika Hujan = Bawa Payung. Jika Tidak = Pakai Topi."
              </div>
            </div>
          )}

          {activeTab === 'looping' && (
            <div className="animate-in">
              <h3 className="text-2xl font-bold text-black mb-4">Pekerja Keras Tanpa Lelah</h3>
              <p className="text-[#71717A] leading-relaxed mb-6">
                Komputer menyukai hal yang diulang. Struktur ini menyuruh mesin mengerjakan instruksi yang sama ratusan, bahkan jutaan kali dengan sangat cepat hingga suatu batasan tertentu tercapai.
              </p>
              <div className="p-4 bg-black/5 rounded-xl border border-black/10 text-sm">
                <strong className="text-black">Cara Awam Memahami:</strong> Menyuruh anak menulis kalimat "Saya tidak nakal" 100 kali. Di program, Anda hanya butuh 3 baris kode untuk melakukannya.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const GlosariumSection = () => {
  const [query, setQuery] = useState('');
  const filtered = GLOSSARY.filter(item => 
    item.term.toLowerCase().includes(query.toLowerCase()) || 
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <SectionTitle 
        title="Kamus Istilah" 
        subtitle="Merasa asing dengan istilah teknis? Temukan penjelasan sederhananya di sini."
      />
      
      <div className="relative mb-10 animate-in">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={20} />
        <input 
          type="text" 
          placeholder="Cari kata (contoh: CPU, Pseudocode)..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white border-2 border-black/10 rounded-2xl py-4 pl-14 pr-6 text-black placeholder-[#A1A1AA] focus:outline-none focus:border-black transition-all shadow-sm"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length > 0 ? filtered.map((item, i) => (
          <div key={i} className={`glass-card p-6 border-l-4 border-l-black animate-in delay-${i%3}`}>
            <h3 className="text-lg font-bold text-black mb-2">{item.term}</h3>
            <p className="text-[#71717A] text-sm leading-relaxed">{item.desc}</p>
          </div>
        )) : (
          <div className="text-center text-[#A1A1AA] py-16 glass-card">
            <Search className="mx-auto mb-4 opacity-50" size={40}/>
            Tidak ada kata yang cocok dengan pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
};

const KuisSection = () => {
  const [activeQuiz, setActiveQuiz] = useState<'tf1'|'tf2'|null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quizData = activeQuiz ? QUIZ_DATA[activeQuiz] : [];

  const handleAnswer = (optIndex: number) => {
    if(isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.forEach((q, idx) => {
      if(answers[idx] === q.a) correct++;
    });
    return (correct / quizData.length) * 100;
  };

  const getGrade = (score: number) => {
    if(score >= 90) return { text: "Sempurna! Pemahaman Anda Sangat Baik.", border: "border-black bg-black text-white" };
    if(score >= 80) return { text: "Cukup Memuaskan. Pertahankan!", border: "border-black/50 bg-black/5 text-black" };
    return { text: "Mari Belajar Lebih Giat Lagi.", border: "border-[#E4E4E7] bg-white text-[#71717A]" };
  };

  if(!activeQuiz) {
    return (
      <div className="text-center max-w-2xl mx-auto py-16 animate-in">
        <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-4xl font-bold mb-4 text-black">Uji Pemahaman</h2>
        <p className="text-[#71717A] mb-12 text-lg leading-relaxed">
          Pilih salah satu tes formatif santai di bawah ini. Anda dapat melatih kembali seberapa jauh pemahaman Anda setelah membaca panduan ini.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <button onClick={() => setActiveQuiz('tf1')} className="glass-card p-8 group border-2 hover:border-black transition-colors">
            <h3 className="text-xl font-bold text-black mb-2 flex justify-between items-center">
              Tes Formatif 1
              <Play size={18} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
            </h3>
            <p className="text-sm text-[#71717A]">Materi Konsep Dasar, Manfaat, & Definisi.</p>
          </button>
          <button onClick={() => setActiveQuiz('tf2')} className="glass-card p-8 group border-2 hover:border-black transition-colors">
            <h3 className="text-xl font-bold text-black mb-2 flex justify-between items-center">
              Tes Formatif 2
              <Play size={18} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
            </h3>
            <p className="text-sm text-[#71717A]">Materi Tiga Struktur Logika Algoritma.</p>
          </button>
        </div>
      </div>
    );
  }

  if(isSubmitted) {
    const score = calculateScore();
    const grade = getGrade(score);
    return (
      <div className="text-center max-w-xl mx-auto py-16 animate-in">
        <h2 className="text-sm font-bold tracking-widest text-[#A1A1AA] uppercase mb-4">Skor Akhir Anda</h2>
        <div className="text-[100px] font-black mb-6 text-black leading-none">{score}</div>
        
        <div className={`inline-block px-6 py-3 rounded-full border-2 text-sm font-bold mb-10 ${grade.border}`}>
          {grade.text}
        </div>
        
        <p className="text-[#71717A] mb-12 text-lg">
          Menjawab benar <b>{score/20}</b> dari total {quizData.length} pertanyaan.
        </p>

        <button 
          onClick={() => { setActiveQuiz(null); setAnswers({}); setIsSubmitted(false); setCurrentIndex(0); }}
          className="px-8 py-4 rounded-full bg-black text-white font-bold hover:scale-105 transition-transform"
        >
          Pilih Kuis Lainnya
        </button>
      </div>
    );
  }

  const q = quizData[currentIndex];
  if (!q) return null;

  return (
    <div className="max-w-2xl mx-auto animate-in">
      <div className="flex justify-between items-center mb-10 border-b border-black/10 pb-6">
        <h2 className="text-lg font-bold text-black">
          {activeQuiz === 'tf1' ? 'Tes Formatif 1' : 'Tes Formatif 2'}
        </h2>
        <span className="bg-black/5 px-4 py-1.5 rounded-full text-xs font-bold text-[#71717A]">
          SOAL {currentIndex + 1} / {quizData.length}
        </span>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl md:text-3xl font-bold text-black leading-snug">{q.q}</h3>
      </div>
      
      <div className="space-y-4 mb-12">
        {q.options.map((opt, idx) => {
          const isSelected = answers[currentIndex] === idx;
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-5 ${isSelected ? 'bg-black border-black text-white' : 'bg-white/50 border-black/10 text-black hover:bg-white hover:border-black/30'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-sm border-2 ${isSelected ? 'border-white/20 bg-white/10 text-white' : 'border-black/20 text-[#A1A1AA]'}`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium text-base md:text-lg">{opt}</span>
            </button>
          )
        })}
      </div>

      <div className="flex justify-between border-t border-black/10 pt-6">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-xl font-medium text-[#71717A] hover:text-black hover:bg-black/5 disabled:opacity-30 transition-colors"
        >
          Kembali
        </button>
        
        {currentIndex === quizData.length - 1 ? (
          <button
            onClick={() => setIsSubmitted(true)}
            disabled={Object.keys(answers).length < quizData.length}
            className="px-8 py-3 rounded-xl bg-black text-white font-bold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            Kumpulkan Jawaban
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(quizData.length - 1, prev + 1))}
            className="px-8 py-3 rounded-xl border border-black text-black font-bold hover:bg-black hover:text-white transition-all"
          >
            Selanjutnya
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  const navigateTo = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'home': return <HomeSection onNavigate={navigateTo} />;
      case 'pengertian': return <PengertianSection />;
      case 'alasan': return <AlasanSection />;
      case 'program': return <ProgramBahasaSection />;
      case 'penyelesaian': return <PenyelesaianSection />;
      case 'ekspresi': return <EkspresiSection />;
      case 'pedoman': return <PedomanSection />;
      case 'struktur': return <StrukturSection />;
      case 'glosarium': return <GlosariumSection />;
      case 'kuis': return <KuisSection />;
      default: return <HomeSection onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] text-[#09090B] overflow-hidden selection:bg-black/20">
      <div className="bg-ambient"></div>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-black/10 flex items-center justify-between px-6 z-50">
        <div className="font-bold text-xl tracking-tight">Edukasi.IT</div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-black p-1">
          <Menu size={28} />
        </button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col border-r border-black/10 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:bg-transparent md:border-r-0 md:w-80 md:px-6 md:py-8`}>
        <div className="px-6 py-8 md:p-0 flex items-center justify-between mb-8">
          <div>
            <h2 className="font-bold text-2xl tracking-tight hidden md:block">Edukasi.IT</h2>
            <p className="text-sm text-[#71717A] mt-1 font-medium">Dasar Algoritma</p>
          </div>
          <button className="md:hidden text-[#71717A] bg-black/5 rounded-full p-2" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 md:px-0 space-y-1.5 pb-20">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            const Icon = sec.icon; 
            return (
              <button
                key={sec.id}
                onClick={() => navigateTo(sec.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[14px] font-semibold transition-all duration-200 ${isActive ? 'bg-black text-white shadow-md' : 'text-[#71717A] hover:bg-black/5 hover:text-black'}`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-[#A1A1AA]'} />
                {sec.title}
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="flex-1 h-full overflow-y-auto relative z-10 pt-20 md:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 relative z-10 pb-32">
          {renderSection()}
        </div>
      </main>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}