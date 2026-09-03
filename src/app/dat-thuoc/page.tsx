import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { ConsultationInfoPanel } from '@/components/medicine-request/ConsultationInfoPanel'
import { MedicineRequestForm } from '@/components/medicine-request/MedicineRequestForm'

export const metadata: Metadata = {
  title: 'Cần mua thuốc | OUPharmacy',
  description: 'Gửi yêu cầu tư vấn mua thuốc. Dược sĩ sẽ liên hệ hỗ trợ quý khách.',
}

export default function DatThuocPage() {
  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      <Container className="py-6 sm:py-8">
        <h1 className="mb-5 text-2xl font-bold text-gray-900 sm:text-3xl">Cần mua thuốc</h1>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MedicineRequestForm />
          </div>
          <div className="lg:col-span-5">
            <ConsultationInfoPanel />
          </div>
        </div>
      </Container>
    </main>
  )
}
