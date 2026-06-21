import { create } from 'zustand'

// Auth Store
interface AuthState {
  isLoggedIn: boolean
  user: { username: string; name: string } | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      set({ isLoggedIn: true, user: { username: 'admin', name: 'Administrator' } })
      return true
    }
    return false
  },
  logout: () => {
    set({ isLoggedIn: false, user: null })
  },
}))

export interface Supplier {
  id: string
  nama: string
  kontak: string
  email: string
  alamat: string
}

export interface Kriteria {
  id: string
  nama: string
  bobot: number
  jenis: 'benefit' | 'cost'
}

export interface Penilaian {
  id: string
  supplierId: string
  kriteriaId: string
  nilai: number
}

// Default 5 kriteria (permanent) - Sesuai Tabel 3.1
const DEFAULT_KRITERIA: Kriteria[] = [
  { id: '1', nama: 'Harga', bobot: 30, jenis: 'cost' },
  { id: '2', nama: 'Kualitas Bahan', bobot: 25, jenis: 'benefit' },
  { id: '3', nama: 'Ketepatan Pengiriman', bobot: 20, jenis: 'benefit' },
  { id: '4', nama: 'Pelayanan', bobot: 15, jenis: 'benefit' },
  { id: '5', nama: 'Ketersediaan Stok', bobot: 10, jenis: 'benefit' },
]

// Default 5 suppliers - Sesuai Tabel 3.2
const DEFAULT_SUPPLIERS: Supplier[] = [
  { id: '1', nama: 'Toko Alif Stationary', kontak: '081234567890', email: 'tokoalif@email.com', alamat: 'Jl. Industri Percetakan No.1, Jakarta' },
  { id: '2', nama: 'CV Jaya Printing', kontak: '082345678901', email: 'jayaprinting@email.com', alamat: 'Jl. Perdagangan No.2, Surabaya' },
  { id: '3', nama: 'PT Prima Grafika', kontak: '083456789012', email: 'primagrafika@email.com', alamat: 'Jl. Bisnis Grafis No.3, Bandung' },
  { id: '4', nama: 'PT Mega Print', kontak: '084567890123', email: 'megaprint@email.com', alamat: 'Jl. Manufaktur Cetak No.4, Medan' },
  { id: '5', nama: 'CV Cahaya Media', kontak: '085678901234', email: 'cahayamedia@email.com', alamat: 'Jl. Komersial Percetakan No.5, Yogyakarta' },
]

interface SupplierStore {
  suppliers: Supplier[]
  kriteria: Kriteria[]
  penilaian: Penilaian[]
  
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  getSupplier: (id: string) => Supplier | undefined
  
  setPenilaian: (penilaian: Penilaian) => void
  getPenilaian: (supplierId: string, kriteriaId: string) => Penilaian | undefined
  getPenilaiandBySupplier: (supplierId: string) => Penilaian[]
}

// Default penilaian data - Sesuai Tabel 3.3 dokumen acuan
const DEFAULT_PENILAIAN: Penilaian[] = [
  // A1: Toko Alif Stationary (80, 90, 85, 88, 80)
  { id: '1', supplierId: '1', kriteriaId: '1', nilai: 80 },
  { id: '2', supplierId: '1', kriteriaId: '2', nilai: 90 },
  { id: '3', supplierId: '1', kriteriaId: '3', nilai: 85 },
  { id: '4', supplierId: '1', kriteriaId: '4', nilai: 88 },
  { id: '5', supplierId: '1', kriteriaId: '5', nilai: 80 },
  // A2: CV Jaya Printing (85, 88, 90, 80, 85)
  { id: '6', supplierId: '2', kriteriaId: '1', nilai: 85 },
  { id: '7', supplierId: '2', kriteriaId: '2', nilai: 88 },
  { id: '8', supplierId: '2', kriteriaId: '3', nilai: 90 },
  { id: '9', supplierId: '2', kriteriaId: '4', nilai: 80 },
  { id: '10', supplierId: '2', kriteriaId: '5', nilai: 85 },
  // A3: PT Prima Grafika (75, 95, 80, 90, 88)
  { id: '11', supplierId: '3', kriteriaId: '1', nilai: 75 },
  { id: '12', supplierId: '3', kriteriaId: '2', nilai: 95 },
  { id: '13', supplierId: '3', kriteriaId: '3', nilai: 80 },
  { id: '14', supplierId: '3', kriteriaId: '4', nilai: 90 },
  { id: '15', supplierId: '3', kriteriaId: '5', nilai: 88 },
  // A4: PT Mega Print (90, 85, 88, 85, 90)
  { id: '16', supplierId: '4', kriteriaId: '1', nilai: 90 },
  { id: '17', supplierId: '4', kriteriaId: '2', nilai: 85 },
  { id: '18', supplierId: '4', kriteriaId: '3', nilai: 88 },
  { id: '19', supplierId: '4', kriteriaId: '4', nilai: 85 },
  { id: '20', supplierId: '4', kriteriaId: '5', nilai: 90 },
  // A5: CV Cahaya Media (78, 87, 86, 89, 84) -> FIX: C4 diganti 89, C5 diganti 84 sesuai tabel dokumen
  { id: '21', supplierId: '5', kriteriaId: '1', nilai: 78 },
  { id: '22', supplierId: '5', kriteriaId: '2', nilai: 87 },
  { id: '23', supplierId: '5', kriteriaId: '3', nilai: 86 },
  { id: '24', supplierId: '5', kriteriaId: '4', nilai: 89 },
  { id: '25', supplierId: '5', kriteriaId: '5', nilai: 84 },
]

export const useSupplierStore = create<SupplierStore>((set, get) => ({
  suppliers: DEFAULT_SUPPLIERS,
  kriteria: DEFAULT_KRITERIA,
  penilaian: DEFAULT_PENILAIAN,

  addSupplier: (supplier) => {
    set((state) => ({
      suppliers: [...state.suppliers, supplier]
    }))
  },

  updateSupplier: (id, updates) => {
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      )
    }))
  },

  deleteSupplier: (id) => {
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.id !== id),
      penilaian: state.penilaian.filter((p) => p.supplierId !== id)
    }))
  },

  getSupplier: (id) => {
    return get().suppliers.find((s) => s.id === id)
  },

  setPenilaian: (penilaian) => {
    set((state) => {
      const existing = state.penilaian.find(
        (p) => p.supplierId === penilaian.supplierId && p.kriteriaId === penilaian.kriteriaId
      )
      if (existing) {
        return {
          penilaian: state.penilaian.map((p) =>
            p.id === existing.id ? penilaian : p
          )
        }
      }
      return {
        penilaian: [...state.penilaian, penilaian]
      }
    })
  },

  getPenilaian: (supplierId, kriteriaId) => {
    return get().penilaian.find(
      (p) => p.supplierId === supplierId && p.kriteriaId === kriteriaId
    )
  },

  getPenilaiandBySupplier: (supplierId) => {
    return get().penilaian.filter((p) => p.supplierId === supplierId)
  },
}))