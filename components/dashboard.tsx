'use client'

import { useState, useEffect } from 'react'
import { Trophy, Users, CheckCircle, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSupplierStore } from '@/lib/store'

export function Dashboard() {
  const suppliers = useSupplierStore((state: any) => state.suppliers)
  const kriteria = useSupplierStore((state: any) => state.kriteria)
  const penilaian = useSupplierStore((state: any) => state.penilaian)

  const [stats, setStats] = useState({
    totalSupplier: 0,
    topSupplier: '-',
    topSkor: '0.00%',
    evaluatedCount: 0
  })

  const [chartData, setChartData] = useState<any[]>([])

  // SAW Calculation Engine (Sinkron 100% dengan halaman HasilRanking)
  useEffect(() => {
    if (!suppliers.length || !kriteria.length) return

    const results: any[] = []

    suppliers.forEach((supplier: any) => {
      let totalSkor = 0

      kriteria.forEach((k: any) => {
        // Menggunakan operator == agar toleran terhadap perbedaan tipe string/number pada ID
        const penilaianItem = penilaian.find(
          (p: any) => p.supplierId == supplier.id && p.kriteriaId == k.id
        )
        const nilai = penilaianItem?.nilai || 0

        const allValues = suppliers
          .map((s: any) => {
            const p = penilaian.find(
              (pen: any) => pen.supplierId == s.id && pen.kriteriaId == k.id
            )
            return p?.nilai || 0
          })
          .filter((v: number) => v > 0)

        const max = allValues.length > 0 ? Math.max(...allValues) : 100
        const min = allValues.length > 0 ? Math.min(...allValues) : 75

        let normalisasi = 0
        if (nilai > 0) {
          if (k.jenis.toLowerCase() === 'benefit') {
            normalisasi = nilai / max
          } else {
            normalisasi = min / nilai
          }
        }

        totalSkor += (k.bobot / 100) * normalisasi
      })

      results.push({
        name: supplier.nama.substring(0, 15),
        skor: parseFloat((totalSkor * 100).toFixed(2))
      })
    })

    // Urutkan berdasarkan skor tertinggi untuk menentukan peringkat 1
    const sortedResults = [...results].sort((a, b) => b.skor - a.skor)
    
    // Hitung jumlah supplier yang datanya sudah terisi lengkap
    const evaluated = suppliers.filter((s: any) => {
      const kriteriaTerisi = kriteria.filter((k: any) => 
        penilaian.some((p: any) => p.supplierId == s.id && p.kriteriaId == k.id && p.nilai > 0)
      )
      return kriteriaTerisi.length === kriteria.length
    }).length

    setChartData(sortedResults)
    
    if (sortedResults.length > 0) {
      setStats({
        totalSupplier: suppliers.length,
        topSupplier: sortedResults[0].name,
        topSkor: `${sortedResults[0].skor}%`,
        evaluatedCount: evaluated
      })
    }
  }, [suppliers, kriteria, penilaian])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Selamat Datang!</h2>
        <p className="text-muted-foreground">Pantau performa supplier berdasarkan perhitungan metode SAW secara real-time</p>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Supplier"
          value={stats.totalSupplier}
          icon={<Users className="w-5 h-5" />}
          color="bg-blue-50 dark:bg-blue-950/30"
          accentColor="text-blue-600"
        />
        <StatCard
          title="Supplier Terbaik (Peringkat 1)"
          value={`${stats.topSupplier} (${stats.topSkor})`}
          icon={<Trophy className="w-5 h-5" />}
          color="bg-amber-50 dark:bg-amber-950/30"
          accentColor="text-amber-600"
        />
        <StatCard
          title="Sudah Dievaluasi"
          value={`${stats.evaluatedCount} / ${stats.totalSupplier}`}
          icon={<CheckCircle className="w-5 h-5" />}
          color="bg-green-50 dark:bg-green-950/30"
          accentColor="text-green-600"
        />
      </div>

      {/* Charts Real-Time Terhubung ke Database SAW */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Perbandingan Skor Supplier</h3>
            <p className="text-sm text-muted-foreground mt-1">Grafik persentase performa riil dari data penilaian</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" unit="%" />
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
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  accentColor: string
}

function StatCard({ title, value, icon, color, accentColor }: StatCardProps) {
  return (
    <div className={`${color} rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-white dark:bg-background ${accentColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="text-xl font-bold text-foreground truncate">{value}</p>
        </div>
      </div>
    </div>
  )
}