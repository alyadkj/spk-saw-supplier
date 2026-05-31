'use client'

import { useState } from 'react'
import { useSupplierStore } from '@/lib/store'
import { Save, AlertCircle } from 'lucide-react'

export function PenilaianForm() {
  const suppliers = useSupplierStore((state) => state.suppliers)
  const kriteria = useSupplierStore((state) => state.kriteria)
  const penilaian = useSupplierStore((state) => state.penilaian)
  const setPenilaian = useSupplierStore((state) => state.setPenilaian)

  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '')
  const [formValues, setFormValues] = useState<Record<string, number>>({})
  const [savedMessage, setSavedMessage] = useState('')

  const handleValueChange = (kriteriaId: string, value: number) => {
    setFormValues({
      ...formValues,
      [kriteriaId]: value
    })
  }

  const handleSave = () => {
    if (!selectedSupplierId) {
      alert('Pilih supplier terlebih dahulu')
      return
    }

    kriteria.forEach((k) => {
      if (formValues[k.id] !== undefined) {
        setPenilaian({
          id: `${selectedSupplierId}-${k.id}`,
          supplierId: selectedSupplierId,
          kriteriaId: k.id,
          nilai: formValues[k.id]
        })
      }
    })

    setSavedMessage('Penilaian berhasil disimpan!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  // Load saved values for selected supplier
  const loadedValues = suppliers.find(s => s.id === selectedSupplierId)
    ? kriteria.reduce((acc, k) => {
        const saved = penilaian.find(
          (p) => p.supplierId === selectedSupplierId && p.kriteriaId === k.id
        )
        if (saved) acc[k.id] = saved.nilai
        return acc
      }, {} as Record<string, number>)
    : {}

  const mergedValues = { ...loadedValues, ...formValues }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Input Penilaian Supplier</h2>
        <p className="text-muted-foreground">Masukkan nilai untuk setiap kriteria evaluasi (skala 1-100)</p>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">{savedMessage}</span>
        </div>
      )}

      {/* Supplier Selection */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <label className="block text-sm font-semibold text-foreground mb-3">Pilih Supplier</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => {
            setSelectedSupplierId(e.target.value)
            setFormValues({})
          }}
          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Criteria Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {kriteria.map((k) => {
          const value = mergedValues[k.id] || 0
          const isBenefit = k.jenis === 'benefit'

          return (
            <div key={k.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{k.nama}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Bobot: {k.bobot}%</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isBenefit 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isBenefit ? 'Benefit' : 'Cost'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => handleValueChange(k.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleValueChange(k.id, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-muted-foreground">/ 100</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  {value === 0 && 'Belum diisi'}
                  {value > 0 && value < 50 && 'Kurang baik'}
                  {value >= 50 && value < 75 && 'Cukup baik'}
                  {value >= 75 && value <= 100 && 'Sangat baik'}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Catatan Penilaian:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li><strong>Benefit:</strong> Semakin tinggi nilai, semakin baik supplier</li>
            <li><strong>Cost:</strong> Semakin rendah nilai, semakin baik supplier (contoh: harga)</li>
            <li>Semua nilai akan disimpan otomatis ketika Anda klik tombol Simpan</li>
          </ul>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5" />
          Simpan Penilaian
        </button>
      </div>

      {/* Assessment Summary */}
      {Object.keys(mergedValues).length > 0 && (
        <div className="bg-secondary/30 rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Ringkasan Penilaian</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kriteria.map((k) => (
              <div key={k.id} className="text-center">
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{k.nama}</p>
                <p className="text-2xl font-bold text-primary">{mergedValues[k.id] || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
