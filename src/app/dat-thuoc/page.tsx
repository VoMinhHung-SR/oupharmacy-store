import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import { DatThuocWorkspace } from '@/components/medicine-request/DatThuocWorkspace'

export const metadata: Metadata = {
  title: 'Cần mua thuốc | OUPharmacy',
  description: 'Gửi yêu cầu tư vấn mua thuốc. Dược sĩ sẽ liên hệ hỗ trợ quý khách.',
}

export default function DatThuocPage() {
  return (
    <div className="bg-slate-50">
      <Container className="py-3 sm:py-4">
        <DatThuocWorkspace />
      </Container>
    </div>
  )
}
