'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react'
import { useSupplierStore, type Supplier } from '@/lib/store'

export function SupplierManagement() {
  const suppliers = useSupplierStore((state) => state.suppliers)
  const addSupplier = useSupplierStore((state) => state.addSupplier)
  const updateSupplier = useSupplierStore((state) => state.updateSupplier)
  const deleteSupplier = useSupplierStore((state) => state.deleteSupplier)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    kontak: '',
    email: '',
    alamat: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nama || !formData.kontak || !formData.email || !formData.alamat) {
      alert('Semua field harus diisi')
      return
    }

    if (editingId) {
      updateSupplier(editingId, formData)
      setEditingId(null)
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...formData
      }
      addSupplier(newSupplier)
    }

    setFormData({ nama: '', kontak: '', email: '', alamat: '' })
    setShowForm(false)
  }

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      nama: supplier.nama,
      kontak: supplier.kontak,
      email: supplier.email,
      alamat: supplier.alamat
    })
    setEditingId(supplier.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      deleteSupplier(id)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ nama: '', kontak: '', email: '', alamat: '' })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Manajemen Supplier</h2>
          <p className="text-muted-foreground">Kelola daftar supplier dengan mudah</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Tambah Supplier
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {editingId ? 'Edit Supplier' : 'Tambah Supplier Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nama Supplier</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: PT. Mitra Jaya"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">No. Kontak</label>
                <input
                  type="tel"
                  value={formData.kontak}
                  onChange={(e) => setFormData({ ...formData, kontak: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: +6281234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: info@perusahaan.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Alamat</label>
                <textarea
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  {editingId ? 'Update' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{supplier.nama[0]}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-1">{supplier.nama}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{supplier.alamat}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                <span>{supplier.kontak}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <MapPin className="w-4 h-4" />
                <span>{supplier.alamat}</span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors text-sm font-medium">
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada supplier. Klik tombol &quot;Tambah Supplier&quot; untuk memulai.</p>
        </div>
      )}
    </div>
  )
}
