'use client'

import { useSupplierStore } from '@/lib/store'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

export function KriteriaView() {
  const kriteria = useSupplierStore((state) => state.kriteria)

  const benefitKriteria = kriteria.filter(k => k.jenis === 'benefit')
  const costKriteria = kriteria.filter(k => k.jenis === 'cost')
  const totalBobot = kriteria.reduce((sum, k) => sum + k.bobot, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Kriteria Evaluasi</h2>
        <p className="text-muted-foreground">Daftar kriteria permanen untuk evaluasi supplier</p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Catatan Penting:</p>
          <p>Kriteria evaluasi bersifat <strong>permanen</strong> dan tidak dapat diubah. Bobot total saat ini: <strong className="text-lg">{totalBobot}%</strong></p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Kriteria</h3>
          <p className="text-3xl font-bold text-foreground">{kriteria.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Kriteria Benefit</h3>
          <p className="text-3xl font-bold text-green-600">{benefitKriteria.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Kriteria Cost</h3>
          <p className="text-3xl font-bold text-amber-600">{costKriteria.length}</p>
        </div>
      </div>

      {/* Benefit Criteria */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-b border-border px-6 py-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-semibold text-foreground">Kriteria Benefit</h3>
            <p className="text-sm text-muted-foreground">Semakin tinggi nilai, semakin baik supplier</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {benefitKriteria.map((k, i) => (
            <div key={k.id} className="flex items-center justify-between p-4 bg-green-50/50 rounded-lg border border-green-200/50 hover:bg-green-50 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1">{i + 1}. {k.nama}</p>
                <p className="text-sm text-muted-foreground">Benefit Criteria</p>
              </div>
              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-bold">
                  {k.bobot}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Criteria */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-border px-6 py-4 flex items-center gap-3">
          <TrendingDown className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="font-semibold text-foreground">Kriteria Cost</h3>
            <p className="text-sm text-muted-foreground">Semakin rendah nilai, semakin baik supplier</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {costKriteria.map((k, i) => (
            <div key={k.id} className="flex items-center justify-between p-4 bg-amber-50/50 rounded-lg border border-amber-200/50 hover:bg-amber-50 transition-colors">
              <div className="flex-1">
                <p className="font-semibold text-foreground mb-1">{benefitKriteria.length + i + 1}. {k.nama}</p>
                <p className="text-sm text-muted-foreground">Cost Criteria</p>
              </div>
              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-lg bg-amber-100 text-amber-700 text-sm font-bold">
                  {k.bobot}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Penjelasan Kriteria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kriteria.map((k) => (
            <div key={k.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${k.jenis === 'benefit' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{k.nama}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Bobot: {k.bobot}% ({k.jenis})</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getKriteriaDescription(k.nama)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bobot Distribution */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-6">Distribusi Bobot</h3>
        <div className="space-y-3">
          {kriteria.map((k) => (
            <div key={k.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{k.nama}</span>
                <span className="text-sm font-bold text-primary">{k.bobot}%</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${k.jenis === 'benefit' ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${k.bobot}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
          <span className="font-semibold text-foreground">Total Bobot</span>
          <span className="text-lg font-bold text-primary">{totalBobot}%</span>
        </div>
      </div>
    </div>
  )
}

function getKriteriaDescription(nama: string): string {
  const descriptions: Record<string, string> = {
    'Kualitas Produk': 'Mengevaluasi tingkat kualitas dari produk atau layanan yang ditawarkan oleh supplier, termasuk ketahannya dan konsistensi.',
    'Harga': 'Menilai kompetitivitas harga yang ditawarkan supplier dibandingkan dengan pasar. Semakin rendah harga, semakin baik.',
    'Pengiriman Tepat Waktu': 'Mengevaluasi kemampuan supplier dalam memenuhi jadwal pengiriman yang telah disepakati.',
    'Layanan Purna Jual': 'Menilai kualitas layanan purna jual, garansi produk, dan responsivitas dalam menangani keluhan.',
    'Stabilitas Bisnis': 'Mengevaluasi kestabilan finansial, reputasi bisnis, dan pengalaman supplier di industri.',
  }
  return descriptions[nama] || 'Kriteria evaluasi untuk supplier'
}
