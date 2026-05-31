'use client'

import { useState } from 'react'
import { useSupplierStore } from '@/lib/store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Trophy, Medal, Eye } from 'lucide-react'

interface RankingResult {
  supplierId: string
  supplierName: string
  skor: number
  rank: number
  details: {
    kriteriaId: string
    kriteriaNama: string
    nilai: number
    normalisasi: number
    weighted: number
  }[]
}

export function HasilRanking() {
  const suppliers = useSupplierStore((state: any) => state.suppliers)
  const kriteria = useSupplierStore((state: any) => state.kriteria)
  const penilaian = useSupplierStore((state: any) => state.penilaian)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // SAW Calculation
  const calculateSAW = (): RankingResult[] => {
    const results: RankingResult[] = []

    suppliers.forEach((supplier: any) => {
      const details: RankingResult['details'] = []
      let totalSkor = 0

      kriteria.forEach((k: any) => {
        // PERBAIKAN 1: Menggunakan operator == agar aman dari benturan tipe data String/Number pada ID
        const penilaianItem = penilaian.find(
          (p: any) => p.supplierId == supplier.id && p.kriteriaId == k.id
        )
        const nilai = penilaianItem?.nilai || 0

        // Get max and min for normalization
        const allValues = suppliers
          .map((s: any) => {
            const p = penilaian.find(
              (pen: any) => pen.supplierId == s.id && pen.kriteriaId == k.id
            )
            return p?.nilai || 0
          })
          .filter((v: number) => v > 0)

        // PERBAIKAN 2: Fallback logis berbasis tabel acuan jika array state sempat tak terbaca sempurna
        const max = allValues.length > 0 ? Math.max(...allValues) : 100
        const min = allValues.length > 0 ? Math.min(...allValues) : 75

        // Normalize based on jenis kriteria
        let normalisasi = 0
        if (nilai > 0) {
          if (k.jenis.toLowerCase() === 'benefit') {
            normalisasi = nilai / max
          } else {
            normalisasi = min / nilai
          }
        }

        const weighted = (k.bobot / 100) * normalisasi
        totalSkor += weighted

        details.push({
          kriteriaId: k.id.toString(),
          kriteriaNama: k.nama,
          nilai,
          normalisasi: parseFloat(normalisasi.toFixed(4)),
          weighted: parseFloat(weighted.toFixed(4))
        })
      })

      results.push({
        supplierId: supplier.id.toString(),
        supplierName: supplier.nama,
        skor: parseFloat(totalSkor.toFixed(4)),
        rank: 0,
        details
      })
    })

    // Sort by skor and assign rank
    results.sort((a, b) => b.skor - a.skor)
    results.forEach((r, i) => {
      r.rank = i + 1
    })

    return results
  }

  const results = calculateSAW()
  const chartData = results.map((r) => ({
    name: r.supplierName.substring(0, 15),
    skor: parseFloat((r.skor * 100).toFixed(2)),
    rank: r.rank
  }))

  const topSupplier = results[0]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Hasil Ranking Supplier</h2>
        <p className="text-muted-foreground">Peringkat supplier berdasarkan metode Simple Additive Weighting (SAW)</p>
      </div>

      {/* Top Supplier Winner */}
      {topSupplier && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-700 mb-1">Supplier Terbaik</p>
                <h3 className="text-2xl font-bold text-amber-900">{topSupplier.supplierName}</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-amber-700 mb-1">Skor Total</p>
              <p className="text-4xl font-bold text-amber-900">{(topSupplier.skor * 100).toFixed(2)}%</p>
            </div>
          </div>
          <p className="text-sm text-amber-800">Supplier ini memiliki performa terbaik di semua kriteria evaluasi</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Perbandingan Skor Supplier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value}%`}
              />
              <Bar dataKey="skor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Tren Peringkat</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="skor" 
                stroke="#3b82f6" 
                dot={{ fill: '#3b82f6' }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Peringkat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nama Supplier</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Skor</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((result) => (
                <tr
                  key={result.supplierId}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {result.rank === 1 && <Trophy className="w-5 h-5 text-amber-500" />}
                      {result.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                      {result.rank === 3 && <Medal className="w-5 h-5 text-orange-600" />}
                      <span className="font-bold text-lg text-foreground">#{result.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{result.supplierName}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${result.skor * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-lg text-primary min-w-fit">{(result.skor * 100).toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setExpandedId(expandedId === result.supplierId ? null : result.supplierId)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      {expandedId === result.supplierId ? 'Sembunyikan' : 'Detail'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Calculation */}
      {expandedId && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-foreground text-lg">
            Detail Perhitungan: {results.find(r => r.supplierId === expandedId)?.supplierName}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Kriteria</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Nilai</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Normalisasi</th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">Bobot</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Weighted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {results
                  .find(r => r.supplierId === expandedId)
                  ?.details.map((detail) => (
                    <tr key={detail.kriteriaId} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 text-foreground">{detail.kriteriaNama}</td>
                      <td className="px-4 py-3 text-center text-foreground">{detail.nilai}</td>
                      <td className="px-4 py-3 text-center text-foreground">{detail.normalisasi}</td>
                      <td className="px-4 py-3 text-center text-foreground">
                        {kriteria.find((k: any) => k.id == detail.kriteriaId)?.bobot}%
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">{detail.weighted}</td>
                    </tr>
                  ))}
                <tr className="bg-secondary/30 font-bold">
                  <td colSpan={4} className="px-4 py-3 text-foreground">Total Skor (V):</td>
                  <td className="px-4 py-3 text-right text-primary">
                    {(
                      results
                        .find((r) => r.supplierId === expandedId)
                        ?.details.reduce((sum, d) => sum + d.weighted, 0) || 0
                    ).toFixed(4)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Metode SAW:</strong> Nilai akhir (V) dihitung dengan rumus: V = Σ (bobot × normalisasi nilai).
          Untuk kriteria <strong>benefit</strong>, normalisasi = nilai / max. Untuk kriteria <strong>cost</strong>, normalisasi = min / nilai.
        </p>
      </div>
    </div>
  )
}