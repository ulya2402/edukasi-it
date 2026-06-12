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
  { id: 'alasan', title: 'Manfaat & Tujuan', icon: MapPin },
  { id: 'program', title: 'Sistem & Bahasa', icon: Code },
  { id: 'penyelesaian', title: 'Tahapan Pengembangan', icon: Layers },
  { id: 'ekspresi', title: 'Notasi Algoritma', icon: FileText },
  { id: 'pedoman', title: 'Kriteria Algoritma', icon: CheckCircle },
  { id: 'struktur', title: 'Struktur Dasar', icon: List },
  { id: 'glosarium', title: 'Glosarium', icon: Search },
];

const GLOSSARY = [
  { term: "CPU (Central Processing Unit)", desc: "Komponen utama komputer yang berfungsi sebagai unit pemrosesan pusat. Bertugas menerima, menerjemahkan, dan mengeksekusi seluruh instruksi dari sebuah program." },
  { term: "Kecerdasan Buatan (Artificial Intelligence)", desc: "Cabang ilmu komputer yang memungkinkan sistem untuk mengenali pola, belajar dari data, dan mengambil keputusan secara mandiri menyerupai kemampuan kognitif manusia." },
  { term: "Mnemonik", desc: "Teknik bantu ingat yang dirancang untuk membantu seseorang menyimpan dan mengingat informasi kompleks dengan cara yang lebih sederhana dan terstruktur." },
  { term: "Pseudocode", desc: "Notasi penulisan algoritma menggunakan struktur bahasa yang mendekati bahasa manusia, bertujuan memudahkan perancangan logika sebelum diimplementasikan ke dalam bahasa pemrograman." },
  { term: "Flowchart (Diagram Alir)", desc: "Representasi visual dari sebuah algoritma yang menggunakan simbol-simbol standar (kotak, oval, belah ketupat) untuk menggambarkan urutan proses secara sistematis." }
];

type QuizQuestion = { q: string, options: string[], a: number };

const QUIZ_DATA: Record<string, QuizQuestion[]> = {
  tf1: [
    { q: "Suatu urutan operasi yang disusun secara logis dan sistematis untuk menyelesaikan suatu masalah disebut...", options: ["Logika pemrograman", "Algoritma", "Program komputer", "Logika informatika"], a: 1 },
    { q: "\"Algoritma adalah suatu metode khusus untuk menyelesaikan suatu permasalahan\" merupakan definisi yang dikemukakan oleh...", options: ["Abu Ja'far Al-Khawarizmi", "Donald E. Knuth", "David Bolton", "Andrey Markov"], a: 0 },
    { q: "Apabila sebuah algoritma tidak memperhatikan penggunaan ruang memori secara optimal, maka algoritma tersebut mengabaikan prinsip...", options: ["Abstraksi", "Efisiensi", "Reusability", "Semua benar"], a: 1 },
    { q: "Bahasa pemrograman tingkat tinggi dirancang agar...", options: ["Dapat langsung dieksekusi oleh mesin", "Lebih sulit untuk diretas", "Mendekati struktur bahasa manusia", "Hanya terdiri dari kombinasi angka 0 dan 1"], a: 2 },
    { q: "Tokoh yang dikenal sebagai penyusun program komputer pertama di dunia melalui rancangan mesin analitikal adalah...", options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "Donald E. Knuth"], a: 2 },
  ],
  tf2: [
    { q: "Struktur dasar yang mengeksekusi instruksi secara berurutan dari awal hingga akhir tanpa ada yang terlewat disebut...", options: ["Perulangan", "Sekuensial", "Seleksi", "Variabel"], a: 1 },
    { q: "Sebuah algoritma yang menerapkan logika \"Jika kondisi benar, lakukan A; jika salah, lakukan B\" menggunakan struktur...", options: ["Seleksi", "Sekuensial", "Perulangan", "Abstraksi"], a: 0 },
    { q: "Cara paling efisien untuk menampilkan angka 1 hingga 1.000 pada layar komputer adalah dengan menggunakan struktur...", options: ["Sekuensial", "Seleksi", "Seleksi dan Sekuensial", "Perulangan"], a: 3 },
    { q: "Jika C = 5, kemudian dijalankan instruksi perulangan C = C + 1 sebanyak 5 kali, maka nilai akhir C adalah...", options: ["9", "10", "11", "12"], a: 1 },
    { q: "Struktur yang memungkinkan programmer menghindari penulisan ribuan baris kode yang berulang secara manual adalah...", options: ["Sekuensial", "Abstraksi", "Perulangan", "Seleksi"], a: 2 },
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
        Modul 1 • Pengantar Algoritma
      </span>
    </div>
    
    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-8 animate-in delay-1 leading-tight">
      Dasar-Dasar <br />
      Algoritma & Logika.
    </h1>
    
    <p className="text-xl text-[#71717A] mb-14 animate-in delay-2 max-w-2xl leading-relaxed">
      Modul pembelajaran interaktif yang dirancang untuk membantu Anda memahami konsep fundamental di balik cara kerja komputer—mulai dari pengertian algoritma, struktur logika dasar, hingga penerapannya dalam kehidupan sehari-hari.
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
            <h3 className="font-semibold text-lg text-black">Mulai Pembelajaran</h3>
            <p className="text-sm text-[#71717A]">Pahami konsep dasar algoritma</p>
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
            <h3 className="font-semibold text-lg text-black">Glosarium</h3>
            <p className="text-sm text-[#71717A]">Kamus istilah teknis singkat</p>
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
      subtitle="Secara mendasar, algoritma adalah rangkaian langkah logis dan sistematis yang disusun untuk menyelesaikan suatu permasalahan—dapat diibaratkan sebagai sebuah prosedur atau resep penyelesaian."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <h3 className="font-bold text-lg mb-2 text-black">Abu Ja'far Al-Khawarizmi</h3>
        <p className="text-[#71717A] text-sm leading-relaxed">"Algoritma merupakan suatu metode khusus yang digunakan untuk menyelesaikan suatu permasalahan tertentu."</p>
      </Card>
      <Card delay="delay-1">
        <h3 className="font-bold text-lg mb-2 text-black">Andrey A. Markov</h3>
        <p className="text-[#71717A] text-sm leading-relaxed">"Algoritma adalah rumusan proses yang menentukan secara tepat bagaimana data awal diolah menjadi hasil akhir."</p>
      </Card>
    </div>

    <div className="glass-card p-8 md:p-12 mt-12 animate-in delay-2">
      <h3 className="text-xl font-bold mb-6 text-black border-b border-black/10 pb-4">Ilustrasi: Menentukan Rute Perjalanan ke Bogor</h3>
      <p className="text-[#71717A] mb-8">
        Untuk mencapai satu tujuan yang sama, terdapat berbagai alur (algoritma) yang dapat dipilih. Setiap alur memiliki tingkat efisiensi waktu dan biaya yang berbeda-beda.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-black/5">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">1. Kereta Api</h4>
          <ul className="space-y-2 text-sm text-[#71717A]">
            <li>• Menuju stasiun keberangkatan</li>
            <li>• Membeli tiket dan memasuki peron</li>
            <li>• Estimasi waktu pasti, biaya terjangkau</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-black/5 border border-black/10">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">2. Taksi/Ride-Hailing</h4>
          <ul className="space-y-2 text-sm text-[#71717A]">
            <li>• Memesan melalui aplikasi</li>
            <li>• Melalui jalur tol</li>
            <li>• Waktu tempuh tercepat, biaya lebih tinggi</li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl bg-black/5">
          <h4 className="font-bold text-black mb-4 flex items-center gap-2">3. Angkutan Umum</h4>
          <ul className="space-y-2 text-sm text-[#71717A]">
            <li>• Menunggu di terminal/pangkalan</li>
            <li>• Menunggu hingga kendaraan terisi penumpang</li>
            <li>• Biaya paling rendah, waktu tempuh lebih lama</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const AlasanSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Mengapa Algoritma Itu Penting?" 
      subtitle="Perusahaan teknologi rela menginvestasikan sumber daya besar untuk merancang algoritma yang tepat, karena terdapat tiga alasan utama berikut."
    />

    <div className="grid grid-cols-1 gap-6">
      <Card className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-14 h-14 bg-black rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Efisiensi</h3>
          <p className="text-[#71717A] leading-relaxed">
            Menghasilkan jawaban yang benar saja tidak cukup. Sebuah algoritma yang baik harus dapat memproses data dengan <b>waktu seminimal mungkin</b> sekaligus menggunakan <b>sumber daya memori secara optimal</b>.
          </p>
        </div>
      </Card>

      <Card delay="delay-1" className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-14 h-14 bg-black rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Penyederhanaan Masalah (Abstraksi)</h3>
          <p className="text-[#71717A] leading-relaxed">
            Mengurai permasalahan yang tampak kompleks menjadi tahapan-tahapan kecil yang logis, terstruktur, dan lebih mudah dipahami serta diikuti.
          </p>
        </div>
      </Card>

      <Card delay="delay-2" className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-14 h-14 bg-black rounded-2xl text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
        <div>
          <h3 className="text-xl font-bold text-black mb-2">Dapat Digunakan Kembali (Reusability)</h3>
          <p className="text-[#71717A] leading-relaxed">
            Algoritma merupakan konsep pemikiran, bukan sekadar kode dalam satu bahasa tertentu. Sebuah algoritma yang baik dapat diadaptasi ke berbagai bahasa pemrograman dan digunakan kembali untuk proyek lain.
          </p>
        </div>
      </Card>
    </div>
  </div>
);

const ProgramBahasaSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Sistem & Bahasa Pemrograman" 
      subtitle="Komputer bekerja sesuai instruksi yang diberikan, namun dibutuhkan 'penerjemah' dan landasan sistem agar instruksi tersebut dapat dijalankan dengan baik."
    />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in">
      <div className="p-8 rounded-3xl bg-white border border-black/10 shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-black mb-2">Programmer</h3>
          <p className="text-[#71717A] text-sm leading-relaxed">
            Profesional yang bertugas merancang dan menyusun logika algoritma, kemudian menerjemahkannya ke dalam bentuk yang dapat dieksekusi oleh komputer.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-black/10 shadow-sm flex flex-col gap-4 delay-1 animate-in">
        <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-black">
          <Terminal size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-black mb-2">Bahasa Pemrograman</h3>
          <p className="text-[#71717A] text-sm leading-relaxed">
            Kumpulan instruksi formal yang digunakan programmer sebagai media komunikasi untuk memberikan perintah kepada komputer.
          </p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 delay-2 animate-in">
      <div className="p-6 rounded-2xl border-l-4 border-l-black bg-black/5">
        <h3 className="font-bold text-black mb-2">1. Sistem Operasi (OS)</h3>
        <p className="text-[#71717A] text-sm leading-relaxed mb-4">Perangkat lunak dasar yang mengelola seluruh perangkat keras (layar, keyboard, penyimpanan) dan menyediakan lingkungan bagi program lain untuk berjalan.</p>
        <span className="text-xs font-semibold px-3 py-1.5 bg-white rounded-full text-black shadow-sm">Windows, macOS, Linux</span>
      </div>
      <div className="p-6 rounded-2xl border-l-4 border-l-black bg-black/5">
        <h3 className="font-bold text-black mb-2">2. Program Aplikasi</h3>
        <p className="text-[#71717A] text-sm leading-relaxed mb-4">Perangkat lunak yang berjalan di atas sistem operasi untuk menjalankan fungsi atau tugas tertentu yang dibutuhkan pengguna.</p>
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
            <p className="text-sm text-[#71717A]">Terdiri dari rangkaian instruksi biner berupa angka <code>0</code> dan <code>1</code>. Paling sulit dipahami manusia, namun dapat diproses langsung oleh mesin tanpa proses penerjemahan.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
          <div>
            <h4 className="font-bold text-black mb-1">Tingkat Menengah (Assembly)</h4>
            <p className="text-sm text-[#71717A]">Menggunakan kode mnemonik seperti <code>MOV</code> (Move) dan <code>SUB</code> (Subtract). Lebih mudah dibaca dibandingkan kode biner, namun penulisannya masih relatif kaku.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
          <div>
            <h4 className="font-bold text-black mb-1">Tingkat Tinggi</h4>
            <p className="text-sm text-[#71717A]">Paling umum digunakan saat ini karena strukturnya mendekati bahasa manusia (Bahasa Inggris), sehingga lebih mudah dipelajari dan ditulis. Contoh: <code>Java, Python, PHP</code>.</p>
          </div>
        </div>
      </div>
    </Card>

    <div className="glass-card p-6 md:p-8 animate-in delay-3 bg-black text-white flex flex-col md:flex-row gap-6 items-center">
      <div className="p-4 bg-white/10 rounded-2xl shrink-0"><Code size={32}/></div>
      <p className="text-sm leading-relaxed text-center md:text-left">
        <span className="font-bold text-white text-base block mb-1">Catatan Sejarah</span> 
        Programmer pertama di dunia tercatat sebagai <b>Ada Lovelace</b> pada tahun 1843. Catatannya mengenai rancangan komputasi pada Mesin Analitikal Charles Babbage diakui sebagai cikal bakal program komputer modern.
      </p>
    </div>
  </div>
);

const PenyelesaianSection = () => (
  <div className="space-y-12">
    <SectionTitle 
      title="Tahapan Pengembangan Program" 
      subtitle="Untuk membangun sebuah program yang andal, pengembang umumnya mengikuti tiga tahapan utama berikut secara berurutan."
    />

    <div className="flex flex-col gap-4 relative">
      <div className="absolute left-7 top-10 bottom-10 w-0.5 bg-black/10 z-0 hidden md:block"></div>
      
      {[
        { step: 1, title: "Analisis & Perancangan Algoritma", desc: "Mengidentifikasi inti permasalahan, menentukan data yang dibutuhkan (input) serta hasil yang diharapkan (output), lalu menyusun urutan langkah penyelesaiannya." },
        { step: 2, title: "Implementasi (Coding)", desc: "Menerjemahkan rancangan algoritma yang telah disusun ke dalam bahasa pemrograman yang dipilih (misalnya Java atau Python) agar dapat dieksekusi oleh komputer." },
        { step: 3, title: "Pengujian & Eksekusi", desc: "Program yang telah ditulis dijalankan dan diuji secara berulang untuk mengidentifikasi kesalahan (bug), yang kemudian diperbaiki sebelum dirilis ke pengguna." }
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
    { id: 'bahasa', label: 'Bahasa Natural' },
    { id: 'pseudo', label: 'Pseudocode' },
    { id: 'java', label: 'Kode Program (Java)' }
  ];

  return (
    <div className="space-y-8">
      <SectionTitle 
        title="Notasi Penulisan Algoritma" 
        subtitle="Sebuah algoritma dapat dituliskan dalam beberapa notasi. Berikut adalah perbandingan penulisan algoritma untuk menentukan nilai terbesar dari tiga buah angka."
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
              <p className="font-medium text-[#71717A]">Langkah-langkah penyelesaian:</p>
              <ul className="space-y-3">
                <li>1. Mulai.</li>
                <li>2. Siapkan tiga buah angka sebagai data masukan.</li>
                <li>3. Tetapkan angka pertama sebagai nilai <b>terbesar</b> sementara.</li>
                <li>4. Bandingkan angka kedua dengan nilai terbesar. Jika lebih besar, jadikan angka kedua sebagai nilai terbesar yang baru.</li>
                <li>5. Bandingkan angka ketiga dengan nilai terbesar saat ini. Jika lebih besar, perbarui nilai terbesar tersebut.</li>
                <li>6. Tampilkan nilai terbesar. Selesai.</li>
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
      title="Kriteria Algoritma yang Baik" 
      subtitle="Menurut Ellis Horowitz dan Sartaj Sahni, sebuah algoritma yang valid harus memenuhi lima kriteria mutlak berikut ini."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: "Input (Masukan)", desc: "Sebuah algoritma dapat memiliki nol, satu, atau lebih data masukan dari pengguna sebelum proses dijalankan." },
        { title: "Output (Keluaran)", desc: "Setiap algoritma wajib menghasilkan minimal satu keluaran berupa solusi atau hasil akhir yang sesuai dengan tujuannya." },
        { title: "Definiteness (Ketegasan)", desc: "Setiap instruksi harus dirumuskan secara jelas, tegas, dan tidak menimbulkan lebih dari satu interpretasi (tidak ambigu)." },
        { title: "Finiteness (Keterbatasan)", desc: "Apapun jalur proses yang ditempuh, algoritma harus berhenti setelah melakukan sejumlah langkah yang terbatas." },
        { title: "Effectiveness (Efektivitas)", desc: "Setiap operasi dalam algoritma harus sederhana, dapat dikerjakan, dan diselesaikan dalam jangka waktu yang wajar." }
      ].map((item, idx) => (
        <Card key={idx} delay={`delay-${idx % 3}`} className={idx === 4 ? "md:col-span-2" : ""}>
          <h3 className="font-bold text-black mb-2">{item.title}</h3>
          <p className="text-[#71717A] text-sm leading-relaxed">{item.desc}</p>
        </Card>
      ))}
    </div>

    <div className="mt-16 animate-in delay-2 border-t border-black/10 pt-10">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-black mb-2">Manfaat Bagi Pembelajar Pemula</h3>
        <p className="text-[#71717A]">Memahami konsep algoritma tidak hanya bermanfaat bagi calon programmer, tetapi juga memberikan dampak positif dalam kehidupan dan cara berpikir sehari-hari.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-black/10 flex items-start gap-4 hover:border-black transition-colors shadow-sm">
           <div className="p-2 bg-black/5 rounded-lg text-black shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-black mb-1">Berpikir Logis & Terstruktur</h4>
             <p className="text-xs text-[#71717A] leading-relaxed">Melatih pola pikir untuk menyusun langkah penyelesaian masalah secara runtut dan sistematis, tanpa melompat-lompat antar tahapan.</p>
           </div>
        </div>
        
        <div className="p-6 rounded-2xl bg-white border border-black/10 flex items-start gap-4 hover:border-black transition-colors shadow-sm">
           <div className="p-2 bg-black/5 rounded-lg text-black shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-black mb-1">Ketelitian dan Analisis</h4>
             <p className="text-xs text-[#71717A] leading-relaxed">Membiasakan diri untuk memeriksa ulang dan menganalisis secara cermat ketika hasil yang diperoleh tidak sesuai dengan harapan.</p>
           </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-black/10 flex items-start gap-4 hover:border-black transition-colors shadow-sm">
           <div className="p-2 bg-black/5 rounded-lg text-black shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-black mb-1">Kemampuan Pemecahan Masalah</h4>
             <p className="text-xs text-[#71717A] leading-relaxed">Meningkatkan kemampuan memprediksi kendala yang mungkin terjadi serta merancang solusi alternatif secara sistematis.</p>
           </div>
        </div>

        <div className="p-6 rounded-2xl bg-black text-white border border-black/10 flex items-start gap-4 shadow-sm">
           <div className="p-2 bg-white/20 rounded-lg text-white shrink-0"><CheckCircle size={22}/></div>
           <div>
             <h4 className="font-bold text-sm text-white mb-1">Keteraturan dalam Bekerja</h4>
             <p className="text-xs text-[#D4D4D8] leading-relaxed">Memahami bahwa sistem yang kompleks dibangun dari instruksi-instruksi kecil yang disusun secara disiplin dan bertahap.</p>
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
        title="Tiga Struktur Dasar Algoritma" 
        subtitle="Mulai dari sistem perbankan, aplikasi perpesanan, hingga game tiga dimensi yang kompleks—semuanya dibangun dari kombinasi tiga struktur logika dasar berikut."
      />

      <div className="flex flex-col md:flex-row gap-3 justify-center mb-10 animate-in">
        {[
          {id: 'sequential', label: '1. Sekuensial (Urutan)'},
          {id: 'selection', label: '2. Seleksi (Percabangan)'},
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
              <div className="w-full p-3 rounded-xl border border-black/20 text-sm text-center font-medium">Buka Kemasan</div>
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
                Apakah Hari Ini Hujan?
              </div>
              
              <div className="flex w-full justify-between items-start pt-2 border-t-2 border-[#E4E4E7] relative mt-2">
                <div className="absolute top-0 left-[20%] w-0.5 h-4 bg-[#E4E4E7]"></div>
                <div className="absolute top-0 right-[20%] w-0.5 h-4 bg-[#E4E4E7]"></div>
                
                <div className="w-[45%] flex flex-col items-center pt-4">
                  <span className="text-xs font-bold mb-2">YA</span>
                  <div className="w-full p-3 rounded-xl border border-black/20 text-xs text-center">Membawa Payung</div>
                </div>
                <div className="w-[45%] flex flex-col items-center pt-4">
                  <span className="text-xs font-bold mb-2 text-[#A1A1AA]">TIDAK</span>
                  <div className="w-full p-3 rounded-xl border border-black/20 text-xs text-center text-[#71717A]">Memakai Topi</div>
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
                
                <div className="text-xs font-bold mb-1">Apakah Sudah Tertancap?</div>
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
              <h3 className="text-2xl font-bold text-black mb-4">Eksekusi Berurutan</h3>
              <p className="text-[#71717A] leading-relaxed mb-6">
                Struktur paling dasar dalam algoritma. Komputer membaca dan menjalankan instruksi dari baris pertama hingga baris terakhir secara berurutan, tanpa ada langkah yang dilewati. Struktur ini cocok untuk proses-proses sederhana yang tidak memerlukan pengambilan keputusan.
              </p>
              <div className="p-4 bg-black/5 rounded-xl border border-black/10 text-sm">
                <strong className="text-black">Analogi Sederhana:</strong> Mengikuti petunjuk penyajian mi instan—seluruh langkah, dari merebus air hingga menuangkan bumbu, harus dilakukan secara berurutan.
              </div>
            </div>
          )}
          
          {activeTab === 'selection' && (
            <div className="animate-in">
              <h3 className="text-2xl font-bold text-black mb-4">Percabangan (Pengambilan Keputusan)</h3>
              <p className="text-[#71717A] leading-relaxed mb-6">
                Struktur ini memungkinkan komputer mengevaluasi sebuah <b>kondisi</b> tertentu. Apabila kondisi tersebut terpenuhi (benar), sistem akan menjalankan instruksi A; jika tidak (salah), sistem akan menjalankan instruksi B.
              </p>
              <div className="p-4 bg-black/5 rounded-xl border border-black/10 text-sm">
                <strong className="text-black">Analogi Sederhana:</strong> Mempertimbangkan kondisi sebelum berangkat dari rumah—"Jika hujan, maka membawa payung. Jika tidak, maka memakai topi."
              </div>
            </div>
          )}

          {activeTab === 'looping' && (
            <div className="animate-in">
              <h3 className="text-2xl font-bold text-black mb-4">Perulangan (Repetisi)</h3>
              <p className="text-[#71717A] leading-relaxed mb-6">
                Struktur ini memerintahkan komputer untuk menjalankan instruksi yang sama secara berulang—dapat ratusan hingga jutaan kali—hingga suatu kondisi atau batas tertentu terpenuhi.
              </p>
              <div className="p-4 bg-black/5 rounded-xl border border-black/10 text-sm">
                <strong className="text-black">Analogi Sederhana:</strong> Menulis kalimat yang sama sebanyak 100 kali sebagai bentuk latihan. Dalam sebuah program, tugas tersebut hanya membutuhkan beberapa baris kode.
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
        title="Glosarium" 
        subtitle="Kumpulan istilah teknis yang sering muncul dalam pembahasan algoritma dan pemrograman, beserta penjelasannya secara sederhana."
      />
      
      <div className="relative mb-10 animate-in">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={20} />
        <input 
          type="text" 
          placeholder="Cari istilah (contoh: CPU, Pseudocode)..." 
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
            Istilah yang Anda cari tidak ditemukan.
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
    if(score >= 90) return { text: "Sangat Baik. Pemahaman Anda sudah sangat memadai.", border: "border-black bg-black text-white" };
    if(score >= 80) return { text: "Baik. Pertahankan capaian ini.", border: "border-black/50 bg-black/5 text-black" };
    return { text: "Disarankan untuk meninjau kembali materi terkait.", border: "border-[#E4E4E7] bg-white text-[#71717A]" };
  };

  if(!activeQuiz) {
    return (
      <div className="text-center max-w-2xl mx-auto py-16 animate-in">
        <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-4xl font-bold mb-4 text-black">Uji Pemahaman</h2>
        <p className="text-[#71717A] mb-12 text-lg leading-relaxed">
          Pilih salah satu tes formatif di bawah ini untuk mengukur sejauh mana pemahaman Anda terhadap materi yang telah dipelajari.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <button onClick={() => setActiveQuiz('tf1')} className="glass-card p-8 group border-2 hover:border-black transition-colors">
            <h3 className="text-xl font-bold text-black mb-2 flex justify-between items-center">
              Tes Formatif 1
              <Play size={18} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
            </h3>
            <p className="text-sm text-[#71717A]">Konsep dasar, manfaat, dan definisi algoritma.</p>
          </button>
          <button onClick={() => setActiveQuiz('tf2')} className="glass-card p-8 group border-2 hover:border-black transition-colors">
            <h3 className="text-xl font-bold text-black mb-2 flex justify-between items-center">
              Tes Formatif 2
              <Play size={18} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
            </h3>
            <p className="text-sm text-[#71717A]">Tiga struktur dasar logika algoritma.</p>
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
          Anda menjawab benar <b>{score/20}</b> dari total {quizData.length} pertanyaan.
        </p>

        <button 
          onClick={() => { setActiveQuiz(null); setAnswers({}); setIsSubmitted(false); setCurrentIndex(0); }}
          className="px-8 py-4 rounded-full bg-black text-white font-bold hover:scale-105 transition-transform"
        >
          Pilih Tes Lainnya
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
            <p className="text-sm text-[#71717A] mt-1 font-medium">Dasar-Dasar Algoritma</p>
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